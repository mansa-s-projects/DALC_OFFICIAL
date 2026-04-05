import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Travel Dubai | Flights, Hotels, Villas, Jets & Car Rental',
  description: 'Plan your Dubai travel with premium flights, luxury stays, private jets, and curated mobility options in one concierge-led hub.',
  path: '/travel',
  keywords: ['Dubai travel', 'Dubai flights', 'Dubai private jets', 'Dubai car rental'],
});

export default function TravelLayout({ children }: { children: ReactNode }) {
  return children;
}
