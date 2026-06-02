import type { Metadata } from 'next';
import { getDesertSubcategory, getDesertProduct } from '@/features/experiences/desertData';
import { getWaterModel, getWaterProduct } from '@/features/experiences/waterData';
import DesertProductDetailPage from '@/features/experiences/pages/DesertProductDetailPage';
import WaterDurationDetailPage from '@/features/experiences/pages/WaterDurationDetailPage';

type PageProps = { params: Promise<{ category: string; item: string; slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, item, slug } = await params;

  if (category === 'desert-adventures') {
    const product = getDesertProduct(item, slug);
    const sub = getDesertSubcategory(item);
    if (product && sub) {
      const title = `${product.title} | ${sub.title} Dubai | Dubai À La Carte`;
      const description = `Book ${product.title} in Dubai — ${product.priceLabel} — ${product.durationMinutes} minutes. ${sub.shortDescription}`;
      return {
        title,
        description,
        alternates: { canonical: `https://dubaialacharte.com/experiences/${category}/${item}/${slug}` },
        openGraph: { title, description, url: `https://dubaialacharte.com/experiences/${category}/${item}/${slug}`, siteName: 'Dubai À La Carte', type: 'website' },
      };
    }
  }

  if (category === 'water-activities') {
    const product = getWaterProduct(item, slug);
    const model = getWaterModel(item);
    if (product && model) {
      const title = `${product.title} | ${model.title} Dubai | Dubai À La Carte`;
      const description = `Book ${product.title} in Dubai — ${product.priceLabel} — ${product.durationMinutes} minutes from ${model.location}.`;
      return {
        title,
        description,
        alternates: { canonical: `https://dubaialacharte.com/experiences/${category}/${item}/${slug}` },
        openGraph: { title, description, url: `https://dubaialacharte.com/experiences/${category}/${item}/${slug}`, siteName: 'Dubai À La Carte', type: 'website' },
      };
    }
  }

  return {
    title: `Book ${slug.replace(/-/g, ' ')} Dubai | Dubai À La Carte`,
    description: `Book this experience in Dubai with Dubai À La Carte — luxury concierge service.`,
    alternates: { canonical: `https://dubaialacharte.com/experiences/${category}/${item}/${slug}` },
  };
}

export default async function ProductDetailRoute({ params }: PageProps) {
  const { category } = await params;

  if (category === 'water-activities') {
    return <WaterDurationDetailPage params={params} />;
  }

  return <DesertProductDetailPage params={params} />;
}
