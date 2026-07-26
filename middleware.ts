import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseMiddlewareClient, ADMIN_ROLES, getRoleFromUser } from './src/lib/supabase-server';
import { hasPermission, normalizeRole } from './src/lib/rbac';
import { VENUE_SLUG_MAP } from './src/lib/venueSlugMap';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  // Redirect legacy /venue/[id] → /venue/[emirate]/[slug]
  const venueSingleMatch = pathname.match(/^\/venue\/([^/]+)$/);
  if (venueSingleMatch) {
    const id = venueSingleMatch[1];
    const mapping = VENUE_SLUG_MAP[id];
    if (mapping) {
      const dest = new URL(`/venue/${mapping.emirate}/${mapping.slug}`, request.url);
      return NextResponse.redirect(dest, { status: 301 });
    }
  }

  // Only run auth checks on protected paths
  const isAdminPath = pathname.startsWith('/admin');
  const isSalesOpsPath = pathname.startsWith('/api/sales-ops');
  const isWorkerPath =
    pathname === '/api/sales-ops/workers/process-queues' ||
    pathname === '/api/sales-ops/command-center/autopilot';

  if (!isAdminPath && !isSalesOpsPath) {
    return response;
  }

  if (isWorkerPath) {
    const expectedToken = process.env.WORKER_CRON_TOKEN;
    const providedToken = request.headers.get('x-worker-token');

    if (expectedToken && providedToken === expectedToken) {
      return response;
    }
  }

  // Cryptographic JWT validation — getUser() calls Supabase Auth servers,
  // unlike getSession() which only reads the cookie without verification.
  const supabase = createSupabaseMiddlewareClient(request, response);
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    if (isAdminPath) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl, { status: 303 });
    }
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  // Role comes from JWT app_metadata — server-signed, unmodifiable by clients
  const jwtRole = getRoleFromUser(user);
  const role = normalizeRole(jwtRole);

  if (isAdminPath) {
    if (!ADMIN_ROLES.includes(role as 'admin' | 'sales_manager')) {
      return NextResponse.redirect(new URL('/', request.url), { status: 303 });
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

  // Forward verified role in a server-set header for downstream route handlers.
  // This header is set by the server — not readable from the client.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-dalc-verified-role', role);
  requestHeaders.set('x-dalc-verified-uid', user.id);
  const forwardedResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Propagate any session cookie refreshes from @supabase/ssr
  response.cookies.getAll().forEach((cookie) => {
    forwardedResponse.cookies.set(cookie.name, cookie.value);
  });

  return forwardedResponse;
}

export const config = {
  matcher: ['/admin/:path*', '/api/sales-ops/:path*', '/venue/:id'],
};
