export interface WaterProduct {
  slug: string;
  title: string;
  description: string;
  image: string;
  priceAED: number;
  priceLabel: string;
  durationMinutes: number;
  badge?: string;
  galleryImages?: string[];
  alt?: string;
}

export interface WaterFaq {
  q: string;
  a: string;
}

export interface WaterModel {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  shortDescription: string;
  image: string;
  badge?: string;
  fromPrice: number;
  group: 'jet-ski' | 'jet-car';
  location: string;
  ageMin: number;
  seoContent: string;
  products: WaterProduct[];
  faq: WaterFaq[];
  galleryImages?: string[];
  alt?: string;
}

export const WATER_MODEL_SLUGS = [
  'yamaha-vx-deluxe',
  'yamaha-jetblaster',
  'yamaha-gp-ho-1900cc',
  'yamaha-fx-svho-260hp',
  'jetcar',
] as const;

export type WaterModelSlug = (typeof WATER_MODEL_SLUGS)[number];

export const WATER_MODELS: WaterModel[] = [
  {
    slug: 'yamaha-vx-deluxe',
    title: 'Yamaha VX Deluxe 1050cc',
    seoTitle: 'Yamaha VX Deluxe Jet Ski Dubai | From AED 250 | JBR Coastline',
    seoDescription:
      'Hire the Yamaha VX Deluxe 1050cc jet ski in Dubai from AED 250. 30, 60, 90 & 120-minute sessions from JBR Beach. Life jacket, safety brief & fuel included.',
    shortDescription:
      'Entry-level thrill on the Arabian Gulf — smooth power, beginner-friendly, available in four session lengths from 30 to 120 minutes.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
    alt: 'Yamaha VX Deluxe 1050cc jet ski hire Dubai JBR beach',
    galleryImages: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991b1c3d253?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
    ],
    badge: 'Beginner Friendly',
    fromPrice: 250,
    group: 'jet-ski',
    location: 'JBR Beach, Dubai',
    ageMin: 16,
    seoContent:
      'The Yamaha VX Deluxe 1050cc is the ideal jet ski for anyone stepping onto the water for the first time — or returning for a reliable, comfortable ride. Its 1050cc 4-stroke engine delivers consistent power without overwhelming beginners, while the wide hull and ergonomic seating keep the ride stable and enjoyable. Sessions launch from our JBR Beach base on the Dubai coastline, where you\'ll receive a safety briefing, life jacket, and guided route before heading out. Choose from four session lengths — 30, 60, 90, or 120 minutes — to match your schedule. Fuel and safety equipment are included in every booking.',
    products: [
      {
        slug: '30-minutes',
        title: 'Yamaha VX Deluxe — 30 Min',
        description:
          '1050cc 4-stroke engine, beginner-friendly. A quick coastal blast from JBR Beach — perfect as a first experience on the water.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
        priceAED: 250,
        priceLabel: 'AED 250',
        durationMinutes: 30,
      },
      {
        slug: '60-minutes',
        title: 'Yamaha VX Deluxe — 60 Min',
        description:
          '1050cc 4-stroke engine, beginner-friendly. One hour along the Dubai coastline — enough time to explore the JBR waterfront and build confidence.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
        priceAED: 450,
        priceLabel: 'AED 450',
        durationMinutes: 60,
        badge: 'Most Popular',
      },
      {
        slug: '90-minutes',
        title: 'Yamaha VX Deluxe — 90 Min',
        description:
          '1050cc 4-stroke engine, beginner-friendly. Extended session to cruise farther along the Dubai coastline at a relaxed, enjoyable pace.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
        priceAED: 600,
        priceLabel: 'AED 600',
        durationMinutes: 90,
      },
      {
        slug: '120-minutes',
        title: 'Yamaha VX Deluxe — 2 Hours',
        description:
          '1050cc 4-stroke engine, beginner-friendly. Two full hours on the Arabian Gulf — the complete VX Deluxe experience from JBR to the horizon.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
        priceAED: 750,
        priceLabel: 'AED 750',
        durationMinutes: 120,
        badge: 'Best Value',
      },
    ],
    faq: [
      {
        q: 'Do I need prior jet ski experience to ride the VX Deluxe?',
        a: 'No. The VX Deluxe is specifically chosen for beginners. A safety briefing is included before every session.',
      },
      {
        q: 'What is the minimum age?',
        a: 'Riders must be at least 16 years old. A valid ID is required at check-in.',
      },
      {
        q: 'What is included in the price?',
        a: 'Jet ski rental, life jacket, safety briefing, and fuel are all included. Photos and insurance are available separately.',
      },
      {
        q: 'Where does the session depart from?',
        a: 'All VX Deluxe sessions launch from JBR Beach, Dubai. Detailed meeting point instructions are sent upon booking confirmation.',
      },
      {
        q: 'Can I extend my session on the day?',
        a: 'Extensions are subject to availability. We recommend booking the longer session in advance to guarantee the slot.',
      },
    ],
  },
  {
    slug: 'yamaha-jetblaster',
    title: 'Yamaha JetBlaster',
    seoTitle: 'Yamaha JetBlaster Jet Ski Dubai | Agile & Fun | From AED 290',
    seoDescription:
      'Book the Yamaha JetBlaster jet ski in Dubai from AED 290. Lightweight, agile play machine for sharp turns and quick acceleration along JBR. 30–120 min sessions.',
    shortDescription:
      'Compact, agile, and built for non-stop fun — the JetBlaster\'s lightweight hull makes it the most playful jet ski in the fleet.',
    image: 'https://images.unsplash.com/photo-1578879272285-4e6379b77e98?q=80&w=1200&auto=format&fit=crop',
    alt: 'Yamaha JetBlaster jet ski Dubai high-speed riding JBR',
    galleryImages: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200&auto=format&fit=crop',
    ],
    badge: 'Fan Favourite',
    fromPrice: 290,
    group: 'jet-ski',
    location: 'JBR Beach, Dubai',
    ageMin: 18,
    seoContent:
      'The Yamaha JetBlaster is purpose-built for pure entertainment on the water. Its lightweight hull and ultra-responsive handling reward riders who want sharp turns, rapid acceleration, and a machine that reacts to every input instantly. Where larger jet skis cruise, the JetBlaster plays — darting through spray, carving tight arcs, and delivering constant smiles. Suitable for riders who have some water sports experience and want a more dynamic ride. Sessions run from JBR Beach in four lengths — 30, 60, 90, and 120 minutes. Life jacket, safety briefing, and fuel are included.',
    products: [
      {
        slug: '30-minutes',
        title: 'Yamaha JetBlaster — 30 Min',
        description:
          'Lightweight performance hull, ultra-agile. A fast 30-minute session to experience the JetBlaster\'s sharp handling and quick acceleration.',
        image: 'https://images.unsplash.com/photo-1578879272285-4e6379b77e98?q=80&w=1200&auto=format&fit=crop',
        priceAED: 290,
        priceLabel: 'AED 290',
        durationMinutes: 30,
      },
      {
        slug: '60-minutes',
        title: 'Yamaha JetBlaster — 60 Min',
        description:
          'Lightweight performance hull, ultra-agile. One full hour to push the JetBlaster through its paces along the Dubai coastline.',
        image: 'https://images.unsplash.com/photo-1578879272285-4e6379b77e98?q=80&w=1200&auto=format&fit=crop',
        priceAED: 490,
        priceLabel: 'AED 490',
        durationMinutes: 60,
        badge: 'Most Popular',
      },
      {
        slug: '90-minutes',
        title: 'Yamaha JetBlaster — 90 Min',
        description:
          'Lightweight performance hull, ultra-agile. Extended play session — more time to explore, turn, and enjoy everything the JetBlaster offers.',
        image: 'https://images.unsplash.com/photo-1578879272285-4e6379b77e98?q=80&w=1200&auto=format&fit=crop',
        priceAED: 640,
        priceLabel: 'AED 640',
        durationMinutes: 90,
      },
      {
        slug: '120-minutes',
        title: 'Yamaha JetBlaster — 2 Hours',
        description:
          'Lightweight performance hull, ultra-agile. Two full hours on the Arabian Gulf with the most playful jet ski in the DALC fleet.',
        image: 'https://images.unsplash.com/photo-1578879272285-4e6379b77e98?q=80&w=1200&auto=format&fit=crop',
        priceAED: 790,
        priceLabel: 'AED 790',
        durationMinutes: 120,
        badge: 'Best Value',
      },
    ],
    faq: [
      {
        q: 'Is the JetBlaster suitable for beginners?',
        a: 'The JetBlaster is better suited to riders with some prior experience. Minimum age is 18. We recommend the Yamaha VX Deluxe for first-timers.',
      },
      {
        q: 'How fast does the JetBlaster go?',
        a: 'The JetBlaster reaches speeds of up to 55 mph (88 km/h). It is designed for agile, high-energy riding rather than top-speed runs.',
      },
      {
        q: 'Is swimming ability required?',
        a: 'Swimming ability is recommended. A properly fitted life jacket is provided for every rider.',
      },
      {
        q: 'Where does the session launch from?',
        a: 'All JetBlaster sessions depart from JBR Beach. Exact location details are shared in your booking confirmation.',
      },
      {
        q: 'What is not included?',
        a: 'Photos, video footage, personal insurance, and transportation to/from the launch point are not included.',
      },
    ],
  },
  {
    slug: 'yamaha-gp-ho-1900cc',
    title: 'Yamaha GP HO 1900cc',
    seoTitle: 'Yamaha GP HO 1900cc Jet Ski Dubai | Race-Grade Performance | From AED 350',
    seoDescription:
      'Hire the Yamaha GP HO 1900cc race-grade jet ski in Dubai from AED 350. High-output 1.8L engine, 65+ mph top speed. 30–120-minute sessions from JBR Beach.',
    shortDescription:
      'Race-grade power on the open water — a high-output 1.8L engine and competitive hull built for speed-hungry riders.',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1200&auto=format&fit=crop',
    alt: 'Yamaha GP HO 1900cc race-grade jet ski Dubai performance JBR',
    galleryImages: [
      'https://images.unsplash.com/photo-1578879272285-4e6379b77e98?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991b1c3d253?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1200&auto=format&fit=crop',
    ],
    badge: 'Performance',
    fromPrice: 350,
    group: 'jet-ski',
    location: 'JBR Beach, Dubai',
    ageMin: 18,
    seoContent:
      'The Yamaha GP HO 1900cc is engineered for performance. Drawing its DNA directly from Yamaha\'s competitive race programme, this jet ski packs a high-output 1.8-litre engine into a precision-designed hull that slices through water with minimal resistance. Top speeds exceed 65 mph on flat water — making it the fastest naturally aspirated jet ski in the DALC fleet. It is strictly for experienced riders who want to feel genuine race-bred performance on the Arabian Gulf. Prior jet ski experience is required. Sessions run in 30, 60, 90, and 120-minute slots from JBR Beach.',
    products: [
      {
        slug: '30-minutes',
        title: 'Yamaha GP HO 1900cc — 30 Min',
        description:
          'Race-grade 1.8L high-output engine. A concentrated 30-minute session to feel the GP HO\'s raw speed and track-inspired handling.',
        image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1200&auto=format&fit=crop',
        priceAED: 350,
        priceLabel: 'AED 350',
        durationMinutes: 30,
      },
      {
        slug: '60-minutes',
        title: 'Yamaha GP HO 1900cc — 60 Min',
        description:
          'Race-grade 1.8L high-output engine. One hour of pure performance on the Dubai coastline — the recommended session for experienced riders.',
        image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1200&auto=format&fit=crop',
        priceAED: 600,
        priceLabel: 'AED 600',
        durationMinutes: 60,
        badge: 'Recommended',
      },
      {
        slug: '90-minutes',
        title: 'Yamaha GP HO 1900cc — 90 Min',
        description:
          'Race-grade 1.8L high-output engine. Extended session for riders who want more time to push the GP HO across open water.',
        image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1200&auto=format&fit=crop',
        priceAED: 750,
        priceLabel: 'AED 750',
        durationMinutes: 90,
      },
      {
        slug: '120-minutes',
        title: 'Yamaha GP HO 1900cc — 2 Hours',
        description:
          'Race-grade 1.8L high-output engine. Two hours of endurance riding on race-bred hardware — the full GP HO experience.',
        image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1200&auto=format&fit=crop',
        priceAED: 890,
        priceLabel: 'AED 890',
        durationMinutes: 120,
        badge: 'Best Value',
      },
    ],
    faq: [
      {
        q: 'Is prior jet ski experience required for the GP HO?',
        a: 'Yes. The GP HO 1900cc is a high-performance machine intended for experienced riders. Prior jet ski experience is required to book.',
      },
      {
        q: 'What top speed does the GP HO reach?',
        a: 'The Yamaha GP HO 1900cc reaches speeds exceeding 65 mph (105 km/h) on flat water — the fastest naturally aspirated jet ski on our fleet.',
      },
      {
        q: 'What is the minimum age?',
        a: 'Riders must be 18 or older with valid ID. Swimming ability is also required.',
      },
      {
        q: 'What if I have never ridden a performance jet ski before?',
        a: 'We recommend starting with the JetBlaster or VX Deluxe to build confidence before stepping up to the GP HO.',
      },
      {
        q: 'Can I book the GP HO for a private session?',
        a: 'Yes. Contact our concierge team to arrange a private exclusive slot, especially for professional riders or content creators.',
      },
    ],
  },
  {
    slug: 'yamaha-fx-svho-260hp',
    title: 'Yamaha FX SVHO 260HP',
    seoTitle: 'Yamaha FX SVHO 260HP Dubai | Supercharged Luxury Jet Ski | From AED 499',
    seoDescription:
      'Experience the Yamaha FX SVHO 260HP in Dubai from AED 499. Supercharged 1.8L engine, NanoXcel hull, cruise control. VIP jet ski sessions from Palm Jumeirah Marina.',
    shortDescription:
      'The pinnacle of jet ski engineering — 260HP supercharged engine, NanoXcel hull, and luxury cruise tech for riders who demand the absolute best.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
    alt: 'Yamaha FX SVHO 260HP supercharged jet ski Palm Jumeirah Dubai',
    galleryImages: [
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991b1c3d253?q=80&w=1200&auto=format&fit=crop',
    ],
    badge: 'Premium',
    fromPrice: 499,
    group: 'jet-ski',
    location: 'Palm Jumeirah Marina, Dubai',
    ageMin: 21,
    seoContent:
      'The Yamaha FX SVHO represents the very peak of personal watercraft engineering. A supercharged 1.8-litre engine producing 260 horsepower, housed in Yamaha\'s flagship NanoXcel hull — designed for maximum speed with minimum weight. Ride control features include adjustable electronic trim, no-wake mode, and cruise control, giving you complete mastery at every speed. Sessions depart from Palm Jumeirah Marina, where you will be briefed by our VIP host before heading out along one of Dubai\'s most spectacular waterfront routes. GoPro hire is available. Minimum age 21, prior jet ski experience required.',
    products: [
      {
        slug: '30-minutes',
        title: 'Yamaha FX SVHO 260HP — 30 Min',
        description:
          '260HP supercharged engine, NanoXcel hull. A VIP 30-minute session on the most powerful jet ski in Dubai — departs Palm Jumeirah Marina.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
        priceAED: 499,
        priceLabel: 'AED 499',
        durationMinutes: 30,
      },
      {
        slug: '60-minutes',
        title: 'Yamaha FX SVHO 260HP — 60 Min',
        description:
          '260HP supercharged engine, NanoXcel hull. One hour of supercharged performance along the Palm Jumeirah waterfront — the signature SVHO experience.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
        priceAED: 749,
        priceLabel: 'AED 749',
        durationMinutes: 60,
        badge: 'Recommended',
      },
      {
        slug: '90-minutes',
        title: 'Yamaha FX SVHO 260HP — 90 Min',
        description:
          '260HP supercharged engine, NanoXcel hull. Extended premium session to fully explore the FX SVHO\'s capabilities along Dubai\'s iconic waterfront.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
        priceAED: 799,
        priceLabel: 'AED 799',
        durationMinutes: 90,
      },
      {
        slug: '120-minutes',
        title: 'Yamaha FX SVHO 260HP — 2 Hours',
        description:
          '260HP supercharged engine, NanoXcel hull. Two hours aboard Dubai\'s most powerful jet ski — the complete FX SVHO flagship experience.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
        priceAED: 999,
        priceLabel: 'AED 999',
        durationMinutes: 120,
        badge: 'Best Value',
      },
    ],
    faq: [
      {
        q: 'What makes the FX SVHO different from the other jet skis?',
        a: 'The FX SVHO is the only supercharged jet ski in our fleet. Its 260HP output, cruise control, and adjustable trim place it in a different class to all naturally aspirated models.',
      },
      {
        q: 'Do I need experience to ride the FX SVHO?',
        a: 'Yes. Prior jet ski experience is required. Minimum age is 21. This machine is not suitable for beginners.',
      },
      {
        q: 'Where does the SVHO session depart from?',
        a: 'FX SVHO sessions depart from Palm Jumeirah Marina — providing access to some of Dubai\'s most spectacular coastal views.',
      },
      {
        q: 'Is a GoPro available?',
        a: 'Yes. GoPro hire and footage transfer are available as an add-on. Ask our team at checkout.',
      },
      {
        q: 'Can the FX SVHO carry a passenger?',
        a: 'The FX SVHO is a three-person stand-up/sit-down model. Passenger rides may be arranged — enquire with our concierge team.',
      },
    ],
  },
  {
    slug: 'jetcar',
    title: 'Jetcar — Drive on Water',
    seoTitle: 'Jetcar Dubai | Drive on Water | From AED 600 | Dubai Marina',
    seoDescription:
      'Experience the Jetcar in Dubai from AED 600. The world\'s first water car — sports car body, marine jet engine. 20, 30 & 60-min sessions from Dubai Marina.',
    shortDescription:
      'The world\'s first water car — a jet-powered supercar body you actually drive on the Arabian Gulf. Drift, spin, and cruise along Dubai Marina.',
    image: 'https://images.unsplash.com/photo-1565620551738-c1f4e2f3ac24?q=80&w=1200&auto=format&fit=crop',
    alt: 'Jetcar water car Dubai Marina jet-powered sports car on water',
    galleryImages: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1200&auto=format&fit=crop',
    ],
    badge: 'One of a Kind',
    fromPrice: 600,
    group: 'jet-car',
    location: 'Dubai Marina',
    ageMin: 16,
    seoContent:
      'The Jetcar is unlike anything else on the water. Designed to look and feel like a supercar, it is powered not by wheels but by a marine jet engine that propels it across the surface of the sea. Sit low in the cockpit, grip the steering wheel, and pilot a machine that drifts, spins, and carves through water the way a sports car attacks a racetrack. No licence is required — a brief orientation is included before every session. Departs from Dubai Marina with views of the skyline that make every minute Instagram-worthy. Sessions run in 20, 30, and 60-minute slots.',
    products: [
      {
        slug: '20-minutes',
        title: 'Jetcar — 20 Min Taster',
        description:
          'Jet-powered supercar on water, no licence required. A 20-minute taster to experience the Jetcar\'s unique handling from Dubai Marina.',
        image: 'https://images.unsplash.com/photo-1565620551738-c1f4e2f3ac24?q=80&w=1200&auto=format&fit=crop',
        priceAED: 600,
        priceLabel: 'AED 600',
        durationMinutes: 20,
      },
      {
        slug: '30-minutes',
        title: 'Jetcar — 30 Min Experience',
        description:
          'Jet-powered supercar on water, no licence required. The full introductory Jetcar session — enough time to drift, spin, and cruise the Marina waterfront.',
        image: 'https://images.unsplash.com/photo-1565620551738-c1f4e2f3ac24?q=80&w=1200&auto=format&fit=crop',
        priceAED: 900,
        priceLabel: 'AED 900',
        durationMinutes: 30,
        badge: 'Most Popular',
      },
      {
        slug: '60-minutes',
        title: 'Jetcar — 1 Hour Extended',
        description:
          'Jet-powered supercar on water, no licence required. One full hour in the Jetcar cockpit — explore Dubai Marina and beyond at your own pace.',
        image: 'https://images.unsplash.com/photo-1565620551738-c1f4e2f3ac24?q=80&w=1200&auto=format&fit=crop',
        priceAED: 1300,
        priceLabel: 'AED 1,300',
        durationMinutes: 60,
        badge: 'Best Value',
      },
    ],
    faq: [
      {
        q: 'Do I need a driving licence or jet ski licence to drive the Jetcar?',
        a: 'No licence is required. A brief orientation session is included before every Jetcar experience.',
      },
      {
        q: 'What is the minimum age for the Jetcar?',
        a: 'Riders must be at least 16 years old with a valid ID. Younger participants may ride as passengers with a consenting adult driver.',
      },
      {
        q: 'Where does the Jetcar depart from?',
        a: 'All Jetcar sessions launch from Dubai Marina, with stunning skyline views throughout the experience.',
      },
      {
        q: 'Can I drift and spin the Jetcar?',
        a: 'Yes — drifts, spins, and tight turns are part of the Jetcar experience. Your orientation will cover how to perform controlled manoeuvres safely.',
      },
      {
        q: 'Is the Jetcar suitable for non-swimmers?',
        a: 'A life jacket is provided. Swimming ability is not required, though it is recommended as a safety precaution.',
      },
    ],
  },
];

export function getWaterModel(slug: string): WaterModel | undefined {
  return WATER_MODELS.find((m) => m.slug === slug);
}

export function getWaterProduct(modelSlug: string, productSlug: string): WaterProduct | undefined {
  return getWaterModel(modelSlug)?.products.find((p) => p.slug === productSlug);
}

export function isWaterModelSlug(slug: string): slug is WaterModelSlug {
  return (WATER_MODEL_SLUGS as readonly string[]).includes(slug);
}
