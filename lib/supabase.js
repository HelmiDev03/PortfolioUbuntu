import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using the service role key.
// Ensure these are set in your .env.local (do not expose SERVICE role to the client):
// SUPABASE_URL=
// SUPABASE_SERVICE_ROLE=
// SUPABASE_BUCKET=pdfs

let supabase = null;

export function getSupabaseServerClient() {
  if (supabase) return supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE');
  }
  supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return supabase;
}
