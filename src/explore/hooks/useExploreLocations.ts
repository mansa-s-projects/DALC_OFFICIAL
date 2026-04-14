export function useExploreLocations() {
  return useQuery<ExploreLocation[]>({
    queryKey: ["explore_locations"],
    queryFn: async () => {
      if (!supabase) {
        throw new Error("Supabase client not initialized");
      }

      const { data, error } = await supabase
        .from("explore_locations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("SUPABASE ERROR:", JSON.stringify(error, null, 2));
        throw new Error(error.message || "Failed to fetch locations");
      }

      if (!data || data.length === 0) {
        throw new Error("No explore locations found in database");
      }

      // 🔥 MAP DB → UI FORMAT
      return data.map((loc) => ({
        id: loc.id,
        title: loc.name,
        slug: loc.slug,
        description: loc.short_description,
        highlight: loc.why_unique,

        // TEMP fallback until you add real images
        image: "/images/placeholder.jpg",

        // TEMP mapping (fix later with joins)
        category: loc.category_id || "unknown",
        district: loc.district_id || "unknown",
        emirate: loc.emirate_id || "unknown",
      }));
    },
    staleTime: 1000 * 60 * 5,
  });
}