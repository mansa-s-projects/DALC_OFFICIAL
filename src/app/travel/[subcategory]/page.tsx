"use client";

import { useParams } from "next/navigation";
import HotelsList from "@/features/stays/pages/HotelsList";
import VillasList from "@/features/stays/pages/VillasList";
import ResidencesList from "@/features/stays/pages/ResidencesList";
import CarsList from "@/features/transport/pages/CarsList";
import NotFound from "@/app/not-found";

// Note: yachts and jets have their own dedicated routes in app/travel/yachts and app/travel/jets
// This dynamic route handles other subcategories
const SUBCATEGORY_MAP: Record<string, React.ComponentType> = {
  hotels: HotelsList,
  villas: VillasList,
  residences: ResidencesList,
  "car-rental": CarsList,
};

export default function TravelSubcategoryPage() {
  const params = useParams();
  const subcategory = params?.subcategory as string;

  const Component = SUBCATEGORY_MAP[subcategory];

  if (!Component) {
    return <NotFound />;
  }

  return <Component />;
}
