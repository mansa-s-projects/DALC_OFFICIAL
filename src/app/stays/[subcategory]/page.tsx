import { notFound, redirect } from 'next/navigation';

const STAYS_SUBCATEGORY_MAP: Record<string, string> = {
  hotels: 'hotels',
  villas: 'villas',
  residences: 'residences',
};

type StaysSubcategoryPageProps = {
  params: Promise<{ subcategory: string }>;
};

export default async function StaysSubcategoryPage({ params }: StaysSubcategoryPageProps) {
  const { subcategory } = await params;

  if (!subcategory || !STAYS_SUBCATEGORY_MAP[subcategory]) {
    notFound();
  }

  redirect(`/travel/${subcategory}`);
}
