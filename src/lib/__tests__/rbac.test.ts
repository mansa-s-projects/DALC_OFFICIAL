import { describe, it, expect } from 'vitest';
import { hasPermission, normalizeRole, PERMISSION_MAP } from '../rbac';

describe('PERMISSION_MAP', () => {
  it('defines entries for every AppRole', () => {
    const roles = ['admin', 'sales_manager', 'sales_agent', 'viewer'] as const;
    for (const role of roles) {
      expect(PERMISSION_MAP[role]).toBeDefined();
    }
  });
});

describe('hasPermission', () => {
  it('grants admin every permission', () => {
    const actions = [
      'view_leads', 'edit_leads', 'assign_leads', 'change_status',
      'manage_tasks', 'view_reports', 'manage_users',
    ] as const;
    for (const action of actions) {
      expect(hasPermission('admin', action)).toBe(true);
    }
  });

  it('allows viewer only view_leads and view_reports', () => {
    expect(hasPermission('viewer', 'view_leads')).toBe(true);
    expect(hasPermission('viewer', 'view_reports')).toBe(true);
    expect(hasPermission('viewer', 'edit_leads')).toBe(false);
    expect(hasPermission('viewer', 'assign_leads')).toBe(false);
    expect(hasPermission('viewer', 'change_status')).toBe(false);
    expect(hasPermission('viewer', 'manage_tasks')).toBe(false);
    expect(hasPermission('viewer', 'manage_users')).toBe(false);
  });

  it('denies sales_agent assign_leads and view_reports and manage_users', () => {
    expect(hasPermission('sales_agent', 'assign_leads')).toBe(false);
    expect(hasPermission('sales_agent', 'view_reports')).toBe(false);
    expect(hasPermission('sales_agent', 'manage_users')).toBe(false);
  });

  it('allows sales_agent view, edit, change_status, manage_tasks', () => {
    expect(hasPermission('sales_agent', 'view_leads')).toBe(true);
    expect(hasPermission('sales_agent', 'edit_leads')).toBe(true);
    expect(hasPermission('sales_agent', 'change_status')).toBe(true);
    expect(hasPermission('sales_agent', 'manage_tasks')).toBe(true);
  });

  it('denies sales_manager only manage_users', () => {
    expect(hasPermission('sales_manager', 'manage_users')).toBe(false);
    expect(hasPermission('sales_manager', 'view_leads')).toBe(true);
    expect(hasPermission('sales_manager', 'edit_leads')).toBe(true);
    expect(hasPermission('sales_manager', 'assign_leads')).toBe(true);
    expect(hasPermission('sales_manager', 'view_reports')).toBe(true);
  });
});

describe('normalizeRole', () => {
  it('passes through valid AppRole values unchanged', () => {
    expect(normalizeRole('admin')).toBe('admin');
    expect(normalizeRole('sales_manager')).toBe('sales_manager');
    expect(normalizeRole('sales_agent')).toBe('sales_agent');
    expect(normalizeRole('viewer')).toBe('viewer');
  });

  it('maps legacy user-facing role "concierge" to sales_agent', () => {
    expect(normalizeRole('concierge')).toBe('sales_agent');
  });

  it('maps legacy user-facing role "user" to viewer', () => {
    expect(normalizeRole('user')).toBe('viewer');
  });

  it('falls back to viewer for null, undefined, and unknown strings', () => {
    expect(normalizeRole(null)).toBe('viewer');
    expect(normalizeRole(undefined)).toBe('viewer');
    expect(normalizeRole('')).toBe('viewer');
    expect(normalizeRole('superadmin')).toBe('viewer');
    expect(normalizeRole('ADMIN')).toBe('viewer');
  });
});
