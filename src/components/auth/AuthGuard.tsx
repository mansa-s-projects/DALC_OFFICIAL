import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '../../store/useAppStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useAppStore((s) => s.session);

  useEffect(() => {
    if (!session) {
      router.push(`/auth/login?from=${encodeURIComponent(pathname ?? '/')}`);
    }
  }, [session, pathname, router]);

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
