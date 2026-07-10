import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Requests',
  robots: { index: false, follow: false },
};

export default function MyRequestsLayout({ children }: { children: ReactNode }) {
  return children;
}
