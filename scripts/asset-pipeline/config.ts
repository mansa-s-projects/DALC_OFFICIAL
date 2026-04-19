import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT_DIR = path.resolve(__dirname, '../..');
export const SRC_DIR = path.join(ROOT_DIR, 'src');
export const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
export const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
export const OUTPUT_DIR = path.join(__dirname, 'output');

export const UNSPLASH_API_BASE = 'https://api.unsplash.com';
export const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY ?? '';

export const SCORING_THRESHOLDS = {
  approved: 70,
  manualReview: 50,
} as const;

export const IMAGE_SIZES = {
  cover: { width: 1200, height: 800, suffix: 'cover' },
  gallery: { width: 800, height: 600, suffix: 'gallery' },
  thumbnail: { width: 400, height: 300, suffix: 'thumb' },
} as const;

export const FOLDER_MAP: Record<string, string> = {
  'transport/cars': 'transport/cars',
  'transport/yachts': 'transport/yachts',
  'transport/jets': 'transport/jets',
  'travel/hotels': 'travel/hotels',
  'travel/jets': 'travel/jets',
  'experiences/water': 'experiences/water',
  'experiences/desert': 'experiences/desert',
  'nightlife/restaurants': 'nightlife/restaurants',
  'nightlife/beach-clubs': 'nightlife/beach-clubs',
  'nightlife/nightclubs': 'nightlife/nightclubs',
  'nightlife/dining-entertainment': 'nightlife/dining-entertainment',
};

// Template variables: {name}, {brand}, {model}, {category}, {subcategory}, {vertical}, {vibe}
export const QUERY_TEMPLATES: Record<string, string[]> = {
  'transport/cars/economy': [
    '{brand} {model} car exterior Dubai',
    '{brand} {model} sedan rental',
  ],
  'transport/cars/standard': [
    '{brand} {model} car exterior Dubai',
    '{brand} {model} sedan white',
  ],
  'transport/cars/suv': [
    '{brand} {model} SUV exterior Dubai desert',
    '{brand} {model} 4x4 white luxury',
  ],
  'transport/cars/luxury': [
    '{brand} {model} luxury car exterior Dubai',
    '{brand} {model} premium sedan black',
  ],
  'transport/cars/supercar': [
    '{brand} {model} supercar exterior Dubai',
    '{brand} {model} sports car red',
  ],
  'transport/cars/electric': [
    '{brand} {model} electric car exterior',
    '{brand} {model} EV charging luxury',
  ],
  'transport/yachts': [
    '{brand} {model} luxury yacht Dubai marina',
    'superyacht Dubai Arabian Gulf sea',
  ],
  'transport/jets': [
    '{model} private jet exterior',
    'private jet luxury aircraft interior',
  ],
  'travel/hotels': [
    '{name} Dubai hotel luxury exterior',
    'luxury 5 star hotel Dubai {name}',
  ],
  'travel/jets': [
    '{name} private jet {category} aircraft',
    'private charter jet luxury interior',
  ],
  'experiences/water': [
    '{brand} {model} jet ski Dubai sea',
    'jet ski Dubai JBR beach action',
  ],
  'experiences/desert': [
    '{name} Dubai desert adventure dunes',
    'desert {category} experience Dubai UAE',
  ],
  'nightlife/restaurants': [
    '{name} restaurant Dubai fine dining interior',
    'luxury restaurant Dubai {vibe} ambiance',
  ],
  'nightlife/beach-clubs': [
    '{name} beach club Dubai pool sea',
    'luxury beach club Dubai daytime party',
  ],
  'nightlife/nightclubs': [
    '{name} nightclub Dubai interior lights',
    'luxury nightclub Dubai night party',
  ],
  'nightlife/dining-entertainment': [
    '{name} dining entertainment Dubai show',
    'luxury dinner show Dubai entertainment',
  ],
};

export const DEFAULT_QUERY_TEMPLATES = [
  '{name} Dubai luxury {vertical}',
  'Dubai {category} luxury {vertical}',
];
