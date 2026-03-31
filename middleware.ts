import { NextRequest, NextResponse } from 'next/server';
import { hasPermission, normalizeRole } from './src/lib/rbac';

function getRole(request: NextRequest) {
  const headerRole = request.headers.get('x-user-role');
  const cookieRole = request.cookies.get('dalc_role')?.value;
  return normalizeRole(headerRole || cookieRole || null);
}

export function middleware(request: NextRequest) {
  const role = getRole(request);
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/admin')) {
    if (role !== 'admin' && role !== 'sales_manager') {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
    }
  }

  if (pathname.startsWith('/api/sales-ops/dashboard')) {
    if (!hasPermission(role, 'view_reports')) {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
    }
  }

  if (pathname.startsWith('/api/sales-ops/commands')) {
    if (!hasPermission(role, 'edit_leads')) {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/sales-ops/:path*'],
};
