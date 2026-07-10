import type { Metadata } from 'next';
import NightlifeHub from '@/features/nightlife/pages/NightlifeHub';

export const metadata: Metadata = {
  title: 'Dubai Nightlife | Clubs, Beach Clubs & VIP Dining | Dubai À La Carte',
  description: 'Discover the best of Dubai nightlife — VIP table bookings at top nightclubs, exclusive beach clubs, rooftop lounges, fine dining, and private events. Curated access, every night.',
  keywords: ['Dubai nightlife', 'VIP clubs Dubai', 'beach clubs Dubai', 'Dubai rooftop bars', 'Dubai nightclubs 2024', 'Dubai VIP table booking', 'luxury nightlife Dubai', 'Dubai nightlife guide'],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife`,
  },
  openGraph: {
    title: 'Dubai Nightlife | Clubs, Beach Clubs & VIP Dining | Dubai À La Carte',
    description: 'Discover the best of Dubai nightlife — VIP table bookings at top nightclubs, exclusive beach clubs, rooftop lounges, fine dining, and private events. Curated access, every night.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife`,
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1200&auto=format&fit=crop', width: 1200, height: 630, alt: 'Dubai Nightlife | Clubs, Beach Clubs & VIP Dining | Dubai À La Carte' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dubai Nightlife | Clubs, Beach Clubs & VIP Dining | Dubai À La Carte',
    description: 'Discover the best of Dubai nightlife — VIP table bookings at top nightclubs, exclusive beach clubs, rooftop lounges, fine dining, and private events. Curated access, every night.',
    images: ['https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1200&auto=format&fit=crop'],
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Dubai Nightlife | Clubs, Beach Clubs & VIP Dining | Dubai À La Carte',
            description: 'Discover the best of Dubai nightlife — VIP table bookings at top nightclubs, exclusive beach clubs, rooftop lounges, fine dining, and private events. Curated access, every night.',
            url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife`,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}` },
                { '@type': 'ListItem', position: 2, name: 'Nightlife', item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife` },
              ],
            },
          }),
        }}
      />
      <NightlifeHub />
    </>
  );
}
