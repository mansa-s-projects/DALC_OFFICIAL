import type { Metadata } from 'next';
import CategoryPage from '@/features/nightlife/pages/CategoryPage';

type Props = {
  params: Promise<{ category: string }>;
};

const CATEGORY_LABELS: Record<string, string> = {
  dining: 'Fine Dining',
  'beach-clubs': 'Beach Clubs',
  nightlife: 'Nightlife',
  'dining-entertainment': 'Dining & Entertainment',
  experiences: 'Experiences',
  wellness: 'Wellness',
  yachts: 'Yachts',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const label = CATEGORY_LABELS[category] ?? category.replace(/-/g, ' ');
  const title = `${label} in Dubai | Dubai À La Carte`;
  const description = `Discover the best ${label.toLowerCase()} venues in Dubai. Curated recommendations, booking, and concierge access.`;
  const canonical = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubaialacharte.com'}/explore/category/${category}`;

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

export default async function ExploreCategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const category = resolvedParams?.category;

  console.log('[ExploreCategoryPage] params:', resolvedParams);

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h1 className="text-2xl font-serif text-cipher-gold mb-2">Category Not Found</h1>
        <p className="text-cipher-muted">
          We could not find the explore category you are looking for. Please return to the explore hub.
        </p>
      </div>
    );
  }

  return <CategoryPage category={category} />;
}
