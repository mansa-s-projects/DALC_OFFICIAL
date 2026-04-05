import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Dubai Services | Visa, Business, Real Estate & Concierge',
  description: 'Access DALC Dubai services across visas, business setup, real estate, relocation, event planning, and bespoke concierge support.',
  path: '/services',
  keywords: ['Dubai services', 'Dubai visa services', 'Dubai business services', 'Dubai concierge services'],
});

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return children;
}
