import { describe, it, expect, vi } from 'vitest';
import { POST } from '../route';

vi.mock('@/lib/supabase-admin', () => {
  const single = vi.fn().mockResolvedValue({
    data: {
      id: 'req_123',
      category: 'concierge',
      status: 'submitted',
    },
    error: null,
  });

  const select = vi.fn(() => ({ single }));
  const insert = vi.fn(() => ({ select }));

  return {
    getSupabaseAdminClient: vi.fn(() => ({
      from: vi.fn(() => ({ insert })),
    })),
  };
});

describe('POST /api/requests', () => {
  it('returns 200 with persisted request payload', async () => {
    const req = new Request('http://localhost/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'concierge' }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.request_id).toBe('req_123');
    expect(body.request.status).toBe('submitted');
  });
});
