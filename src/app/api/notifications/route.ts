import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/api-auth';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';

interface NotificationBody {
  type: string;
  message: string;
  target_user_id?: string;
  metadata?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = (await request.json()) as NotificationBody;

    if (!body.type || !body.message) {
      return NextResponse.json({ error: 'Missing required fields: type, message' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        type: body.type,
        message: body.message,
        target_user_id: body.target_user_id ?? null,
        metadata: body.metadata ?? null,
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
      { error: error instanceof Error ? error.message : 'Failed to create notification' },
      { status: 500 }
    );
  }
}
