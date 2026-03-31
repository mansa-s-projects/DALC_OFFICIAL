import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../../store/useAppStore';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const session = useAppStore((s) => s.session);
  const profile = useAppStore((s) => s.profile);

  // TEMP: Allow access without admin check for development
  // Uncomment below to re-enable protection
  
  /*
  useEffect(() => {
    if (!session) {
      router.push('/login');
    } else if (profile?.role !== 'admin') {
      router.push('/');
    }
  }, [session, profile, router]);

  if (!session || profile?.role !== 'admin') {
    return null;
  }
  */

  return <>{children}</>;
}
