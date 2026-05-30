'use client';

import { use } from 'react';
import DesertProductDetailPage from '@/features/experiences/pages/DesertProductDetailPage';
import WaterDurationDetailPage from '@/features/experiences/pages/WaterDurationDetailPage';

export default function ProductDetailRoute({
  params,
}: {
  params: Promise<{ category: string; item: string; slug: string }>;
}) {
  const { category } = use(params);

  if (category === 'water-activities') {
    return <WaterDurationDetailPage params={params} />;
  }

  return <DesertProductDetailPage params={params} />;
}
