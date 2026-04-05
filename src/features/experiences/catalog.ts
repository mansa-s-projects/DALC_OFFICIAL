import { CAR_CATEGORIES, getCarImage } from '../../data/transport/carsData';
import { YACHT_CATEGORIES, getYachtImage } from '../../data/transport/yachtsData';
import { MOCK_EXPERIENCES } from '../../lib/experiences';

export type ExperienceCategorySlug =
  | 'desert-adventures'
  | 'water-activities'
  | 'aerial-and-adrenaline'
  | 'wellness'
  | 'tickets-and-culture'
  | 'luxury-leisure';

export interface ExperienceCatalogItem {
  slug: string;
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
}

export interface ExperienceCatalogCategory {
  slug: ExperienceCategorySlug;
  title: string;
  description: string;
  items: ExperienceCatalogItem[];
}

function normalizeText(text: string): string {
  return text
    .replace(/\u2014/g, '-')
    .replace(/\u2013/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function toSlug(value: string): string {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Fallback images by subcategory for reliable rendering
const SUBCATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  nightlife: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop',
  dining: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop',
  adventure: 'https://images.unsplash.com/photo-1547234935-80c7142ee969?q=80&w=800&auto=format&fit=crop',
  sky: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop',
  wellness: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop',
  culture: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop',
  water: 'https://images.unsplash.com/photo-1566373809071-8bc4ae67f186?q=80&w=800&auto=format&fit=crop',
};

function fromMockSubcategory(subcategory: string): ExperienceCatalogItem[] {
  return MOCK_EXPERIENCES.filter((item) => item.subcategory === subcategory).map((item) => ({
    slug: item.slug,
    title: normalizeText(item.name),
    description: normalizeText(item.description_short || item.description_long || ''),
    image: item.hero_image || SUBCATEGORY_FALLBACK_IMAGES[subcategory] || '',
    ctaLabel: 'Request Booking',
  }));
}

// Water Activities - Jet Skis with reliable images
function getWaterActivityItems(): ExperienceCatalogItem[] {
  return [
    {
      slug: 'yamaha-vx-deluxe',
      title: 'Yamaha VX Deluxe 1050cc',
      description: 'Jet Ski Ride in Dubai • Reliable performance with comfort',
      image: 'https://images.unsplash.com/photo-1530870110042-98b2cb110834?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Book Ride',
    },
    {
      slug: 'yamaha-jetblaster',
      title: 'Yamaha JetBlaster',
      description: 'Jet Ski Ride in Dubai • Compact, agile, and built for fun - the ultimate play machine on the water',
      image: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Book Ride',
    },
    {
      slug: 'yamaha-gp-ho',
      title: 'Yamaha GP HO 1900cc',
      description: 'Jet Ski Ride in Dubai • High-output performance for thrill seekers',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Book Ride',
    },
    {
      slug: 'yamaha-fx-svho',
      title: 'Yamaha FX SVHO 260HP',
      description: 'Premium Jet Ski in Dubai • Supercharged luxury performance',
      image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Book Ride',
    },
  ];
}

function getYachtCharterItems(): ExperienceCatalogItem[] {
  return YACHT_CATEGORIES.flatMap((category) =>
    category.items.slice(0, category.id === 'luxury-collection' ? 4 : 2).map((yacht) => ({
      slug: `yacht-${yacht.id}`,
      title: normalizeText(yacht.name),
      description: `${yacht.length} • Up to ${yacht.capacity} guests • From AED ${yacht.pricePerHour.toLocaleString()}/hour`,
      image: getYachtImage(yacht.name),
      ctaLabel: 'Request Charter',
    }))
  );
}

// Desert Adventures - Dune Buggies and ATVs with reliable images
function getDesertAdventureItems(): ExperienceCatalogItem[] {
  const desertImages = [
    'https://images.unsplash.com/photo-1547234935-80c7142ee969?q=80&w=800&auto=format&fit=crop', // Dubai desert dunes
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop', // Desert sunset
    'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?q=80&w=800&auto=format&fit=crop', // Desert safari
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop', // Desert landscape
  ];

  const vehicles: ExperienceCatalogItem[] = [
    // Polaris RZR 4 seater
    {
      slug: 'polaris-rzr-4-seater-30min',
      title: 'Polaris RZR 4 Seater • 30 Minutes',
      description: 'Premium off-road dune buggy • 4 passengers • AED 600',
      image: desertImages[0],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'polaris-rzr-4-seater-1hour',
      title: 'Polaris RZR 4 Seater • 1 Hour',
      description: 'Premium off-road dune buggy • 4 passengers • AED 1,000',
      image: desertImages[0],
      ctaLabel: 'Book Now',
    },
    // Quad 570
    {
      slug: 'quad-570-30min',
      title: 'Quad 570 • 30 Minutes',
      description: 'Powerful quad bike for desert exploration • AED 300',
      image: desertImages[1],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'quad-570-1hour',
      title: 'Quad 570 • 1 Hour',
      description: 'Powerful quad bike for desert exploration • AED 500',
      image: desertImages[1],
      ctaLabel: 'Book Now',
    },
    // Yamaha Raptor 700
    {
      slug: 'yamaha-raptor-700-30min',
      title: 'Yamaha Raptor 700 • 30 Minutes',
      description: 'High-performance sport ATV • AED 350',
      image: desertImages[2],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'yamaha-raptor-700-1hour',
      title: 'Yamaha Raptor 700 • 1 Hour',
      description: 'High-performance sport ATV • AED 600',
      image: desertImages[2],
      ctaLabel: 'Book Now',
    },
    // Yamaha Grizzly 700
    {
      slug: 'yamaha-grizzly-700-30min',
      title: 'Yamaha Grizzly 700 • 30 Minutes',
      description: 'Heavy-duty utility ATV • AED 380',
      image: desertImages[3],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'yamaha-grizzly-700-1hour',
      title: 'Yamaha Grizzly 700 • 1 Hour',
      description: 'Heavy-duty utility ATV • AED 650',
      image: desertImages[3],
      ctaLabel: 'Book Now',
    },
    // Maverick R 2 seats
    {
      slug: 'maverick-r-2-seats-30min',
      title: 'Maverick R 2 Seats • 30 Minutes',
      description: 'Ultimate performance side-by-side • 2 passengers • AED 1,150',
      image: desertImages[0],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'maverick-r-2-seats-1hour',
      title: 'Maverick R 2 Seats • 1 Hour',
      description: 'Ultimate performance side-by-side • 2 passengers • AED 2,000',
      image: desertImages[0],
      ctaLabel: 'Book Now',
    },
    // Maverick R 4 seats
    {
      slug: 'maverick-r-4-seats-30min',
      title: 'Maverick R 4 Seats • 30 Minutes',
      description: 'Ultimate performance side-by-side • 4 passengers • AED 1,250',
      image: desertImages[1],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'maverick-r-4-seats-1hour',
      title: 'Maverick R 4 Seats • 1 Hour',
      description: 'Ultimate performance side-by-side • 4 passengers • AED 2,200',
      image: desertImages[1],
      ctaLabel: 'Book Now',
    },
    // Maverick X3 2 seats
    {
      slug: 'maverick-x3-2-seats-30min',
      title: 'Maverick X3 2 Seats • 30 Minutes',
      description: 'High-performance turbo side-by-side • 2 passengers • AED 800',
      image: desertImages[2],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'maverick-x3-2-seats-1hour',
      title: 'Maverick X3 2 Seats • 1 Hour',
      description: 'High-performance turbo side-by-side • 2 passengers • AED 1,350',
      image: desertImages[2],
      ctaLabel: 'Book Now',
    },
    // Maverick X3 4 seats
    {
      slug: 'maverick-x3-4-seats-30min',
      title: 'Maverick X3 4 Seats • 30 Minutes',
      description: 'High-performance turbo side-by-side • 4 passengers • AED 850',
      image: desertImages[3],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'maverick-x3-4-seats-1hour',
      title: 'Maverick X3 4 Seats • 1 Hour',
      description: 'High-performance turbo side-by-side • 4 passengers • AED 1,450',
      image: desertImages[3],
      ctaLabel: 'Book Now',
    },
    // Maverick Sport 2 seats
    {
      slug: 'maverick-sport-2-seats-30min',
      title: 'Maverick Sport 2 Seats • 30 Minutes',
      description: 'Sport-focused side-by-side • 2 passengers • AED 600',
      image: desertImages[0],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'maverick-sport-2-seats-1hour',
      title: 'Maverick Sport 2 Seats • 1 Hour',
      description: 'Sport-focused side-by-side • 2 passengers • AED 900',
      image: desertImages[0],
      ctaLabel: 'Book Now',
    },
    // Desert Safari Packages
    {
      slug: 'morning-safari-private',
      title: 'Morning Safari • Private Car',
      description: 'Up to 7 people • Hotel pickup included • AED 890 per car',
      image: desertImages[2],
      ctaLabel: 'Book Safari',
    },
    {
      slug: 'evening-safari-shared-child',
      title: 'Evening Safari • Shared • Child',
      description: 'Camel ride • Falcon photos • AED 160 per child',
      image: desertImages[1],
      ctaLabel: 'Book Safari',
    },
    {
      slug: 'evening-safari-shared-adult',
      title: 'Evening Safari • Shared • Adult',
      description: 'Camel ride • Falcon photos • AED 220 per adult',
      image: desertImages[1],
      ctaLabel: 'Book Safari',
    },
    {
      slug: 'evening-safari-private',
      title: 'Evening Safari • Private',
      description: '2 people included • Dune driving • Sandboarding • AED 990',
      image: desertImages[3],
      ctaLabel: 'Book Safari',
    },
    {
      slug: 'evening-safari-extra-person',
      title: 'Evening Safari • Extra Person Add-on',
      description: 'Additional person for private safari • BBQ dinner • Shows • Henna • +AED 100',
      image: desertImages[2],
      ctaLabel: 'Add to Booking',
    },
  ];

  return vehicles;
}

function getLuxuryLeisureCars(): ExperienceCatalogItem[] {
  const source = CAR_CATEGORIES.filter((cat) => cat.id === 'luxury' || cat.id === 'sport');
  const latestByModel = new Map<string, { id: string; title: string; year: number; price: number; image: string }>();

  for (const category of source) {
    for (const car of category.items) {
      const key = `${car.brand}-${car.model}`;
      const title = normalizeText(`${car.brand} ${car.model}`);
      const current = latestByModel.get(key);

      if (!current || car.year > current.year) {
        latestByModel.set(key, {
          id: toSlug(`${car.brand}-${car.model}`),
          title,
          year: car.year,
          price: car.dailyPrice,
          image: getCarImage(car.id, category.id),
        });
      }
    }
  }

  return Array.from(latestByModel.values()).map((car) => ({
    slug: car.id,
    title: car.title,
    description: `${car.year} model • From AED ${car.price}/day`,
    image: car.image,
    ctaLabel: 'Request Rental',
  }));
}

export const DALC_EXPERIENCE_CATEGORIES: ExperienceCatalogCategory[] = [
  {
    slug: 'desert-adventures',
    title: 'Desert Adventures',
    description: 'Dune buggies, ATVs, and off-road safaris in the Dubai desert.',
    items: [
      ...getDesertAdventureItems(),
      ...fromMockSubcategory('adventure').filter((i) => !i.title.toLowerCase().includes('skydive')),
    ],
  },
  {
    slug: 'water-activities',
    title: 'Water Activities',
    description: 'Jet skis, yacht charters, and high-speed water experiences along the Dubai coastline.',
    items: [...getWaterActivityItems(), ...getYachtCharterItems()],
  },
  {
    slug: 'aerial-and-adrenaline',
    title: 'Aerial & Adrenaline',
    description: 'Sky-focused and adrenaline-led experiences.',
    items: [...fromMockSubcategory('sky'), ...fromMockSubcategory('adventure').filter((i) => i.title.toLowerCase().includes('skydive'))],
  },
  {
    slug: 'wellness',
    title: 'Wellness',
    description: 'Spa and restoration experiences.',
    items: fromMockSubcategory('wellness'),
  },
  {
    slug: 'tickets-and-culture',
    title: 'Tickets & Culture',
    description: 'Cultural tours, events, and curated access.',
    items: fromMockSubcategory('culture'),
  },
  {
    slug: 'luxury-leisure',
    title: 'Luxury Leisure',
    description: 'Premium lifestyle bookings and luxury cars.',
    items: [...fromMockSubcategory('nightlife'), ...fromMockSubcategory('dining'), ...getLuxuryLeisureCars()],
  },
];

export function getExperienceCategory(category: string): ExperienceCatalogCategory | undefined {
  return DALC_EXPERIENCE_CATEGORIES.find((entry) => entry.slug === category);
}

export function getExperienceItem(
  category: string,
  item: string
): ExperienceCatalogItem | undefined {
  const entry = getExperienceCategory(category);
  return entry?.items.find((record) => record.slug === item);
}
