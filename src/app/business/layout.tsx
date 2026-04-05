import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Dubai Business Services | Setup, Licensing, Banking',
  description: 'Launch and scale in Dubai with DALC business services including company setup, licensing support, banking guidance, and advisory workflows.',
  path: '/business',
  keywords: ['Dubai business setup', 'Dubai company formation', 'Dubai licensing', 'Dubai business concierge'],
});

export default function BusinessLayout({ children }: { children: ReactNode }) {
  return children;
}
