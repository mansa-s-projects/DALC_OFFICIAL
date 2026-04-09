import { describe, it, expect } from 'vitest';
import {
  parseCommaSeparated,
  normalizeSupplierForm,
  validateSupplierForm,
} from '../supplier';
import type { SupplierFormValues } from '../supplier';

// ─── Fixture ────────────────────────────────────────────────────────────────────

function makeForm(overrides: Partial<SupplierFormValues> = {}): SupplierFormValues {
  return {
    name: 'DALC Logistics',
    contact_person: 'Sara Ahmed',
    email: 'sara@dalc.com',
    phone: '+971501234567',
    whatsapp: '+971501234567',
    categories: 'transport, yachts, jets',
    commission_rate: 15,
    notes: 'VIP partner',
    status: 'active',
    venue_ids: 'v1, v2, v3',
    ...overrides,
  };
}

// ─── parseCommaSeparated ─────────────────────────────────────────────────────────

describe('parseCommaSeparated', () => {
  it('splits on commas and trims whitespace', () => {
    expect(parseCommaSeparated('a, b,  c')).toEqual(['a', 'b', 'c']);
  });

  it('filters empty strings', () => {
    expect(parseCommaSeparated('a,,b, ')).toEqual(['a', 'b']);
  });

  it('returns empty array for empty string', () => {
    expect(parseCommaSeparated('')).toEqual([]);
  });

  it('returns single item array for single value', () => {
    expect(parseCommaSeparated('transport')).toEqual(['transport']);
  });
});

// ─── normalizeSupplierForm ───────────────────────────────────────────────────────

describe('normalizeSupplierForm', () => {
  it('trims name and contact_person', () => {
    const result = normalizeSupplierForm(makeForm({ name: '  DALC  ', contact_person: ' Sara ' }));
    expect(result.name).toBe('DALC');
    expect(result.contact_person).toBe('Sara');
  });

  it('converts categories string to array', () => {
    const result = normalizeSupplierForm(makeForm({ categories: 'transport, yachts' }));
    expect(result.categories).toEqual(['transport', 'yachts']);
  });

  it('converts venue_ids string to array', () => {
    const result = normalizeSupplierForm(makeForm({ venue_ids: 'v1, v2' }));
    expect(result.venue_ids).toEqual(['v1', 'v2']);
  });

  it('converts commission_rate to number', () => {
    const result = normalizeSupplierForm(makeForm({ commission_rate: 20 }));
    expect(result.commission_rate).toBe(20);
    expect(typeof result.commission_rate).toBe('number');
  });

  it('returns undefined for blank optional string fields', () => {
    const result = normalizeSupplierForm(makeForm({ email: '  ', notes: '' }));
    expect(result.email).toBeUndefined();
    expect(result.notes).toBeUndefined();
  });

  it('preserves status as-is', () => {
    expect(normalizeSupplierForm(makeForm({ status: 'inactive' })).status).toBe('inactive');
  });
});

// ─── validateSupplierForm ────────────────────────────────────────────────────────

describe('validateSupplierForm', () => {
  it('returns null for a valid form', () => {
    expect(validateSupplierForm(makeForm())).toBeNull();
  });

  it('returns error when name is empty or whitespace', () => {
    expect(validateSupplierForm(makeForm({ name: '' }))).toBe('Company name is required.');
    expect(validateSupplierForm(makeForm({ name: '   ' }))).toBe('Company name is required.');
  });

  it('returns error for malformed email', () => {
    expect(validateSupplierForm(makeForm({ email: 'not-an-email' }))).toBe(
      'Please enter a valid email address.'
    );
  });

  it('accepts blank email (optional)', () => {
    expect(validateSupplierForm(makeForm({ email: '' }))).toBeNull();
  });

  it('returns error when commission_rate is negative', () => {
    expect(validateSupplierForm(makeForm({ commission_rate: -1 }))).toBe(
      'Commission rate must be between 0 and 100.'
    );
  });

  it('returns error when commission_rate exceeds 100', () => {
    expect(validateSupplierForm(makeForm({ commission_rate: 101 }))).toBe(
      'Commission rate must be between 0 and 100.'
    );
  });

  it('accepts boundary values 0 and 100', () => {
    expect(validateSupplierForm(makeForm({ commission_rate: 0 }))).toBeNull();
    expect(validateSupplierForm(makeForm({ commission_rate: 100 }))).toBeNull();
  });
});
