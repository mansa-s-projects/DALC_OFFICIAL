import { describe, it, expect } from 'vitest';
import { loginService } from '../loginService';
import { registerService } from '../registerService';

describe('loginService', () => {
  it('returns { ok: true }', async () => {
    expect(await loginService()).toEqual({ ok: true });
  });
});

describe('registerService', () => {
  it('returns { ok: true }', async () => {
    expect(await registerService()).toEqual({ ok: true });
  });
});
