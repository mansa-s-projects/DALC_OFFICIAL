import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const session = useAppStore((s) => s.session);
  const profile = useAppStore((s) => s.profile);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (profile?.role !== 'admin' && profile?.role !== 'concierge') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
