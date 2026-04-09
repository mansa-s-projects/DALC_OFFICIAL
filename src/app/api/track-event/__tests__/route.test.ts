import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makePostRequest, expectErrorResponse } from '@/test/api-helpers';

// ─── Hoist all dependency mocks ─────────────────────────────────────────────────

const {
  mockFrom,
  mockMaybeSingle,
  mockSingle,
  mockProcessLeadAutomation,
  mockEnqueueCrm,
  mockMapLeadToCrmFields,
  mockAssignExperimentVariant,
  mockTrackExperimentEvent,
  mockRecordApiFailure,
} = vi.hoisted(() => {
  const mockMaybeSingle = vi.fn();
  const mockSingle = vi.fn();

  const chain = {
    select: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    maybeSingle: mockMaybeSingle,
    single: mockSingle,
  };

  return {
    mockFrom: vi.fn(() => chain),
    mockMaybeSingle,
    mockSingle,
    mockProcessLeadAutomation: vi.fn().mockResolvedValue(undefined),
    mockEnqueueCrm: vi.fn().mockResolvedValue(undefined),
    mockMapLeadToCrmFields: vi.fn().mockReturnValue({}),
    mockAssignExperimentVariant: vi.fn().mockResolvedValue({ variant: 'control' }),
    mockTrackExperimentEvent: vi.fn().mockResolvedValue(undefined),
    mockRecordApiFailure: vi.fn().mockResolvedValue(undefined),
  };
});

vi.mock('@/lib/supabase-admin', () => ({
  getSupabaseAdminClient: () => ({ from: mockFrom }),
}));
vi.mock('@/lib/lead-automation', () => ({ processLeadAutomation: mockProcessLeadAutomation }));
vi.mock('@/lib/crm-sync', () => ({
  enqueueCrmSyncJob: mockEnqueueCrm,
  mapLeadToCrmFields: mockMapLeadToCrmFields,
}));
vi.mock('@/lib/experimentation', () => ({
  assignExperimentVariant: mockAssignExperimentVariant,
  trackExperimentEvent: mockTrackExperimentEvent,
}));
vi.mock('@/lib/monitoring', () => ({ recordApiFailure: mockRecordApiFailure }));

import { POST } from '../route';

// ─── Helpers ────────────────────────────────────────────────────────────────────

const VALID_EVENT = {
  event_name: 'move_to_dubai_landing_whatsapp_hero_click',
  page: '/move-to-dubai',
  section: 'hero',
  client_event_id: 'evt-test-123',
};

const makeRequest = (body: unknown) => makePostRequest('http://localhost/api/track-event', body);

const STUB_EVENT = { id: 'e1', event_name: VALID_EVENT.event_name, created_at: new Date().toISOString() };

beforeEach(() => {
  vi.clearAllMocks();
  mockMaybeSingle.mockResolvedValue({ data: STUB_EVENT, error: null });
  mockSingle.mockResolvedValue({ data: STUB_EVENT, error: null });
});

// ─── Tests ───────────────────────────────────────────────────────────────────────

describe('POST /api/track-event', () => {
  it('returns 400 when event_name is missing', async () => {
    await expectErrorResponse(await POST(makeRequest({ page: '/test' })));
  });

  it('returns 400 when event_name is empty string', async () => {
    const res = await POST(makeRequest({ ...VALID_EVENT, event_name: '' }));
    expect(res.status).toBe(400);
  });

  it('returns 200 and { ok: true } for a valid payload', async () => {
    const res = await POST(makeRequest(VALID_EVENT));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });

  it('does not run lead automation when no lead is found for the session', async () => {
    mockMaybeSingle
      .mockResolvedValueOnce({ data: STUB_EVENT, error: null }) // event upsert
      .mockResolvedValueOnce({ data: null, error: null });       // lead lookup → not found

    await POST(makeRequest(VALID_EVENT));
    expect(mockProcessLeadAutomation).not.toHaveBeenCalled();
  });

  it('runs lead automation when a matching lead is found', async () => {
    const lead = { id: 'lead-1', session_id: 'sess-1' };
    mockMaybeSingle
      .mockResolvedValueOnce({ data: STUB_EVENT, error: null })
      .mockResolvedValueOnce({ data: lead, error: null });
    mockSingle.mockResolvedValue({ data: lead, error: null });

    await POST(makeRequest({ ...VALID_EVENT, session_id: 'sess-1' }));
    expect(mockProcessLeadAutomation).toHaveBeenCalledWith(
      expect.objectContaining({ triggerSource: 'event_tracked' })
    );
  });

  it('tracks experiment when experiment_key is present in metadata', async () => {
    await POST(makeRequest({
      ...VALID_EVENT,
      metadata: { experiment_key: 'hero_cta_test' },
    }));
    expect(mockAssignExperimentVariant).toHaveBeenCalledWith(
      expect.objectContaining({ experimentKey: 'hero_cta_test' })
    );
    expect(mockTrackExperimentEvent).toHaveBeenCalled();
  });

  it('does not track experiment when metadata has no experiment_key', async () => {
    await POST(makeRequest(VALID_EVENT));
    expect(mockAssignExperimentVariant).not.toHaveBeenCalled();
  });

  it('returns 500 when the DB upsert fails', async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: { message: 'DB failure' } });
    await expectErrorResponse(await POST(makeRequest(VALID_EVENT)), 500);
  });
});
