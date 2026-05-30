import type { UnsplashPhoto, UnsplashSearchResult } from '../types.js';
import { UNSPLASH_API_BASE, UNSPLASH_ACCESS_KEY } from '../config.js';

async function apiFetch<T>(endpoint: string): Promise<T> {
  const url = `${UNSPLASH_API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
  });
  if (!res.ok) {
    throw new Error(`Unsplash API error ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

export async function searchPhotos(
  query: string,
  page = 1,
  perPage = 10
): Promise<UnsplashSearchResult> {
  const params = new URLSearchParams({
    query,
    page: String(page),
    per_page: String(perPage),
    orientation: 'landscape',
  });
  return apiFetch<UnsplashSearchResult>(`/search/photos?${params.toString()}`);
}

export async function getDownloadUrl(photo: UnsplashPhoto): Promise<string> {
  const data = await apiFetch<{ url: string }>(
    photo.links.download_location.replace(UNSPLASH_API_BASE, '')
  );
  return data.url;
}

export async function fetchCandidatesForQuery(
  query: string
): Promise<UnsplashPhoto[]> {
  const result = await searchPhotos(query);
  return result.results;
}
