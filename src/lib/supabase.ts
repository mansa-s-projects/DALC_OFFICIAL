import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string | undefined;

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