import { redirect } from 'next/navigation';

const CATEGORY_REDIRECTS: Record<string, string> = {
  cars: '/travel/car-rental',
  yachts: '/experiences/water-activities',
  jets: '/travel/jets',
};

export default async function LegacyTravelTransportCategoryRedirectPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  redirect(CATEGORY_REDIRECTS[category] ?? '/travel');
}
