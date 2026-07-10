import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Dubai Transport | Cars, Yachts & Private Jets',
  description: 'Rent luxury cars, charter yachts, and book private jets in Dubai. Premium transport concierge for every occasion.',
  path: '/transport',
  keywords: ['Dubai car rental', 'Dubai yacht charter', 'Dubai private jet', 'Dubai luxury transport'],
});

export default function TransportLayout({ children }: { children: ReactNode }) {
  return children;
}
