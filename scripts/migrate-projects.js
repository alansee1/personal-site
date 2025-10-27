/**
 * Migration Script: Projects JSON → Supabase Database
 *
 * This script:
 * 1. Reads existing projects.json
 * 2. Inserts projects into Supabase projects table
 * 3. Gets auto-generated integer IDs
 * 4. Updates notes table to use integer project_id
 * 5. Adds foreign key constraint
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function migrateProjects() {
  console.log('🚀 Starting projects migration...\n');

  // Step 1: Read projects.json
  console.log('📖 Reading projects.json...');
  const projectsPath = path.join(__dirname, '../data/projects.json');
  const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
  console.log(`   Found ${projectsData.length} projects\n`);

  // Step 2: Insert projects and capture ID mapping
  console.log('💾 Inserting projects into Supabase...');
  const idMapping = {}; // { 'personal-site': 1, 'weight-tracker': 2, ... }

  for (const project of projectsData) {
    const projectRecord = {
      slug: project.id,
      title: project.title,
      description: project.description,
      long_description: null, // Will add later
      status: project.status,
      tech: project.tech,
      github: project.github,
      url: project.url,
      media: [], // Will add later
      start_date: project.startDate,
      end_date: null
    };

    const { data, error } = await supabase
      .from('projects')
      .insert(projectRecord)
      .select('id, slug')
      .single();

    if (error) {
      console.error(`   ❌ Failed to insert project "${project.title}":`, error.message);
      process.exit(1);
    }

    idMapping[project.id] = data.id;
    console.log(`   ✓ ${project.title} (${project.id} → ID: ${data.id})`);
  }

  console.log('\n✅ All projects inserted successfully!');
  console.log('\n📊 ID Mapping:');
  console.log(JSON.stringify(idMapping, null, 2));

  // Step 3: Count notes per project
  console.log('\n🔄 Analyzing notes table...');

  for (const [slug, id] of Object.entries(idMapping)) {
    const { count } = await supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', slug);

    console.log(`   "${slug}" (→ ID ${id}): ${count} notes`);
  }

  console.log('\n⚠️  IMPORTANT: Notes table migration requires manual steps:');
  console.log('\n   Run these SQL commands in Supabase SQL Editor:\n');

  console.log('   -- Step 1: Add temporary column');
  console.log('   ALTER TABLE notes ADD COLUMN IF NOT EXISTS project_id_new INTEGER;\n');

  for (const [slug, id] of Object.entries(idMapping)) {
    console.log(`   -- Update "${slug}" → ${id}`);
    console.log(`   UPDATE notes SET project_id_new = ${id} WHERE project_id = '${slug}';`);
  }

  console.log('\n   -- Step 2: Verify all notes mapped');
  console.log('   SELECT COUNT(*) FROM notes WHERE project_id_new IS NULL;');
  console.log('   -- Should return 0\n');

  console.log('   -- Step 3: Drop old column and rename');
  console.log('   ALTER TABLE notes DROP COLUMN project_id;');
  console.log('   ALTER TABLE notes RENAME COLUMN project_id_new TO project_id;');
  console.log('   ALTER TABLE notes ALTER COLUMN project_id SET NOT NULL;\n');

  console.log('   -- Step 4: Add foreign key constraint');
  console.log('   ALTER TABLE notes');
  console.log('     ADD CONSTRAINT fk_project');
  console.log('     FOREIGN KEY (project_id)');
  console.log('     REFERENCES projects(id)');
  console.log('     ON DELETE CASCADE;\n');

  console.log('   -- Step 5: Add index');
  console.log('   CREATE INDEX IF NOT EXISTS idx_notes_project_id ON notes (project_id);\n');

  // Step 4: Verify migration
  console.log('🔍 Verifying projects migration...');
  const { data: allProjects, error: fetchError } = await supabase
    .from('projects')
    .select('id, slug, title, status')
    .order('id');

  if (fetchError) {
    console.error('   ❌ Failed to verify:', fetchError.message);
    process.exit(1);
  }

  console.log('\n📋 Projects in database:');
  allProjects.forEach(p => {
    console.log(`   ${p.id}: ${p.title} (${p.slug}) - ${p.status}`);
  });

  console.log('\n✅ Projects migration complete!');
  console.log('\n⚠️  Next steps:');
  console.log('   1. Run the SQL commands above in Supabase SQL Editor');
  console.log('   2. Verify notes migration completed');
  console.log('   3. Test API endpoints');
  console.log('   4. Update components to use new API\n');
}

// Run migration
migrateProjects().catch(error => {
  console.error('\n❌ Migration failed:', error);
  process.exit(1);
});
