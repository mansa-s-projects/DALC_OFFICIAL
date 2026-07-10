import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Luxury Hotels in Dubai | 5-Star Stays & Resort Booking | Dubai À La Carte',
  description: 'Book Dubai\'s most exclusive hotels — Burj Al Arab, Atlantis The Royal, One&Only, Four Seasons, and 100+ curated properties. Best rates with complimentary upgrades.',
  keywords: ['luxury hotels Dubai', '5 star hotels Dubai', 'Burj Al Arab booking', 'Atlantis The Royal Dubai', 'best hotels Dubai', 'Dubai hotel deals', 'hotel booking Dubai', 'resort Dubai'],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel/hotels`,
  },
  openGraph: {
    title: 'Luxury Hotels in Dubai | 5-Star Stays & Resort Booking | Dubai À La Carte',
    description: 'Book Dubai\'s most exclusive hotels — Burj Al Arab, Atlantis The Royal, One&Only, Four Seasons, and 100+ curated properties. Best rates with complimentary upgrades.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel/hotels`,
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop', width: 1200, height: 630, alt: 'Luxury hotel in Dubai' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxury Hotels in Dubai | 5-Star Stays & Resort Booking | Dubai À La Carte',
    description: 'Book Dubai\'s most exclusive hotels — Burj Al Arab, Atlantis The Royal, One&Only, Four Seasons, and 100+ curated properties. Best rates with complimentary upgrades.',
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop'],
  },
};

export default function HotelsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Luxury Hotel Booking Dubai',
            description: "Book Dubai's most exclusive hotels — Burj Al Arab, Atlantis The Royal, One&Only, Four Seasons, and 100+ curated properties. Best rates with complimentary upgrades.",
            provider: {
              '@type': 'Organization',
              name: 'Dubai À La Carte',
              url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com',
            },
            areaServed: {
              '@type': 'City',
              name: 'Dubai',
              addressCountry: 'AE',
            },
            url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel/hotels`,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com' },
                { '@type': 'ListItem', position: 2, name: 'Travel', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel` },
                { '@type': 'ListItem', position: 3, name: 'Hotels', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel/hotels` },
              ],
            },
          }),
        }}
      />
      {children}
    </>
  );
}
