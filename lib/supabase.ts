import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client (uses anon key, protected by RLS)
// Used by the website to fetch public data
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Note: supabaseAdmin (with service role key) is only used locally
// by the /log-work command, not needed on Vercel
