import type { Metadata } from 'next';
import { getSupabaseAdminClient, hasSupabaseAdminCredentials } from '@/lib/supabase-admin';
import { fetchVenues } from '@/lib/fetchVenues';
import VenueCard from '@/components/cards/VenueCard';

export const revalidate = 3600;

type Props = {
  params: Promise<{ emirate: string; category: string }>;
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

const CATEGORY_LABELS: Record<string, string> = {
  restaurants: 'Fine Dining',
  'beach-clubs': 'Beach Clubs',
  nightlife: 'Nightlife',
  'dining-entertainment': 'Dining & Entertainment',
  experiences: 'Experiences',
  wellness: 'Wellness',
};

export async function generateStaticParams() {
  if (!hasSupabaseAdminCredentials()) {
    return [];
  }
  try {
    const admin = getSupabaseAdminClient();
    const [emiratesResult, categoriesResult] = await Promise.all([
      admin.from('emirates').select('slug').eq('is_active', true),
      admin.from('venue_categories').select('slug').eq('is_active', true),
    ]);
    const emirates = emiratesResult.data ?? [];
    const categories = categoriesResult.data ?? [];
    return emirates.flatMap((e: { slug: string }) =>
      categories.map((c: { slug: string }) => ({ emirate: e.slug, category: c.slug }))
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { emirate, category } = await params;
  const emirateLabel =
    EMIRATE_LABELS[emirate] ??
    emirate.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const categoryLabel =
    CATEGORY_LABELS[category] ??
    category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const title = `${categoryLabel} in ${emirateLabel} | Dubai Ã€ La Carte`;
  const description = `Discover the best ${categoryLabel.toLowerCase()} in ${emirateLabel}. Curated recommendations with concierge booking access.`;
  const canonical = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubaialacharte.com'}/explore/${emirate}/${category}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: 'Dubai Ã€ La Carte',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function ExploreCategoryPage({ params }: Props) {
  const { emirate, category } = await params;
  const emirateLabel =
    EMIRATE_LABELS[emirate] ??
    emirate.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const categoryLabel =
    CATEGORY_LABELS[category] ??
    category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const venues = await fetchVenues({ emirate, category });

  return (
    <main className="min-h-screen bg-cipher-void text-cipher-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <p className="text-cipher-gold text-xs font-mono uppercase tracking-widest mb-2">
            {emirateLabel}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-cipher-white">
            {categoryLabel}
          </h1>
        </header>

        {venues.length === 0 ? (
          <p className="text-cipher-muted">No venues available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
