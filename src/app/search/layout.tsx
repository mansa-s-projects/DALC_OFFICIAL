import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Search Dubai Experiences & Services | Dubai À La Carte',
  description:
    'Search across all Dubai À La Carte services — luxury transport, stays, nightlife, experiences, concierge, and more.',
  keywords: [
    'Dubai luxury search',
    'Dubai concierge services',
    'Dubai experiences search',
    'find luxury Dubai',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/search`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchLayout({ children }: { children: ReactNode }) {
  return children;
}
