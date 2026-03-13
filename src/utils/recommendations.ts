import { Venue, UserProfile, UserSkill, FeedItem, Category, UserStage } from '../types';

function intersection<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b);
  return a.filter((item) => setB.has(item));
}

const STAGE_CATEGORY_MAP: Record<UserStage, Category[]> = {
  EXPLORING: ['dining', 'experiences', 'beach-clubs'],
  VISA_PENDING: ['dining', 'nightlife', 'beach-clubs'],
  VISA_APPROVED: ['nightlife', 'beach-clubs', 'dining'],
  COMPANY_SETUP: ['dining', 'business', 'nightlife'],
  PROPERTY_SEARCH: ['dining', 'beach-clubs', 'experiences'],
  ESTABLISHED: ['nightlife', 'beach-clubs', 'yachts', 'experiences', 'dining-entertainment'],
};

function getStageMultiplier(venue: Venue, stage: UserStage): number {
  const preferred = STAGE_CATEGORY_MAP[stage] || [];
  return preferred.includes(venue.category) ? 10 : 5;
}

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 21) return 'evening';
  return 'night';
}

function calculateTimeRelevance(venue: Venue): number {
  const time = getTimeOfDay();
  const category = venue.category;

  if (time === 'night' && (category === 'nightlife' || category === 'dining-entertainment')) return 10;
  if (time === 'evening' && category === 'dining') return 10;
  if (time === 'afternoon' && category === 'beach-clubs') return 10;
  if (time === 'morning' && category === 'wellness') return 10;

  return 5;
}

export function calculateRelevance(venue: Venue, user: UserProfile | null): number {
  if (!user || !user.skills.length) {
    // No user profile — rely on trending + base score
    const trendingScore = venue.is_trending ? Math.min((venue.trending_score ?? 0) / 10, 10) : 0;
    const baseScore = Math.min(venue.recommend_score / 10, 10);
    return trendingScore * 0.5 + baseScore * 0.3 + calculateTimeRelevance(venue) * 0.2;
  }

  // Skill overlap (0-10)
  const skillOverlap = intersection(venue.skills, user.skills).length;
  const skillScore = Math.min(skillOverlap * 2.5, 10);

  // Trending boost (0-10)
  const trendingScore = venue.is_trending
    ? Math.min((venue.trending_score ?? 0) / 10, 10)
    : 0;

  // Stage appropriateness (0-10)
  const stageScore = getStageMultiplier(venue, user.relocation_stage);

  // Time context (0-10)
  const timeScore = calculateTimeRelevance(venue);

  return skillScore * 0.4 + trendingScore * 0.3 + stageScore * 0.2 + timeScore * 0.1;
}

export function getMatchPercentage(venue: Venue, userSkills: UserSkill[]): number {
  if (!userSkills.length || !venue.skills.length) return 0;
  const overlap = intersection(venue.skills, userSkills).length;
  return Math.round((overlap / userSkills.length) * 100);
}

export function getMatchExplanation(venue: Venue, user: UserProfile | null): string {
  if (!user || !user.skills.length) {
    if (venue.is_trending) return 'Trending now';
    return 'Popular venue';
  }

  const matched = intersection(venue.skills, user.skills);
  if (matched.length > 0) {
    const topSkill = matched[0];
    const label = topSkill.charAt(0) + topSkill.slice(1).toLowerCase().replace('_', ' ');
    return `Matches your ${label} preference`;
  }

  if (venue.is_trending) return 'Trending tonight';
  return 'Recommended for you';
}

function determineFeedType(venue: Venue, user: UserProfile | null): FeedItem['type'] {
  if (venue.is_trending && (venue.trending_score ?? 0) > 85) return 'TRENDING';

  if (user && user.skills.length > 0) {
    const overlap = intersection(venue.skills, user.skills);
    if (overlap.length >= 2) return 'SKILL_MATCH';
  }

  if (user) {
    const preferred = STAGE_CATEGORY_MAP[user.relocation_stage] || [];
    if (preferred.includes(venue.category)) return 'STAGE_BASED';
  }

  return 'SIMILAR';
}

export function buildSmartFeed(venues: Venue[], user: UserProfile | null): FeedItem[] {
  const scored = venues.map((venue) => ({
    venue,
    score: calculateRelevance(venue, user),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.map((item, index) => ({
    id: item.venue.id,
    type: determineFeedType(item.venue, user),
    venue: item.venue,
    relevanceScore: item.score,
    explanation: getMatchExplanation(item.venue, user),
    rank: index + 1,
  }));
}

export function getTrendingVenues(venues: Venue[], limit = 10): Venue[] {
  return venues
    .filter((v) => v.is_trending)
    .sort((a, b) => (b.trending_score ?? 0) - (a.trending_score ?? 0))
    .slice(0, limit);
}

export function getSkillMatchedVenues(
  venues: Venue[],
  userSkills: UserSkill[],
  limit = 10
): Venue[] {
  if (!userSkills.length) return [];

  return venues
    .map((v) => ({
      venue: v,
      overlap: intersection(v.skills, userSkills).length,
    }))
    .filter((v) => v.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map((v) => v.venue);
}
