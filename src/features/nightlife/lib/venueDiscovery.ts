import type { Category, UserSkill, Venue } from '@/types';
import { SKILL_LABELS } from '@/types';

type RecommendationReason = {
  label: string;
  score: number;
};

export type VenueRecommendation = {
  venue: Venue;
  matchScore: number;
  matchExplanation: string;
  reasons: string[];
};

const CATEGORY_ROUTES: Partial<Record<Category, string>> = {
  dining: '/explore/dubai/restaurants',
  nightlife: '/explore/dubai/nightlife',
  'beach-clubs': '/explore/dubai/beach-clubs',
  'dining-entertainment': '/explore/dubai/dining-entertainment',
};

function normalizeValue(value: string): string {
  return value.trim().toLowerCase();
}

function getSharedValues(left: string[], right: string[]): string[] {
  const rightSet = new Set(right.map(normalizeValue));
  return left.filter((value) => rightSet.has(normalizeValue(value)));
}

function buildExplanation(reasons: RecommendationReason[]): string {
  const [primary, secondary] = reasons;
  if (!primary) {
    return 'Curated by DALC concierge.';
  }

  if (!secondary) {
    return primary.label;
  }

  return `${primary.label} ${secondary.label.toLowerCase()}`;
}

export function getVenueCategoryHref(category: Category): string {
  return CATEGORY_ROUTES[category] ?? '/nightlife';
}

export function getStaticVenueById(_id: string): Venue | undefined {
  return undefined;
}

export function getStaticVenueBySlug(_slug: string): Venue | undefined {
  return undefined;
}

export function getVenueSeoDescription(venue: Venue): string {
  const categoryLabel = (venue.category || '').replace(/-/g, ' ').trim() || 'venue';
  const location = venue.area || venue.location || 'Dubai';
  const locationLabel = location === 'Dubai' ? 'Dubai' : `${location}, Dubai`;
  const shortDescription = typeof venue.description_short === 'string' ? venue.description_short.trim() : '';

  return [
    `${venue.name} in ${locationLabel}.`,
    shortDescription,
    `Discover ${categoryLabel} details, images, insider tips, and concierge booking with Dubai A La Carte.`,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getVenueRecommendations(
  venue: Venue,
  allVenues: Venue[],
  userSkills: UserSkill[] = [],
  limit = 4,
): VenueRecommendation[] {
  const targetVibes = venue.vibe_tags ?? [];
  const targetSkills = venue.skills ?? [];
  const audienceSkills = userSkills.length > 0 ? userSkills : targetSkills;

  return allVenues
    .filter((candidate) => candidate.id !== venue.id)
    .map((candidate) => {
      const reasons: RecommendationReason[] = [];

      if (candidate.category === venue.category) {
        reasons.push({ label: `Same ${venue.category.replace(/-/g, ' ')} scene`, score: 3.2 });
      }

      if (candidate.area === venue.area || candidate.location === venue.location) {
        reasons.push({ label: `Near ${venue.area || venue.location}`, score: 1.8 });
      }

      const sharedVibes = getSharedValues(targetVibes, candidate.vibe_tags ?? []);
      if (sharedVibes.length > 0) {
        reasons.push({
          label: `${sharedVibes.slice(0, 2).join(' + ')} vibe match`,
          score: Math.min(2.4, sharedVibes.length * 1.2),
        });
      }

      const candidateSkills = candidate.skills ?? [];
      const sharedSkills = candidateSkills.filter((skill) => audienceSkills.includes(skill));
      if (sharedSkills.length > 0) {
        reasons.push({
          label: `Aligned with ${sharedSkills.slice(0, 2).map((skill) => SKILL_LABELS[skill]).join(' & ')}`,
          score: Math.min(2.6, sharedSkills.length * 1.3),
        });
      }

      if (candidate.cuisine && venue.cuisine && normalizeValue(candidate.cuisine) === normalizeValue(venue.cuisine)) {
        reasons.push({ label: `${candidate.cuisine} culinary match`, score: 1.2 });
      }

      const candidateTier = Number(candidate.price_tier ?? 1) || 1;
      const venueTier = Number(venue.price_tier ?? 1) || 1;
      const priceDelta = Math.abs(candidateTier - venueTier);
      reasons.push({ label: 'Comparable spend level', score: Math.max(0.4, 1.2 - priceDelta * 0.25) });

      if (candidate.is_trending) {
        reasons.push({ label: 'Trending right now', score: 0.8 });
      }

      const recommendScore = Number(candidate.recommend_score ?? 0) || 0;
      const rawScore = reasons.reduce((total, reason) => total + reason.score, 0) + recommendScore / 100;
      const matchScore = Math.min(9.9, rawScore);
      const sortedReasons = reasons.sort((left, right) => right.score - left.score);

      return {
        venue: candidate,
        matchScore,
        matchExplanation: buildExplanation(sortedReasons),
        reasons: sortedReasons.map((reason) => reason.label),
        rawScore,
      };
    })
    .sort((left, right) => right.rawScore - left.rawScore)
    .slice(0, limit)
    .map(({ rawScore: _rawScore, ...recommendation }) => recommendation);
}
