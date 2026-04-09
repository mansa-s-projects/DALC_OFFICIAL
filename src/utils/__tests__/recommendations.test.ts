import { describe, it, expect, vi, afterEach } from 'vitest';
import type { Venue, UserProfile } from '../../types';
import {
  calculateRelevance,
  getMatchPercentage,
  getMatchExplanation,
  buildSmartFeed,
  getTrendingVenues,
  getSkillMatchedVenues,
} from '../recommendations';

// ─── Fixtures ───────────────────────────────────────────────────────────────────

function makeVenue(overrides: Partial<Venue> = {}): Venue {
  return {
    id: 'v1',
    name: 'Test Venue',
    category: 'dining',
    skills: [],
    is_trending: false,
    trending_score: 0,
    recommend_score: 50,
    ...overrides,
  } as unknown as Venue;
}

function makeUser(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: 'u1',
    email: 'test@dalc.com',
    first_name: 'Test',
    last_name: 'User',
    phone: null,
    avatar_url: null,
    skills: [],
    preferences: {},
    relocation_stage: 'EXPLORING',
    role: 'user',
    tier: 'standard',
    ...overrides,
  } as UserProfile;
}

afterEach(() => {
  vi.useRealTimers();
});

// ─── calculateRelevance ──────────────────────────────────────────────────────────

describe('calculateRelevance', () => {
  it('returns a number between 0 and 10 for a venue with no user', () => {
    const score = calculateRelevance(makeVenue(), null);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(10);
  });

  it('trending venues score higher than non-trending with no user', () => {
    const trending = makeVenue({ is_trending: true, trending_score: 90, recommend_score: 50 });
    const flat = makeVenue({ is_trending: false, trending_score: 0, recommend_score: 50 });
    expect(calculateRelevance(trending, null)).toBeGreaterThan(calculateRelevance(flat, null));
  });

  it('skill overlap increases score when user has skills', () => {
    const venue = makeVenue({ skills: ['NETWORKING', 'DEAL_MAKING'] as never });
    const userWithMatch = makeUser({ skills: ['NETWORKING', 'DEAL_MAKING'] as never });
    const userNoMatch = makeUser({ skills: ['FOODIE'] as never });

    const highScore = calculateRelevance(venue, userWithMatch);
    const lowScore = calculateRelevance(venue, userNoMatch);
    expect(highScore).toBeGreaterThan(lowScore);
  });

  it('returns score in 0-10 range even with maximum skill overlap', () => {
    const skills = ['NETWORKING', 'DEAL_MAKING', 'ADVENTURE', 'WELLNESS', 'CULTURAL'] as never;
    const venue = makeVenue({ skills, is_trending: true, trending_score: 100, recommend_score: 100 });
    const user = makeUser({ skills });
    const score = calculateRelevance(venue, user);
    expect(score).toBeLessThanOrEqual(10);
  });

  it('gives a stage bonus when category matches the user relocation stage', () => {
    // EXPLORING preferred categories include 'dining' but not nightlife
    const diningVenue = makeVenue({ category: 'dining' });
    const otherVenue = makeVenue({ category: 'nightlife' });
    // User needs at least one skill so the stage-aware branch runs (not the no-user fallback)
    const user = makeUser({ relocation_stage: 'EXPLORING', skills: ['NETWORKING'] as never });

    expect(calculateRelevance(diningVenue, user)).toBeGreaterThanOrEqual(
      calculateRelevance(otherVenue, user)
    );
  });
});

// ─── getMatchPercentage ──────────────────────────────────────────────────────────

describe('getMatchPercentage', () => {
  it('returns 0 when user has no skills', () => {
    expect(getMatchPercentage(makeVenue({ skills: ['NETWORKING'] as never }), [])).toBe(0);
  });

  it('returns 0 when venue has no skills', () => {
    expect(getMatchPercentage(makeVenue(), ['NETWORKING'] as never)).toBe(0);
  });

  it('returns 100 when all user skills match', () => {
    const skills = ['NETWORKING', 'DEAL_MAKING'] as never;
    expect(getMatchPercentage(makeVenue({ skills }), skills)).toBe(100);
  });

  it('returns 50 when half of user skills match', () => {
    const venue = makeVenue({ skills: ['NETWORKING'] as never });
    expect(getMatchPercentage(venue, ['NETWORKING', 'FOODIE'] as never)).toBe(50);
  });

  it('rounds to nearest integer', () => {
    const venue = makeVenue({ skills: ['NETWORKING'] as never });
    const result = getMatchPercentage(venue, ['NETWORKING', 'DEAL_MAKING', 'SOCIALITE'] as never);
    expect(Number.isInteger(result)).toBe(true);
  });
});

// ─── getMatchExplanation ─────────────────────────────────────────────────────────

describe('getMatchExplanation', () => {
  it('returns "Popular venue" for null user on non-trending venue', () => {
    expect(getMatchExplanation(makeVenue(), null)).toBe('Popular venue');
  });

  it('returns "Trending now" for null user on trending venue', () => {
    expect(getMatchExplanation(makeVenue({ is_trending: true }), null)).toBe('Trending now');
  });

  it('returns skill match explanation when user skill matches venue', () => {
    const venue = makeVenue({ skills: ['NETWORKING'] as never });
    const user = makeUser({ skills: ['NETWORKING'] as never });
    expect(getMatchExplanation(venue, user)).toContain('Matches your');
  });

  it('returns "Trending tonight" when trending but no skill overlap', () => {
    const venue = makeVenue({ is_trending: true, skills: [] });
    const user = makeUser({ skills: ['FOODIE'] as never });
    expect(getMatchExplanation(venue, user)).toBe('Trending tonight');
  });

  it('returns fallback when user has no skills', () => {
    const result = getMatchExplanation(makeVenue(), makeUser({ skills: [] }));
    expect(['Popular venue', 'Trending now']).toContain(result);
  });
});

// ─── buildSmartFeed ──────────────────────────────────────────────────────────────

describe('buildSmartFeed', () => {
  it('returns one FeedItem per venue', () => {
    const venues = [makeVenue({ id: 'v1' }), makeVenue({ id: 'v2' }), makeVenue({ id: 'v3' })];
    const feed = buildSmartFeed(venues, null);
    expect(feed).toHaveLength(3);
  });

  it('assigns sequential rank starting at 1', () => {
    const venues = [makeVenue({ id: 'v1' }), makeVenue({ id: 'v2' })];
    const feed = buildSmartFeed(venues, null);
    expect(feed[0].rank).toBe(1);
    expect(feed[1].rank).toBe(2);
  });

  it('sorts by relevance descending', () => {
    const low = makeVenue({ id: 'low', is_trending: false, trending_score: 0, recommend_score: 10 });
    const high = makeVenue({ id: 'high', is_trending: true, trending_score: 95, recommend_score: 90 });
    const feed = buildSmartFeed([low, high], null);
    expect(feed[0].venue.id).toBe('high');
  });

  it('returns empty array for empty input', () => {
    expect(buildSmartFeed([], null)).toEqual([]);
  });

  it('each item has venue, relevanceScore, explanation, rank, and type', () => {
    const feed = buildSmartFeed([makeVenue()], null);
    expect(feed[0]).toMatchObject({
      venue: expect.any(Object),
      relevanceScore: expect.any(Number),
      explanation: expect.any(String),
      rank: 1,
      type: expect.any(String),
    });
  });
});

// ─── getTrendingVenues ───────────────────────────────────────────────────────────

describe('getTrendingVenues', () => {
  it('returns only trending venues', () => {
    const venues = [
      makeVenue({ id: 'trending', is_trending: true, trending_score: 80 }),
      makeVenue({ id: 'flat', is_trending: false }),
    ];
    const result = getTrendingVenues(venues);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('trending');
  });

  it('sorts by trending_score descending', () => {
    const venues = [
      makeVenue({ id: 'low', is_trending: true, trending_score: 40 }),
      makeVenue({ id: 'high', is_trending: true, trending_score: 90 }),
    ];
    const result = getTrendingVenues(venues);
    expect(result[0].id).toBe('high');
  });

  it('respects the limit parameter', () => {
    const venues = Array.from({ length: 15 }, (_, i) =>
      makeVenue({ id: `v${i}`, is_trending: true, trending_score: i })
    );
    expect(getTrendingVenues(venues, 5)).toHaveLength(5);
  });

  it('returns empty array when none are trending', () => {
    expect(getTrendingVenues([makeVenue()])).toEqual([]);
  });
});

// ─── getSkillMatchedVenues ───────────────────────────────────────────────────────

describe('getSkillMatchedVenues', () => {
  it('returns empty array when userSkills is empty', () => {
    const venues = [makeVenue({ skills: ['NETWORKING'] as never })];
    expect(getSkillMatchedVenues(venues, [])).toEqual([]);
  });

  it('returns only venues with at least one matching skill', () => {
    const match = makeVenue({ id: 'match', skills: ['NETWORKING'] as never });
    const noMatch = makeVenue({ id: 'no', skills: ['FOODIE'] as never });
    const result = getSkillMatchedVenues([match, noMatch], ['NETWORKING'] as never);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('match');
  });

  it('sorts by overlap count descending', () => {
    const two = makeVenue({ id: 'two', skills: ['NETWORKING', 'DEAL_MAKING'] as never });
    const one = makeVenue({ id: 'one', skills: ['NETWORKING'] as never });
    const result = getSkillMatchedVenues([one, two], ['NETWORKING', 'DEAL_MAKING'] as never);
    expect(result[0].id).toBe('two');
  });

  it('respects the limit parameter', () => {
    const venues = Array.from({ length: 15 }, (_, i) =>
      makeVenue({ id: `v${i}`, skills: ['NETWORKING'] as never })
    );
    expect(getSkillMatchedVenues(venues, ['NETWORKING'] as never, 5)).toHaveLength(5);
  });
});
