import { redirect } from 'next/navigation';

const CATEGORY_REDIRECTS: Record<string, string> = {
  cars: '/travel/car-rental',
  yachts: '/experiences/water-activities',
  jets: '/travel/jets',
};

export default async function TransportCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const destination = CATEGORY_REDIRECTS[category];

  if (!destination) {
    redirect('/travel');
  }

  redirect(destination);
}
