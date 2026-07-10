import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/api-auth';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';

interface QuoteBody {
  request_id: string;
  amount_aed: number;
  notes?: string;
  expires_at?: string;
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'edit_leads');
  if (auth instanceof NextResponse) return auth;

  try {
    const body = (await request.json()) as QuoteBody;

    if (!body.request_id || body.amount_aed === undefined) {
      return NextResponse.json({ error: 'Missing required fields: request_id, amount_aed' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from('quotes')
      .insert({
        request_id: body.request_id,
        amount_aed: body.amount_aed,
        notes: body.notes ?? null,
        expires_at: body.expires_at ?? null,
        status: 'pending',
        created_by: auth.userId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create quote' },
      { status: 500 }
    );
  }
}
