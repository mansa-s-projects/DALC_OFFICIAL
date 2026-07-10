import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Dubai Nightlife | Clubs, Beach Clubs, Dining & Private Events',
  description: 'Discover the best of Dubai nightlife — exclusive clubs, beach clubs, fine dining, rooftop bars, and private event experiences curated by DALC.',
  path: '/nightlife',
  keywords: ['Dubai nightlife', 'Dubai clubs', 'Dubai beach clubs', 'Dubai rooftop bars', 'Dubai dining'],
});

export default function NightlifeLayout({ children }: { children: ReactNode }) {
  return children;
}
