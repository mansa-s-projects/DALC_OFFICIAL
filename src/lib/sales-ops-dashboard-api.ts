import { NextRequest } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';

export function getLimitFromRequest(request: NextRequest, fallback = 50, max = 200) {
  const value = Number(request.nextUrl.searchParams.get('limit') || fallback);
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return Math.min(max, Math.floor(value));
}

export async function fetchViewRows(
  viewName: string,
  opts?: {
    limit?: number;
    orderBy?: string;
    ascending?: boolean;
  }
) {
  const supabase = getSupabaseAdminClient();
  let query = supabase.from(viewName).select('*');

  if (opts?.orderBy) {
    query = query.order(opts.orderBy, { ascending: opts.ascending ?? false });
  }

  if (opts?.limit) {
    query = query.limit(opts.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
