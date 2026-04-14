import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { makePostRequest } from '@/test/api-helpers';

const { mockHandleIntent } = vi.hoisted(() => ({
  mockHandleIntent: vi.fn(),
}));

const {
  mockCreateRequestFromIntent,
  mockGetSupabaseAdminClient,
  mockFrom,
  mockInsert,
  mockSelect,
  mockSingle,
} = vi.hoisted(() => {
  const mockSingle = vi.fn();
  const mockSelect = vi.fn(() => ({ single: mockSingle }));
  const mockInsert = vi.fn(() => ({ select: mockSelect }));
  const mockFrom = vi.fn(() => ({ insert: mockInsert }));
  const mockGetSupabaseAdminClient = vi.fn(() => ({ from: mockFrom }));
  const mockCreateRequestFromIntent = vi.fn();

  return {
    mockCreateRequestFromIntent,
    mockGetSupabaseAdminClient,
    mockFrom,
    mockInsert,
    mockSelect,
    mockSingle,
  };
});

vi.mock('../../../../../lib/intentService', () => ({
  handleIntent: mockHandleIntent,
}));

vi.mock('../../../../../lib/supabase-admin', () => ({
  getSupabaseAdminClient: mockGetSupabaseAdminClient,
}));

vi.mock('../../../../../lib/requestService', () => ({
  createRequestFromIntent: mockCreateRequestFromIntent,
}));

import { POST } from '../route';

const makeRequest = (body: unknown) => makePostRequest('http://localhost/api/dalc/intent', body);

beforeEach(() => {
  vi.clearAllMocks();
  mockSingle.mockResolvedValue({ data: { id: 'intent_123' }, error: null });
  mockCreateRequestFromIntent.mockResolvedValue({ id: 'request_123' });
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

  it('calls handleIntent with trimmed input and returns persisted intent info', async () => {
    const intentResponse = {
      intent: {
        user_input: 'I want to move to Dubai',
        intent_type: 'relocation',
        complexity_score: 3,
      },
    };
    mockHandleIntent.mockResolvedValueOnce({ intentResponse, decision: 'GUIDE_FLOW' });

    const res = await POST(makeRequest({ user_input: '  I want to move to Dubai  ' }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      intentResponse,
      decision: 'GUIDE_FLOW',
      intent_id: 'intent_123',
      request: null,
    });
    expect(mockHandleIntent).toHaveBeenCalledWith('I want to move to Dubai');
    expect(mockGetSupabaseAdminClient).toHaveBeenCalledTimes(1);
    expect(mockFrom).toHaveBeenCalledWith('intents');
    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(mockSelect).toHaveBeenCalledWith('id');
    expect(mockCreateRequestFromIntent).not.toHaveBeenCalled();
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
