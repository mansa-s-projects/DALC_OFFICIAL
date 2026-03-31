'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackVisitor, trackButtonClick } from '@/lib/analytics/posthog';

export function useAutoTracking() {
  const pathname = usePathname();
  const lastPathname = useRef<string | null>(null);

  useEffect(() => {
    if (pathname && pathname !== lastPathname.current) {
      lastPathname.current = pathname;
      trackVisitor(pathname);
    }
  }, [pathname]);
}

export function useButtonTracking(buttonName: string, properties?: Record<string, unknown>) {
  return {
    onClick: () => trackButtonClick(buttonName, properties),
  };
}

export { trackVisitor, trackButtonClick };
