# Recommendation System

## Overview

DALC's recommendation system surfaces personalized content based on a user's declared interests (skills), browsing behavior, and relocation context. It is designed to make the platform feel curated rather than generic.

---

## UserSkill Enum

Users declare up to 10 interests during onboarding. These are stored in `profiles.skills TEXT[]`.

```typescript
type UserSkill =
  | 'NIGHTLIFE'    // Clubs, lounges, parties
  | 'ADVENTURE'    // Outdoors, adrenaline, desert
  | 'FOODIE'       // Restaurants, chef experiences, gourmet
  | 'WELLNESS'     // Spa, fitness, mindfulness
  | 'CULTURE'      // Heritage, arts, history
  | 'WATER_SPORTS' // Marine activities, beaches
  | 'MOTORSPORT'   // Supercars, racing, car culture
  | 'AVIATION'     // Jets, helicopters, aerial
  | 'YACHT'        // Yachts, sailing, marine luxury
  | 'BUSINESS'     // Professional services, networking
```

---

## Skills Mapping File

`src/data/skillsMapping.ts` maps each `UserSkill` to:
1. **Experience subcategories** — which subcategories to prioritize
2. **Venue tags** — which tags indicate relevance
3. **Transport subcategories** — which transport type to surface
4. **Weight** — relative priority (1.0 = baseline)

```typescript
export const SKILLS_MAPPING: Record<UserSkill, SkillMapping> = {
  NIGHTLIFE: {
    experienceSubcategories: ['nightlife'],
    venueTags: ['vip', 'bottle-service', 'celebrity', 'rooftop', 'beachclub'],
    transportSubcategory: 'cars',
    weight: 1.0,
  },
  ADVENTURE: {
    experienceSubcategories: ['adventure', 'water', 'sky'],
    venueTags: ['thrill-seeking', 'outdoor', 'adrenaline'],
    transportSubcategory: 'cars',
    weight: 1.0,
  },
  FOODIE: {
    experienceSubcategories: ['dining', 'culture'],
    venueTags: ['michelin', 'tasting-menu', 'celebrity-chef', 'private-dining'],
    transportSubcategory: 'cars',
    weight: 1.0,
  },
  WELLNESS: {
    experienceSubcategories: ['wellness'],
    venueTags: ['spa', 'fitness', 'mindfulness', 'retreat'],
    transportSubcategory: 'cars',
    weight: 0.8,
  },
  CULTURE: {
    experienceSubcategories: ['culture', 'dining'],
    venueTags: ['heritage', 'museum', 'art', 'cultural'],
    transportSubcategory: 'cars',
    weight: 0.8,
  },
  WATER_SPORTS: {
    experienceSubcategories: ['water'],
    venueTags: ['marine', 'beach', 'water-activities'],
    transportSubcategory: 'yachts',
    weight: 1.0,
  },
  MOTORSPORT: {
    experienceSubcategories: ['adventure'],
    venueTags: ['supercar', 'racing', 'motorsport'],
    transportSubcategory: 'cars',
    weight: 1.2,
  },
  AVIATION: {
    experienceSubcategories: ['sky'],
    venueTags: ['helicopter', 'aerial', 'aviation'],
    transportSubcategory: 'jets',
    weight: 1.2,
  },
  YACHT: {
    experienceSubcategories: ['water'],
    venueTags: ['yacht', 'sailing', 'marina', 'luxury-marine'],
    transportSubcategory: 'yachts',
    weight: 1.2,
  },
  BUSINESS: {
    experienceSubcategories: ['culture'],
    venueTags: ['corporate', 'networking', 'business'],
    transportSubcategory: 'cars',
    weight: 0.8,
  },
};
```

---

## Scoring Algorithm

`src/utils/recommendations.ts`

```typescript
interface ScoredItem {
  id: string;
  type: 'venue' | 'experience' | 'transport';
  base_score: number;  // trending_score from DB or 0
  skill_score: number; // points added by skill matches
  total_score: number; // base_score * 0.4 + skill_score * 0.6
}

function scoreItem(item: ExploreItem, userSkills: UserSkill[]): number {
  if (!userSkills.length) return item.trending_score || 0;

  let skillScore = 0;
  for (const skill of userSkills) {
    const mapping = SKILLS_MAPPING[skill];

    // Subcategory match
    if (mapping.experienceSubcategories.includes(item.subcategory)) {
      skillScore += 10 * mapping.weight;
    }

    // Tag match (partial)
    const matchingTags = item.tags.filter(tag => mapping.venueTags.includes(tag));
    skillScore += matchingTags.length * 3 * mapping.weight;

    // Transport type match
    if (item.type === 'transport' && mapping.transportSubcategory === item.subcategory) {
      skillScore += 8 * mapping.weight;
    }
  }

  return item.trending_score * 0.4 + skillScore * 0.6;
}
```

---

## Where Recommendations Appear

### 1. Home Page — "For You" Section
Displays the top 4 items by `total_score` for the current user. If not logged in, shows top trending items instead.

### 2. Explore Page — Default Sort
When `sort = 'recommended'` (default), items are sorted by `total_score`.

### 3. Vertical Hubs — "Recommended for You" Strip
Each pillar hub page shows a horizontal strip of recommended items within that vertical. Filtered to the pillar's categories, sorted by skill-score.

### 4. Post-Booking Recommendations
After completing a booking, the success page shows "You might also like..." — 3 items scored for the user's skills, excluding already-booked items.

---

## Trending Score

`experience_services.trending_score DECIMAL(5,2)` — a float managed by admin or future analytics.

**Current:** Manually set per experience in the admin dashboard. Higher = more prominent in trending strip and default sort.

**Future:** Auto-calculated from:
- Booking count in last 7 days (weight: 0.5)
- View count in last 7 days (weight: 0.3)
- Click-through rate from explore (weight: 0.2)

```sql
-- Future trending score update job (daily CRON via Supabase Edge Functions):
UPDATE experience_services SET trending_score =
  (SELECT COUNT(*) FROM experience_bookings
   WHERE experience_id = experience_services.id
   AND created_at > NOW() - INTERVAL '7 days') * 0.5
  +
  (SELECT COALESCE(SUM(view_count), 0) FROM experience_views
   WHERE experience_id = experience_services.id
   AND viewed_at > NOW() - INTERVAL '7 days') * 0.3;
```

---

## Onboarding Skills Collection

`src/pages/Onboarding.tsx` — presented to new users after registration.

Flow:
1. Skill selection UI — grid of skill cards with icons
2. User selects 1–10 skills
3. Onboarding saves: `supabase.from('profiles').update({ skills: selectedSkills })`
4. User is redirected to `/` (main feed)

Skills can be updated later in user profile settings.

---

## Relocation Context Boost

If a user has an active `relocation_profile` (detected via `useRelocation()`), a "Relocation Boost" is applied:
- Boost `BUSINESS` skill weight to 2.0 (company formation, banking)
- Surface stays with `booking_type = 'relocation'` higher
- Surface transport services with `relocation_linked = true` higher

---

## Future Enhancements

### Collaborative Filtering
"Users like you also booked..." — match users by skill overlap, recommend items popular among similar users.

### Vector Embeddings
Embed service descriptions using OpenAI `text-embedding-3-small`. Store in `pgvector`. Build a `search_similar(user_embedding)` RPC for semantic recommendations.

### Behavioral Analytics
Track: page views, item views, booking starts vs completions, time spent on each vertical. Weight personalization by revealed preferences (stronger signal than declared skills).

### A/B Testing
Run recommendation algorithm variants (skills-based vs trending-only vs hybrid) and compare booking conversion rates across cohorts.
