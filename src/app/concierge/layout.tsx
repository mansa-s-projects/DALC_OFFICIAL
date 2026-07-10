import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Concierge Request | Dubai À La Carte',
  description: 'Submit a concierge request — tell us what you need and a dedicated DALC specialist will handle every detail.',
  path: '/concierge',
  keywords: ['Dubai concierge', 'Dubai luxury concierge', 'Dubai personal assistant', 'Dubai VIP service'],
});

export default function ConciergeLayout({ children }: { children: ReactNode }) {
  return children;
}
