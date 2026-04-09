import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../route';

describe('POST /api/requests', () => {
  it('returns 200 with request_id and status', async () => {
    const req = new NextRequest('http://localhost/api/requests', { method: 'POST' });
    const res = await POST();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ request_id: 'test_123', status: 'created' });
  });
});
