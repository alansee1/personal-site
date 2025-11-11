/**
 * Migration Script: notes.json → Supabase
 *
 * This script reads existing notes from data/notes.json and inserts them
 * into the Supabase works table.
 *
 * Run with: node scripts/migrate-notes.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing environment variables!');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key (full access)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function migrateNotes() {
  console.log('🚀 Starting migration: notes.json → Supabase\n');

  // Read notes.json
  const notesPath = path.join(__dirname, '../data/notes.json');

  if (!fs.existsSync(notesPath)) {
    console.error('❌ notes.json not found at:', notesPath);
    process.exit(1);
  }

  const notesData = JSON.parse(fs.readFileSync(notesPath, 'utf-8'));
  console.log(`📊 Found ${notesData.length} notes to migrate\n`);

  // Check if works table is empty
  const { data: existingWorks, error: checkError } = await supabase
    .from('works')
    .select('id')
    .limit(1);

  if (checkError) {
    console.error('❌ Error checking existing works:', checkError);
    process.exit(1);
  }

  if (existingWorks && existingWorks.length > 0) {
    console.warn('⚠️  Warning: works table already contains data!');
    console.warn('This script will add to existing data (no duplicates check).');
    console.warn('\nPress Ctrl+C to cancel, or wait 5 seconds to continue...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  // Transform notes for Supabase (remove any extra fields, ensure correct format)
  const transformedNotes = notesData.map(note => ({
    timestamp: note.timestamp,
    project_id: note.projectId,
    summary: note.summary,
    tags: note.tags || []
  }));

  // Insert in batches (Supabase recommends batches of 1000)
  const batchSize = 1000;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < transformedNotes.length; i += batchSize) {
    const batch = transformedNotes.slice(i, i + batchSize);

    console.log(`📤 Inserting batch ${Math.floor(i / batchSize) + 1} (${batch.length} notes)...`);

    const { data, error } = await supabase
      .from('works')
      .insert(batch)
      .select();

    if (error) {
      console.error(`❌ Error inserting batch:`, error);
      errorCount += batch.length;
    } else {
      successCount += data.length;
      console.log(`✅ Successfully inserted ${data.length} notes`);
    }
  }

  console.log('\n📋 Migration Summary:');
  console.log(`   Total notes in JSON: ${notesData.length}`);
  console.log(`   ✅ Successfully migrated: ${successCount}`);
  if (errorCount > 0) {
    console.log(`   ❌ Failed: ${errorCount}`);
  }
  console.log('\n✨ Migration complete!');

  // Verify the data
  const { count } = await supabase
    .from('works')
    .select('*', { count: 'exact', head: true });

  console.log(`\n🔍 Verification: works table now has ${count} total records\n`);
}

// Run migration
migrateNotes().catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
