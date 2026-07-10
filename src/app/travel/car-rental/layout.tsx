import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Luxury Car Rental Dubai | Supercars, SUVs & Chauffeur Service | Dubai À La Carte',
  description: 'Rent a luxury car in Dubai — Lamborghini, Ferrari, Rolls-Royce, Bentley, and premium SUVs. Daily, weekly, or monthly. Self-drive or with professional chauffeur.',
  keywords: ['luxury car rental Dubai', 'supercar hire Dubai', 'Ferrari rental Dubai', 'Lamborghini Dubai', 'Rolls-Royce rental Dubai', 'chauffeur service Dubai', 'car hire Dubai', 'exotic cars Dubai'],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel/car-rental`,
  },
  openGraph: {
    title: 'Luxury Car Rental Dubai | Supercars, SUVs & Chauffeur Service | Dubai À La Carte',
    description: 'Rent a luxury car in Dubai — Lamborghini, Ferrari, Rolls-Royce, Bentley, and premium SUVs. Daily, weekly, or monthly. Self-drive or with professional chauffeur.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel/car-rental`,
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1200&auto=format&fit=crop', width: 1200, height: 630, alt: 'Luxury car rental Dubai' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxury Car Rental Dubai | Supercars, SUVs & Chauffeur Service | Dubai À La Carte',
    description: 'Rent a luxury car in Dubai — Lamborghini, Ferrari, Rolls-Royce, Bentley, and premium SUVs. Daily, weekly, or monthly. Self-drive or with professional chauffeur.',
    images: ['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1200&auto=format&fit=crop'],
  },
};

export default function CarRentalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Luxury Car Rental Dubai',
            description: 'Rent a luxury car in Dubai — Lamborghini, Ferrari, Rolls-Royce, Bentley, and premium SUVs. Daily, weekly, or monthly. Self-drive or with professional chauffeur.',
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
            url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel/car-rental`,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com' },
                { '@type': 'ListItem', position: 2, name: 'Travel', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel` },
                { '@type': 'ListItem', position: 3, name: 'Car Rental', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel/car-rental` },
              ],
            },
          }),
        }}
      />
      {children}
    </>
  );
}
