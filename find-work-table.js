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
  const tables = [
    'work', 'work_items', 'work_sessions', 'tasks', 
    'dev_work', 'project_work', 'sessions', 'dev_sessions',
    'activity', 'work_log', 'work_entries'
  ];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (!error) {
      console.log(`✅ Found table: ${table}`);
      console.log('Sample:', JSON.stringify(data, null, 2));
    }
  }
})();
