"use client";

import { useParams } from "next/navigation";
import HotelsList from "@/features/stays/pages/HotelsList";
import VillasList from "@/features/stays/pages/VillasList";
import ResidencesList from "@/features/stays/pages/ResidencesList";
import NotFound from "@/app/not-found";

const SUBCATEGORY_MAP: Record<string, React.ComponentType> = {
  hotels: HotelsList,
  villas: VillasList,
  residences: ResidencesList,
};

export default function StaysSubcategoryPage() {
  const params = useParams();
  const subcategory = params?.subcategory as string;

  const Component = SUBCATEGORY_MAP[subcategory];

  if (!Component) {
    return <NotFound />;
  }

  return <Component />;
}
