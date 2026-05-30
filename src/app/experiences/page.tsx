import type { Metadata } from 'next';
import ExperiencesHub from '@/features/experiences/pages/ExperiencesHub';

export const metadata: Metadata = {
  title: 'Luxury Experiences Dubai | Desert, Water, Sky & Private Dining | Dubai À La Carte',
  description:
    'Book curated Dubai experiences — desert safaris, jet skiing, helicopter tours, sky dining and more. 9 categories of handpicked experiences from AED 70.',
  keywords: [
    'dubai experiences',
    'desert safari dubai',
    'jet ski dubai',
    'skydiving dubai',
    'luxury spa dubai',
    'private dinner dubai',
    'dubai attractions',
    'dubai things to do',
    'helicopter tour dubai',
    'supercar rental dubai',
  ],
  alternates: { canonical: 'https://dubaialacharte.com/experiences' },
  openGraph: {
    title: 'Luxury Experiences Dubai | Dubai À La Carte',
    description:
      'Nine categories of handpicked Dubai experiences — from dune buggies to sky dining. Book instantly.',
    url: 'https://dubaialacharte.com/experiences',
    siteName: 'Dubai À La Carte',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Luxury Experiences Dubai',
  description:
    'Curated Dubai experiences across 9 categories — desert adventures, water sports, aerial thrills, sky dining, wellness and more.',
  url: 'https://dubaialacharte.com/experiences',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dubaialacharte.com' },
      { '@type': 'ListItem', position: 2, name: 'Experiences', item: 'https://dubaialacharte.com/experiences' },
    ],
  },
};

export default function ExperiencesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ExperiencesHub />
    </>
  );
}
