import { redirect } from 'next/navigation';

type StaysSubcategoryPageProps = {
  params: Promise<{ subcategory: string }>;
};

export default async function StaysSubcategoryPage({ params }: StaysSubcategoryPageProps) {
  const { subcategory } = await params;
  redirect(`/travel/${subcategory}`);
}
