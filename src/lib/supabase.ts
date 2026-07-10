import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let warnedMissingEnv = false;

function reportMissingSupabaseEnv() {
  if (warnedMissingEnv) return;
  warnedMissingEnv = true;
  if (typeof window !== 'undefined') {
    console.error('[DALC] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Configure them in Vercel Project Settings > Environment Variables and redeploy.');
  }
}

const _supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (reportMissingSupabaseEnv(), null);

if (!_supabase) {
  throw new Error(
    'Supabase client failed to initialize. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}
export const supabase = _supabase;
