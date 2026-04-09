import type { Metadata } from 'next';
import ExplorePage from '@/explore/pages/ExplorePage';

type Props = {
  params: Promise<{ emirate: string }>;
};

const EMIRATE_LABELS: Record<string, string> = {
  dubai: 'Dubai',
  'abu-dhabi': 'Abu Dhabi',
  sharjah: 'Sharjah',
  ajman: 'Ajman',
  'ras-al-khaimah': 'Ras Al Khaimah',
  fujairah: 'Fujairah',
  'umm-al-quwain': 'Umm Al Quwain',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { emirate } = await params;
  const label = EMIRATE_LABELS[emirate] ?? emirate.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const title = `Explore ${label} | Landmarks, Dining & Hidden Gems | Dubai À La Carte`;
  const description = `Discover the best venues, landmarks, dining, and experiences in ${label}. Curated recommendations with concierge booking access.`;
  const canonical = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubaialacharte.com'}/explore/${emirate}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: 'Dubai À La Carte',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function ExploreEmiratePage() {
  return <ExplorePage />;
}
