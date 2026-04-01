"use client";

import { useParams } from "next/navigation";
import CarsList from "@/features/transport/pages/CarsList";
import YachtsList from "@/features/transport/pages/YachtsList";
import JetsList from "@/features/transport/pages/JetsList";
import NotFound from "@/app/not-found";

const CATEGORY_MAP: Record<string, React.ComponentType> = {
  cars: CarsList,
  yachts: YachtsList,
  jets: JetsList,
};

export default function TransportCategoryPage() {
  const params = useParams();
  const category = params?.category as string;

  const Component = CATEGORY_MAP[category];

  if (!Component) {
    return <NotFound />;
  }

  return <Component />;
}
