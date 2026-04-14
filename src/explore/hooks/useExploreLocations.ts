import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import type { ExploreLocation } from "../types";
import { ALL_EXPLORE_LOCATIONS } from "../data/exploreLocations";

const STATIC_FALLBACK: ExploreLocation[] = ALL_EXPLORE_LOCATIONS.map((loc) => ({
  ...loc,
  created_at: "2024-01-01T00:00:00Z",
})) as ExploreLocation[];

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
        return STATIC_FALLBACK;
      }
      if (!data || data.length === 0) return STATIC_FALLBACK;
      return data as ExploreLocation[];
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });
}
