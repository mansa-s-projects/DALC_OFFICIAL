import { supabase } from './supabase';
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

export const MOCK_EXPERIENCES: ExperienceService[] = [
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
  {
    id: 'mock-exp-water-1',
    subcategory: 'water',
    sub_subcategory: 'jet-ski',
    name: 'Yamaha VX Deluxe 1050cc — Jet Ski Ride',
    slug: 'yamaha-vx-deluxe-jet-ski',
    description_short: 'Entry-level thrill on the Arabian Gulf — the Yamaha VX Deluxe delivers smooth power for all skill levels.',
    description_long: 'Jump on the Yamaha VX Deluxe 1050cc — the perfect entry point for jet ski enthusiasts. Whether you\'re a first-timer or a seasoned rider, the VX Deluxe offers a comfortable, nimble ride across the crystal waters of the Dubai coastline. Available in 30, 60, 90, and 120-minute sessions from the JBR launch point.',
    hero_image: 'https://images.unsplash.com/photo-1530870110042-98b2cb110834?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: ['1050cc 4-stroke engine', 'Suitable for beginners', 'JBR coastline route', 'Life jacket & safety brief included'],
    vibe_tags: ['Adrenaline', 'Water Sports', 'Beach', 'Fun'],
    service_type: 'on_demand',
    pricing_model: 'tiered',
    price_from: 250,
    price_currency: 'AED',
    price_display: 'From AED 250',
    pricing_tiers: [
      { tier: '30 Minutes', price: 250, description: '30-min coastal ride', max_guests: 1 },
      { tier: '60 Minutes', price: 450, description: '1-hour extended cruise', max_guests: 1 },
      { tier: '90 Minutes', price: 600, description: '90-min explorer session', max_guests: 1 },
      { tier: '120 Minutes', price: 750, description: '2-hour full experience', max_guests: 1 },
    ],
    max_capacity: 10,
    current_bookings: 4,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Daily', start: '08:00', end: '18:00', capacity: 10 },
    ],
    is_recurring: true,
    duration_minutes: 30,
    location: 'Dubai',
    area: 'JBR Beach',
    venue_name: 'DALC Water Sports',
    age_minimum: 16,
    requirements: ['Valid ID', 'Life jacket provided', 'Brief safety training'],
    included: ['Jet ski rental', 'Life jacket', 'Safety briefing', 'Fuel'],
    excluded: ['Photos', 'Insurance', 'Transportation'],
    is_featured: false,
    is_trending: false,
    trending_score: 70,
    booking_count: 312,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-exp-water-2',
    subcategory: 'water',
    sub_subcategory: 'jet-ski',
    name: 'Yamaha JetBlaster — Jet Ski Ride',
    slug: 'yamaha-jetblaster-jet-ski',
    description_short: 'Compact, agile, and built for fun — the JetBlaster is the ultimate play machine on the water.',
    description_long: 'The Yamaha JetBlaster is designed for pure entertainment. Its lightweight hull and responsive handling make it the most playful jet ski in the fleet. Perfect for riders who want sharp turns, quick acceleration, and non-stop smiles along the Dubai Marina coastline.',
    hero_image: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: ['Ultra-agile handling', 'Lightweight performance hull', 'Spray & splash mode', 'Perfect for experienced riders'],
    vibe_tags: ['Adrenaline', 'Water Sports', 'Fun', 'Active'],
    service_type: 'on_demand',
    pricing_model: 'tiered',
    price_from: 290,
    price_currency: 'AED',
    price_display: 'From AED 290',
    pricing_tiers: [
      { tier: '30 Minutes', price: 290, description: '30-min blast session', max_guests: 1 },
      { tier: '60 Minutes', price: 490, description: '1-hour action ride', max_guests: 1 },
      { tier: '90 Minutes', price: 640, description: '90-min extended play', max_guests: 1 },
      { tier: '120 Minutes', price: 790, description: '2-hour full session', max_guests: 1 },
    ],
    max_capacity: 8,
    current_bookings: 3,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Daily', start: '08:00', end: '18:00', capacity: 8 },
    ],
    is_recurring: true,
    duration_minutes: 30,
    location: 'Dubai',
    area: 'JBR Beach',
    venue_name: 'DALC Water Sports',
    age_minimum: 18,
    requirements: ['Valid ID', 'Swimming ability recommended'],
    included: ['Jet ski rental', 'Life jacket', 'Safety briefing', 'Fuel'],
    excluded: ['Photos', 'Insurance', 'Transportation'],
    is_featured: false,
    is_trending: true,
    trending_score: 75,
    booking_count: 289,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-exp-water-3',
    subcategory: 'water',
    sub_subcategory: 'jet-ski',
    name: 'Yamaha GP HO 1900cc — Jet Ski Ride',
    slug: 'yamaha-gp-ho-jet-ski',
    description_short: 'Race-grade power on the open water — the GP HO 1900cc is for riders who crave speed.',
    description_long: 'The Yamaha GP HO 1900cc is built for performance. With a high-output 1.8L engine and a hull designed for competitive racing, this jet ski delivers raw speed and precision handling. Ride the same platform used by professional riders along the stunning Dubai coastline.',
    hero_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: ['1900cc high-output engine', 'Race-grade hull', 'Top speeds 65+ mph', 'Pro-level performance'],
    vibe_tags: ['Adrenaline', 'Speed', 'Performance', 'Extreme'],
    service_type: 'on_demand',
    pricing_model: 'tiered',
    price_from: 350,
    price_currency: 'AED',
    price_display: 'From AED 350',
    pricing_tiers: [
      { tier: '30 Minutes', price: 350, description: '30-min speed session', max_guests: 1 },
      { tier: '60 Minutes', price: 600, description: '1-hour performance ride', max_guests: 1 },
      { tier: '90 Minutes', price: 750, description: '90-min extended run', max_guests: 1 },
      { tier: '120 Minutes', price: 890, description: '2-hour endurance ride', max_guests: 1 },
    ],
    max_capacity: 6,
    current_bookings: 2,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Daily', start: '08:00', end: '18:00', capacity: 6 },
    ],
    is_recurring: true,
    duration_minutes: 30,
    location: 'Dubai',
    area: 'JBR Beach',
    venue_name: 'DALC Water Sports',
    age_minimum: 18,
    requirements: ['Valid ID', 'Prior jet ski experience recommended', 'Swimming ability required'],
    included: ['Jet ski rental', 'Life jacket', 'Safety briefing', 'Fuel'],
    excluded: ['Photos', 'Insurance', 'Transportation'],
    is_featured: true,
    is_trending: true,
    trending_score: 82,
    booking_count: 198,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-exp-water-4',
    subcategory: 'water',
    sub_subcategory: 'jet-ski',
    name: 'Yamaha FX SVHO 260HP — Premium Jet Ski',
    slug: 'yamaha-fx-svho-premium-jet-ski',
    description_short: 'The flagship Yamaha FX SVHO — 260 horsepower of supercharged luxury on the water.',
    description_long: 'The Yamaha FX SVHO is the pinnacle of jet ski engineering. A supercharged 1.8-liter engine producing 260HP, combined with luxury cruise features like adjustable trim, no-wake mode, and a premium NanoXcel hull. This is the Dubai experience for riders who demand the absolute best.',
    hero_image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: ['260HP supercharged engine', 'NanoXcel premium hull', 'Adjustable electronic trim', 'Cruise control & no-wake mode'],
    vibe_tags: ['Luxury', 'Speed', 'Premium', 'VIP'],
    service_type: 'on_demand',
    pricing_model: 'tiered',
    price_from: 499,
    price_currency: 'AED',
    price_display: 'From AED 499',
    pricing_tiers: [
      { tier: '30 Minutes', price: 499, description: '30-min VIP ride', max_guests: 1 },
      { tier: '60 Minutes', price: 749, description: '1-hour premium cruise', max_guests: 1 },
      { tier: '90 Minutes', price: 799, description: '90-min luxury session', max_guests: 1 },
      { tier: '120 Minutes', price: 999, description: '2-hour full SVHO experience', max_guests: 1 },
    ],
    max_capacity: 4,
    current_bookings: 2,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Daily', start: '08:00', end: '18:00', capacity: 4 },
    ],
    is_recurring: true,
    duration_minutes: 30,
    location: 'Dubai',
    area: 'Palm Jumeirah Marina',
    venue_name: 'DALC Water Sports',
    age_minimum: 21,
    dress_code: 'Swimwear with sun protection',
    requirements: ['Valid ID', 'Prior jet ski experience required', 'Swimming ability required'],
    included: ['Premium jet ski rental', 'Life jacket', 'VIP safety briefing', 'Fuel', 'GoPro available'],
    excluded: ['GoPro footage transfer', 'Insurance', 'Transportation'],
    is_featured: true,
    is_trending: true,
    trending_score: 88,
    booking_count: 156,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-exp-water-5',
    subcategory: 'water',
    sub_subcategory: 'water-car',
    name: 'Jetcar — Drive on Water',
    slug: 'jetcar-drive-on-water',
    description_short: 'The world\'s first water car — drive a jet-powered supercar across the Arabian Gulf.',
    description_long: 'The Jetcar is unlike anything you\'ve experienced. Built to resemble a sports car but powered by a marine jet engine, it lets you literally drive on water at thrilling speeds. Drift, spin, and cruise along the Dubai Marina coastline in this head-turning, Instagram-breaking machine.',
    hero_image: 'https://images.unsplash.com/photo-1476673160081-cf065bc4e7ce?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: ['World\'s first water car', 'Jet-powered supercar body', 'No license required', 'Dubai Marina coastline route'],
    vibe_tags: ['Unique', 'Adrenaline', 'Instagram', 'VIP', 'One-of-a-kind'],
    service_type: 'on_demand',
    pricing_model: 'tiered',
    price_from: 600,
    price_currency: 'AED',
    price_display: 'From AED 600',
    pricing_tiers: [
      { tier: '20 Minutes', price: 600, description: '20-min taster ride', max_guests: 1 },
      { tier: '30 Minutes', price: 900, description: '30-min full experience', max_guests: 1 },
      { tier: '60 Minutes', price: 1300, description: '1-hour extended session', max_guests: 1 },
    ],
    max_capacity: 3,
    current_bookings: 2,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Daily', start: '09:00', end: '17:00', capacity: 3 },
    ],
    is_recurring: true,
    duration_minutes: 20,
    location: 'Dubai',
    area: 'Dubai Marina',
    venue_name: 'DALC Water Sports',
    age_minimum: 16,
    requirements: ['Valid ID', 'Brief orientation included'],
    included: ['Jetcar rental', 'Life jacket', 'Orientation session', 'Fuel'],
    excluded: ['Photos/video', 'Insurance', 'Transportation'],
    is_featured: true,
    is_trending: true,
    trending_score: 95,
    booking_count: 423,
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

  // ─── Additional Wellness Experiences ─────────────────────────────────────────
  {
    id: 'mock-exp-wellness-2',
    subcategory: 'wellness',
    sub_subcategory: 'spa-resort',
    name: 'Anantara Spa — Desert Rose Ritual',
    slug: 'anantara-desert-rose-ritual',
    description_short: 'Luxurious 2-hour spa journey inspired by Bedouin healing traditions.',
    description_long: 'Experience the ancient healing traditions of the desert at Anantara The Palm Dubai Resort. The Desert Rose Ritual combines Arabian essential oils, desert sand exfoliation, and a full-body massage using warmed stones from the nearby desert. A truly transformative wellness experience.',
    hero_image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: ['2-hour ritual', 'Arabian essential oils', 'Desert sand exfoliation', 'Hot stone massage'],
    vibe_tags: ['Relaxation', 'Luxury', 'Traditional', 'Healing'],
    service_type: 'recurring',
    pricing_model: 'per_person',
    price_from: 850,
    price_currency: 'AED',
    price_display: 'AED 850 per person',
    pricing_tiers: [
      { tier: 'Standard', price: 850, description: '2-hour Desert Rose Ritual', max_guests: 1 },
      { tier: 'Couples Experience', price: 1600, description: 'Side-by-side ritual for two', max_guests: 2 },
    ],
    max_capacity: 12,
    current_bookings: 5,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Daily', start: '10:00', end: '12:00', capacity: 4 },
      { day: 'Daily', start: '14:00', end: '16:00', capacity: 4 },
      { day: 'Daily', start: '16:00', end: '18:00', capacity: 4 },
    ],
    is_recurring: true,
    duration_minutes: 120,
    location: 'Dubai',
    area: 'Palm Jumeirah',
    venue_name: 'Anantara The Palm',
    age_minimum: 18,
    dress_code: 'Robe provided',
    requirements: ['Advance booking recommended'],
    included: ['Spa ritual', 'Spa access', 'Refreshments', 'Robe & slippers'],
    excluded: ['Additional treatments', 'Products', 'Gratuities'],
    is_featured: true,
    is_trending: true,
    trending_score: 85,
    booking_count: 432,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-exp-wellness-3',
    subcategory: 'wellness',
    sub_subcategory: 'yoga-retreat',
    name: 'Desert Yoga & Meditation Retreat',
    slug: 'desert-yoga-meditation-retreat',
    description_short: 'Sunrise yoga and guided meditation in the tranquil Dubai desert.',
    description_long: 'Find inner peace in the heart of the desert with this transformative sunrise yoga experience. Led by certified instructors, the session includes gentle yoga flows, guided meditation, and breathing exercises surrounded by the serene beauty of the Dubai desert landscape.',
    hero_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: ['Sunrise yoga session', 'Guided meditation', 'Desert setting', 'Healthy breakfast included'],
    vibe_tags: ['Wellness', 'Nature', 'Mindfulness', 'Sunrise'],
    service_type: 'recurring',
    pricing_model: 'per_person',
    price_from: 450,
    price_currency: 'AED',
    price_display: 'AED 450 per person',
    pricing_tiers: [
      { tier: 'Yoga Only', price: 450, description: '2-hour sunrise session', max_guests: 1 },
      { tier: 'Full Retreat', price: 650, description: 'Yoga + Meditation + Breakfast', max_guests: 1 },
    ],
    max_capacity: 20,
    current_bookings: 12,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Daily', start: '06:00', end: '08:00', capacity: 20 },
    ],
    is_recurring: true,
    duration_minutes: 120,
    location: 'Dubai Desert Conservation Reserve',
    area: 'Lahbab',
    venue_name: 'Desert Retreat Camp',
    age_minimum: 16,
    dress_code: 'Comfortable yoga wear',
    requirements: ['Some yoga experience helpful', 'Bring water'],
    included: ['Yoga session', 'Meditation', 'Yoga mat', 'Healthy breakfast (Full Retreat)', 'Transport'],
    excluded: ['Personal items', 'Additional meals'],
    is_featured: true,
    is_trending: true,
    trending_score: 90,
    booking_count: 567,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-exp-wellness-4',
    subcategory: 'wellness',
    sub_subcategory: 'spa-resort',
    name: 'Royal Hammam Experience at Talise Ottoman',
    slug: 'royal-hammam-talise-ottoman',
    description_short: 'Authentic Turkish hammam ritual in Dubai largest spa.',
    description_long: 'Immerse yourself in centuries-old Ottoman bathing traditions at Talise Ottoman Spa. This 3-hour Royal Hammam ritual includes full body exfoliation, foam massage, mud mask, and relaxation in the opulent marble surroundings of one of the Middle East most luxurious spas.',
    hero_image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: ['3-hour royal ritual', 'Marble hamam chamber', 'Full body exfoliation', 'Spa access'],
    vibe_tags: ['Relaxation', 'Luxury', 'Traditional', 'Rejuvenating'],
    service_type: 'recurring',
    pricing_model: 'per_person',
    price_from: 750,
    price_currency: 'AED',
    price_display: 'AED 750 per person',
    pricing_tiers: [
      { tier: 'Royal Hammam', price: 750, description: '3-hour traditional ritual', max_guests: 1 },
      { tier: 'Couples Ritual', price: 1400, description: 'Private hammam suite for two', max_guests: 2 },
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
    is_trending: true,
    trending_score: 78,
    booking_count: 743,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-exp-wellness-5',
    subcategory: 'wellness',
    sub_subcategory: 'spa-resort',
    name: 'Float Therapy at Zero Gravity',
    slug: 'float-therapy-zero-gravity',
    description_short: 'Weightless sensory deprivation floatation therapy for deep relaxation.',
    description_long: 'Experience true weightlessness in our state-of-the-art floatation pods. Filled with Epsom salt-saturated water, these pods allow you to float effortlessly while eliminating all external stimuli. Perfect for deep relaxation, stress relief, and mental clarity.',
    hero_image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6e?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: ['60-minute float session', 'Sensory deprivation', 'Epsom salt therapy', 'Private suites'],
    vibe_tags: ['Wellness', 'Relaxation', 'Healing', 'Mental clarity'],
    service_type: 'recurring',
    pricing_model: 'per_person',
    price_from: 350,
    price_currency: 'AED',
    price_display: 'AED 350 per session',
    pricing_tiers: [
      { tier: 'Single Session', price: 350, description: '60-minute float', max_guests: 1 },
      { tier: 'Package of 3', price: 900, description: '3 x 60-minute sessions', max_guests: 1 },
    ],
    max_capacity: 6,
    current_bookings: 3,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Daily', start: '10:00', end: '22:00', capacity: 6 },
    ],
    is_recurring: true,
    duration_minutes: 90,
    location: 'Dubai',
    area: 'Dubai Marina',
    venue_name: 'Zero Gravity Wellness',
    age_minimum: 18,
    dress_code: 'Swimwear or nude (private)',
    requirements: ['No open wounds', 'Shower before session'],
    included: ['Float session', 'Private suite', 'Shower facilities', 'Relaxation lounge access'],
    excluded: ['Spa products', 'Food & beverages'],
    is_featured: false,
    is_trending: true,
    trending_score: 82,
    booking_count: 298,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-exp-wellness-6',
    subcategory: 'wellness',
    sub_subcategory: 'yoga-retreat',
    name: 'Sound Healing Session',
    slug: 'sound-healing-session',
    description_short: 'Therapeutic sound bath using Tibetan bowls and crystal frequencies.',
    description_long: 'Immerse yourself in the healing vibrations of Tibetan singing bowls, crystal bowls, and gongs. This guided sound healing session promotes deep relaxation, reduces stress and anxiety, and helps restore balance to your mind and body.',
    hero_image: 'https://images.unsplash.com/photo-1515894203077-9cd36032142f?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: ['90-minute session', 'Tibetan & crystal bowls', 'Guided meditation', 'Group setting'],
    vibe_tags: ['Wellness', 'Healing', 'Meditation', 'Relaxation'],
    service_type: 'recurring',
    pricing_model: 'per_person',
    price_from: 280,
    price_currency: 'AED',
    price_display: 'AED 280 per person',
    pricing_tiers: [
      { tier: 'Group Session', price: 280, description: 'Up to 12 participants', max_guests: 1 },
      { tier: 'Private Session', price: 800, description: 'One-on-one sound healing', max_guests: 1 },
    ],
    max_capacity: 12,
    current_bookings: 7,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Monday', start: '19:00', end: '20:30', capacity: 12 },
      { day: 'Wednesday', start: '19:00', end: '20:30', capacity: 12 },
      { day: 'Friday', start: '10:00', end: '11:30', capacity: 12 },
      { day: 'Sunday', start: '18:00', end: '19:30', capacity: 12 },
    ],
    is_recurring: true,
    duration_minutes: 90,
    location: 'Dubai',
    area: 'Jumeirah',
    venue_name: 'Harmony Wellness Center',
    age_minimum: 16,
    dress_code: 'Comfortable clothing',
    requirements: ['Arrive 10 minutes early'],
    included: ['Sound healing session', 'Meditation cushions', 'Herbal tea'],
    excluded: ['Private sessions by appointment'],
    is_featured: false,
    is_trending: true,
    trending_score: 79,
    booking_count: 345,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ─── Additional Culture Experiences ──────────────────────────────────────────
  {
    id: 'mock-exp-culture-2',
    subcategory: 'culture',
    sub_subcategory: 'museum-tour',
    name: 'Museum of the Future — Private Guided Tour',
    slug: 'museum-future-private-tour',
    description_short: 'Exclusive after-hours access to Dubai most iconic museum.',
    description_long: 'Experience the Museum of the Future like never before with a private guided tour after public hours. This exclusive access allows you to explore the immersive exhibits without crowds, with a dedicated guide explaining the vision of tomorrow technologies and innovations.',
    hero_image: 'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: ['After-hours access', 'Private guide', 'Immersive exhibits', 'No crowds'],
    vibe_tags: ['Culture', 'Technology', 'Exclusive', 'Educational'],
    service_type: 'recurring',
    pricing_model: 'per_person',
    price_from: 650,
    price_currency: 'AED',
    price_display: 'AED 650 per person',
    pricing_tiers: [
      { tier: 'Private Tour', price: 650, description: '2-hour guided experience', max_guests: 1 },
      { tier: 'VIP Experience', price: 1200, description: 'Tour + Exclusive lounge + Gift', max_guests: 1 },
    ],
    max_capacity: 15,
    current_bookings: 8,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Tuesday', start: '18:00', end: '20:00', capacity: 15 },
      { day: 'Thursday', start: '18:00', end: '20:00', capacity: 15 },
      { day: 'Saturday', start: '18:00', end: '20:00', capacity: 15 },
    ],
    is_recurring: true,
    duration_minutes: 120,
    location: 'Dubai',
    area: 'Sheikh Zayed Road',
    venue_name: 'Museum of the Future',
    age_minimum: 0,
    dress_code: 'Smart casual',
    requirements: ['Advance booking essential'],
    included: ['Private tour', 'Expert guide', 'Museum entry', 'Souvenir'],
    excluded: ['Food & beverages', 'Transportation'],
    is_featured: true,
    is_trending: true,
    trending_score: 93,
    booking_count: 892,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-exp-culture-3',
    subcategory: 'culture',
    sub_subcategory: 'heritage-walk',
    name: 'Old Dubai Creek & Gold Souk Walking Tour',
    slug: 'old-dubai-creek-gold-souk-walk',
    description_short: 'Journey through historic Dubai from the creek to the famous Gold Souk.',
    description_long: 'Step back in time and explore the historic heart of Dubai. Begin at the bustling Dubai Creek, cross by traditional abra boat, and wander through the labyrinthine alleys of the Gold Souk and Spice Souk. Learn about the city trading heritage and haggle for treasures.',
    hero_image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: ['Abras boat ride', 'Gold Souk visit', 'Spice Souk exploration', 'Expert local guide'],
    vibe_tags: ['Culture', 'History', 'Shopping', 'Photography'],
    service_type: 'recurring',
    pricing_model: 'per_person',
    price_from: 320,
    price_currency: 'AED',
    price_display: 'AED 320 per person',
    pricing_tiers: [
      { tier: 'Group Tour', price: 320, description: 'Small group (max 8)', max_guests: 1 },
      { tier: 'Private Tour', price: 950, description: 'Private guide for up to 4', max_guests: 4 },
    ],
    max_capacity: 16,
    current_bookings: 10,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Daily', start: '09:00', end: '12:00', capacity: 8 },
      { day: 'Daily', start: '16:00', end: '19:00', capacity: 8 },
    ],
    is_recurring: true,
    duration_minutes: 180,
    location: 'Dubai',
    area: 'Deira',
    venue_name: 'Dubai Creek',
    age_minimum: 0,
    dress_code: 'Modest dress recommended',
    requirements: ['Comfortable walking shoes', 'Sun protection'],
    included: ['Guide', 'Abra ride', 'Water', 'Tea', 'Souk visits'],
    excluded: ['Meals', 'Purchases', 'Gratuities'],
    is_featured: true,
    is_trending: true,
    trending_score: 86,
    booking_count: 723,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-exp-culture-4',
    subcategory: 'culture',
    sub_subcategory: 'art-gallery',
    name: 'Alserkal Avenue Arts District Tour',
    slug: 'alserkal-avenue-arts-tour',
    description_short: 'Contemporary art tour through Dubai creative hub in Al Quoz.',
    description_long: 'Discover Dubai thriving contemporary art scene with a curated tour of Alserkal Avenue. Visit cutting-edge galleries, meet local artists, and learn about the transformation of this industrial area into the UAE premier arts destination. Includes stops at 4-5 galleries.',
    hero_image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: ['Gallery visits', 'Artist meet-and-greets', 'Curator insights', 'Contemporary art focus'],
    vibe_tags: ['Art', 'Culture', 'Contemporary', 'Educational'],
    service_type: 'recurring',
    pricing_model: 'per_person',
    price_from: 380,
    price_currency: 'AED',
    price_display: 'AED 380 per person',
    pricing_tiers: [
      { tier: 'Standard Tour', price: 380, description: '3-hour gallery tour', max_guests: 1 },
      { tier: 'Collector Experience', price: 750, description: 'Private tour + artist studio visit', max_guests: 1 },
    ],
    max_capacity: 12,
    current_bookings: 6,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Tuesday', start: '10:00', end: '13:00', capacity: 12 },
      { day: 'Thursday', start: '16:00', end: '19:00', capacity: 12 },
      { day: 'Saturday', start: '10:00', end: '13:00', capacity: 12 },
    ],
    is_recurring: true,
    duration_minutes: 180,
    location: 'Dubai',
    area: 'Al Quoz',
    venue_name: 'Alserkal Avenue',
    age_minimum: 12,
    dress_code: 'Smart casual',
    requirements: ['Interest in contemporary art'],
    included: ['Gallery entries', 'Expert guide', 'Refreshments', 'Art guide booklet'],
    excluded: ['Art purchases', 'Transportation'],
    is_featured: true,
    is_trending: true,
    trending_score: 84,
    booking_count: 456,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-exp-culture-5',
    subcategory: 'culture',
    sub_subcategory: 'heritage-walk',
    name: 'Arabic Calligraphy Workshop',
    slug: 'arabic-calligraphy-workshop',
    description_short: 'Learn the ancient art of Arabic calligraphy from a master artist.',
    description_long: 'Discover the beauty of Arabic script in this hands-on calligraphy workshop. Led by a master calligrapher, you will learn the basics of the Thuluth script, practice brush techniques, and create your own calligraphic artwork to take home.',
    hero_image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: ['Hands-on instruction', 'Thuluth script basics', 'Take-home artwork', 'All materials provided'],
    vibe_tags: ['Culture', 'Art', 'Educational', 'Hands-on'],
    service_type: 'recurring',
    pricing_model: 'per_person',
    price_from: 420,
    price_currency: 'AED',
    price_display: 'AED 420 per person',
    pricing_tiers: [
      { tier: 'Workshop', price: 420, description: '2.5-hour session', max_guests: 1 },
      { tier: 'Private Lesson', price: 900, description: 'One-on-one with master', max_guests: 1 },
    ],
    max_capacity: 10,
    current_bookings: 5,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Wednesday', start: '14:00', end: '16:30', capacity: 10 },
      { day: 'Friday', start: '10:00', end: '12:30', capacity: 10 },
      { day: 'Sunday', start: '14:00', end: '16:30', capacity: 10 },
    ],
    is_recurring: true,
    duration_minutes: 150,
    location: 'Dubai',
    area: 'Al Fahidi',
    venue_name: 'Calligraphy House',
    age_minimum: 12,
    dress_code: 'Comfortable clothing (ink may stain)',
    requirements: ['No prior experience needed'],
    included: ['Materials', 'Instruction', 'Take-home piece', 'Tea'],
    excluded: ['Additional materials', 'Frame'],
    is_featured: false,
    is_trending: true,
    trending_score: 81,
    booking_count: 267,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-exp-culture-6',
    subcategory: 'culture',
    sub_subcategory: 'heritage-walk',
    name: 'Desert Bedouin Camp Overnight',
    slug: 'desert-bedouin-overnight',
    description_short: 'Authentic overnight desert experience with Bedouin hospitality.',
    description_long: 'Spend a magical night in the desert at an authentic Bedouin camp. Arrive for sunset, enjoy traditional activities like camel rides and falconry, savor an Emirati dinner under the stars, sleep in a traditional tent, and wake to sunrise over the dunes with breakfast.',
    hero_image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    highlights: ['Overnight in desert', 'Bedouin camp', 'Traditional activities', 'Sunset & sunrise'],
    vibe_tags: ['Culture', 'Adventure', 'Authentic', 'Nature'],
    service_type: 'recurring',
    pricing_model: 'per_person',
    price_from: 1200,
    price_currency: 'AED',
    price_display: 'AED 1,200 per person',
    pricing_tiers: [
      { tier: 'Shared Camp', price: 1200, description: 'Shared tent experience', max_guests: 1 },
      { tier: 'Private Tent', price: 1800, description: 'Private luxury tent', max_guests: 2 },
    ],
    max_capacity: 30,
    current_bookings: 18,
    availability_type: 'time_slot',
    time_slots: [
      { day: 'Daily', start: '15:00', end: '09:00', capacity: 30 },
    ],
    is_recurring: true,
    duration_minutes: 1080,
    location: 'Dubai Desert Conservation Reserve',
    area: 'Lahbab',
    venue_name: 'Bedouin Heritage Camp',
    age_minimum: 6,
    dress_code: 'Comfortable clothing, warm layers for night',
    requirements: ['Basic fitness for sand walking'],
    included: ['Tent', 'Dinner', 'Breakfast', 'Activities', 'Transportation'],
    excluded: ['Alcoholic beverages', 'Personal items'],
    is_featured: true,
    is_trending: true,
    trending_score: 89,
    booking_count: 634,
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
  let query = supabase
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
  const { data, error } = await supabase
    .from('experience_services')
    .select('*')
    .eq('slug', slug)
    .in('status', ['published', 'sold_out'])
    .single();

  if (error) throw error;
  return data as ExperienceService | null;
}

export async function getFeaturedExperiences(subcategory?: string): Promise<ExperienceService[]> {
  let query = supabase
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
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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
  const dateStr = date.toISOString().split('T')[0];
  const query = supabase
    .from('experience_bookings')
    .select('party_size')
    .eq('service_id', serviceId)
    .eq('booking_date', dateStr)
    .neq('status', 'cancelled');

  if (timeSlot) {
    query.eq('time_slot', timeSlot);
  }

  const { data: bookings, error } = await query;
  if (error) throw error;

  let bookedCount = 0;
  if (bookings) {
    for (const b of bookings) bookedCount += (b.party_size || 1);
  }

  const { data: service } = await supabase
    .from('experience_services')
    .select('max_capacity')
    .eq('id', serviceId)
    .single();

  const totalCapacity = service?.max_capacity || 100;
  const remaining = Math.max(0, totalCapacity - bookedCount);
  const percentFull = (bookedCount / totalCapacity) * 100;

  return {
    available: remaining > 0,
    total_capacity: totalCapacity,
    booked_count: bookedCount,
    remaining,
    is_filling_up: percentFull > 75,
    percent_full: Math.round(percentFull),
  };
}

export async function getAvailableSlots(serviceId: string, date: Date): Promise<TimeSlot[]> {
  const { data: service, error } = await supabase
    .from('experience_services')
    .select('time_slots')
    .eq('id', serviceId)
    .single();

  if (error || !service || !service.time_slots) return [];

  const slots: TimeSlot[] = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[date.getDay()];
  const timeConfigs = service.time_slots as {day: string, start: string, end: string, capacity: number}[];

  for (const config of timeConfigs) {
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
  const ticketCode = generateTicketCode(input.service_id);

  const { data, error } = await supabase
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
  const { data, error } = await supabase
    .from('experience_bookings')
    .select('*, service:experience_services(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as ExperienceBooking[];
}

