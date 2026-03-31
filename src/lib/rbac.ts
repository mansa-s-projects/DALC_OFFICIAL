export type AppRole = 'admin' | 'sales_manager' | 'sales_agent' | 'viewer';
export type PermissionAction =
  | 'view_leads'
  | 'edit_leads'
  | 'assign_leads'
  | 'change_status'
  | 'manage_tasks'
  | 'view_reports'
  | 'manage_users';

export const PERMISSION_MAP: Record<AppRole, Record<PermissionAction, boolean>> = {
  admin: {
    view_leads: true,
    edit_leads: true,
    assign_leads: true,
    change_status: true,
    manage_tasks: true,
    view_reports: true,
    manage_users: true,
  },
  sales_manager: {
    view_leads: true,
    edit_leads: true,
    assign_leads: true,
    change_status: true,
    manage_tasks: true,
    view_reports: true,
    manage_users: false,
  },
  sales_agent: {
    view_leads: true,
    edit_leads: true,
    assign_leads: false,
    change_status: true,
    manage_tasks: true,
    view_reports: false,
    manage_users: false,
  },
  viewer: {
    view_leads: true,
    edit_leads: false,
    assign_leads: false,
    change_status: false,
    manage_tasks: false,
    view_reports: true,
    manage_users: false,
  },
};

export function hasPermission(role: AppRole, action: PermissionAction) {
  return Boolean(PERMISSION_MAP[role]?.[action]);
}

export function normalizeRole(value: string | null | undefined): AppRole {
  if (value === 'admin' || value === 'sales_manager' || value === 'sales_agent' || value === 'viewer') {
    return value;
  }
  
  // Map user-facing roles to app roles
  if (value === 'concierge') return 'sales_agent';
  if (value === 'user') return 'viewer';

  return 'viewer';
}
