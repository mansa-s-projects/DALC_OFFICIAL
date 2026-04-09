import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makePostRequest, expectErrorResponse } from '@/test/api-helpers';

// ─── Hoist all dependency mocks ─────────────────────────────────────────────────

const {
  mockUpsert,
  mockSelect,
  mockEq,
  mockOrder,
  mockLimit,
  mockMaybeSingle,
  mockSingle,
  mockFrom,
  mockProcessLeadAutomation,
  mockEnqueueCrm,
  mockMapLeadToCrmFields,
  mockEnqueueEnrichment,
  mockEnqueueWhatsApp,
  mockRecordApiFailure,
} = vi.hoisted(() => {
  const mockMaybeSingle = vi.fn();
  const mockSingle = vi.fn();
  const mockOrder = vi.fn();
  const mockLimit = vi.fn();
  const mockEq = vi.fn();
  const mockSelect = vi.fn();
  const mockUpsert = vi.fn();

  mockOrder.mockReturnThis = () => mockOrder;
  mockLimit.mockReturnThis = () => mockLimit;
  mockEq.mockReturnThis = () => mockEq;
  mockSelect.mockReturnThis = () => mockSelect;
  mockUpsert.mockReturnThis = () => mockUpsert;

  const chain = {
    select: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    maybeSingle: mockMaybeSingle,
    single: mockSingle,
  };
  const mockFrom = vi.fn(() => chain);

  return {
    mockUpsert: chain.upsert,
    mockSelect: chain.select,
    mockEq: chain.eq,
    mockOrder: chain.order,
    mockLimit: chain.limit,
    mockMaybeSingle,
    mockSingle,
    mockFrom,
    mockProcessLeadAutomation: vi.fn().mockResolvedValue(undefined),
    mockEnqueueCrm: vi.fn().mockResolvedValue(undefined),
    mockMapLeadToCrmFields: vi.fn().mockReturnValue({}),
    mockEnqueueEnrichment: vi.fn().mockResolvedValue(undefined),
    mockEnqueueWhatsApp: vi.fn().mockResolvedValue(undefined),
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
vi.mock('@/lib/lead-enrichment', () => ({ enqueueLeadEnrichmentJob: mockEnqueueEnrichment }));
vi.mock('@/lib/whatsapp-automation', () => ({ enqueueWhatsAppJob: mockEnqueueWhatsApp }));
vi.mock('@/lib/monitoring', () => ({ recordApiFailure: mockRecordApiFailure }));

import { POST } from '../route';

// ─── Helpers ────────────────────────────────────────────────────────────────────

const VALID_PAYLOAD = {
  name: 'Fatima Al Mansoori',
  phone: '+971501234567',
  source_page: '/move-to-dubai',
  source_section: 'hero',
  cta_label: 'Get Started',
  destination: 'Dubai',
  client_submission_id: 'test-idempotency-key',
};

const makeRequest = (body: unknown) => makePostRequest('http://localhost/api/submit-lead', body);

const STUB_LEAD = { id: 'lead-1', lead_temperature: null, phone: null, source_page: '/move-to-dubai' };

beforeEach(() => {
  vi.clearAllMocks();
  mockMaybeSingle.mockResolvedValue({ data: STUB_LEAD, error: null });
  mockSingle.mockResolvedValue({ data: STUB_LEAD, error: null });
  mockEq.mockReturnThis();
  mockOrder.mockReturnThis();
  mockLimit.mockReturnThis();
});

// ─── Tests ───────────────────────────────────────────────────────────────────────

describe('POST /api/submit-lead', () => {
  it('returns 400 for missing required fields', async () => {
    const res = await POST(makeRequest({ name: 'test' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe('Invalid payload');
  });

  it('returns 400 for invalid email format', async () => {
    await expectErrorResponse(await POST(makeRequest({ ...VALID_PAYLOAD, email: 'not-an-email' })));
  });

  it('returns 200 and { ok: true } for a valid payload', async () => {
    const res = await POST(makeRequest(VALID_PAYLOAD));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });

  it('calls processLeadAutomation with triggerSource lead_created', async () => {
    await POST(makeRequest(VALID_PAYLOAD));
    expect(mockProcessLeadAutomation).toHaveBeenCalledWith(
      expect.objectContaining({ triggerSource: 'lead_created' })
    );
  });

  it('enqueues CRM sync and enrichment jobs', async () => {
    await POST(makeRequest(VALID_PAYLOAD));
    expect(mockEnqueueCrm).toHaveBeenCalled();
    expect(mockEnqueueEnrichment).toHaveBeenCalled();
  });

  it('does NOT enqueue WhatsApp job for non-hot lead', async () => {
    mockMaybeSingle.mockResolvedValue({ data: { ...STUB_LEAD, lead_temperature: 'warm' }, error: null });
    mockSingle.mockResolvedValue({ data: { ...STUB_LEAD, lead_temperature: 'warm' }, error: null });

    await POST(makeRequest(VALID_PAYLOAD));
    expect(mockEnqueueWhatsApp).not.toHaveBeenCalled();
  });

  it('enqueues WhatsApp job for a hot lead', async () => {
    const hotLead = { ...STUB_LEAD, lead_temperature: 'hot', phone: '+971501234567' };
    mockMaybeSingle.mockResolvedValue({ data: hotLead, error: null });
    mockSingle.mockResolvedValue({ data: hotLead, error: null });

    await POST(makeRequest(VALID_PAYLOAD));
    expect(mockEnqueueWhatsApp).toHaveBeenCalledWith(
      expect.objectContaining({ triggerType: 'hot_lead_created' })
    );
  });

  it('returns 500 when the DB upsert fails', async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: { message: 'DB write failed' } });
    await expectErrorResponse(await POST(makeRequest(VALID_PAYLOAD)), 500);
  });

  it('accepts an empty string email (optional field)', async () => {
    const res = await POST(makeRequest({ ...VALID_PAYLOAD, email: '' }));
    expect(res.status).toBe(200);
  });
});
