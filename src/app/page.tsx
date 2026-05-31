import HomeEntry from '@/features/home/pages/HomeEntry';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Dubai À La Carte | Luxury Concierge, Nightlife, Experiences, Travel',
  description:
    'Book Dubai nightlife, curated experiences, travel, stays, and concierge support through one luxury platform built for high-intent requests.',
  path: '/',
  keywords: [
    'Dubai concierge',
    'Dubai nightlife',
    'Dubai experiences',
    'luxury travel Dubai',
    'Dubai stays',
  ],
});

export default function HomePage() {
  const baseUrl = new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ).toString();

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Dubai À La Carte',
      url: baseUrl,
      logo: `${baseUrl.replace(/\/$/, '')}/branding/logo-main.png`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Dubai À La Carte',
      url: baseUrl,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD must be an inline script; Next metadata doesn't cover this.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeEntry />
    </>
  );
}

