import { useQuery } from '@tanstack/react-query';
import {
  getBusinessServices,
  getServiceBySlug,
  getFeaturedServices,
} from '../../../lib/business';
import type { BusinessFilters } from '../types';

export function useBusinessServices(filters?: BusinessFilters) {
  return useQuery({
    queryKey: ['business-services', filters],
    queryFn: () => getBusinessServices(filters),
  });
}

export function useBusinessService(slug: string | undefined) {
  return useQuery({
    queryKey: ['business-service', slug],
    enabled: Boolean(slug),
    queryFn: () => getServiceBySlug(slug!),
  });
}

export function useFeaturedBusinessServices(subcategory?: string) {
  return useQuery({
    queryKey: ['business-services-featured', subcategory],
    queryFn: () => getFeaturedServices(subcategory),
  });
}
