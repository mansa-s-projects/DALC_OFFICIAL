import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export function createSupabaseMiddlewareClient(
  request: NextRequest,
  response: NextResponse
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );
}

export type AdminRole = 'admin' | 'sales_manager' | 'sales_agent' | 'viewer';
export const ADMIN_ROLES: AdminRole[] = ['admin', 'sales_manager'];
export const ALL_STAFF_ROLES: AdminRole[] = ['admin', 'sales_manager', 'sales_agent', 'viewer'];

export function getRoleFromUser(user: { app_metadata?: Record<string, unknown> } | null): string | null {
  if (!user) return null;
  return (user.app_metadata?.role as string) ?? null;
}
