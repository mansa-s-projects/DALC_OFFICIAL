import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, getRoleFromUser, ADMIN_ROLES } from '@/lib/supabase-server';
import { normalizeRole, hasPermission, type PermissionAction } from '@/lib/rbac';

export interface AuthResult {
  userId: string;
  role: string;
}

export async function requireUserAuth(): Promise<AuthResult | NextResponse> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    return {
      userId: user.id,
      role: getRoleFromUser(user) ?? 'user',
    };
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}

/**
 * Validates the caller's JWT server-side and checks role.
 * Returns { userId, role } on success or a NextResponse error to return immediately.
 *
 * Route handlers must call this independently — never rely on middleware alone.
 */
export async function requireAdminAuth(
  _request: NextRequest,
  permission?: PermissionAction
): Promise<AuthResult | NextResponse> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const jwtRole = getRoleFromUser(user);
    const role = normalizeRole(jwtRole);

    if (!ADMIN_ROLES.includes(role as 'admin' | 'sales_manager')) {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
    }

    if (permission && !hasPermission(role, permission)) {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
    }

    return { userId: user.id, role };
  } catch {
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
