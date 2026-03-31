import { redirect } from 'next/navigation';

export default async function LegacyTravelTransportCategoryRedirectPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  redirect(`/transport/${category}`);
}
