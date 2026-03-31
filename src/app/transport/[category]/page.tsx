"use client";

import { useParams } from "next/navigation";
import CarsList from "@/features/transport/pages/CarsList";
import NotFound from "@/app/not-found";

const CATEGORY_MAP: Record<string, React.ComponentType> = {
  cars: CarsList,
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
