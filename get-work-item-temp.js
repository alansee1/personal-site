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
  const { data: workItem, error } = await supabase
    .from('work')
    .select('*')
    .eq('project_id', 6)
    .eq('status', 'in_progress')
    .single();

  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }

  console.log(JSON.stringify(workItem, null, 2));
})();
