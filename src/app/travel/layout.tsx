import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Dubai Travel | Flights, Hotels, Private Jets & Car Rental | Dubai À La Carte',
  description: 'Plan your Dubai journey with concierge-grade travel services — private jet charters, luxury hotel bookings, business class flights, premium car rental, and yacht transfers.',
  keywords: ['Dubai travel', 'luxury travel Dubai', 'private jet Dubai', 'Dubai hotel booking', 'business class flights Dubai', 'car rental Dubai', 'yacht charter Dubai', 'luxury chauffeur Dubai'],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel`,
  },
  openGraph: {
    title: 'Dubai Travel | Flights, Hotels, Private Jets & Car Rental | Dubai À La Carte',
    description: 'Plan your Dubai journey with concierge-grade travel services — private jet charters, luxury hotel bookings, business class flights, premium car rental, and yacht transfers.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel`,
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop', width: 1200, height: 630, alt: 'Dubai skyline — Dubai À La Carte Travel' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dubai Travel | Flights, Hotels, Private Jets & Car Rental | Dubai À La Carte',
    description: 'Plan your Dubai journey with concierge-grade travel services — private jet charters, luxury hotel bookings, business class flights, premium car rental, and yacht transfers.',
    images: ['https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop'],
  },
};

export default function TravelLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Dubai Travel Concierge',
            description: 'Plan your Dubai journey with concierge-grade travel services — private jet charters, luxury hotel bookings, business class flights, premium car rental, and yacht transfers.',
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
            url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel`,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com' },
                { '@type': 'ListItem', position: 2, name: 'Travel', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel` },
              ],
            },
          }),
        }}
      />
      {children}
    </>
  );
}
