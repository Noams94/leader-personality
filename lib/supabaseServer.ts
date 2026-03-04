import { createClient } from '@supabase/supabase-js';

const supabaseUrl       = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Returns a Supabase client using the service-role key (server-side only).
 * Returns null when env vars are not yet configured so the build doesn't fail.
 */
export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}
