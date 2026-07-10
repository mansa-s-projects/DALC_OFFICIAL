import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — cookies are read-only here; middleware handles refresh
          }
        },
      },
    }
  );
}

// Re-export the shared admin-role helpers so existing imports from supabase-server still work
export type { AdminRole } from './supabase-middleware';
export { ADMIN_ROLES, ALL_STAFF_ROLES, getRoleFromUser } from './supabase-middleware';
