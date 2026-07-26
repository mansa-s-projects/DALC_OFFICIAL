import 'server-only';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUserAuth } from '@/lib/api-auth';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';

const requestIdSchema = z.string().uuid();
const staffRoles = new Set(['admin', 'sales_manager', 'concierge']);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireUserAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  if (!requestIdSchema.safeParse(id).success) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const isStaff = staffRoles.has(auth.role);
  const supabase = getSupabaseAdminClient();
  let requestQuery = supabase
    .from('requests')
    .select(
      'id, user_id, category, status, priority, title, description, notes, created_at, updated_at',
    )
    .eq('id', id);

  if (!isStaff) {
    requestQuery = requestQuery.eq('user_id', auth.userId);
  }

  const { data: request, error } = await requestQuery.single();
  if (error || !request) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const [quotesResult, paymentsResult] = await Promise.all([
    supabase
      .from('quotes')
      .select('id, amount_aed, status, notes, expires_at, created_at')
      .eq('request_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('payments')
      .select('id, amount_aed, status, payment_type, created_at')
      .eq('request_id', id)
      .order('created_at', { ascending: false }),
  ]);

  return NextResponse.json(
    {
      ...request,
      quotes: quotesResult.data ?? [],
      payments: paymentsResult.data ?? [],
    },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}
