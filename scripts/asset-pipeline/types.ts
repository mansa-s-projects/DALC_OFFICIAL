export type ImageStatus = 'verified' | 'pending' | 'missing' | 'fallback' | 'unpublished';

export type Vertical = 'transport' | 'stays' | 'experiences' | 'nightlife' | 'travel';

export interface ManifestItem {
  id: string;
  slug: string;
  name: string;
  vertical: Vertical;
  category: string;
  subcategory?: string;
  brand?: string;
  city: string;
  country: string;
  assetType: string;
  searchQueries: string[];
  targetFolder: string;
  currentImage?: string;
  coverImage?: string;
  galleryImages?: string[];
  thumbnail?: string;
  alt?: string;
  imageStatus: ImageStatus;
  confidenceScore?: number;
  lastUpdated?: string;
}

export interface ValidationScores {
  entityMatch: number;       // 0-25: name/brand in tags or description
  categoryRelevance: number; // 0-25: category keywords match
  sourceTrust: number;       // 0-20: trusted source bonus
  resolution: number;        // 0-15: min 1200px wide = full score
  aspectRatio: number;       // 0-10: landscape 16:9 / 4:3 preferred
  duplicateCheck: number;    // 0-5: not already used in manifest
}

export interface ImageCandidate {
  unsplashId: string;
  sourceUrl: string;
  thumbnailUrl: string;
  downloadUrl: string;
  width: number;
  height: number;
  descriptionAlt: string;
  authorName: string;
  authorUrl: string;
  tags: string[];
  scores: ValidationScores;
  totalScore: number;
  approved: boolean;
}

export interface CandidateSet {
  manifestItemId: string;
  queries: string[];
  fetchedAt: string;
  candidates: ImageCandidate[];
  selectedIndex?: number;
}

export interface AssetMetadata {
  slug: string;
  name: string;
  vertical: string;
  category: string;
  paths: {
    cover: string;
    gallery: string[];
    thumbnail: string;
  };
  source: {
    unsplashId: string;
    downloadUrl: string;
    authorName: string;
    licenseNote: string;
  };
  alt: string;
  originalDimensions: { width: number; height: number };
  format: 'webp';
  confidenceScore: number;
  lastChecked: string;
}

export interface PipelineManifest {
  version: string;
  generatedAt: string;
  totalItems: number;
  stats: Record<ImageStatus, number>;
  items: ManifestItem[];
}

export interface PipelineOptions {
  dryRun?: boolean;
  verbose?: boolean;
  forceRefetch?: boolean;
  onlyStatus?: ImageStatus;
  limitItems?: number;
}

export interface UnsplashPhoto {
  id: string;
  width: number;
  height: number;
  description: string | null;
  alt_description: string | null;
  urls: { raw: string; full: string; regular: string; small: string; thumb: string };
  links: { download_location: string };
  user: { name: string; links: { html: string } };
  tags?: Array<{ title: string }>;
}

export interface UnsplashSearchResult {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}
