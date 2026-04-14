import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import type { ExploreLocation } from "../types";
import { ALL_EXPLORE_LOCATIONS } from "../data/exploreLocations";

const STATIC_FALLBACK: ExploreLocation[] = ALL_EXPLORE_LOCATIONS.map((loc) => ({
  id: loc.id,
  name: loc.name,
  short_description: loc.short_description,
  long_description: loc.long_description,
  latitude: loc.latitude,
  longitude: loc.longitude,
  emirate: loc.emirate,
  area: loc.area,
  category: loc.category,
  subcategory: loc.subcategory,
  is_hidden_gem: loc.is_hidden_gem,
  is_featured: loc.is_featured,
  hero_image: loc.hero_image,
  gallery_images: loc.gallery_images,
  tags: loc.tags,
  vibe: loc.vibe,
  price_tier: loc.price_tier,
  opening_hours: loc.opening_hours,
  best_time: loc.best_time,
  insider_tip: loc.insider_tip,
  source_venue_id: loc.source_venue_id,
  created_at: "2024-01-01T00:00:00Z",
}));

export function useExploreLocations() {
  return useQuery<ExploreLocation[]>({
    queryKey: ["explore_locations"],
    queryFn: async () => {
      if (!supabase) return STATIC_FALLBACK;

      const { data, error } = await supabase
        .from("explore_locations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[useExploreLocations] fetch error:", error);
        return STATIC_FALLBACK;
      }

      if (!data || data.length === 0) return STATIC_FALLBACK;

      return data as ExploreLocation[];
    },
    staleTime: 1000 * 60 * 5,
  });
}