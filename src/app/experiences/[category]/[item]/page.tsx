import type { Metadata } from 'next';
import { isDesertSubcategorySlug, getDesertSubcategory } from '@/features/experiences/desertData';
import { isWaterModelSlug, getWaterModel } from '@/features/experiences/waterData';
import { getExperienceItem } from '@/features/experiences/catalog';
import ExperienceDetail from '@/features/experiences/pages/ExperienceDetail';
import DesertSubcategoryPage from '@/features/experiences/pages/DesertSubcategoryPage';
import WaterModelPage from '@/features/experiences/pages/WaterModelPage';

type PageProps = { params: Promise<{ category: string; item: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, item } = await params;

  if (category === 'desert-adventures' && isDesertSubcategorySlug(item)) {
    const sub = getDesertSubcategory(item);
    if (sub) {
      return {
        title: `${sub.seoTitle} | Dubai À La Carte`,
        description: sub.seoDescription,
        alternates: { canonical: `https://dubaialacharte.com/experiences/${category}/${item}` },
        openGraph: {
          title: sub.seoTitle,
          description: sub.seoDescription,
          url: `https://dubaialacharte.com/experiences/${category}/${item}`,
          siteName: 'Dubai À La Carte',
          type: 'website',
        },
      };
    }
  }

  if (category === 'water-activities' && isWaterModelSlug(item)) {
    const model = getWaterModel(item);
    if (model) {
      return {
        title: `${model.seoTitle} | Dubai À La Carte`,
        description: model.seoDescription,
        alternates: { canonical: `https://dubaialacharte.com/experiences/${category}/${item}` },
        openGraph: {
          title: model.seoTitle,
          description: model.seoDescription,
          url: `https://dubaialacharte.com/experiences/${category}/${item}`,
          siteName: 'Dubai À La Carte',
          type: 'website',
        },
      };
    }
  }

  const catalogItem = getExperienceItem(category, item);
  const title = catalogItem?.title ?? item;
  const description = catalogItem?.description ?? `Book ${title} in Dubai with Dubai À La Carte.`;

  return {
    title: `${title} Dubai | Dubai À La Carte`,
    description,
    alternates: { canonical: `https://dubaialacharte.com/experiences/${category}/${item}` },
    openGraph: {
      title: `${title} Dubai`,
      description,
      url: `https://dubaialacharte.com/experiences/${category}/${item}`,
      siteName: 'Dubai À La Carte',
      type: 'website',
    },
  };
}

export default async function ExperiencesCategoryItemPage({ params }: PageProps) {
  const { category, item } = await params;

  if (category === 'desert-adventures' && isDesertSubcategorySlug(item)) {
    return <DesertSubcategoryPage params={params} />;
  }

  if (category === 'water-activities' && isWaterModelSlug(item)) {
    return <WaterModelPage params={params} />;
  }

  return <ExperienceDetail params={params} />;
}
