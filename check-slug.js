const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/alansee/Projects/personal-site/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSlug() {
  const { data } = await supabase
    .from('projects')
    .select('slug, title')
    .eq('slug', 'nba-90ers');
  console.log(JSON.stringify(data));
}
checkSlug();
