import { supabase, isMockMode } from './supabase';
import type {
  ExperienceService,
  ExperienceBooking,
  ExperienceFilters,
  ExperienceBookingInput,
  CapacityResult,
  TimeSlot,
  PricingTier,
} from '../types/experiences';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_EXPERIENCES: ExperienceService[] = [
  // ─── Nightlife ───────────────────────────────────────────────────────────────
  {
    id: 'mock-exp-1',
    subcategory: 'nightlife',
    sub_subcategory: 'rooftop-lounges',
    name: 'Aura Skypool Lounge — Sunset Session',
    slug: 'aura-skypool-sunset-session',
    description_short: 'The world\'s highest 360° infinity pool with panoramic views of the Palm Jumeirah.',
    description_long: 'Experience the iconic Aura Skypool, suspended 200 meters in the air on the 50th floor of the Palm Tower. This sunset session includes premium lounger access, welcome drink, and unparalleled views of the Dubai skyline as the sun dips below the horizon.',
    hero_image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbec6e?q=80&w=800&auto=format&fit=crop',
    ],
    highlights: [
      '360° infinity pool access',
      'Palm Jumeirah skyline views',
      'Premium sun lounger',
      'Welcome champagne cocktail',
    ],
    vibe_tags: ['Luxury', 'Views', 'Instagram-worthy', 'Romantic'],
    service_type: 'recurring',
    pricing_model: 'tiered',
    price_from: 300,
    price_currency: 'AED',
    price_display: 'From AED 300',
    pricing_tiers: [
      { tier: 'Lounge Access', price: 300, description: 'Standard pool access with lounger', includes: ['Pool access', 'Sun lounger', 'Towel service'], max_guests: 1 },
      { tier: 'Premium Lounger', price: 500, description: 'Premium location lounger with fruit platter', includes: ['Premium lounger', 'Welcome drink', 'Fresh fruit platter', 'Towel service'], max_guests: 1 },
      { tier: 'Cabana', price: 1200, description: 'Private cabana for up to 4 guests with dedicated service', includes: ['Private cabana', 'Bottle of champagne', 'Gourmet snacks', 'Priority access'], max_guests: 4 },
    ],
    max_capacity: 120,
    current_bookings: 87,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Daily', start: '15:00', end: '19:00', capacity: 60 },
      { day: 'Daily', start: '19:00', end: '23:00', capacity: 60 },
    ],
    is_recurring: true,
    duration_minutes: 240,
    location: 'Dubai',
    area: 'Palm Jumeirah',
    venue_name: 'Aura Skypool',
    age_minimum: 21,
    dress_code: 'Smart casual. Swimwear acceptable with cover-up.',
    requirements: ['Valid ID', 'Advance booking required'],
    included: ['Pool access', 'Sun lounger', 'Welcome drink', 'Towel service'],
    excluded: ['Food and beverages', 'Spa treatments', 'Transportation'],
    is_featured: true,
    is_trending: true,
    trending_score: 98,
    booking_count: 1247,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-exp-2',
    subcategory: 'nightlife',
    sub_subcategory: 'clubs',
    name: 'WHITE Dubai — VIP Table Experience',
    slug: 'white-dubai-vip-table',
    description_short: 'Dubai\'s ultimate rooftop nightclub with world-class DJs and skyline views.',
    description_long: 'WHITE Dubai is an award-winning outdoor rooftop nightclub at Meydan Racecourse Grandstand. This VIP table experience includes priority entry, premium bottle service, and a private table with unmatched views of the dance floor and Dubai skyline.',
    hero_image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: [
      'VIP skip-the-line entry',
      'Private table with premium location',
      'Bottle service included',
      'World-class DJ performances',
    ],
    vibe_tags: ['Party', 'High-energy', 'Celebrity hotspot', 'Luxury'],
    service_type: 'recurring',
    pricing_model: 'tiered',
    price_from: 1500,
    price_currency: 'AED',
    price_display: 'From AED 1,500',
    pricing_tiers: [
      { tier: 'Standard VIP', price: 1500, description: 'VIP table for up to 4 guests', includes: ['VIP entry', 'Private table', '1 premium bottle', 'Mixers'], max_guests: 4 },
      { tier: 'Premium VIP', price: 3000, description: 'Premium location table for up to 6 guests', includes: ['Priority VIP entry', 'Premium table location', '2 premium bottles', 'Champagne', 'Dedicated host'], max_guests: 6 },
      { tier: 'Presidential', price: 8000, description: 'Best table in the house for up to 10 guests', includes: ['Express entry', 'Best table location', '3 premium bottles', 'Dom Perignon', 'Personal security', 'Private host'], max_guests: 10 },
    ],
    max_capacity: 400,
    current_bookings: 289,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Thursday', start: '23:00', end: '04:00', capacity: 200 },
      { day: 'Friday', start: '23:00', end: '04:00', capacity: 200 },
      { day: 'Saturday', start: '23:00', end: '04:00', capacity: 200 },
    ],
    is_recurring: true,
    duration_minutes: 300,
    location: 'Dubai',
    area: 'Meydan',
    venue_name: 'WHITE Dubai',
    age_minimum: 21,
    dress_code: 'Smart elegant. No sportswear or flip-flops.',
    requirements: ['Valid ID or passport', 'Advance reservation required'],
    included: ['VIP entry', 'Private table', 'Bottle service', 'Mixers'],
    excluded: ['Additional beverages', 'Food', 'Transportation'],
    is_featured: true,
    is_trending: true,
    trending_score: 95,
    booking_count: 2156,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ─── Adventure ───────────────────────────────────────────────────────────────
  {
    id: 'mock-exp-3',
    subcategory: 'adventure',
    sub_subcategory: 'desert-safari',
    name: 'Platinum Desert Safari & Dinner',
    slug: 'platinum-desert-safari-dinner',
    description_short: 'Luxury desert safari with wildlife drive, falcon show, and gourmet dinner under the stars.',
    description_long: 'Experience the Dubai Desert Conservation Reserve in ultimate luxury. This platinum safari includes a private wildlife drive in a Range Rover, interactive falcon demonstration, camel ride, and a 6-course gourmet dinner at an exclusive desert camp with live entertainment.',
    hero_image: 'https://images.unsplash.com/photo-1547234935-80c7142ee969?q=80&w=2674&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1509023464722-18d996393ca8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?q=80&w=800&auto=format&fit=crop',
    ],
    highlights: [
      'Private Range Rover wildlife drive',
      'Interactive falcon demonstration',
      '6-course gourmet dinner',
      'Traditional live entertainment',
    ],
    vibe_tags: ['Adventure', 'Luxury', 'Nature', 'Authentic'],
    service_type: 'recurring',
    pricing_model: 'per_person',
    price_from: 950,
    price_currency: 'AED',
    price_display: 'AED 950 per person',
    pricing_tiers: [
      { tier: 'Standard', price: 950, description: 'Shared wildlife drive experience', max_guests: 1 },
      { tier: 'Private Vehicle', price: 4500, description: 'Private Range Rover for up to 4 guests', max_guests: 4 },
    ],
    max_capacity: 40,
    current_bookings: 28,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Daily', start: '15:00', end: '21:00', capacity: 40 },
    ],
    is_recurring: true,
    duration_minutes: 360,
    location: 'Dubai Desert Conservation Reserve',
    area: 'Lahbab',
    age_minimum: 5,
    requirements: ['Comfortable clothing recommended', 'Hotel pickup included'],
    included: ['Hotel pickup/drop-off', 'Wildlife drive', 'Falcon show', 'Camel ride', 'Dinner', 'Entertainment'],
    excluded: ['Alcoholic beverages', 'Personal expenses', 'Gratuities'],
    is_featured: true,
    is_trending: true,
    trending_score: 92,
    booking_count: 1847,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-exp-4',
    subcategory: 'adventure',
    sub_subcategory: 'skydiving',
    name: 'Skydive Dubai — Tandem Palm Jump',
    slug: 'skydive-dubai-tandem-palm',
    description_short: 'The ultimate adrenaline rush — tandem skydive over the iconic Palm Jumeirah.',
    description_long: 'Experience the world\'s most spectacular skydiving location. Jump from 13,000 feet with a certified instructor and freefall at 120mph over the stunning Palm Jumeirah, with breathtaking views of the Dubai coastline, Burj Al Arab, and the Arabian Gulf.',
    hero_image: 'https://images.unsplash.com/photo-1529661197280-63dc398c6b33?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: [
      'Tandem jump from 13,000 feet',
      '60-second freefall experience',
      'Views of Palm Jumeirah & Burj Al Arab',
      'Professional photos & video included',
    ],
    vibe_tags: ['Adrenaline', 'Bucket-list', 'Extreme', 'Unforgettable'],
    service_type: 'recurring',
    pricing_model: 'per_person',
    price_from: 2599,
    price_currency: 'AED',
    price_display: 'AED 2,599 per person',
    pricing_tiers: [
      { tier: 'Standard', price: 2599, description: 'Tandem jump with photos & video', includes: ['Tandem jump', 'Professional photos', 'Edited video', 'Certificate'], max_guests: 1 },
      { tier: 'Premium', price: 3299, description: 'Jump with dedicated camera flyer', includes: ['Tandem jump', 'Dedicated camera flyer', 'Premium photos', 'Cinematic video edit', 'Certificate', 'Priority scheduling'], max_guests: 1 },
    ],
    max_capacity: 80,
    current_bookings: 67,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Daily', start: '08:00', end: '15:00', capacity: 80 },
    ],
    is_recurring: true,
    duration_minutes: 180,
    location: 'Dubai',
    area: 'Al Seyahi Street',
    venue_name: 'Skydive Dubai',
    age_minimum: 18,
    requirements: ['Weight limit: 100kg max', 'Valid ID required', 'Good health condition'],
    included: ['Tandem jump', 'All equipment', 'Training briefing', 'Photos & video', 'Certificate'],
    excluded: ['Insurance', 'Transportation', 'Additional photos'],
    is_featured: true,
    is_trending: true,
    trending_score: 96,
    booking_count: 3421,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ─── Dining ──────────────────────────────────────────────────────────────────
  {
    id: 'mock-exp-5',
    subcategory: 'dining',
    sub_subcategory: 'chefs-table',
    name: 'Tresind Studio — Chef\'s Table Experience',
    slug: 'tresind-studio-chefs-table',
    description_short: 'Intimate 20-course progressive Indian dining at the Chef\'s Table.',
    description_long: 'Tresind Studio is Dubai\'s most celebrated progressive Indian restaurant, holding two Michelin stars. The Chef\'s Table experience offers an intimate 20-course tasting menu with front-row seats to the kitchen action, personally curated and presented by Chef Himanshu Saini.',
    hero_image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: [
      '20-course progressive tasting menu',
      'Front-row kitchen views',
      'Personal interaction with Chef',
      'Wine pairing available',
    ],
    vibe_tags: ['Fine Dining', 'Michelin-starred', 'Intimate', 'Culinary Art'],
    service_type: 'recurring',
    pricing_model: 'per_person',
    price_from: 1200,
    price_currency: 'AED',
    price_display: 'AED 1,200 per person',
    pricing_tiers: [
      { tier: 'Chef\'s Table', price: 1200, description: '20-course menu with kitchen views', max_guests: 1 },
      { tier: 'With Wine Pairing', price: 1800, description: 'Menu with premium wine pairing', max_guests: 1 },
    ],
    max_capacity: 12,
    current_bookings: 10,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Tuesday', start: '19:00', end: '23:00', capacity: 6 },
      { day: 'Wednesday', start: '19:00', end: '23:00', capacity: 6 },
      { day: 'Thursday', start: '19:00', end: '23:00', capacity: 6 },
      { day: 'Friday', start: '19:00', end: '23:00', capacity: 6 },
      { day: 'Saturday', start: '19:00', end: '23:00', capacity: 6 },
    ],
    is_recurring: true,
    duration_minutes: 240,
    location: 'Dubai',
    area: 'Palm Jumeirah',
    venue_name: 'Tresind Studio',
    age_minimum: 12,
    dress_code: 'Smart elegant',
    requirements: ['Advance booking essential', 'Dietary requirements must be advised'],
    included: ['20-course tasting menu', 'Welcome cocktail', 'Coffee/tea'],
    excluded: ['Wine pairing (optional)', 'Additional beverages', 'Gratuities'],
    is_featured: true,
    is_trending: true,
    trending_score: 94,
    booking_count: 892,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ─── Water ───────────────────────────────────────────────────────────────────
  {
    id: 'mock-exp-6',
    subcategory: 'water',
    sub_subcategory: 'scuba-diving',
    name: 'Atlantis Dive — Shark Safari Experience',
    slug: 'atlantis-dive-shark-safari',
    description_short: 'Dive among sharks, rays, and 65,000 marine animals at Atlantis The Palm.',
    description_long: 'Experience the ultimate underwater adventure at the Ambassador Lagoon, a 11-million-liter marine habitat. The Shark Safari uses specialized helmets that allow you to walk underwater and breathe naturally while surrounded by sharks, rays, and thousands of colorful fish. No diving certification required.',
    hero_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: [
      'Walk underwater in shark tank',
      'No diving certification needed',
      'Professional underwater photos',
      'Marine life education session',
    ],
    vibe_tags: ['Underwater', 'Adventure', 'Family-friendly', 'Unique'],
    service_type: 'recurring',
    pricing_model: 'per_person',
    price_from: 850,
    price_currency: 'AED',
    price_display: 'AED 850 per person',
    pricing_tiers: [
      { tier: 'Shark Safari', price: 850, description: '30-minute underwater walk', includes: ['Safety briefing', 'Helmet dive', '30-min underwater', 'Photos'], max_guests: 1 },
      { tier: 'Certified Dive', price: 1200, description: 'Full dive for certified divers', includes: ['All equipment', '45-min dive', 'Professional guide', 'Photos', 'Video'], max_guests: 1 },
    ],
    max_capacity: 12,
    current_bookings: 8,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Daily', start: '10:00', end: '17:00', capacity: 12 },
    ],
    is_recurring: true,
    duration_minutes: 120,
    location: 'Dubai',
    area: 'Palm Jumeirah',
    venue_name: 'Atlantis The Palm',
    age_minimum: 8,
    requirements: ['Good health condition', 'No diving experience required'],
    included: ['All equipment', 'Safety briefing', 'Underwater walk', 'Photos'],
    excluded: ['Wetsuit rental', 'Additional photos', 'Aquarium entry'],
    is_featured: true,
    is_trending: true,
    trending_score: 89,
    booking_count: 1567,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ─── Sky ─────────────────────────────────────────────────────────────────────
  {
    id: 'mock-exp-7',
    subcategory: 'sky',
    sub_subcategory: 'helicopter-tour',
    name: 'HeliDubai — Iconic Tour (22 min)',
    slug: 'helidubai-iconic-tour',
    description_short: 'Breathtaking helicopter tour over Dubai\'s most iconic landmarks.',
    description_long: 'See Dubai from a whole new perspective with this 22-minute helicopter tour. Soar above the Palm Jumeirah, circle the Burj Al Arab, glide past the World Islands, and witness the towering Burj Khalifa from the sky. An unforgettable experience for any Dubai visitor.',
    hero_image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: [
      '22-minute aerial tour',
      'Views of Burj Khalifa & Palm Jumeirah',
      'Luxury Airbus H130 helicopter',
      'Live commentary from pilot',
    ],
    vibe_tags: ['Views', 'Luxury', 'Photography', 'Bucket-list'],
    service_type: 'recurring',
    pricing_model: 'per_person',
    price_from: 1099,
    price_currency: 'AED',
    price_display: 'AED 1,099 per person',
    pricing_tiers: [
      { tier: 'Shared Flight', price: 1099, description: 'Shared helicopter experience', max_guests: 1 },
      { tier: 'Private Flight', price: 5499, description: 'Private helicopter for up to 5 guests', max_guests: 5 },
    ],
    max_capacity: 25,
    current_bookings: 18,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Daily', start: '09:00', end: '17:00', capacity: 25 },
    ],
    is_recurring: true,
    duration_minutes: 60,
    location: 'Dubai',
    area: 'Dubai Police Academy',
    venue_name: 'HeliDubai',
    age_minimum: 2,
    requirements: ['Valid ID required', 'Weight limit applies'],
    included: ['22-min helicopter tour', 'Safety briefing', 'Live commentary'],
    excluded: ['Transportation', 'Photos (available for purchase)', 'Insurance'],
    is_featured: true,
    is_trending: true,
    trending_score: 91,
    booking_count: 2134,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ─── Wellness ────────────────────────────────────────────────────────────────
  {
    id: 'mock-exp-8',
    subcategory: 'wellness',
    sub_subcategory: 'spa-resort',
    name: 'Talise Ottoman Spa — Royal Hammam Ritual',
    slug: 'talise-ottoman-royal-hammam',
    description_short: 'Luxurious Turkish hammam experience in Dubai\'s largest spa.',
    description_long: 'Immerse yourself in centuries-old Ottoman bathing traditions at Talise Ottoman Spa, one of the largest and most luxurious spas in the Middle East. This 3-hour Royal Hammam ritual includes full body exfoliation, foam massage, mud mask, and relaxation in the opulent marble surroundings.',
    hero_image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: [
      '3-hour royal hammam ritual',
      'Marble hamam chamber',
      'Full body exfoliation & foam massage',
      'Access to spa facilities',
    ],
    vibe_tags: ['Relaxation', 'Luxury', 'Traditional', 'Rejuvenating'],
    service_type: 'recurring',
    pricing_model: 'per_person',
    price_from: 750,
    price_currency: 'AED',
    price_display: 'AED 750 per person',
    pricing_tiers: [
      { tier: 'Royal Hammam', price: 750, description: '3-hour traditional ritual', includes: ['Hammam access', 'Body exfoliation', 'Foam massage', 'Mud mask', 'Relaxation time'], max_guests: 1 },
      { tier: 'Couples Ritual', price: 1400, description: 'Private hammam suite for two', includes: ['Private suite', 'Couples ritual', 'Champagne', 'Fresh fruit', 'Spa products to take home'], max_guests: 2 },
    ],
    max_capacity: 20,
    current_bookings: 12,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Daily', start: '10:00', end: '21:00', capacity: 20 },
    ],
    is_recurring: true,
    duration_minutes: 180,
    location: 'Dubai',
    area: 'Jumeirah Zabeel Saray',
    venue_name: 'Talise Ottoman Spa',
    age_minimum: 16,
    dress_code: 'Spa robes provided',
    requirements: ['Advance booking recommended', 'Arrive 15 minutes early'],
    included: ['Hammam ritual', 'Spa access', 'Towels', 'Slippers', 'Refreshments'],
    excluded: ['Additional treatments', 'Products', 'Gratuities'],
    is_featured: true,
    is_trending: false,
    trending_score: 78,
    booking_count: 743,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ─── Culture ─────────────────────────────────────────────────────────────────
  {
    id: 'mock-exp-9',
    subcategory: 'culture',
    sub_subcategory: 'heritage-walk',
    name: 'Al Fahidi Historical — Old Dubai Walking Tour',
    slug: 'alfahidi-old-dubai-walking-tour',
    description_short: 'Discover the historic heart of Dubai on this guided heritage walk through Al Fahidi.',
    description_long: 'Step back in time and explore Dubai\'s oldest neighborhood, Al Fahidi Historical District. This intimate walking tour takes you through narrow lanes, wind-tower houses, and traditional courtyards. Visit the Coffee Museum, cross the creek by abra, and explore the vibrant souks with an expert local guide.',
    hero_image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: [
      'Guided heritage walk',
      'Coffee Museum visit',
      'Traditional abra boat ride',
      'Gold & Spice Souk exploration',
    ],
    vibe_tags: ['Cultural', 'Educational', 'Authentic', 'Photography'],
    service_type: 'recurring',
    pricing_model: 'per_person',
    price_from: 250,
    price_currency: 'AED',
    price_display: 'AED 250 per person',
    pricing_tiers: [
      { tier: 'Group Tour', price: 250, description: 'Small group tour (max 8)', max_guests: 1 },
      { tier: 'Private Tour', price: 800, description: 'Private guide for up to 4 guests', max_guests: 4 },
    ],
    max_capacity: 16,
    current_bookings: 6,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Daily', start: '09:00', end: '12:00', capacity: 8 },
      { day: 'Daily', start: '16:00', end: '19:00', capacity: 8 },
    ],
    is_recurring: true,
    duration_minutes: 180,
    location: 'Dubai',
    area: 'Bur Dubai',
    venue_name: 'Al Fahidi Historical District',
    age_minimum: 0,
    dress_code: 'Modest dress recommended',
    requirements: ['Comfortable walking shoes', 'Sun protection'],
    included: ['Professional guide', 'Abra ride', 'Water', 'Coffee tasting', 'Souk visits'],
    excluded: ['Meals', 'Personal purchases', 'Gratuities'],
    is_featured: false,
    is_trending: false,
    trending_score: 72,
    booking_count: 428,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ─── Event (Upcoming) ────────────────────────────────────────────────────────
  {
    id: 'mock-exp-10',
    subcategory: 'culture',
    sub_subcategory: 'art-gallery',
    name: 'Dubai Art Season — Exclusive Gallery Night',
    slug: 'dubai-art-season-gallery-night',
    description_short: 'VIP access to Dubai\'s premier art galleries with artist meet-and-greets.',
    description_long: 'An exclusive evening celebrating Dubai\'s vibrant art scene. This curated gallery night provides VIP access to Alserkal Avenue\'s top contemporary galleries, private viewings, artist meet-and-greets, and a champagne reception. Limited tickets available.',
    hero_image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=2574&auto=format&fit=crop',
    gallery_images: [],
    highlights: [
      'VIP gallery access',
      'Artist meet-and-greet',
      'Curator-led tours',
      'Champagne reception',
    ],
    vibe_tags: ['Art', 'Exclusive', 'Cultural', 'Social'],
    service_type: 'event',
    pricing_model: 'per_person',
    price_from: 450,
    price_currency: 'AED',
    price_display: 'AED 450 per person',
    pricing_tiers: [
      { tier: 'General', price: 450, description: 'Gallery access & reception', max_guests: 1 },
      { tier: 'VIP', price: 850, description: 'Early access + artist dinner', includes: ['Early access', 'Artist dinner', 'Limited print', 'Priority seating'], max_guests: 1 },
    ],
    max_capacity: 100,
    current_bookings: 73,
    availability_type: 'date_based',
    time_slots: [],
    event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    is_recurring: false,
    duration_minutes: 240,
    location: 'Dubai',
    area: 'Al Quoz',
    venue_name: 'Alserkal Avenue',
    age_minimum: 18,
    dress_code: 'Smart casual',
    requirements: ['Advance ticket purchase required'],
    included: ['Gallery access', 'Guided tours', 'Champagne reception', 'Art guide'],
    excluded: ['Art purchases', 'Additional drinks', 'Transportation'],
    is_featured: false,
    is_trending: true,
    trending_score: 88,
    booking_count: 73,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ─── Service Functions ────────────────────────────────────────────────────────

export async function getExperiences(filters?: ExperienceFilters): Promise<ExperienceService[]> {
  if (isMockMode) {
    let results = [...MOCK_EXPERIENCES];
    if (filters?.subcategory) results = results.filter(e => e.subcategory === filters.subcategory);
    if (filters?.sub_subcategory) results = results.filter(e => e.sub_subcategory === filters.sub_subcategory);
    if (filters?.service_type) results = results.filter(e => e.service_type === filters.service_type);
    if (filters?.pricing_model) results = results.filter(e => e.pricing_model === filters.pricing_model);
    if (filters?.price_min != null) results = results.filter(e => (e.price_from ?? 0) >= filters.price_min!);
    if (filters?.price_max != null) results = results.filter(e => (e.price_from ?? 0) <= filters.price_max!);
    if (filters?.is_featured != null) results = results.filter(e => e.is_featured === filters.is_featured);
    if (filters?.is_trending != null) results = results.filter(e => e.is_trending === filters.is_trending);
    if (filters?.location) results = results.filter(e => e.location?.toLowerCase().includes(filters.location!.toLowerCase()));
    if (filters?.vibe_tags?.length) {
      results = results.filter(e => filters.vibe_tags!.some(tag => e.vibe_tags.includes(tag)));
    }
    if (filters?.date_from) {
      const fromDate = new Date(filters.date_from);
      results = results.filter(e => !e.event_date || new Date(e.event_date) >= fromDate);
    }
    return results;
  }

  let query = supabase!
    .from('experience_services')
    .select('*')
    .in('status', ['published', 'sold_out'])
    .order('trending_score', { ascending: false });

  if (filters?.subcategory) query = query.eq('subcategory', filters.subcategory);
  if (filters?.sub_subcategory) query = query.eq('sub_subcategory', filters.sub_subcategory);
  if (filters?.service_type) query = query.eq('service_type', filters.service_type);
  if (filters?.pricing_model) query = query.eq('pricing_model', filters.pricing_model);
  if (filters?.price_min != null) query = query.gte('price_from', filters.price_min);
  if (filters?.price_max != null) query = query.lte('price_from', filters.price_max);
  if (filters?.is_featured != null) query = query.eq('is_featured', filters.is_featured);
  if (filters?.is_trending != null) query = query.eq('is_trending', filters.is_trending);
  if (filters?.location) query = query.ilike('location', `%${filters.location}%`);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ExperienceService[];
}

export async function getExperienceBySlug(slug: string): Promise<ExperienceService | null> {
  if (isMockMode) {
    return MOCK_EXPERIENCES.find(e => e.slug === slug) ?? null;
  }

  const { data, error } = await supabase!
    .from('experience_services')
    .select('*')
    .eq('slug', slug)
    .in('status', ['published', 'sold_out'])
    .single();

  if (error) throw error;
  return data as ExperienceService | null;
}

export async function getFeaturedExperiences(subcategory?: string): Promise<ExperienceService[]> {
  if (isMockMode) {
    let results = MOCK_EXPERIENCES.filter(e => e.is_featured);
    if (subcategory) results = results.filter(e => e.subcategory === subcategory);
    return results;
  }

  let query = supabase!
    .from('experience_services')
    .select('*')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('trending_score', { ascending: false })
    .limit(6);

  if (subcategory) query = query.eq('subcategory', subcategory);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ExperienceService[];
}

export async function getTrendingExperiences(limit: number = 6): Promise<ExperienceService[]> {
  if (isMockMode) {
    return MOCK_EXPERIENCES
      .filter(e => e.is_trending)
      .sort((a, b) => b.trending_score - a.trending_score)
      .slice(0, limit);
  }

  const { data, error } = await supabase!
    .from('experience_services')
    .select('*')
    .eq('status', 'published')
    .eq('is_trending', true)
    .order('trending_score', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as ExperienceService[];
}

export async function getUpcomingEvents(limit: number = 4): Promise<ExperienceService[]> {
  if (isMockMode) {
    return MOCK_EXPERIENCES
      .filter(e => e.service_type === 'event' && e.event_date && new Date(e.event_date) > new Date())
      .sort((a, b) => new Date(a.event_date!).getTime() - new Date(b.event_date!).getTime())
      .slice(0, limit);
  }

  const { data, error } = await supabase!
    .from('experience_services')
    .select('*')
    .eq('status', 'published')
    .eq('service_type', 'event')
    .gt('event_date', new Date().toISOString())
    .order('event_date', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as ExperienceService[];
}

// ─── Capacity & Availability ──────────────────────────────────────────────────

export async function checkCapacity(
  serviceId: string,
  date: Date,
  timeSlot?: string
): Promise<CapacityResult> {
  if (isMockMode) {
    const experience = MOCK_EXPERIENCES.find(e => e.id === serviceId);
    if (!experience) {
      return {
        available: false,
        total_capacity: 0,
        booked_count: 0,
        remaining: 0,
        is_filling_up: false,
        percent_full: 0,
      };
    }

    const totalCapacity = experience.max_capacity || 100;
    // Simulate some variance in bookings based on date
    const dayOffset = date.getDate();
    const mockBooked = Math.min(experience.current_bookings + (dayOffset % 10), totalCapacity);
    const remaining = Math.max(0, totalCapacity - mockBooked);
    const percentFull = (mockBooked / totalCapacity) * 100;

    return {
      available: remaining > 0,
      total_capacity: totalCapacity,
      booked_count: mockBooked,
      remaining,
      is_filling_up: percentFull > 75,
      percent_full: Math.round(percentFull),
    };
  }

  const { data, error } = await supabase!
    .rpc('check_experience_capacity', {
      p_service_id: serviceId,
      p_date: date.toISOString().split('T')[0],
      p_time_slot: timeSlot,
    });

  if (error) throw error;
  return data as CapacityResult;
}

export async function getAvailableSlots(serviceId: string, date: Date): Promise<TimeSlot[]> {
  if (isMockMode) {
    const experience = MOCK_EXPERIENCES.find(e => e.id === serviceId);
    if (!experience || !experience.time_slots.length) {
      return [];
    }

    // Generate slots based on experience's time slot configuration
    const slots: TimeSlot[] = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[date.getDay()];

    for (const config of experience.time_slots) {
      if (config.day === 'Daily' || config.day === dayName) {
        const capacity = await checkCapacity(serviceId, date, config.start);
        slots.push({
          time: config.start,
          label: `${config.start} - ${config.end}`,
          available: capacity.remaining > 0,
          remaining_capacity: capacity.remaining,
        });
      }
    }

    return slots;
  }

  const { data, error } = await supabase!
    .rpc('get_experience_slots', {
      p_service_id: serviceId,
      p_date: date.toISOString().split('T')[0],
    });

  if (error) throw error;
  return (data ?? []) as TimeSlot[];
}

// ─── Booking Functions ────────────────────────────────────────────────────────

export function generateTicketCode(bookingId: string): string {
  // Format: DALC-XXXX-XXXX (8 random alphanumeric characters)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding similar chars like 0, O, 1, I
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `DALC-${code.slice(0, 4)}-${code.slice(4)}`;
}

export async function createExperienceBooking(input: ExperienceBookingInput): Promise<ExperienceBooking> {
  if (isMockMode) {
    const experience = MOCK_EXPERIENCES.find(e => e.id === input.service_id);
    const bookingId = `mock-exp-booking-${Date.now()}`;

    return {
      id: bookingId,
      service_id: input.service_id,
      user_id: input.user_id,
      booking_date: input.booking_date,
      time_slot: input.time_slot,
      party_size: input.party_size,
      tier: input.tier,
      unit_price: input.unit_price,
      total_price: input.total_price,
      currency: 'AED',
      ticket_code: generateTicketCode(bookingId),
      ticket_status: 'active',
      status: 'confirmed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      service: experience,
    } as ExperienceBooking;
  }

  const ticketCode = generateTicketCode(input.service_id);

  const { data, error } = await supabase!
    .from('experience_bookings')
    .insert({
      service_id: input.service_id,
      user_id: input.user_id,
      booking_date: input.booking_date,
      time_slot: input.time_slot,
      party_size: input.party_size,
      tier: input.tier,
      unit_price: input.unit_price,
      total_price: input.total_price,
      currency: 'AED',
      ticket_code: ticketCode,
      ticket_status: 'active',
      status: 'confirmed',
    })
    .select('*, service:experience_services(*)')
    .single();

  if (error) throw error;
  return data as ExperienceBooking;
}

export async function getUserExperienceBookings(userId: string): Promise<ExperienceBooking[]> {
  if (isMockMode) return [] as ExperienceBooking[];

  const { data, error } = await supabase!
    .from('experience_bookings')
    .select('*, service:experience_services(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as ExperienceBooking[];
}
