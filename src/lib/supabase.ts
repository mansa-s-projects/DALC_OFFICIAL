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

// Non-null assertion: supabase is always initialised in production (env vars
// are required). Call sites that need graceful degradation can check
// `process.env.NEXT_PUBLIC_SUPABASE_URL` directly before calling.
export const supabase = _supabase!;
