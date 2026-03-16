import { useMemo } from 'react';
import type { ExploreLocation, ExploreFilterState } from '../types';

export function useFilteredLocations(
  locations: ExploreLocation[] | undefined,
  filters: ExploreFilterState,
): ExploreLocation[] {
  return useMemo(() => {
    if (!locations) return [];

    const q = filters.search.trim().toLowerCase();

    return locations.filter((loc) => {
      if (filters.hiddenGems === 'true' && !loc.is_hidden_gem) return false;
      if (filters.hiddenGems === 'false' && loc.is_hidden_gem) return false;
      if (
        filters.emirate !== 'All Emirates' &&
        loc.emirate?.toLowerCase() !== filters.emirate.toLowerCase()
      )
        return false;
      if (
        filters.category !== 'All Categories' &&
        loc.category?.toLowerCase() !== filters.category.toLowerCase()
      )
        return false;
      if (q) {
        const hit =
          loc.name.toLowerCase().includes(q) ||
          (loc.short_description?.toLowerCase().includes(q) ?? false) ||
          (loc.emirate?.toLowerCase().includes(q) ?? false) ||
          (loc.category?.toLowerCase().includes(q) ?? false);
        if (!hit) return false;
      }
      return true;
    });
  }, [locations, filters]);
}
