import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Private Jet Charter Dubai | Same-Day & International Flights | Dubai À La Carte',
  description: 'Charter a private jet from Dubai to any destination worldwide — light jets, midsize, super-midsize, large cabin, and VIP airliners. Instant quotes, same-day availability.',
  keywords: ['private jet charter Dubai', 'private jet Dubai', 'charter flight Dubai', 'Dubai private aviation', 'VIP jet Dubai', 'private jet hire Dubai', 'empty leg Dubai', 'luxury jet Dubai'],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel/jets`,
  },
  openGraph: {
    title: 'Private Jet Charter Dubai | Same-Day & International Flights | Dubai À La Carte',
    description: 'Charter a private jet from Dubai to any destination worldwide — light jets, midsize, super-midsize, large cabin, and VIP airliners. Instant quotes, same-day availability.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel/jets`,
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1200&auto=format&fit=crop', width: 1200, height: 630, alt: 'Private jet charter Dubai' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Private Jet Charter Dubai | Same-Day & International Flights | Dubai À La Carte',
    description: 'Charter a private jet from Dubai to any destination worldwide — light jets, midsize, super-midsize, large cabin, and VIP airliners. Instant quotes, same-day availability.',
    images: ['https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1200&auto=format&fit=crop'],
  },
};

export default function JetsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Private Jet Charter Dubai',
            description: 'Charter a private jet from Dubai to any destination worldwide — light jets, midsize, super-midsize, large cabin, and VIP airliners. Instant quotes, same-day availability.',
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
            url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel/jets`,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com' },
                { '@type': 'ListItem', position: 2, name: 'Travel', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel` },
                { '@type': 'ListItem', position: 3, name: 'Private Jets', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/travel/jets` },
              ],
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How much does a private jet charter cost from Dubai?',
                acceptedAnswer: { '@type': 'Answer', text: 'Private jet charter from Dubai typically costs AED 15,000–80,000 per flight hour depending on aircraft type, from light jets to large cabin VIP airliners. We source competitive empty-leg rates and full charters with same-day availability.' },
              },
              {
                '@type': 'Question',
                name: 'Can I book a same-day private jet from Dubai?',
                acceptedAnswer: { '@type': 'Answer', text: 'Yes. Dubai has excellent private aviation infrastructure with multiple FBOs at DXB and DWC. Same-day and next-day charters are available to most destinations including Europe, Africa, and Asia.' },
              },
              {
                '@type': 'Question',
                name: 'What aircraft types are available for charter in Dubai?',
                acceptedAnswer: { '@type': 'Answer', text: 'We offer the full spectrum: light jets (6 seats), midsize jets (8 seats), super-midsize (9 seats), large cabin (12–16 seats), ultra-long-range, and VIP airliner conversions. Each category has different range, speed, and cabin configuration.' },
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
