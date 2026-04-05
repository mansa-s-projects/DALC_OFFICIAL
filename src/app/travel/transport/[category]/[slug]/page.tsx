import { redirect } from 'next/navigation';

const DETAIL_REDIRECTS: Record<string, (slug: string) => string> = {
  cars: (slug) => `/travel/car-rental/${slug}`,
  yachts: () => '/experiences/water-activities',
  jets: () => '/travel/jets',
};

export default async function LegacyTravelTransportDetailRedirectPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const resolver = DETAIL_REDIRECTS[category];
  redirect(resolver ? resolver(slug) : '/travel');
}
