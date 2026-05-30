import { CAR_CATEGORIES, getCarImage } from '../../data/transport/carsData';
import { YACHT_CATEGORIES, getYachtImage } from '../../data/yachts/yachtsData';
import { MOCK_EXPERIENCES } from '../../lib/experiences';

export type ExperienceCategorySlug =
  | 'desert-adventures'
  | 'water-activities'
  | 'aerial-and-adrenaline'
  | 'wellness'
  | 'tickets-and-culture'
  | 'luxury-leisure'
  | 'photography-experience'
  | 'signature-dining'
  | 'observation';

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
  adventure: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?q=80&w=800&auto=format&fit=crop',
  sky: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop',
  wellness: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop',
  culture: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop',
  water: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
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
      description: 'Jet Ski Ride in Dubai  Reliable performance with comfort',
      image: 'https://images.unsplash.com/photo-1530870110042-98b2cb110834?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Book Ride',
    },
    {
      slug: 'yamaha-jetblaster',
      title: 'Yamaha JetBlaster',
      description: 'Jet Ski Ride in Dubai  Compact, agile, and built for fun - the ultimate play machine on the water',
      image: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Book Ride',
    },
    {
      slug: 'yamaha-gp-ho',
      title: 'Yamaha GP HO 1900cc',
      description: 'Jet Ski Ride in Dubai  High-output performance for thrill seekers',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Book Ride',
    },
    {
      slug: 'yamaha-fx-svho',
      title: 'Yamaha FX SVHO 260HP',
      description: 'Premium Jet Ski in Dubai  Supercharged luxury performance',
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
      description: `${yacht.length}  Up to ${yacht.capacity} guests  From AED ${yacht.pricePerHour.toLocaleString()}/hour`,
      image: getYachtImage(yacht.name),
      ctaLabel: 'Request Charter',
    }))
  );
}

// Desert Adventures - Dune Buggies and ATVs with reliable images
function getDesertAdventureItems(): ExperienceCatalogItem[] {
  const desertImages = [
    '/images/desert-adventures/Aristodesert/image1.png',
    '/images/desert-adventures/Aristodesert/image2.png',
    '/images/desert-adventures/Aristodesert/image3.png',
    '/images/desert-adventures/Aristodesert/image1.png',
  ];

  const vehicles: ExperienceCatalogItem[] = [
    {
      slug: 'polaris-rzr-4-seater-30min',
      title: 'Polaris RZR 4-Seater - 30 Minutes',
      description: 'Premium off-road dune buggy - 4 passengers - AED 600',
      image: desertImages[0],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'polaris-rzr-4-seater-1hour',
      title: 'Polaris RZR 4-Seater - 1 Hour',
      description: 'Premium off-road dune buggy - 4 passengers - AED 1,000',
      image: desertImages[0],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'quad-570-30min',
      title: 'Quad 570 - 30 Minutes',
      description: 'Powerful quad bike for desert exploration - AED 300',
      image: desertImages[1],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'quad-570-1hour',
      title: 'Quad 570 - 1 Hour',
      description: 'Powerful quad bike for desert exploration - AED 500',
      image: desertImages[1],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'yamaha-raptor-700-30min',
      title: 'Yamaha Raptor 700 - 30 Minutes',
      description: 'High-performance sport ATV - AED 350',
      image: desertImages[2],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'yamaha-raptor-700-1hour',
      title: 'Yamaha Raptor 700 - 1 Hour',
      description: 'High-performance sport ATV - AED 600',
      image: desertImages[2],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'yamaha-grizzly-700-30min',
      title: 'Yamaha Grizzly 700 - 30 Minutes',
      description: 'Heavy-duty utility ATV - AED 380',
      image: desertImages[3],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'yamaha-grizzly-700-1hour',
      title: 'Yamaha Grizzly 700 - 1 Hour',
      description: 'Heavy-duty utility ATV - AED 650',
      image: desertImages[3],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'maverick-r-2-seats-30min',
      title: 'Maverick R 2-Seater - 30 Minutes',
      description: 'Ultimate performance side-by-side - 2 passengers - AED 1,150',
      image: desertImages[0],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'maverick-r-2-seats-1hour',
      title: 'Maverick R 2-Seater - 1 Hour',
      description: 'Ultimate performance side-by-side - 2 passengers - AED 2,000',
      image: desertImages[0],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'maverick-r-4-seats-30min',
      title: 'Maverick R 4-Seater - 30 Minutes',
      description: 'Ultimate performance side-by-side - 4 passengers - AED 1,250',
      image: desertImages[1],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'maverick-r-4-seats-1hour',
      title: 'Maverick R 4-Seater - 1 Hour',
      description: 'Ultimate performance side-by-side - 4 passengers - AED 2,200',
      image: desertImages[1],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'maverick-x3-2-seats-30min',
      title: 'Maverick X3 2-Seater - 30 Minutes',
      description: 'High-performance turbo side-by-side - 2 passengers - AED 800',
      image: desertImages[2],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'maverick-x3-2-seats-1hour',
      title: 'Maverick X3 2-Seater - 1 Hour',
      description: 'High-performance turbo side-by-side - 2 passengers - AED 1,350',
      image: desertImages[2],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'maverick-x3-4-seats-30min',
      title: 'Maverick X3 4-Seater - 30 Minutes',
      description: 'High-performance turbo side-by-side - 4 passengers - AED 850',
      image: desertImages[3],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'maverick-x3-4-seats-1hour',
      title: 'Maverick X3 4-Seater - 1 Hour',
      description: 'High-performance turbo side-by-side - 4 passengers - AED 1,450',
      image: desertImages[3],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'maverick-sport-2-seats-30min',
      title: 'Maverick Sport 2-Seater - 30 Minutes',
      description: 'Sport-focused side-by-side - 2 passengers - AED 600',
      image: desertImages[0],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'maverick-sport-2-seats-1hour',
      title: 'Maverick Sport 2-Seater - 1 Hour',
      description: 'Sport-focused side-by-side - 2 passengers - AED 900',
      image: desertImages[0],
      ctaLabel: 'Book Now',
    },
    {
      slug: 'morning-safari-private',
      title: 'Morning Safari - Private Car',
      description: 'Up to 7 people - Hotel pickup included - AED 890 per car',
      image: desertImages[2],
      ctaLabel: 'Book Safari',
    },
    {
      slug: 'evening-safari-shared-child',
      title: 'Evening Safari - Shared - Child',
      description: 'Camel ride - Falcon photos - AED 160 per child',
      image: desertImages[1],
      ctaLabel: 'Book Safari',
    },
    {
      slug: 'evening-safari-shared-adult',
      title: 'Evening Safari - Shared - Adult',
      description: 'Camel ride - Falcon photos - AED 220 per adult',
      image: desertImages[1],
      ctaLabel: 'Book Safari',
    },
    {
      slug: 'evening-safari-private',
      title: 'Evening Safari - Private',
      description: '2 people included - Dune driving - Sandboarding - AED 990',
      image: desertImages[3],
      ctaLabel: 'Book Safari',
    },
    {
      slug: 'evening-safari-extra-person',
      title: 'Evening Safari - Extra Person Add-on',
      description: 'Additional person for private safari - BBQ dinner - Shows - Henna - +AED 100',
      image: desertImages[2],
      ctaLabel: 'Add to Booking',
    },
    {
      slug: 'balade-a-cheval-1h',
      title: 'Balade a Cheval - 1 Hour',
      description: 'Horse ride in the desert - Mon-Thu: AED 240 / Fri-Sun: AED 280',
      image: '/images/desert-adventures/Aristodesert/image2.png',
      ctaLabel: 'Book Ride',
    },
    {
      slug: 'balade-a-poney-30min',
      title: 'Balade a Poney - 30 Minutes',
      description: 'Pony ride for kids in the desert - AED 150',
      image: '/images/desert-adventures/Aristodesert/image2.png',
      ctaLabel: 'Book Ride',
    },
    {
      slug: 'sonara-camp-sunset-dinner',
      title: 'Sonara Camp - Sunset & Dinner Experience',
      description: 'Desert camp with live show and BBQ dinner - AED 890 adult / AED 380 child',
      image: desertImages[1],
      ctaLabel: 'Book Experience',
    },
    {
      slug: 'sonara-camp-overnight',
      title: 'Sonara Camp - Overnight Experience',
      description: 'Spend the night under the stars in a private desert nest - AED 2,650 per nest',
      image: desertImages[3],
      ctaLabel: 'Book Overnight',
    },
    {
      slug: 'sonara-camp-sunset',
      title: 'Sonara Camp - Sunset Experience',
      description: 'Golden hour in the desert with show and drinks - AED 480 adult / AED 190 child',
      image: desertImages[2],
      ctaLabel: 'Book Experience',
    },
    {
      slug: 'desert-photo-session',
      title: 'Desert Photo Session on Demand',
      description: 'Professional shoot with horse, camel, falcon, or snake - Price on request',
      image: desertImages[0],
      ctaLabel: 'Request Shoot',
    },
  ];

  return vehicles;
}

function getAerialItems(): ExperienceCatalogItem[] {
  const heliImage = 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop';
  const skydiveImage = 'https://images.unsplash.com/photo-1601024445121-e5b82f020549?q=80&w=800&auto=format&fit=crop';
  const ziplineImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop';
  const balloonImage = 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=800&auto=format&fit=crop';
  const seaplaneImage = 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?q=80&w=800&auto=format&fit=crop';

  return [
    {
      slug: 'helicoptere-tour-12min',
      title: 'Hélicoptère Tour  12 Minutes',
      description: 'Scenic helicopter flight over Dubai  AED 710/pers or AED 3,550 private (up to 5)',
      image: heliImage,
      ctaLabel: 'Book Flight',
    },
    {
      slug: 'helicoptere-tour-17min',
      title: 'Hélicoptère Tour  17 Minutes',
      description: 'Extended scenic helicopter flight over Dubai  AED 945/pers or AED 4,725 private',
      image: heliImage,
      ctaLabel: 'Book Flight',
    },
    {
      slug: 'helicoptere-tour-22min',
      title: 'Hélicoptère Tour  22 Minutes',
      description: 'Full iconic Dubai helicopter tour  AED 1,299/pers or AED 6,495 private',
      image: heliImage,
      ctaLabel: 'Book Flight',
    },
    {
      slug: 'saut-en-parachute-palm',
      title: 'Skydiving  Palm Jumeirah Drop Zone',
      description: 'Tandem skydive over the iconic Palm Jumeirah  3 hours  From AED 2,205',
      image: skydiveImage,
      ctaLabel: 'Book Skydive',
    },
    {
      slug: 'saut-en-parachute-desert',
      title: 'Skydiving  Desert Drop Zone',
      description: 'Tandem skydive over the golden Dubai desert  AED 2,099/pers',
      image: skydiveImage,
      ctaLabel: 'Book Skydive',
    },
    {
      slug: 'indoor-skydiving-ifly',
      title: 'Indoor Skydiving â iFly Dubai',
      description: 'Wind tunnel skydiving simulation â no experience needed  1 hour  From AED 440',
      image: 'https://images.unsplash.com/photo-1521898284481-a5ec348cb555?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Book Experience',
    },
    {
      slug: 'hot-air-balloon-desert',
      title: 'Hot Air Balloon â Desert Sunrise',
      description: 'Sunrise balloon flight over the desert with falcon show  4 hours  From AED 1,285',
      image: balloonImage,
      ctaLabel: 'Book Flight',
    },
    {
      slug: 'seaplane-tour-dubai',
      title: 'Seaplane Aerial Tour â Dubai',
      description: 'Scenic seaplane tour over Dubai Creek and coastline  40 minutes  From AED 1,543',
      image: seaplaneImage,
      ctaLabel: 'Book Tour',
    },
    {
      slug: 'gyrocopter-flight',
      title: 'Gyrocopter Flight â Dubai Marina',
      description: 'Open-cockpit gyrocopter over the marina skyline  20 minutes  From AED 1,028',
      image: heliImage,
      ctaLabel: 'Book Flight',
    },
    {
      slug: 'tyrolienne-marina-zipline',
      title: 'Zipline â Dubai Marina',
      description: 'Fly at 80 km/h over Dubai Marina  AED 699/pers',
      image: ziplineImage,
      ctaLabel: 'Book Zipline',
    },
    {
      slug: 'zipline-jebel-jais',
      title: 'Zipline â Jebel Jais (World\'s Longest)',
      description: 'World\'s longest zipline over the Hajar mountains, Ras Al Khaimah  2 hours  From AED 808',
      image: ziplineImage,
      ctaLabel: 'Book Zipline',
    },
    {
      slug: 'jais-sledder',
      title: 'Jais Sledder â Mountain Toboggan',
      description: 'Thrilling toboggan ride down Jebel Jais mountain, Ras Al Khaimah  30 min  From AED 220',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Book Ride',
    },
  ];
}

function getPhotographyItems(): ExperienceCatalogItem[] {
  const photoImage = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop';
  return [
    {
      slug: 'flying-shooting-solo',
      title: 'Flying Shooting â Solo',
      description: 'Unforgettable dress photoshoot in the desert or stud farm  AED 1,650',
      image: photoImage,
      ctaLabel: 'Book Shoot',
    },
    {
      slug: 'flying-shooting-duo',
      title: 'Flying Shooting â Duo',
      description: 'Unforgettable dress photoshoot for two  AED 1,850',
      image: photoImage,
      ctaLabel: 'Book Shoot',
    },
    {
      slug: 'flying-shooting-couple',
      title: 'Flying Shooting â Couple',
      description: 'Romantic desert or stud farm couple shoot  AED 1,750',
      image: photoImage,
      ctaLabel: 'Book Shoot',
    },
    {
      slug: 'flying-shooting-family',
      title: 'Flying Shooting â Family',
      description: 'Family dress photoshoot in a magical setting  AED 1,950',
      image: photoImage,
      ctaLabel: 'Book Shoot',
    },
    {
      slug: 'flying-shooting-group',
      title: 'Flying Shooting â Group (3+)',
      description: 'Group dress photoshoot  AED 1,200/pers  Minimum 3 people',
      image: photoImage,
      ctaLabel: 'Book Shoot',
    },
    {
      slug: 'flying-shooting-extra',
      title: 'Flying Shooting â Extra Subjects',
      description: 'Add horse, camel, falcon, snake, video, or event coverage  Price on request',
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Request Quote',
    },
  ];
}

function getSignatureDiningItems(): ExperienceCatalogItem[] {
  return [
    {
      slug: 'experience-signature-dinner',
      title: 'Gourmet Dinner on Embers',
      description: 'Exclusive gourmet dinner at the stud farm or in the desert, prepared over open embers  Price on request',
      image: '/images/Signature Dining/Gourmet Dinner on Embers.png',
      ctaLabel: 'Request Experience',
    },
    {
      slug: 'desert-dinner-experience',
      title: 'Private Desert Dinner Experience',
      description: 'Intimate dinner under the stars in the Dubai desert â private setup, curated menu  3 hours  From AED 735',
      image: '/images/Signature Dining/Private Desert Dinner Experience.png',
      ctaLabel: 'Reserve Now',
    },
    {
      slug: 'luxury-dinner-in-the-sky',
      title: 'Dinner in the Sky â Dubai',
      description: 'Suspended dining table 50m above the city skyline â an unmissable spectacle  1.5 hours  From AED 918',
      image: '/images/Signature Dining/Dinner in the Sky â Dubai.png',
      ctaLabel: 'Reserve Now',
    },
    {
      slug: 'dhow-cruise-dinner',
      title: 'Dhow Cruise Dinner â Dubai Marina',
      description: 'Traditional dhow dinner cruise through Dubai Marina with skyline views  2 hours  From AED 330',
      image: '/images/Signature Dining/Dhow Cruise Dinner.png',
      ctaLabel: 'Book Cruise',
    },
  ];
}

function getObservationItems(): ExperienceCatalogItem[] {
  return [
    {
      slug: 'sky-views-observatory',
      title: 'Sky Views Observatory',
      description: 'Breathtaking views from the top of Address Sky View  Glass slide & walk-in-void at 219m  From AED 70/pers',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Book Tickets',
    },
    {
      slug: 'palm-jumeirah-boardwalk',
      title: 'Palm Jumeirah Boardwalk',
      description: 'Stroll the outer crescent of Palm Island â panoramic views of Atlantis, the Gulf and Dubai skyline  Best at sunset  Free',
      image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Explore',
    },
    {
      slug: 'dubai-marina-walk',
      title: 'Dubai Marina Walk',
      description: 'Waterfront promenade lined with skyscrapers, yachts and restaurants â most iconic urban district  Best at evening  Free',
      image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Explore',
    },
    {
      slug: 'aura-skypool',
      title: 'Aura Skypool â Palm Jumeirah',
      description: '360Â° infinity pool at the top of Palm Tower â the highest 360Â° infinity pool in the world  Best at sunset',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Book Access',
    },
    {
      slug: 'al-qudra-lakes',
      title: 'Al Qudra Lakes',
      description: 'Artificial desert lakes with flamingos, cycling routes, and a surprising wetland ecosystem in the dunes  NovâMar',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Discover',
    },
    {
      slug: 'love-lake',
      title: 'Love Lake â Al Qudra',
      description: 'Heart-shaped desert lake visible from the air â a romantic desert landscape unique to Dubai  OctâApr',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Discover',
    },
    {
      slug: 'moon-lake',
      title: 'Moon Lake â Hidden Gem',
      description: 'Crescent-shaped lake hidden deep in the Al Qudra dunes â rarely visited, extraordinary at sunset  Hidden Gem ð®',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Request Guide',
    },
    {
      slug: 'hatta-dam',
      title: 'Hatta Dam',
      description: 'Turquoise mountain reservoir surrounded by the Hajar mountains â popular for kayaking  OctâApr',
      image: 'https://images.unsplash.com/photo-1588449668365-d15e397f6787?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Discover',
    },
    {
      slug: 'liwa-desert',
      title: 'Liwa Desert â Empty Quarter',
      description: 'Some of the tallest sand dunes on Earth in the heart of the Empty Quarter, Abu Dhabi  NovâMar',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Plan Visit',
    },
    {
      slug: 'sir-bani-yas-island',
      title: 'Sir Bani Yas Island Wildlife Safari',
      description: 'Wildlife island reserve with Arabian oryx, cheetahs & giraffes â a rare UAE safari experience  OctâApr',
      image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Plan Visit',
    },
    {
      slug: 'jubail-mangrove-park',
      title: 'Jubail Mangrove Park â Abu Dhabi',
      description: 'Boardwalk and kayaking through the UAE\'s largest mangrove ecosystem  OctâApr  Free entry',
      image: 'https://images.unsplash.com/photo-1518822374967-36b15e5f36f5?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Discover',
    },
    {
      slug: 'khatt-springs',
      title: 'Khatt Springs â Hidden Gem',
      description: 'Natural hot springs in the Ras Al Khaimah mountains â therapeutic mineral water, off the tourist trail  Hidden Gem ð®',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Request Guide',
    },
    {
      slug: 'al-zorah-nature-reserve',
      title: 'Al Zorah Nature Reserve â Ajman',
      description: 'Hidden coastal mangrove reserve with flamingos and rare birdlife near Ajman city  Hidden Gem ð®  OctâApr',
      image: 'https://images.unsplash.com/photo-1518822374967-36b15e5f36f5?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Discover',
    },
  ];
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
    description: `${car.year} model  From AED ${car.price}/day`,
    image: car.image,
    ctaLabel: 'Request Rental',
  }));
}


function getWaterExtrasItems(): ExperienceCatalogItem[] {
  const waterImg = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop';
  const yachtImg = 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=800&auto=format&fit=crop';
  const divingImg = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop';
  return [
    {
      slug: 'parasailing-dubai',
      title: 'Parasailing â Dubai Marina',
      description: 'Soar above the marina coastline with panoramic skyline views  30 min  From AED 440',
      image: waterImg,
      ctaLabel: 'Book Now',
    },
    {
      slug: 'flyboard-dubai',
      title: 'Flyboard â JBR Beach',
      description: 'Water-propulsion hydroflight experience at JBR Beach  30 min  From AED 477',
      image: waterImg,
      ctaLabel: 'Book Now',
    },
    {
      slug: 'wakeboarding-dubai',
      title: 'Wakeboarding â Dubai Marina',
      description: 'Behind-the-boat wakeboarding in Dubai Marina  1 hour  From AED 514',
      image: waterImg,
      ctaLabel: 'Book Now',
    },
    {
      slug: 'scuba-diving-dubai',
      title: 'Scuba Diving â Jumeirah',
      description: 'Introductory open-water scuba dive with certified instructors  2 hours  From AED 734',
      image: divingImg,
      ctaLabel: 'Book Dive',
    },
    {
      slug: 'sunset-yacht-cruise',
      title: 'Sunset Yacht Cruise â Dubai Marina',
      description: 'Intimate sunset cruise with Dubai skyline panorama  2 hours  From AED 1,285',
      image: yachtImg,
      ctaLabel: 'Book Cruise',
    },
    {
      slug: 'private-yacht-50ft',
      title: 'Private Yacht Charter â 50ft',
      description: 'Private 50ft yacht for small groups in Dubai Marina  3 hours  From AED 2,570',
      image: yachtImg,
      ctaLabel: 'Request Charter',
    },
    {
      slug: 'luxury-yacht-80ft',
      title: 'Luxury Yacht Charter â 80ft',
      description: 'Luxury 80ft yacht with full crew for an unforgettable cruise  4 hours  From AED 5,508',
      image: yachtImg,
      ctaLabel: 'Request Charter',
    },
    {
      slug: 'deep-sea-fishing',
      title: 'Deep Sea Fishing Trip',
      description: 'Full-day fishing expedition into international waters with experienced crew  4 hours  From AED 1,835',
      image: waterImg,
      ctaLabel: 'Book Trip',
    },
    {
      slug: 'snorkeling-fujairah',
      title: 'Snorkeling â Fujairah Coral Reefs',
      description: 'Snorkel through vibrant coral reefs and marine life on the East Coast  2 hours  From AED 440',
      image: divingImg,
      ctaLabel: 'Book Now',
    },
    {
      slug: 'diving-snoopy-island',
      title: 'Scuba Diving â Snoopy Island, Fujairah',
      description: 'Dive around the famous Snoopy Island with turtles, fish and coral  3 hours  From AED 587',
      image: divingImg,
      ctaLabel: 'Book Dive',
    },
    {
      slug: 'deep-dive-dubai',
      title: 'Deep Dive Dubai â World\'s Deepest Pool',
      description: 'Dive into the world\'s deepest indoor pool â explore an underwater city at 60m depth  From AED 1,285',
      image: divingImg,
      ctaLabel: 'Book Dive',
    },
    {
      slug: 'kayaking-hatta-dam',
      title: 'Kayaking â Hatta Dam',
      description: 'Kayak on the stunning turquoise mountain reservoir of Hatta Dam  1 hour  From AED 220',
      image: waterImg,
      ctaLabel: 'Book Now',
    },
    {
      slug: 'mangrove-kayaking-abudhabi',
      title: 'Mangrove Kayaking â Abu Dhabi',
      description: 'Paddle through the lush mangrove forests of Abu Dhabi  2 hours  From AED 294',
      image: waterImg,
      ctaLabel: 'Book Now',
    },
    {
      slug: 'snoopy-island',
      title: 'Snoopy Island â Fujairah',
      description: 'Small island famous for crystal waters, coral reefs, and sea turtles â snorkeling paradise  OctâMay',
      image: divingImg,
      ctaLabel: 'Discover',
    },
    {
      slug: 'dibba-rock',
      title: 'Dibba Rock â Dive Site',
      description: 'Top dive site in the UAE with coral reefs and rich marine biodiversity in Fujairah  OctâMay',
      image: divingImg,
      ctaLabel: 'Discover',
    },
  ];
}

function getCulturalItems(): ExperienceCatalogItem[] {
  const cultureImg = 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop';
  return [
    {
      slug: 'cultural-tour-al-fahidi',
      title: 'Cultural Tour â Al Fahidi Historic District',
      description: 'Walking tour through old Dubai\'s wind tower houses, museums and souks  2 hours  From AED 220',
      image: cultureImg,
      ctaLabel: 'Book Tour',
    },
    {
      slug: 'louvre-abu-dhabi-tour',
      title: 'Louvre Abu Dhabi â Guided Tour',
      description: 'Guided experience of Jean Nouvel\'s architectural masterpiece and its world-class collection  2 hours  From AED 257',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Book Tour',
    },
    {
      slug: 'sharjah-art-walk',
      title: 'Sharjah Art Walk',
      description: 'Explore the vibrant art district of Sharjah â galleries, installations and street art  2 hours  From AED 184',
      image: cultureImg,
      ctaLabel: 'Book Walk',
    },
    {
      slug: 'oyster-farm-rak',
      title: 'Oyster Farm Tour â Ras Al Khaimah',
      description: 'Tour a working oyster farm and taste fresh locally-farmed oysters  2 hours  From AED 514',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Book Tour',
    },
    {
      slug: 'al-fahidi-historic-district',
      title: 'Al Fahidi Historic District â Self Guide',
      description: 'Best preserved neighborhood in Dubai â traditional wind towers, the Dubai Museum, art galleries  Free  OctâApr',
      image: cultureImg,
      ctaLabel: 'Discover',
    },
    {
      slug: 'al-seef-waterfront',
      title: 'Al Seef â Dubai Creek Waterfront',
      description: 'Waterfront district blending heritage architecture with modern design along Dubai Creek  Best in the evening',
      image: cultureImg,
      ctaLabel: 'Discover',
    },
    {
      slug: 'qasr-al-watan',
      title: 'Qasr Al Watan â Presidential Palace',
      description: 'Stunning presidential palace open to visitors â symbol of Emirati governance and architecture, Abu Dhabi  Evenings',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Plan Visit',
    },
    {
      slug: 'dhayah-fort',
      title: 'Dhayah Fort â Ras Al Khaimah',
      description: 'The only remaining hilltop fort in the UAE â sweeping views over palm groves  Hidden Gem ð®  OctâApr',
      image: cultureImg,
      ctaLabel: 'Discover',
    },
    {
      slug: 'al-noor-island',
      title: 'Al Noor Island â Sharjah',
      description: 'Island park with art installations and a butterfly house â where art meets nature  Evenings',
      image: cultureImg,
      ctaLabel: 'Plan Visit',
    },
    {
      slug: 'fossil-rock-sharjah',
      title: 'Fossil Rock â Sharjah',
      description: 'Ancient marine fossils embedded in sandstone formations â prehistoric UAE in the desert  OctâApr',
      image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Discover',
    },
    {
      slug: 'mleiha-archaeological-centre',
      title: 'Mleiha Archaeological Centre â Sharjah',
      description: 'Ancient human settlements in Arabia â fossils, desert expeditions and Bronze Age tombs  OctâApr',
      image: cultureImg,
      ctaLabel: 'Plan Visit',
    },
    {
      slug: 'ed-dur-archaeological-site',
      title: 'Ed Dur â Ancient Sun Temple',
      description: 'One of the most important pre-Islamic sites in the UAE â ancient temple ruins, Umm Al Quwain  Hidden Gem ð®',
      image: cultureImg,
      ctaLabel: 'Discover',
    },
  ];
}

function getWellnessExtrasItems(): ExperienceCatalogItem[] {
  return [
    {
      slug: 'luxury-spa-day',
      title: 'Luxury Spa Day â Full Treatment',
      description: 'Premium full-body spa and wellness treatment at a 5-star Dubai resort  3 hours  From AED 808',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Book Now',
    },
    {
      slug: 'beach-club-day-pass',
      title: 'Beach Club Day Pass',
      description: 'Full-day access to a premium Dubai beach club with pool, sunbeds and F&B credit  Full day  From AED 551',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
      ctaLabel: 'Book Access',
    },
  ];
}

function getMountainAdventureItems(): ExperienceCatalogItem[] {
  const mountainImg = 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop';
  return [
    {
      slug: 'mountain-hiking-hatta',
      title: 'Mountain Hiking â Hatta',
      description: 'Guided hiking through the rugged Hajar mountains in Hatta  3 hours  From AED 330',
      image: mountainImg,
      ctaLabel: 'Book Hike',
    },
    {
      slug: 'mountain-bike-hatta',
      title: 'Mountain Biking â Hatta Trails',
      description: 'Bike through scenic mountain trails inside the Hatta Heritage Village area  2 hours  From AED 257',
      image: mountainImg,
      ctaLabel: 'Book Now',
    },
    {
      slug: 'wadi-shawka',
      title: 'Wadi Shawka â Off-Road Hiking',
      description: 'Rocky valley with natural pools and hiking routes, Ras Al Khaimah â popular local off-road destination  NovâMar',
      image: mountainImg,
      ctaLabel: 'Discover',
    },
    {
      slug: 'wadi-wurayah',
      title: 'Wadi Wurayah â UNESCO Waterfall Valley',
      description: 'UNESCO protected valley with one of the UAE\'s only permanent waterfalls and rich wildlife, Fujairah  OctâApr',
      image: mountainImg,
      ctaLabel: 'Discover',
    },
    {
      slug: 'jebel-jais-scenic',
      title: 'Jebel Jais â UAE\'s Highest Mountain',
      description: 'Scenic mountain drive to the UAE\'s highest peak with dramatic Hajar landscapes, Ras Al Khaimah  OctâApr',
      image: mountainImg,
      ctaLabel: 'Plan Visit',
    },
  ];
}

export const DALC_EXPERIENCE_CATEGORIES: ExperienceCatalogCategory[] = [
  {
    slug: 'desert-adventures',
    title: 'Desert Adventures',
    description: 'Dune buggies, ATVs, and off-road safaris in the Dubai desert.',
    items: [
      ...getDesertAdventureItems(),
      ...getMountainAdventureItems(),
      ...fromMockSubcategory('adventure').filter((i) => !i.title.toLowerCase().includes('skydive')),
    ],
  },
  {
    slug: 'water-activities',
    title: 'Water Activities',
    description: 'Jet skis, yacht charters, scuba diving, kayaking and more along the UAE coastline.',
    items: [...getWaterActivityItems(), ...getYachtCharterItems(), ...getWaterExtrasItems()],
  },
  {
    slug: 'aerial-and-adrenaline',
    title: 'Aerial & Adrenaline',
    description: 'Sky-focused and adrenaline-led experiences.',
    items: getAerialItems(),
  },
  {
    slug: 'wellness',
    title: 'Wellness',
    description: 'Spa, beach club access, and restoration experiences across Dubai.',
    items: [...fromMockSubcategory('wellness'), ...getWellnessExtrasItems()],
  },
  {
    slug: 'tickets-and-culture',
    title: 'Tickets & Culture',
    description: 'Cultural tours, archaeological sites, and curated access across the UAE.',
    items: [...fromMockSubcategory('culture'), ...getCulturalItems()],
  },
  {
    slug: 'luxury-leisure',
    title: 'Luxury Leisure',
    description: 'Premium lifestyle bookings and luxury cars.',
    items: [...fromMockSubcategory('nightlife'), ...fromMockSubcategory('dining'), ...getLuxuryLeisureCars()],
  },
  {
    slug: 'photography-experience',
    title: 'Photography & Experience',
    description: 'Unforgettable dress photoshoots in the desert or at the stud farm with premium subjects.',
    items: getPhotographyItems(),
  },
  {
    slug: 'signature-dining',
    title: 'Signature Dining',
    description: 'Exclusive gourmet dining experiences under the stars or at the stud farm.',
    items: getSignatureDiningItems(),
  },
  {
    slug: 'observation',
    title: 'Observation',
    description: 'Sky-high viewpoints and iconic observatory experiences across Dubai.',
    items: getObservationItems(),
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
