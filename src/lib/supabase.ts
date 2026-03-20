import { createClient } from '@supabase/supabase-js';

function getEnv(name: string): string | undefined {
  if (typeof process !== 'undefined' && process.env?.[name]) {
    return process.env[name];
  }

  const viteEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined) as
    | Record<string, string | undefined>
    | undefined;

  return viteEnv?.[name];
}

const supabaseUrl =
  getEnv('NEXT_PUBLIC_SUPABASE_URL') ??
  getEnv('VITE_SUPABASE_URL');

const supabaseAnonKey =
  getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') ??
  getEnv('VITE_SUPABASE_ANON_KEY');

function isValidConfig(url?: string, key?: string): boolean {
  if (!url || !key) return false;
  // Reject placeholder / dummy values
  if (url.includes('PLACEHOLDER') || key.includes('PLACEHOLDER')) return false;
  // Must look like a real Supabase URL
  try { new URL(url); } catch { return false; }
  return true;
}

const hasValidConfig = isValidConfig(supabaseUrl, supabaseAnonKey);

// Fallback for development without env vars
export const supabase = hasValidConfig
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export const isMockMode = !supabase;
