import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { makePostRequest } from '@/test/api-helpers';

const { mockHandleIntent } = vi.hoisted(() => ({
  mockHandleIntent: vi.fn(),
}));

vi.mock('../../../../../lib/intentService', () => ({
  handleIntent: mockHandleIntent,
}));

import { POST } from '../route';

const makeRequest = (body: unknown) => makePostRequest('http://localhost/api/dalc/intent', body);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/dalc/intent', () => {
  it('returns 400 when user_input is missing', async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: 'user_input is required' });
  });

  it('returns 400 when user_input is empty string', async () => {
    const res = await POST(makeRequest({ user_input: '   ' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when user_input is not a string', async () => {
    const res = await POST(makeRequest({ user_input: 42 }));
    expect(res.status).toBe(400);
  });

  it('calls handleIntent with the trimmed input and returns its result', async () => {
    mockHandleIntent.mockResolvedValueOnce({ intent: 'relocation', score: 8 });

    const res = await POST(makeRequest({ user_input: 'I want to move to Dubai' }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ intent: 'relocation', score: 8 });
    expect(mockHandleIntent).toHaveBeenCalledWith('I want to move to Dubai');
  });

  it('returns 400 when the request body is invalid JSON', async () => {
    const req = new NextRequest('http://localhost/api/dalc/intent', {
      method: 'POST',
      body: 'not-json',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
