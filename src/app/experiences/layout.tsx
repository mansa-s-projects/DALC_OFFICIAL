import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Dubai Experiences | Adventure, Wellness, Dining & Culture',
  description: 'Discover curated Dubai experiences including adventure, water activities, dining moments, wellness escapes, and cultural highlights.',
  path: '/experiences',
  keywords: ['Dubai experiences', 'Dubai adventure activities', 'Dubai wellness', 'Dubai dining experiences'],
});

export default function ExperiencesLayout({ children }: { children: ReactNode }) {
  return children;
}
