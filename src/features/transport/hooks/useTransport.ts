import { useQuery } from '@tanstack/react-query';
import {
  getTransportServices,
  getTransportServiceBySlug,
  getFeaturedTransport,
} from '../../../lib/transport';
import type { TransportFilters } from '../types';

export function useTransportServices(filters?: TransportFilters) {
  return useQuery({
    queryKey: ['transport-services', filters],
    queryFn: () => getTransportServices(filters),
  });
}

export function useTransportService(slug: string | undefined) {
  return useQuery({
    queryKey: ['transport-service', slug],
    enabled: Boolean(slug),
    queryFn: () => getTransportServiceBySlug(slug!),
  });
}

export function useFeaturedTransport(subcategory?: string) {
  return useQuery({
    queryKey: ['transport-services-featured', subcategory],
    queryFn: () => getFeaturedTransport(subcategory),
  });
}
