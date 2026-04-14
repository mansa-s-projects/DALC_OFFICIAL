'use client';

import React from 'react';

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * AdminGuard is a UX-only component.
 * Security enforcement for /admin routes is handled by:
 *   1. Next.js middleware (middleware.ts) — cryptographic JWT validation via getUser()
 *   2. Individual API route handlers — independent server-side auth via requireAdminAuth()
 *   3. Supabase RLS — DB-level enforcement via is_user_admin()
 *
 * This component does NOT gate access. It exists purely for layout composition.
 */
export default function AdminGuard({ children }: AdminGuardProps) {
  return <>{children}</>;
}
