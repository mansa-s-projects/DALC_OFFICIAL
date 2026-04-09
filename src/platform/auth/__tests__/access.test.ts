import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetSession, mockFromChain } = vi.hoisted(() => {
  const mockFromChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
  };
  return {
    mockGetSession: vi.fn(),
    mockFromChain,
  };
});

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: { getSession: mockGetSession },
    from: vi.fn(() => mockFromChain),
  },
}));

import { getCurrentUserRole, canManageSuppliers, canUpdateRequestStatus, canViewAllRequests } from '../access';

beforeEach(() => {
  vi.clearAllMocks();
  mockFromChain.select.mockReturnThis();
  mockFromChain.eq.mockReturnThis();
  mockFromChain.single.mockResolvedValue({ data: null, error: null });
});

function withSession(userId: string) {
  mockGetSession.mockResolvedValue({ data: { session: { user: { id: userId } } } });
}

function withProfile(role: string | null) {
  mockFromChain.single.mockResolvedValue({ data: role ? { role } : null, error: null });
}

describe('getCurrentUserRole', () => {
  it('returns null when there is no active session', async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: null } });
    expect(await getCurrentUserRole()).toBeNull();
  });

  it('returns the role from the user profile', async () => {
    withSession('u1');
    withProfile('admin');
    expect(await getCurrentUserRole()).toBe('admin');
  });

  it('returns null when profile has no role', async () => {
    withSession('u1');
    withProfile(null);
    expect(await getCurrentUserRole()).toBeNull();
  });
});

describe('canManageSuppliers', () => {
  it('returns true for admin', async () => {
    withSession('u1');
    withProfile('admin');
    expect(await canManageSuppliers()).toBe(true);
  });

  it('returns true for concierge', async () => {
    withSession('u1');
    withProfile('concierge');
    expect(await canManageSuppliers()).toBe(true);
  });

  it('returns false for a regular user', async () => {
    withSession('u1');
    withProfile('user');
    expect(await canManageSuppliers()).toBe(false);
  });

  it('returns false when not authenticated', async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: null } });
    expect(await canManageSuppliers()).toBe(false);
  });
});

describe('canUpdateRequestStatus', () => {
  it('returns true for admin', async () => {
    withSession('u1');
    withProfile('admin');
    expect(await canUpdateRequestStatus()).toBe(true);
  });

  it('returns true for concierge', async () => {
    withSession('u1');
    withProfile('concierge');
    expect(await canUpdateRequestStatus()).toBe(true);
  });

  it('returns false for viewer role', async () => {
    withSession('u1');
    withProfile('viewer');
    expect(await canUpdateRequestStatus()).toBe(false);
  });
});

describe('canViewAllRequests', () => {
  it('returns true for admin', async () => {
    withSession('u1');
    withProfile('admin');
    expect(await canViewAllRequests()).toBe(true);
  });

  it('returns false for sales_agent', async () => {
    withSession('u1');
    withProfile('sales_agent');
    expect(await canViewAllRequests()).toBe(false);
  });
});
