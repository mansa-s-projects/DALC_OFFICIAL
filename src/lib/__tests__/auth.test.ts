import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Hoist mocks before imports ────────────────────────────────────────────────

const { mockAuthApi, mockDbChain } = vi.hoisted(() => {
  const mockDbChain = {
    select: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
  };
  const mockAuthApi = {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
  };
  return { mockAuthApi, mockDbChain };
});

vi.mock('../supabase', () => ({
  supabase: {
    auth: mockAuthApi,
    from: vi.fn(() => mockDbChain),
  },
}));

import { signUp, signIn, signOut, getSession, getProfile, updateProfile } from '../auth';

// ─── Helpers ────────────────────────────────────────────────────────────────────

function profileRow(overrides = {}) {
  return {
    id: 'user-1',
    email: 'test@dalc.com',
    first_name: 'Test',
    last_name: 'User',
    phone: null,
    avatar_url: null,
    skills: ['networking'],
    preferences: { theme: 'dark' },
    relocation_stage: 'EXPLORING',
    role: 'user',
    tier: 'standard',
    ...overrides,
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  mockDbChain.select.mockReturnThis();
  mockDbChain.update.mockReturnThis();
  mockDbChain.eq.mockReturnThis();
  mockDbChain.single.mockResolvedValue({ data: null, error: null });
});

// ─── signUp ─────────────────────────────────────────────────────────────────────

describe('signUp', () => {
  it('returns supabase data on success', async () => {
    const fakeData = { user: { id: 'u1' }, session: null };
    mockAuthApi.signUp.mockResolvedValueOnce({ data: fakeData, error: null });

    const result = await signUp('a@b.com', 'pass');
    expect(result).toEqual(fakeData);
    expect(mockAuthApi.signUp).toHaveBeenCalledWith({
      email: 'a@b.com',
      password: 'pass',
      options: { data: { first_name: undefined, last_name: undefined } },
    });
  });

  it('throws when supabase returns an error', async () => {
    const err = new Error('Email taken');
    mockAuthApi.signUp.mockResolvedValueOnce({ data: {}, error: err });

    await expect(signUp('a@b.com', 'pass')).rejects.toThrow('Email taken');
  });

  it('updates profile when first/last name supplied', async () => {
    const fakeData = { user: { id: 'u1' }, session: null };
    mockAuthApi.signUp.mockResolvedValueOnce({ data: fakeData, error: null });
    mockDbChain.eq.mockResolvedValueOnce({ error: null });

    await signUp('a@b.com', 'pass', 'Ada', 'Lovelace');
    expect(mockDbChain.update).toHaveBeenCalledWith({
      first_name: 'Ada',
      last_name: 'Lovelace',
    });
  });

  it('throws with a helpful message if profile update fails after signup', async () => {
    const fakeData = { user: { id: 'u1' }, session: null };
    mockAuthApi.signUp.mockResolvedValueOnce({ data: fakeData, error: null });
    mockDbChain.eq.mockResolvedValueOnce({ error: new Error('DB error') });

    await expect(signUp('a@b.com', 'pass', 'Ada', 'Lovelace')).rejects.toThrow(
      'Account created but failed to set profile name'
    );
  });
});

// ─── signIn ─────────────────────────────────────────────────────────────────────

describe('signIn', () => {
  it('returns session data on success', async () => {
    const fakeData = { user: { id: 'u1' }, session: { access_token: 'tok' } };
    mockAuthApi.signInWithPassword.mockResolvedValueOnce({ data: fakeData, error: null });
    mockDbChain.single.mockResolvedValueOnce({ data: { role: 'admin' }, error: null });

    const result = await signIn('a@b.com', 'pass');
    expect(result).toEqual(fakeData);
  });

  it('throws when credentials are wrong', async () => {
    const err = new Error('Invalid login credentials');
    mockAuthApi.signInWithPassword.mockResolvedValueOnce({ data: {}, error: err });

    await expect(signIn('a@b.com', 'wrong')).rejects.toThrow('Invalid login credentials');
  });
});

// ─── signOut ────────────────────────────────────────────────────────────────────

describe('signOut', () => {
  it('resolves without error on success', async () => {
    mockAuthApi.signOut.mockResolvedValueOnce({ error: null });
    await expect(signOut()).resolves.toBeUndefined();
  });

  it('throws when supabase signOut fails', async () => {
    const err = new Error('Network error');
    mockAuthApi.signOut.mockResolvedValueOnce({ error: err });

    await expect(signOut()).rejects.toThrow('Network error');
  });
});

// ─── getSession ─────────────────────────────────────────────────────────────────

describe('getSession', () => {
  it('returns the session object', async () => {
    const session = { access_token: 'abc', user: { id: 'u1' } };
    mockAuthApi.getSession.mockResolvedValueOnce({ data: { session } });

    const result = await getSession();
    expect(result).toEqual(session);
  });

  it('returns null when there is no active session', async () => {
    mockAuthApi.getSession.mockResolvedValueOnce({ data: { session: null } });
    expect(await getSession()).toBeNull();
  });
});

// ─── getProfile ─────────────────────────────────────────────────────────────────

describe('getProfile', () => {
  it('returns null when profile query returns an error', async () => {
    mockDbChain.single.mockResolvedValueOnce({ data: null, error: new Error('Not found') });
    expect(await getProfile('u1')).toBeNull();
  });

  it('constructs a UserProfile from the DB row', async () => {
    const row = profileRow();
    mockDbChain.single.mockResolvedValueOnce({ data: row, error: null });

    const profile = await getProfile('u1');
    expect(profile).toMatchObject({
      id: 'user-1',
      email: 'test@dalc.com',
      first_name: 'Test',
      last_name: 'User',
      skills: ['networking'],
      preferences: { theme: 'dark' },
      relocation_stage: 'EXPLORING',
      role: 'user',
      tier: 'standard',
    });
  });

  it('defaults skills to [] and relocation_stage to EXPLORING when absent in row', async () => {
    const row = profileRow({ skills: undefined, relocation_stage: undefined, preferences: undefined });
    mockDbChain.single.mockResolvedValueOnce({ data: row, error: null });

    const profile = await getProfile('u1');
    expect(profile?.skills).toEqual([]);
    expect(profile?.relocation_stage).toBe('EXPLORING');
    expect(profile?.preferences).toEqual({});
  });
});

// ─── updateProfile ───────────────────────────────────────────────────────────────

describe('updateProfile', () => {
  it('does nothing when no allowed fields are present in updates', async () => {
    const { supabase } = await import('../supabase');
    await updateProfile('u1', { role: 'admin' } as never);
    expect(supabase!.from).not.toHaveBeenCalled();
  });

  it('only patches allowed fields, excluding sensitive ones', async () => {
    mockDbChain.eq.mockResolvedValueOnce({ error: null });

    await updateProfile('u1', {
      first_name: 'New',
      last_name: 'Name',
      role: 'admin',
      tier: 'vip',
    } as never);

    expect(mockDbChain.update).toHaveBeenCalledWith(
      expect.not.objectContaining({ role: 'admin', tier: 'vip' })
    );
    expect(mockDbChain.update).toHaveBeenCalledWith(
      expect.objectContaining({ first_name: 'New', last_name: 'Name' })
    );
  });

  it('throws when the DB update fails', async () => {
    mockDbChain.eq.mockResolvedValueOnce({ error: new Error('Constraint violation') });

    await expect(updateProfile('u1', { first_name: 'X' })).rejects.toThrow(
      'Constraint violation'
    );
  });
});
