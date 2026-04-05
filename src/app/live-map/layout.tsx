import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Dubai Live Map | Curated Places & Discovery Layers',
  description: 'Explore DALC Live Map for handpicked Dubai venues, cultural spots, and discovery points with editorial context and concierge pathways.',
  path: '/live-map',
  keywords: ['Dubai live map', 'Dubai venue map', 'Dubai discovery map', 'DALC map'],
});

export default function LiveMapLayout({ children }: { children: ReactNode }) {
  return children;
}
