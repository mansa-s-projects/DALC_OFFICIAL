import { NextRequest, NextResponse } from 'next/server';
import { runSelfOptimizationCycle } from '@/lib/self-optimization';

function isAuthorized(request: NextRequest) {
  const expected = process.env.WORKER_CRON_TOKEN;
  if (!expected) return false;
  const provided = request.headers.get('x-worker-token') || '';
  return expected === provided;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const summary = await runSelfOptimizationCycle();
    return NextResponse.json({ ok: true, summary });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Self-optimization cycle failed',
      },
      { status: 500 }
    );
  }
}
