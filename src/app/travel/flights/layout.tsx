import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Business Class & First Class Flights from Dubai | Dubai À La Carte',
  description: 'Book premium flights from Dubai with concierge assistance — business class, first class, and bespoke itineraries on Emirates, Etihad, Qatar Airways and top carriers worldwide.',
  keywords: ['flights from Dubai', 'business class flights Dubai', 'first class flights Dubai', 'Emirates business class', 'Dubai international flights', 'luxury flights Dubai', 'DXB flights'],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel/flights`,
  },
  openGraph: {
    title: 'Business Class & First Class Flights from Dubai | Dubai À La Carte',
    description: 'Book premium flights from Dubai with concierge assistance — business class, first class, and bespoke itineraries on Emirates, Etihad, Qatar Airways and top carriers worldwide.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel/flights`,
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop', width: 1200, height: 630, alt: 'Business class flights from Dubai' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Class & First Class Flights from Dubai | Dubai À La Carte',
    description: 'Book premium flights from Dubai with concierge assistance — business class, first class, and bespoke itineraries on Emirates, Etihad, Qatar Airways and top carriers worldwide.',
    images: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop'],
  },
};

export default function FlightsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Premium Flight Booking Dubai',
            description: 'Book premium flights from Dubai with concierge assistance — business class, first class, and bespoke itineraries on Emirates, Etihad, Qatar Airways and top carriers worldwide.',
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
            url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel/flights`,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com' },
                { '@type': 'ListItem', position: 2, name: 'Travel', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel` },
                { '@type': 'ListItem', position: 3, name: 'Flights', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel/flights` },
              ],
            },
          }),
        }}
      />
      {children}
    </>
  );
}
