import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import type { ManifestItem, ImageCandidate, AssetMetadata } from '../types.js';

interface OptimizedPaths {
  cover: string;
  gallery: string;
  thumbnail: string;
  coverUrl: string;
  galleryUrl: string;
  thumbnailUrl: string;
}

export function buildMetadata(
  item: ManifestItem,
  candidate: ImageCandidate,
  paths: OptimizedPaths
): AssetMetadata {
  return {
    slug: item.slug,
    name: item.name,
    vertical: item.vertical,
    category: item.category,
    paths: {
      cover: paths.coverUrl,
      gallery: [paths.galleryUrl],
      thumbnail: paths.thumbnailUrl,
    },
    source: {
      unsplashId: candidate.unsplashId,
      downloadUrl: candidate.downloadUrl,
      authorName: candidate.authorName,
      licenseNote: 'Unsplash License - https://unsplash.com/license',
    },
    alt: candidate.descriptionAlt || item.alt || item.name,
    originalDimensions: { width: candidate.width, height: candidate.height },
    format: 'webp',
    confidenceScore: candidate.totalScore,
    lastChecked: new Date().toISOString(),
  };
}

export function saveMetadata(metadata: AssetMetadata, folderPath: string): void {
  const dest = path.join(folderPath, `${metadata.slug}.meta.json`);
  writeFileSync(dest, JSON.stringify(metadata, null, 2), 'utf-8');
}

export function readMetadata(folderPath: string, slug: string): AssetMetadata | null {
  const src = path.join(folderPath, `${slug}.meta.json`);
  if (!existsSync(src)) return null;
  try {
    return JSON.parse(readFileSync(src, 'utf-8')) as AssetMetadata;
  } catch {
    return null;
  }
}
