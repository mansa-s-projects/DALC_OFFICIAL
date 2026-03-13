import { useQuery } from '@tanstack/react-query';
import {
  getProperties,
  getPropertyBySlug,
  getFeaturedProperties,
} from '../../../lib/stays';
import type { StaysFilters } from '../types';

export function useProperties(filters?: StaysFilters) {
  return useQuery({
    queryKey: ['stays-properties', filters],
    queryFn: () => getProperties(filters),
  });
}

export function useProperty(slug: string | undefined) {
  return useQuery({
    queryKey: ['stays-property', slug],
    enabled: Boolean(slug),
    queryFn: () => getPropertyBySlug(slug!),
  });
}

export function useFeaturedProperties(subcategory?: string) {
  return useQuery({
    queryKey: ['stays-properties-featured', subcategory],
    queryFn: () => getFeaturedProperties(subcategory),
  });
}
