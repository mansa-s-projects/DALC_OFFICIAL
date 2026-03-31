'use client';

import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { UserSkill, Venue, FeedItem } from '../types';

interface RecommendationFilters {
  category?: string;
  limit?: number;
  excludeIds?: string[];
}

interface UseRecommendationsResult {
  recommendations: FeedItem[];
  skillMatches: FeedItem[];
  trending: FeedItem[];
  personalized: FeedItem[];
  isLoading: boolean;
}

/**
 * Calculate skill match score between user skills and venue skills
 */
function calculateSkillMatch(
  userSkills: UserSkill[],
  venueSkills: UserSkill[]
): { score: number; matchedSkills: UserSkill[] } {
  if (!userSkills.length || !venueSkills.length) {
    return { score: 0, matchedSkills: [] };
  }

  const matchedSkills = userSkills.filter((skill) => venueSkills.includes(skill));
  const score = matchedSkills.length / Math.max(userSkills.length, venueSkills.length);

  return { score, matchedSkills };
}

/**
 * Generate explanation for why a venue is recommended
 */
function generateExplanation(
  venue: Venue,
  matchedSkills: UserSkill[],
  userSkills: UserSkill[],
  userStage?: string
): string {
  const explanations: string[] = [];

  // Skill-based explanation
  if (matchedSkills.length > 0) {
    const skillNames = matchedSkills
      .map((s) => s.toLowerCase().replace('_', ' '))
      .join(', ');
    explanations.push(`Matches your ${skillNames} preferences`);
  }

  // Stage-based explanation
  if (userStage && userStage !== 'EXPLORING') {
    const stageExplanations: Record<string, string> = {
      VISA_PENDING: 'Popular with new residents',
      VISA_APPROVED: 'Great for celebrating your move',
      COMPANY_SETUP: 'Business-friendly venue',
      PROPERTY_SEARCH: 'Convenient location for house hunting',
      ESTABLISHED: 'Favored by Dubai veterans',
    };
    if (stageExplanations[userStage]) {
      explanations.push(stageExplanations[userStage]);
    }
  }

  // Trending explanation
  if (venue.is_trending) {
    explanations.push('Trending this week');
  }

  // Vibe-based explanation
  if (venue.vibe_tags?.length > 0) {
    explanations.push(`${venue.vibe_tags[0]} vibe`);
  }

  return explanations[0] || 'Recommended for you';
}

/**
 * Hook to get skill-based and personalized recommendations
 */
export function useRecommendations(
  venues: Venue[] = [],
  filters: RecommendationFilters = {}
): UseRecommendationsResult {
  const profile = useAppStore((s) => s.profile);
  const user = useAppStore((s) => s.user);

  const userSkills = useMemo(
    () => profile?.skills ?? user?.skills ?? [],
    [profile?.skills, user?.skills]
  );
  const userStage = useMemo(
    () => profile?.relocation_stage ?? user?.relocation_stage,
    [profile?.relocation_stage, user?.relocation_stage]
  );
  const userPreferences = useMemo(
    () => profile?.preferences ?? user?.preferences,
    [profile?.preferences, user?.preferences]
  );

  const { limit = 10, excludeIds = [] } = filters;

  const recommendations = useMemo(() => {
    const filteredVenues = venues.filter(
      (v) => !excludeIds.includes(v.id) && v.status !== 'archived'
    );

    // Calculate scores for all venues
    const scoredVenues = filteredVenues.map((venue) => {
      const { score: skillScore, matchedSkills } = calculateSkillMatch(
        userSkills,
        venue.skills
      );

      // Stage match bonus (skills don't include stage, so skip this check)
      const stageScore = 0;

      // Trending bonus
      const trendingScore = venue.is_trending ? 0.15 : 0;
      const trendingBonus = (venue.trending_score ?? 0) * 0.001;

      // Featured bonus
      const featuredScore = venue.is_featured ? 0.1 : 0;

      // Total score
      const totalScore =
        skillScore * 0.5 +
        stageScore * 0.2 +
        trendingScore +
        trendingBonus +
        featuredScore +
        venue.recommend_score * 0.15;

      return {
        venue,
        score: totalScore,
        matchedSkills,
      };
    });

    // Sort by score and create feed items
    const sortedVenues = scoredVenues
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return sortedVenues.map((item, index): FeedItem => {
      const explanation = generateExplanation(
        item.venue,
        item.matchedSkills,
        userSkills,
        userStage
      );

      return {
        id: `rec-${item.venue.id}`,
        type: item.matchedSkills.length > 0 ? 'SKILL_MATCH' : 'TRENDING',
        venue: item.venue,
        relevanceScore: item.score,
        explanation,
        rank: index + 1,
      };
    });
  }, [venues, userSkills, userStage, limit, excludeIds]);

  // Skill-specific matches (venues that share skills with user)
  const skillMatches = useMemo(() => {
    return recommendations.filter((r) => r.type === 'SKILL_MATCH').slice(0, 6);
  }, [recommendations]);

  // Trending venues
  const trending = useMemo(() => {
    return recommendations
      .filter((r) => r.venue.is_trending)
      .sort((a, b) => (b.venue.trending_score ?? 0) - (a.venue.trending_score ?? 0))
      .slice(0, 6);
  }, [recommendations]);

  // Personalized picks (top recommendations with explanations)
  const personalized = useMemo(() => {
    return recommendations.slice(0, 8);
  }, [recommendations]);

  return {
    recommendations,
    skillMatches,
    trending,
    personalized,
    isLoading: false,
  };
}

/**
 * Hook to check if a specific venue matches user skills
 */
export function useVenueSkillMatch(venue: Venue | null | undefined): {
  isMatch: boolean;
  matchedSkills: UserSkill[];
  matchScore: number;
} {
  const profile = useAppStore((s) => s.profile);
  const user = useAppStore((s) => s.user);
  const userSkills = profile?.skills ?? user?.skills ?? [];

  if (!venue || !userSkills.length) {
    return { isMatch: false, matchedSkills: [], matchScore: 0 };
  }

  const matchedSkills = userSkills.filter((skill) => venue.skills.includes(skill));
  const matchScore = matchedSkills.length / Math.max(userSkills.length, venue.skills.length);

  return {
    isMatch: matchedSkills.length > 0,
    matchedSkills,
    matchScore,
  };
}

/**
 * Get skill-based explanation for a venue
 */
export function useVenueExplanation(venue: Venue | null | undefined): string {
  const profile = useAppStore((s) => s.profile);
  const user = useAppStore((s) => s.user);
  const userSkills = profile?.skills ?? user?.skills ?? [];
  const userStage = profile?.relocation_stage ?? user?.relocation_stage;

  if (!venue) return '';

  return generateExplanation(
    venue,
    userSkills.filter((s) => venue.skills.includes(s)),
    userSkills,
    userStage
  );
}
