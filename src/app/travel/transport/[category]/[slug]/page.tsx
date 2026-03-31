import { redirect } from 'next/navigation';

export default async function LegacyTravelTransportDetailRedirectPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  redirect(`/transport/${category}/${slug}`);
}
