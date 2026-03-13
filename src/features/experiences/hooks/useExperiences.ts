import { useQuery } from '@tanstack/react-query';
import {
  getExperiences,
  getExperienceBySlug,
  getFeaturedExperiences,
  getTrendingExperiences,
  getUpcomingEvents,
} from '../../../lib/experiences';
import type { ExperienceFilters } from '../types';

export function useExperiences(filters?: ExperienceFilters) {
  return useQuery({
    queryKey: ['experiences', filters],
    queryFn: () => getExperiences(filters),
  });
}

export function useExperience(slug: string | undefined) {
  return useQuery({
    queryKey: ['experience', slug],
    enabled: Boolean(slug),
    queryFn: () => getExperienceBySlug(slug!),
  });
}

export function useFeaturedExperiences(subcategory?: string) {
  return useQuery({
    queryKey: ['experiences-featured', subcategory],
    queryFn: () => getFeaturedExperiences(subcategory),
  });
}

export function useTrendingExperiences(limit: number = 6) {
  return useQuery({
    queryKey: ['experiences-trending', limit],
    queryFn: () => getTrendingExperiences(limit),
  });
}

export function useUpcomingEvents(limit: number = 4) {
  return useQuery({
    queryKey: ['experiences-upcoming', limit],
    queryFn: () => getUpcomingEvents(limit),
  });
}
