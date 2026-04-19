import type { ManifestItem, ImageCandidate, UnsplashPhoto } from '../types.js';
import { SCORING_THRESHOLDS } from '../config.js';

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  hotels: ['hotel', 'resort', 'lobby', 'suite', 'room', 'pool', 'spa'],
  cars: ['car', 'vehicle', 'supercar', 'sports car', 'luxury car', 'automobile'],
  yachts: ['yacht', 'boat', 'sailing', 'sea', 'ocean', 'marine', 'vessel'],
  jets: ['jet', 'aircraft', 'plane', 'private jet', 'aviation', 'cockpit'],
  restaurants: ['restaurant', 'dining', 'cuisine', 'food', 'table'],
  'beach-clubs': ['beach', 'club', 'pool', 'sand', 'cabana', 'ocean'],
  'night-clubs': ['nightclub', 'party', 'dj', 'lights', 'dance'],
  'dining-entertainment': ['entertainment', 'show', 'restaurant', 'stage'],
  water: ['jet ski', 'water sport', 'sea', 'wave', 'speedboat'],
  desert: ['desert', 'dune', 'sand', 'safari', 'buggy'],
};

function calcEntityMatch(photo: UnsplashPhoto, item: ManifestItem): number {
  const haystack = [
    photo.description ?? '',
    photo.alt_description ?? '',
    ...(photo.tags ?? []).map((t) => t.title),
  ]
    .join(' ')
    .toLowerCase();

  const needles = [
    item.name,
    item.brand ?? '',
    item.subcategory ?? '',
  ].filter(Boolean).map((s) => s.toLowerCase());

  const matches = needles.filter((n) => n && haystack.includes(n)).length;
  if (matches >= 2) return 25;
  if (matches === 1) return 12;
  return 0;
}

function calcCategoryRelevance(photo: UnsplashPhoto, item: ManifestItem): number {
  const keywords = CATEGORY_KEYWORDS[item.category] ?? [];
  if (keywords.length === 0) return 10;

  const haystack = [
    photo.description ?? '',
    photo.alt_description ?? '',
    ...(photo.tags ?? []).map((t) => t.title),
  ]
    .join(' ')
    .toLowerCase();

  const hits = keywords.filter((k) => haystack.includes(k)).length;
  const ratio = hits / keywords.length;
  if (ratio >= 0.4) return 25;
  if (ratio >= 0.2) return 15;
  if (ratio > 0) return 8;
  return 0;
}

function calcResolution(photo: UnsplashPhoto): number {
  const { width } = photo;
  if (width >= 1200) return 15;
  if (width >= 800) return 10;
  if (width >= 600) return 5;
  return 0;
}

function calcAspectRatio(photo: UnsplashPhoto): number {
  const ratio = photo.width / photo.height;
  if (ratio >= 1.2 && ratio <= 2.0) return 10;
  if (ratio >= 1.0 && ratio < 1.2) return 5;
  return 0;
}

function calcDuplicateCheck(
  photo: UnsplashPhoto,
  usedIds: Set<string>
): number {
  return usedIds.has(photo.id) ? 0 : 5;
}

export function scoreCandidate(
  photo: UnsplashPhoto,
  item: ManifestItem,
  usedIds: Set<string> = new Set()
): ImageCandidate {
  const entityMatch = calcEntityMatch(photo, item);
  const categoryRelevance = calcCategoryRelevance(photo, item);
  const sourceTrust = 20;
  const resolution = calcResolution(photo);
  const aspectRatio = calcAspectRatio(photo);
  const duplicateCheck = calcDuplicateCheck(photo, usedIds);
  const totalScore =
    entityMatch + categoryRelevance + sourceTrust + resolution + aspectRatio + duplicateCheck;

  return {
    unsplashId: photo.id,
    sourceUrl: photo.urls.regular,
    thumbnailUrl: photo.urls.thumb,
    downloadUrl: photo.urls.full,
    width: photo.width,
    height: photo.height,
    descriptionAlt: photo.alt_description ?? photo.description ?? '',
    authorName: photo.user.name,
    authorUrl: photo.user.links.html,
    tags: (photo.tags ?? []).map((t) => t.title),
    scores: { entityMatch, categoryRelevance, sourceTrust, resolution, aspectRatio, duplicateCheck },
    totalScore,
    approved: totalScore >= SCORING_THRESHOLDS.approved,
  };
}

export function pickWinner(candidates: ImageCandidate[]): ImageCandidate | null {
  const approved = candidates
    .filter((c) => c.approved)
    .sort((a, b) => b.totalScore - a.totalScore);
  return approved[0] ?? null;
}
