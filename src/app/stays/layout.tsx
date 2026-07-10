import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Luxury Stays Dubai | Hotels, Villas & Residences | Dubai À La Carte',
  description:
    'Book luxury stays in Dubai — five-star hotels, private beach villas, penthouse residences, and serviced apartments. Curated by DALC concierge.',
  keywords: [
    'luxury hotels Dubai',
    'Dubai villa rental',
    'Dubai residences',
    'five star hotels Dubai',
    'beachfront villa Dubai',
    'luxury accommodation Dubai',
    'Dubai penthouse',
    'serviced apartments Dubai',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/stays`,
  },
  openGraph: {
    title: 'Luxury Stays Dubai | Hotels, Villas & Residences | Dubai À La Carte',
    description:
      'Book luxury stays in Dubai — five-star hotels, private beach villas, penthouse residences, and serviced apartments. Curated by DALC concierge.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/stays`,
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Luxury hotel and villa stays in Dubai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxury Stays Dubai | Hotels, Villas & Residences | Dubai À La Carte',
    description:
      'Book luxury stays in Dubai — five-star hotels, private beach villas, penthouse residences, and serviced apartments. Curated by DALC concierge.',
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop',
    ],
  },
};

export default function StaysLayout({ children }: { children: ReactNode }) {
  return children;
}
