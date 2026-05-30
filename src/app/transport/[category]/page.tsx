"use client";

import type { ComponentType } from "react";
import { useParams } from "next/navigation";
import NotFound from "@/app/not-found";
import CarsList from "@/features/transport/pages/CarsList";
import YachtsList from "@/features/transport/pages/YachtsList";
import JetsList from "@/features/transport/pages/JetsList";

const CATEGORY_COMPONENTS: Record<string, ComponentType> = {
  cars: CarsList,
  yachts: YachtsList,
  jets: JetsList,
};

export default function TransportCategoryPage() {
  const params = useParams();
  const category = params?.category as string;
  const Component = CATEGORY_COMPONENTS[category];

  if (!Component) {
    return <NotFound />;
  }

  return <Component />;
}
