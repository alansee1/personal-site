const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkProjectHealth() {
  console.log('🔍 Running project health check...\n');

  // 1. Get all DB projects
  const { data: dbProjects, error } = await supabase
    .from('projects')
    .select('id, slug, title')
    .order('id');

  if (error) {
    console.error('❌ Failed to fetch projects from DB:', error.message);
    process.exit(1);
  }

  console.log(`📊 Found ${dbProjects.length} projects in database`);

  // 2. Get all markdown files
  const contentDir = path.join(process.cwd(), 'content', 'projects');
  const files = fs.readdirSync(contentDir)
    .filter(f => f.endsWith('.md') && f !== '.gitkeep');

  const mdSlugs = files.map(f => f.replace('.md', ''));
  console.log(`📄 Found ${files.length} markdown files\n`);

  // 3. Check DB → Markdown
  console.log('Checking DB records have markdown files:');
  let orphanedDb = [];
  for (const project of dbProjects) {
    const hasFile = fs.existsSync(path.join(contentDir, `${project.slug}.md`));
    if (!hasFile) {
      console.log(`  ❌ ${project.slug} (ID: ${project.id}) - MISSING FILE`);
      orphanedDb.push(project);
    } else {
      console.log(`  ✅ ${project.slug}`);
    }
  }

  // 4. Check Markdown → DB
  console.log('\nChecking markdown files have DB records:');
  let orphanedMd = [];
  for (const slug of mdSlugs) {
    const hasDb = dbProjects.some(p => p.slug === slug);
    if (!hasDb) {
      console.log(`  ❌ ${slug}.md - MISSING DB RECORD`);
      orphanedMd.push(slug);
    } else {
      console.log(`  ✅ ${slug}.md`);
    }
  }

  // 5. Summary
  console.log('\n' + '='.repeat(50));
  if (orphanedDb.length === 0 && orphanedMd.length === 0) {
    console.log('✅ All projects healthy! DB and filesystem in sync.');
    process.exit(0);
  } else {
    console.log('⚠️  Issues found:');
    if (orphanedDb.length > 0) {
      console.log(`  - ${orphanedDb.length} DB records without markdown files`);
    }
    if (orphanedMd.length > 0) {
      console.log(`  - ${orphanedMd.length} markdown files without DB records`);
    }
    process.exit(1);
  }
}

checkProjectHealth();
