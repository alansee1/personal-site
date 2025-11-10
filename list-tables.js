const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

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

(async () => {
  // Try to query information_schema to see available tables
  const { data, error } = await supabase.rpc('exec_sql', {
    query: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
  });

  if (error) {
    console.error('Error:', error);
    
    // Alternative: try a few common table names
    console.log('\nTrying common table names...');
    const tables = ['work', 'work_items', 'tasks', 'projects', 'dev_diary'];
    
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (!error) {
        console.log(`✅ Found table: ${table}`);
      }
    }
    return;
  }

  console.log('Available tables:', data);
})();
