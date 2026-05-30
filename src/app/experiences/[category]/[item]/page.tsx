'use client';

import { use } from 'react';
import { isDesertSubcategorySlug } from '@/features/experiences/desertData';
import { isWaterModelSlug } from '@/features/experiences/waterData';
import ExperienceDetail from '@/features/experiences/pages/ExperienceDetail';
import DesertSubcategoryPage from '@/features/experiences/pages/DesertSubcategoryPage';
import WaterModelPage from '@/features/experiences/pages/WaterModelPage';

export default function ExperiencesCategoryItemPage({
  params,
}: {
  params: Promise<{ category: string; item: string }>;
}) {
  const { category, item } = use(params);

  if (category === 'desert-adventures' && isDesertSubcategorySlug(item)) {
    return <DesertSubcategoryPage params={params} />;
  }

  if (category === 'water-activities' && isWaterModelSlug(item)) {
    return <WaterModelPage params={params} />;
  }

  return <ExperienceDetail params={params} />;
}
