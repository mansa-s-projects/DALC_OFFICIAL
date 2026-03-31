import { NextRequest, NextResponse } from 'next/server';
import { commandCenterActionSchema, executeCommandCenterAction } from '@/lib/command-center';

function isAuthorized(request: NextRequest) {
  const expected = process.env.SALES_OPS_API_TOKEN;
  if (!expected) return false;
  const provided = request.headers.get('x-api-token') || '';
  return expected === provided;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const parsed = commandCenterActionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid command center action payload',
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = await executeCommandCenterAction(parsed.data);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to execute command center action',
      },
      { status: 500 }
    );
  }
}
