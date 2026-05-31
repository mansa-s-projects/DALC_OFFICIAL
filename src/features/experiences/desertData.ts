export interface DesertProduct {
  slug: string;
  title: string;
  description: string;
  image: string;
  priceAED: number;
  priceLabel: string;
  durationMinutes: number;
  seats: number;
  badge?: string;
  galleryImages?: string[];
  alt?: string;
}

export interface DesertFaq {
  q: string;
  a: string;
}

export interface DesertSubcategory {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  shortDescription: string;
  image: string;
  badge?: string;
  fromPrice: number;
  seoContent: string;
  products: DesertProduct[];
  faq: DesertFaq[];
  galleryImages?: string[];
  alt?: string;
}

export const DESERT_SUBCATEGORY_SLUGS = [
  'dune-buggy',
  'quad-biking',
  'desert-safari',
  'camel-riding',
  'sandboarding',
] as const;

export type DesertSubcategorySlug = (typeof DESERT_SUBCATEGORY_SLUGS)[number];

export const DESERT_SUBCATEGORIES: DesertSubcategory[] = [
  {
    slug: 'dune-buggy',
    title: 'Dune Buggies Dubai',
    seoTitle: 'Dune Buggy Rental Dubai | Polaris RZR & Can-Am Maverick | From AED 600',
    seoDescription:
      'Book dune buggy rental in Dubai from AED 600. Polaris RZR, Can-Am Maverick R, X3 & Sport. Private desert track, 30-min & 1-hour sessions. Helmets & safety gear included.',
    shortDescription:
      'Tear across golden dunes at full throttle. Premium buggies — Polaris RZR, Can-Am Maverick X3 & Maverick R — on a private desert track.',
    image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-4.webp',
    alt: 'Dune buggy rental Dubai Lahbab desert Can-Am Maverick Polaris RZR',
    galleryImages: [
      '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-4.webp',
      '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-4.webp',
      '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-4.webp',
    ],
    badge: 'Most Popular',
    fromPrice: 600,
    seoContent:
      "Dune buggy rental in Dubai puts you behind the wheel of the most powerful off-road machines in the UAE. Our private desert track features classified dunes, steep descents, and ridge runs in the heart of the Lahbab Red Sand Dunes. Choose from the iconic Polaris RZR with 110 HP, the precision-engineered Can-Am Maverick R (232 HP twin-turbo), the performance favourite Maverick X3 (195 HP), or the accessible Maverick Sport. All rentals include safety briefing, helmet, neck brace, gloves, goggles, and a guide vehicle. Sessions run in 30-minute and 1-hour time slots — suitable for all experience levels.",
    products: [
      {
        slug: 'polaris-rzr-4-seater-30min',
        title: 'Polaris RZR 4-Seater — 30 Min',
        description:
          '110 HP powerhouse, 4 seats. Ideal for groups or families who want shared thrills on the most iconic buggy in the UAE.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-4.webp',
        priceAED: 600,
        priceLabel: 'AED 600',
        durationMinutes: 30,
        seats: 4,
      },
      {
        slug: 'polaris-rzr-4-seater-1hour',
        title: 'Polaris RZR 4-Seater — 1 Hour',
        description:
          '110 HP powerhouse, 4 seats. Full hour to tackle every dune, ridge, and valley — the complete desert buggy experience.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-4.webp',
        priceAED: 1000,
        priceLabel: 'AED 1,000',
        durationMinutes: 60,
        seats: 4,
        badge: 'Best Value',
      },
      {
        slug: 'maverick-r-2-seats-30min',
        title: 'Can-Am Maverick R 2-Seater — 30 Min',
        description:
          '232 HP twin-turbo — the fastest production side-by-side ever made. 2 seats. For those who demand peak desert performance.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-4.webp',
        priceAED: 1150,
        priceLabel: 'AED 1,150',
        durationMinutes: 30,
        seats: 2,
        badge: 'Flagship',
      },
      {
        slug: 'maverick-r-2-seats-1hour',
        title: 'Can-Am Maverick R 2-Seater — 1 Hour',
        description:
          '232 HP twin-turbo, 2 seats. A full hour at the absolute limit — maximum speed, maximum adrenaline.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-4.webp',
        priceAED: 2000,
        priceLabel: 'AED 2,000',
        durationMinutes: 60,
        seats: 2,
      },
      {
        slug: 'maverick-r-4-seats-30min',
        title: 'Can-Am Maverick R 4-Seater — 30 Min',
        description:
          "232 HP twin-turbo, 4 seats. Share the Maverick R's legendary power with up to 3 passengers.",
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-4.webp',
        priceAED: 1250,
        priceLabel: 'AED 1,250',
        durationMinutes: 30,
        seats: 4,
      },
      {
        slug: 'maverick-r-4-seats-1hour',
        title: 'Can-Am Maverick R 4-Seater — 1 Hour',
        description:
          '232 HP twin-turbo, 4 seats. The full Maverick R experience for groups — an hour of pure desert domination.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-4.webp',
        priceAED: 2200,
        priceLabel: 'AED 2,200',
        durationMinutes: 60,
        seats: 4,
      },
      {
        slug: 'maverick-x3-2-seats-30min',
        title: 'Can-Am Maverick X3 2-Seater — 30 Min',
        description:
          '195 HP turbocharged, 2 seats. The benchmark desert racer — explosive acceleration and pro-grade long-travel suspension.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-4.webp',
        priceAED: 800,
        priceLabel: 'AED 800',
        durationMinutes: 30,
        seats: 2,
      },
      {
        slug: 'maverick-x3-2-seats-1hour',
        title: 'Can-Am Maverick X3 2-Seater — 1 Hour',
        description:
          '195 HP turbocharged, 2 seats. A full hour on the most popular desert racer in Dubai. Pure adrenaline.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-4.webp',
        priceAED: 1350,
        priceLabel: 'AED 1,350',
        durationMinutes: 60,
        seats: 2,
        badge: 'Most Booked',
      },
      {
        slug: 'maverick-x3-4-seats-30min',
        title: 'Can-Am Maverick X3 4-Seater — 30 Min',
        description:
          '195 HP turbocharged, 4 seats. All the thrill of the X3 with room for the whole crew.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-4.webp',
        priceAED: 850,
        priceLabel: 'AED 850',
        durationMinutes: 30,
        seats: 4,
      },
      {
        slug: 'maverick-x3-4-seats-1hour',
        title: 'Can-Am Maverick X3 4-Seater — 1 Hour',
        description:
          '195 HP turbocharged, 4 seats. An hour of desert racing with up to 3 passengers along for the ride.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-4.webp',
        priceAED: 1450,
        priceLabel: 'AED 1,450',
        durationMinutes: 60,
        seats: 4,
      },
      {
        slug: 'maverick-sport-2-seats-30min',
        title: 'Can-Am Maverick Sport 2-Seater — 30 Min',
        description:
          '100 HP, 2 seats. The perfect introduction to dune buggy racing — capable, controlled, and genuinely thrilling.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-4.webp',
        priceAED: 600,
        priceLabel: 'AED 600',
        durationMinutes: 30,
        seats: 2,
      },
      {
        slug: 'maverick-sport-2-seats-1hour',
        title: 'Can-Am Maverick Sport 2-Seater — 1 Hour',
        description:
          '100 HP, 2 seats. Full hour of desert exploration at an accessible price point — ideal for first-timers.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-4.webp',
        priceAED: 900,
        priceLabel: 'AED 900',
        durationMinutes: 60,
        seats: 2,
      },
    ],
    faq: [
      {
        q: 'What is the minimum age to drive a dune buggy in Dubai?',
        a: 'The minimum age to drive is 18 years with a valid driving licence. Passengers must be at least 5 years old. Children under 12 must be seated in the rear.',
      },
      {
        q: 'Do I need prior off-road experience?',
        a: 'No prior experience is required. All sessions begin with a safety briefing and vehicle orientation. Our track is designed for all skill levels with easy, medium, and expert zones.',
      },
      {
        q: 'What safety equipment is provided?',
        a: 'Helmets, neck braces, gloves, and goggles are provided for all riders. Closed-toe shoes are mandatory — sandals and flip-flops are not permitted.',
      },
      {
        q: 'Can I go alone or do I need a group?',
        a: 'Solo bookings are welcome. 2-seater buggies are ideal for couples, and 4-seaters accommodate families or small groups.',
      },
      {
        q: 'What is the difference between the Maverick R, Maverick X3, and Polaris RZR?',
        a: "The Maverick R is Can-Am's flagship with 232 HP twin-turbo — the highest performance option available. The Maverick X3 (195 HP) is the best-selling choice, balancing extreme power with accessibility. The Polaris RZR (110 HP) is the family-friendly all-rounder. The Maverick Sport (100 HP) is the ideal entry-level buggy.",
      },
    ],
  },
  {
    slug: 'quad-biking',
    title: 'Quad Biking Dubai',
    seoTitle: 'Quad Biking Dubai | ATV Desert Tours | Yamaha Raptor & Grizzly | From AED 300',
    seoDescription:
      'Quad biking in Dubai from AED 300. Yamaha Raptor 700, Yamaha Grizzly 700, and Quad 570 through the Lahbab Red Sand Dunes. 30-min and 1-hour sessions. No experience needed.',
    shortDescription:
      'Conquer the Lahbab dunes on powerful ATVs. From the entry-level Quad 570 to the thundering Yamaha Raptor 700 — sessions for all levels.',
    image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-5.webp',
    alt: 'Quad biking Dubai ATV desert Yamaha Raptor Grizzly Lahbab dunes',
    galleryImages: [
      '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-5.webp',
      '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-5.webp',
      '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-5.webp',
    ],
    badge: 'Best Value',
    fromPrice: 300,
    seoContent:
      'Quad biking in Dubai is the most accessible way to experience the Arabian desert at speed. Our fleet ranges from the entry-level Quad 570 to the sport-performance Yamaha Raptor 700 and the all-terrain Yamaha Grizzly 700. All sessions are guided on tracked desert routes in the Lahbab Red Sand Dunes, approximately 45 minutes from Dubai Marina. 30-minute and 1-hour sessions are available. No driving licence is required — beginner and advanced routes available.',
    products: [
      {
        slug: 'quad-570-30min',
        title: 'Quad 570 — 30 Minutes',
        description:
          'The perfect starter ATV. Easy to ride, powerful enough to tackle any dune — ideal for your first desert quad experience.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-5.webp',
        priceAED: 300,
        priceLabel: 'AED 300',
        durationMinutes: 30,
        seats: 1,
      },
      {
        slug: 'quad-570-1hour',
        title: 'Quad 570 — 1 Hour',
        description:
          'Full hour on the Quad 570. Cover more ground, explore more dunes, and build real confidence on the machine.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-5.webp',
        priceAED: 500,
        priceLabel: 'AED 500',
        durationMinutes: 60,
        seats: 1,
        badge: 'Best Value',
      },
      {
        slug: 'yamaha-raptor-700-30min',
        title: 'Yamaha Raptor 700 — 30 Minutes',
        description:
          'Sport-spec ATV with aggressive power delivery and a lightweight frame. For riders who want to push harder on the dunes.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-5.webp',
        priceAED: 350,
        priceLabel: 'AED 350',
        durationMinutes: 30,
        seats: 1,
      },
      {
        slug: 'yamaha-raptor-700-1hour',
        title: 'Yamaha Raptor 700 — 1 Hour',
        description:
          "An hour on Dubai's favourite sport quad. Maximum acceleration, maximum dune coverage — pure desert performance.",
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-5.webp',
        priceAED: 600,
        priceLabel: 'AED 600',
        durationMinutes: 60,
        seats: 1,
        badge: 'Most Booked',
      },
      {
        slug: 'yamaha-grizzly-700-30min',
        title: 'Yamaha Grizzly 700 — 30 Minutes',
        description:
          'All-terrain utility ATV with the smoothest ride in the fleet. Stable, capable, and confident on steep dune faces.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-5.webp',
        priceAED: 380,
        priceLabel: 'AED 380',
        durationMinutes: 30,
        seats: 1,
      },
      {
        slug: 'yamaha-grizzly-700-1hour',
        title: 'Yamaha Grizzly 700 — 1 Hour',
        description:
          'A full hour on the Grizzly — maximising trail coverage with the stability and power to handle any terrain.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-5.webp',
        priceAED: 650,
        priceLabel: 'AED 650',
        durationMinutes: 60,
        seats: 1,
      },
    ],
    faq: [
      {
        q: 'Do I need a driving licence for quad biking in Dubai?',
        a: 'No driving licence is required. Sessions are fully guided on private desert tracks. The minimum age for solo riding is 16; children from age 8 may ride on supervised double-seater options.',
      },
      {
        q: 'What is the difference between the Raptor 700 and Grizzly 700?',
        a: 'The Yamaha Raptor 700 is a sport quad — lighter, more responsive, better for performance riders. The Grizzly 700 is an all-terrain utility ATV — larger, more stable, with a smoother ride on technical terrain. The Quad 570 is the entry-level option for beginners.',
      },
      {
        q: 'Is quad biking in Dubai safe?',
        a: 'All sessions are fully supervised by certified guides. Helmets, goggles, and gloves are provided and mandatory. Routes are graded by difficulty so you ride at your own level.',
      },
      {
        q: 'Where is the quad biking location?',
        a: 'The base camp is in the Lahbab Red Sand Dunes, approximately 45 minutes from Dubai Marina and 30 minutes from Downtown Dubai. Hotel transfers can be arranged on request.',
      },
    ],
  },
  {
    slug: 'desert-safari',
    title: 'Desert Safari Dubai',
    seoTitle: 'Desert Safari Dubai | Sunset, Evening & Overnight Experiences | From AED 160',
    seoDescription:
      'Book a desert safari in Dubai from AED 160. Shared evening safaris, private morning safaris, and exclusive Sonara Camp overnight stays with dune bashing, BBQ dinner & entertainment.',
    shortDescription:
      'Sunset dune bashing, a lavish Bedouin camp dinner, and stars over the Lahbab. Shared from AED 160, private from AED 990 — or go all-night at Sonara Camp.',
    image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
    alt: 'Desert safari Dubai evening dune bashing Lahbab Bedouin camp',
    galleryImages: [
      '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
      '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
      '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
    ],
    badge: 'Most Booked',
    fromPrice: 160,
    seoContent:
      "Desert safari tours in Dubai are the most iconic way to experience the UAE's golden landscape. Choose between a shared evening safari (the most popular option, joining a group) and a fully private departure with a dedicated 4x4. All safaris include dune bashing, a traditional Bedouin-style camp, BBQ dinner, and live entertainment. For the ultimate desert immersion, Sonara Camp offers an exclusive luxury glamping experience deep in the Lahbab — with curated dining, live performances, and private overnight nest tents under the stars.",
    products: [
      {
        slug: 'evening-safari-shared-adult',
        title: 'Evening Desert Safari — Shared (Adult)',
        description:
          "Dubai's most popular desert experience. Shared group departure: dune bashing, camel ride, Bedouin camp, BBQ dinner, and live entertainment under the stars.",
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
        priceAED: 220,
        priceLabel: 'AED 220 / person',
        durationMinutes: 360,
        seats: 1,
        badge: 'Most Booked',
      },
      {
        slug: 'evening-safari-shared-child',
        title: 'Evening Desert Safari — Shared (Child)',
        description:
          'The classic shared evening safari for children aged 2–11. Full experience — dune bashing, camp, dinner, and entertainment — at a reduced price.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
        priceAED: 160,
        priceLabel: 'AED 160 / child',
        durationMinutes: 360,
        seats: 1,
      },
      {
        slug: 'evening-safari-private',
        title: 'Private Evening Desert Safari',
        description:
          'Exclusive private vehicle for your group. Dedicated guide, flexible timing, and a personalised journey through the Lahbab dunes.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
        priceAED: 990,
        priceLabel: 'From AED 990 / vehicle',
        durationMinutes: 360,
        seats: 6,
        badge: 'Premium',
      },
      {
        slug: 'morning-safari-private',
        title: 'Morning Desert Safari — Private',
        description:
          'Beat the heat and the crowds. Exclusive morning dune bashing in a private 4x4 — the desert in golden silence, all to yourself.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
        priceAED: 890,
        priceLabel: 'From AED 890 / car',
        durationMinutes: 240,
        seats: 6,
      },
      {
        slug: 'evening-safari-extra-person',
        title: 'Evening Safari — Extra Person',
        description:
          'Add an additional guest to an existing private evening safari reservation.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
        priceAED: 100,
        priceLabel: '+AED 100 / person',
        durationMinutes: 360,
        seats: 1,
      },
      {
        slug: 'sonara-camp-sunset-dinner',
        title: 'Sonara Camp — Sunset & Dinner',
        description:
          "The UAE's most exclusive desert dining experience. A luxury camp in a private valley — sunset cocktails, a 5-course dinner, and curated entertainment.",
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
        priceAED: 890,
        priceLabel: 'AED 890 adult / AED 380 child',
        durationMinutes: 300,
        seats: 2,
        badge: 'Luxury',
      },
      {
        slug: 'sonara-camp-sunset',
        title: 'Sonara Camp — Sunset Experience',
        description:
          'Attend the legendary Sonara Camp sunset gathering without the full dinner. Cocktail hour, live music, and dusk over endless dunes.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
        priceAED: 480,
        priceLabel: 'AED 480 adult / AED 190 child',
        durationMinutes: 120,
        seats: 2,
      },
      {
        slug: 'sonara-camp-overnight',
        title: 'Sonara Camp — Overnight Stay',
        description:
          "Fall asleep under the Milky Way in a private nest tent. Sunrise breakfast included. The UAE's most extraordinary overnight desert experience.",
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
        priceAED: 2650,
        priceLabel: 'From AED 2,650 / nest',
        durationMinutes: 960,
        seats: 2,
        badge: 'Exclusive',
      },
    ],
    faq: [
      {
        q: 'What is included in the shared evening desert safari?',
        a: 'Hotel pick-up and drop-off, dune bashing in a 4x4, camel riding, a Bedouin camp visit, BBQ dinner, and entertainment including Tanoura dance and fire show.',
      },
      {
        q: 'What is the best time to do a desert safari in Dubai?',
        a: 'October to April is ideal, with temperatures between 18–30°C. Summer safaris (May–September) are available in early morning hours only to avoid the peak heat.',
      },
      {
        q: 'What is the difference between a shared and private safari?',
        a: 'Shared safaris join a group of up to 40 people with shared 4x4 vehicles for dune bashing. Private safaris have a dedicated vehicle and guide exclusively for your group, with flexible timing and a more personalised experience.',
      },
      {
        q: 'What is Sonara Camp?',
        a: 'Sonara Camp is an ultra-exclusive luxury desert experience in a private valley in the Lahbab desert. It features a curated dining programme, live entertainment, and overnight nest tents under the stars. Advance booking is essential — capacity is strictly limited.',
      },
      {
        q: 'Is dune bashing safe for children?',
        a: 'Yes, with some conditions. Children aged 4+ can participate with a seat belt. Pregnant guests and those with back or neck conditions should use camp-only alternatives. Our drivers are professionally licensed and experienced.',
      },
    ],
  },
  {
    slug: 'camel-riding',
    title: 'Camel & Horse Riding Dubai',
    seoTitle: 'Camel & Horse Riding Dubai | Desert Rides from AED 150 | Book Online',
    seoDescription:
      'Camel and horse riding in the Dubai desert from AED 150. Guided rides for all ages on Arabian horses and camels. Pony rides for children from AED 150. Lahbab desert location.',
    shortDescription:
      'Drift across the sands on an Arabian horse or a desert camel. Gentle guided rides for all ages — including pony rides for the little ones.',
    image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
    alt: 'Camel riding Dubai desert traditional experience Lahbab Arabian horse',
    galleryImages: [
      '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
      '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
      '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
    ],
    fromPrice: 150,
    seoContent:
      'Camel and horse riding in the Dubai desert is a timeless way to connect with the authentic Bedouin culture of the UAE. Our horses are well-trained Arabians and our camels are experienced with visitors of all ages and confidence levels. Rides take place on a guided desert trail adjacent to the main camp, with trained handlers accompanying every session. Children from age 3 can enjoy pony rides with a handler walking alongside at all times.',
    products: [
      {
        slug: 'balade-a-poney-30min',
        title: 'Pony Ride — 30 Minutes',
        description:
          'A gentle, guided pony ride on the desert sands — perfect for children aged 3 and up. Handler present at all times.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
        priceAED: 150,
        priceLabel: 'AED 150 / child',
        durationMinutes: 30,
        seats: 1,
      },
      {
        slug: 'balade-a-cheval-1h',
        title: 'Horse Ride — 1 Hour',
        description:
          'A scenic guided ride through the Lahbab red dunes on an Arabian horse. Suitable for beginners and experienced riders alike.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
        priceAED: 240,
        priceLabel: 'AED 240–280 / person',
        durationMinutes: 60,
        seats: 1,
        badge: 'Best Seller',
      },
    ],
    faq: [
      {
        q: 'Is prior horse riding experience required?',
        a: 'No prior experience is needed. Our guides walk alongside beginners and all rides are conducted at a calm, controlled pace through flat desert terrain.',
      },
      {
        q: 'What is the minimum age for horse and pony riding?',
        a: 'Children aged 3 and above can enjoy supervised pony rides. Horse rides are available from age 8 with parental consent. Adults of all ages are welcome.',
      },
      {
        q: 'Are camel rides available?',
        a: 'Yes — camel rides are included in our evening and morning desert safari packages, or can be arranged as a standalone activity at the camp during operating hours.',
      },
    ],
  },
  {
    slug: 'sandboarding',
    title: 'Sandboarding Dubai',
    seoTitle: 'Sandboarding Dubai | Desert Dune Boarding from AED 90 | All Levels',
    seoDescription:
      'Try sandboarding in the Dubai desert from AED 90 per person. Slide down the Lahbab red sand dunes with all boards and equipment included. Suitable for all ages and experience levels.',
    shortDescription:
      'Strap on a board and carve down the towering red dunes. Equipment and instruction included — suitable for all ages and abilities.',
    image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
    alt: 'Sandboarding Dubai Lahbab red sand dunes desert activity',
    galleryImages: [
      '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
      '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
      '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
    ],
    fromPrice: 90,
    seoContent:
      "Sandboarding in Dubai is one of the most thrilling and accessible adventure activities in the UAE. Using specially designed boards, participants glide down the steep faces of the Lahbab Red Sand Dunes. Sessions begin with a short instruction period before hitting the slopes. The soft sand makes falls painless and the dunes offer gradients for all confidence levels — from gentle beginner slopes to steep expert runs.",
    products: [
      {
        slug: 'sandboarding-group',
        title: 'Sandboarding — Group Session',
        description:
          'Group rate for parties of 4 or more. Private dune zone, dedicated instructor, and group discount applied automatically. Unlimited runs for the session duration.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
        priceAED: 90,
        priceLabel: 'AED 90 / person (4+ guests)',
        durationMinutes: 60,
        seats: 12,
        badge: 'Group Rate',
      },
      {
        slug: 'sandboarding-solo',
        title: 'Sandboarding — Solo Session',
        description:
          'Strap on a board and carve down the iconic red dunes solo or as a pair. Equipment, instruction, and unlimited runs on the designated dune face.',
        image: '/images/desert-adventures/Aristodesert/fleet/aristo-fleet-1.webp',
        priceAED: 120,
        priceLabel: 'AED 120 / person',
        durationMinutes: 60,
        seats: 1,
      },
    ],
    faq: [
      {
        q: 'Is sandboarding in Dubai suitable for beginners?',
        a: 'Absolutely. All sessions begin with equipment fitting and a brief technique demonstration. The sand absorbs falls better than snow, making sandboarding one of the safest board sports to try for the first time.',
      },
      {
        q: 'What should I wear for sandboarding?',
        a: 'Wear comfortable clothing that covers your legs and arms — sand can cause minor friction on exposed skin when learning. Closed-toe shoes are mandatory. A scarf or buff for wind and sand coverage is recommended.',
      },
      {
        q: 'Is sandboarding included in desert safari packages?',
        a: 'Basic sandboarding is occasionally included in group evening safari packages as a short add-on. Dedicated sandboarding sessions guarantee full dune access, equipment, and instructor time for the entire session duration.',
      },
    ],
  },
];

export function getDesertSubcategory(slug: string): DesertSubcategory | undefined {
  return DESERT_SUBCATEGORIES.find((sub) => sub.slug === slug);
}

export function getDesertProduct(subcategorySlug: string, productSlug: string): DesertProduct | undefined {
  const sub = getDesertSubcategory(subcategorySlug);
  return sub?.products.find((p) => p.slug === productSlug);
}

export function isDesertSubcategorySlug(slug: string): slug is DesertSubcategorySlug {
  return (DESERT_SUBCATEGORY_SLUGS as readonly string[]).includes(slug);
}
