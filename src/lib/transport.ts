import { supabase, isMockMode } from './supabase';
import type {
  TransportService,
  TransportBooking,
  TransportFilters,
  TransportBookingInput,
  AvailabilityResult,
  TimeSlot,
} from '../types/transport';

// ─── Mock Data ──────────────────────────────────────────────────────────────────

export const MOCK_SERVICES: TransportService[] = [
  // ─── CARS ─────────────────────────────────────────────────────────────────────
  {
    id: 'mock-car-1',
    category: 'transport',
    subcategory: 'cars',
    sub_subcategory: 'luxury-sedans',
    name: 'Rolls-Royce Ghost',
    slug: 'rolls-royce-ghost-dubai',
    description_short: 'Experience ultimate luxury in the iconic Rolls-Royce Ghost with professional chauffeur.',
    description_long: 'The Rolls-Royce Ghost represents the pinnacle of automotive luxury. With its whisper-quiet cabin, handcrafted leather interior, and effortless performance, this is the perfect choice for weddings, corporate events, or simply experiencing Dubai in unparalleled style. Includes professional chauffeur service.',
    hero_image: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=2574&auto=format&fit=crop',
    ],
    highlights: [
      'Professional chauffeur included',
      'Starlight headliner',
      'Premium sound system',
      'Rear entertainment',
      'Complimentary refreshments',
    ],
    pricing_model: 'hourly',
    price_from: 1200,
    price_currency: 'AED',
    price_display: 'AED 1,200/hour',
    availability_type: 'on_demand',
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    max_capacity: 4,
    min_booking_hours: 4,
    advance_booking_hours: 4,
    specifications: {
      make: 'Rolls-Royce',
      model: 'Ghost',
      year: 2023,
      seats: 4,
      transmission: 'Automatic',
      fuel: 'Petrol',
      color: 'Arctic White',
      engine: '6.75L V12',
      horsepower: '563 hp',
      acceleration_0_100: '4.8s',
      top_speed: '250 km/h',
    },
    location: 'Dubai',
    area: 'Downtown Dubai',
    pickup_locations: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Dubai Marina'],
    is_featured: true,
    is_trending: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-car-2',
    category: 'transport',
    subcategory: 'cars',
    sub_subcategory: 'sports-cars',
    name: 'Lamborghini Huracán EVO',
    slug: 'lamborghini-huracan-evo-dubai',
    description_short: 'Unleash the bull — experience the raw power of the Huracán EVO on Dubai\'s roads.',
    description_long: 'The Lamborghini Huracán EVO delivers an adrenaline-pumping driving experience with its naturally aspirated V10 engine and advanced aerodynamics. Feel the roar of 640 horsepower as you cruise down Sheikh Zayed Road or take a scenic drive to Hatta. Available for self-drive or with instructor.',
    hero_image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2574&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1614200187524-dc411f8f105c?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2670&auto=format&fit=crop',
    ],
    highlights: [
      '640 hp V10 engine',
      '0-100 km/h in 2.9s',
      'All-wheel drive',
      'LDVI supercomputer',
      'Full insurance included',
    ],
    pricing_model: 'daily',
    price_from: 3500,
    price_currency: 'AED',
    price_display: 'From AED 3,500/day',
    availability_type: 'on_demand',
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    max_capacity: 2,
    min_booking_hours: 24,
    advance_booking_hours: 12,
    specifications: {
      make: 'Lamborghini',
      model: 'Huracán EVO',
      year: 2023,
      seats: 2,
      transmission: '7-speed DCT',
      fuel: 'Petrol',
      color: 'Verde Mantis',
      engine: '5.2L V10',
      horsepower: '640 hp',
      acceleration_0_100: '2.9s',
      top_speed: '325 km/h',
    },
    location: 'Dubai',
    area: 'Dubai Marina',
    pickup_locations: ['Dubai Marina', 'Palm Jumeirah', 'Downtown Dubai'],
    is_featured: true,
    is_trending: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-car-3',
    category: 'transport',
    subcategory: 'cars',
    sub_subcategory: 'suvs',
    name: 'Range Rover Autobiography',
    slug: 'range-rover-autobiography-dubai',
    description_short: 'Supreme comfort meets off-road capability in the flagship Range Rover.',
    description_long: 'The Range Rover Autobiography offers the perfect blend of luxury and versatility. Whether you\'re attending a business meeting or exploring the desert dunes, this SUV delivers exceptional comfort with its executive rear seats, Meridian sound system, and air suspension.',
    hero_image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?q=80&w=2574&auto=format&fit=crop',
    ],
    highlights: [
      'Executive class rear seats',
      'Terrain Response 2',
      'Panoramic roof',
      'Meridian Signature audio',
      'Air suspension',
    ],
    pricing_model: 'daily',
    price_from: 2200,
    price_currency: 'AED',
    price_display: 'From AED 2,200/day',
    availability_type: 'on_demand',
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    max_capacity: 5,
    min_booking_hours: 24,
    advance_booking_hours: 6,
    specifications: {
      make: 'Land Rover',
      model: 'Range Rover Autobiography',
      year: 2023,
      seats: 5,
      transmission: 'Automatic',
      fuel: 'Petrol',
      color: 'Santorini Black',
      engine: '4.4L V8',
      horsepower: '530 hp',
      acceleration_0_100: '4.6s',
      top_speed: '250 km/h',
    },
    location: 'Dubai',
    area: 'Business Bay',
    pickup_locations: ['Business Bay', 'Downtown Dubai', 'Dubai Airport'],
    is_featured: false,
    is_trending: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // ─── YACHTS ───────────────────────────────────────────────────────────────────
  {
    id: 'mock-yacht-1',
    category: 'transport',
    subcategory: 'yachts',
    sub_subcategory: 'day-cruises',
    name: '85ft Majesty Yacht',
    slug: '85ft-majesty-yacht-dubai',
    description_short: 'Luxury yacht charter for up to 30 guests — perfect for celebrations and corporate events.',
    description_long: 'Step aboard this stunning 85-foot Gulf Craft Majesty and experience Dubai from the water. With spacious sun decks, a fully equipped kitchen, and elegant interior spaces, this yacht is ideal for birthday parties, corporate gatherings, or romantic sunset cruises. Professional crew of 4 included.',
    hero_image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605281317010-fe5ffe79ba66?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=2670&auto=format&fit=crop',
    ],
    highlights: [
      'Up to 30 guests',
      '4 professional crew members',
      'BBQ grill & full kitchen',
      'Sun deck with jacuzzi',
      'Sound system & TV',
      'Water sports equipment',
    ],
    pricing_model: 'hourly',
    price_from: 3500,
    price_currency: 'AED',
    price_display: 'From AED 3,500/hour',
    availability_type: 'on_demand',
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    max_capacity: 30,
    min_booking_hours: 3,
    advance_booking_hours: 24,
    specifications: {
      length_ft: 85,
      cabins: 4,
      crew_size: 4,
      max_guests: 30,
      builder: 'Gulf Craft',
      year_built: 2021,
      beam_ft: 20,
      draft_ft: 5.5,
      cruising_speed: '18 knots',
      range_nm: 450,
    },
    location: 'Dubai',
    area: 'Dubai Marina',
    pickup_locations: ['Dubai Marina', 'Palm Jumeirah', 'JBR'],
    is_featured: true,
    is_trending: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-yacht-2',
    category: 'transport',
    subcategory: 'yachts',
    sub_subcategory: 'overnight-charters',
    name: '120ft Superyacht — Sovereign',
    slug: '120ft-superyacht-sovereign-dubai',
    description_short: 'Ultimate luxury overnight charter with 5 cabins, spa, and helipad access.',
    description_long: 'The Sovereign is a masterpiece of maritime engineering and luxury design. This 120-foot superyacht features 5 ensuite cabins, a private spa, cinema room, and direct helipad access. Perfect for multi-day cruises to Oman or exclusive overnight stays in Dubai\'s pristine waters. Full crew of 6 plus private chef.',
    hero_image: 'https://images.unsplash.com/photo-1621275471769-e6aa344546d5?q=80&w=2673&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1605281317010-fe5ffe79ba66?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2670&auto=format&fit=crop',
    ],
    highlights: [
      '5 luxury ensuite cabins',
      'Private spa & jacuzzi',
      'Cinema room',
      'Helipad access',
      'Private chef included',
      '24-hour butler service',
    ],
    pricing_model: 'daily',
    price_from: 45000,
    price_currency: 'AED',
    price_display: 'From AED 45,000/day',
    availability_type: 'by_request',
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    max_capacity: 12,
    min_booking_hours: 24,
    advance_booking_hours: 72,
    specifications: {
      length_ft: 120,
      cabins: 5,
      crew_size: 6,
      max_guests: 12,
      builder: 'Benetti',
      year_built: 2020,
      beam_ft: 26,
      draft_ft: 6.5,
      cruising_speed: '14 knots',
      range_nm: 800,
    },
    location: 'Dubai',
    area: 'Palm Jumeirah',
    pickup_locations: ['Palm Jumeirah', 'Dubai Marina', 'World Islands'],
    is_featured: true,
    is_trending: false,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // ─── JETS ─────────────────────────────────────────────────────────────────────
  {
    id: 'mock-jet-1',
    category: 'transport',
    subcategory: 'jets',
    sub_subcategory: 'private-charter',
    name: 'Gulfstream G650',
    slug: 'gulfstream-g650-private-charter',
    description_short: 'Ultra-long-range business jet seating 14 — Dubai to London non-stop.',
    description_long: 'The Gulfstream G650 is the gold standard in business aviation. With a range of 13,000 km and a cabin altitude of just 4,000 feet at cruise, you\'ll arrive refreshed anywhere in the world. Features include a full galley, private stateroom, and high-speed WiFi.',
    hero_image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590073242678-cfea534351a5?q=80&w=2670&auto=format&fit=crop',
    ],
    highlights: [
      'Range: 13,000 km',
      '14 passengers',
      'Cruise speed: Mach 0.90',
      'Full stand-up cabin',
      'Private stateroom',
      'Global coverage',
    ],
    pricing_model: 'per_trip',
    price_from: 185000,
    price_currency: 'AED',
    price_display: 'From AED 185,000',
    availability_type: 'by_request',
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    max_capacity: 14,
    min_booking_hours: 48,
    advance_booking_hours: 48,
    specifications: {
      aircraft_type: 'Ultra Long Range',
      range_km: 13000,
      seats: 14,
      luggage_capacity: '195 cu ft',
      cruising_speed: 'Mach 0.90',
      max_altitude: '51,000 ft',
      year_manufactured: 2022,
      operator: 'ExecuJet Middle East',
    },
    location: 'Dubai',
    area: 'Al Maktoum International',
    pickup_locations: ['Al Maktoum International (DWC)', 'Dubai International (DXB)'],
    is_featured: true,
    is_trending: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-jet-2',
    category: 'transport',
    subcategory: 'jets',
    sub_subcategory: 'helicopter-tours',
    name: 'Helicopter Tour — Dubai Skyline',
    slug: 'helicopter-tour-dubai-skyline',
    description_short: 'Breathtaking 25-minute helicopter tour over Dubai\'s iconic landmarks.',
    description_long: 'Take to the skies and witness Dubai\'s architectural wonders from above. This 25-minute tour covers the Palm Jumeirah, Burj Al Arab, Burj Khalifa, and the World Islands. Professional pilot with thousands of flight hours ensures a safe and memorable experience.',
    hero_image: 'https://images.unsplash.com/photo-1506467493604-25d7861a67c5?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2670&auto=format&fit=crop',
    ],
    highlights: [
      '25-minute flight',
      '5 passengers max',
      'Professional pilot',
      'Bird\'s eye views',
      'Photo opportunities',
      'Hotel pickup available',
    ],
    pricing_model: 'fixed',
    price_from: 4500,
    price_currency: 'AED',
    price_display: 'AED 4,500 (whole helicopter)',
    availability_type: 'scheduled',
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    max_capacity: 5,
    min_booking_hours: 4,
    advance_booking_hours: 12,
    specifications: {
      aircraft_type: 'AW139 Helicopter',
      range_km: 500,
      seats: 5,
      luggage_capacity: 'Limited',
      cruising_speed: '165 knots',
      max_altitude: '15,000 ft',
      year_manufactured: 2021,
      operator: 'Falcon Aviation',
    },
    location: 'Dubai',
    area: 'Dubai Helipad',
    pickup_locations: ['Dubai Helipad (Atlantis)', 'Dubai Helipad (Burj Al Arab)'],
    is_featured: false,
    is_trending: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ─── Service Functions ──────────────────────────────────────────────────────────

export async function getTransportServices(filters?: TransportFilters): Promise<TransportService[]> {
  if (isMockMode) {
    let results = [...MOCK_SERVICES];
    
    if (filters?.subcategory) {
      results = results.filter(s => s.subcategory === filters.subcategory);
    }
    if (filters?.sub_subcategory) {
      results = results.filter(s => s.sub_subcategory === filters.sub_subcategory);
    }
    if (filters?.pricing_model) {
      results = results.filter(s => s.pricing_model === filters.pricing_model);
    }
    if (filters?.price_min != null) {
      results = results.filter(s => (s.price_from ?? 0) >= filters.price_min!);
    }
    if (filters?.price_max != null) {
      results = results.filter(s => (s.price_from ?? 0) <= filters.price_max!);
    }
    if (filters?.availability_type) {
      results = results.filter(s => s.availability_type === filters.availability_type);
    }
    if (filters?.featured_only) {
      results = results.filter(s => s.is_featured);
    }
    if (filters?.capacity_min) {
      results = results.filter(s => (s.max_capacity ?? 0) >= filters.capacity_min!);
    }
    if (filters?.search) {
      const term = filters.search.toLowerCase();
      results = results.filter(s => 
        s.name.toLowerCase().includes(term) ||
        s.description_short?.toLowerCase().includes(term)
      );
    }
    
    return results;
  }

  let query = supabase!
    .from('transport_services')
    .select('*')
    .eq('status', 'published')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (filters?.subcategory) query = query.eq('subcategory', filters.subcategory);
  if (filters?.sub_subcategory) query = query.eq('sub_subcategory', filters.sub_subcategory);
  if (filters?.pricing_model) query = query.eq('pricing_model', filters.pricing_model);
  if (filters?.price_min != null) query = query.gte('price_from', filters.price_min);
  if (filters?.price_max != null) query = query.lte('price_from', filters.price_max);
  if (filters?.availability_type) query = query.eq('availability_type', filters.availability_type);
  if (filters?.featured_only) query = query.eq('is_featured', true);
  if (filters?.capacity_min) query = query.gte('max_capacity', filters.capacity_min);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as TransportService[];
}

export async function getTransportServiceBySlug(slug: string): Promise<TransportService | null> {
  if (isMockMode) {
    return MOCK_SERVICES.find(s => s.slug === slug) ?? null;
  }

  const { data, error } = await supabase!
    .from('transport_services')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) throw error;
  return data as TransportService | null;
}

export async function getFeaturedTransport(subcategory?: string): Promise<TransportService[]> {
  if (isMockMode) {
    let results = MOCK_SERVICES.filter(s => s.is_featured);
    if (subcategory) {
      results = results.filter(s => s.subcategory === subcategory);
    }
    return results;
  }

  let query = supabase!
    .from('transport_services')
    .select('*')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (subcategory) query = query.eq('subcategory', subcategory);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as TransportService[];
}

export async function createTransportBooking(input: TransportBookingInput): Promise<TransportBooking> {
  if (isMockMode) {
    const service = MOCK_SERVICES.find(s => s.id === input.service_id);
    return {
      id: `mock-transport-booking-${Date.now()}`,
      service_id: input.service_id,
      user_id: input.user_id,
      pickup_date: input.pickup_date,
      return_date: input.return_date,
      pickup_location: input.pickup_location,
      dropoff_location: input.dropoff_location,
      duration_hours: input.duration_hours,
      relocation_profile_id: input.relocation_profile_id,
      workflow_step_id: input.workflow_step_id,
      quoted_price: input.quoted_price,
      final_price: input.quoted_price,
      currency: 'AED',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as TransportBooking;
  }

  const { data, error } = await supabase!
    .from('transport_bookings')
    .insert({
      service_id: input.service_id,
      user_id: input.user_id,
      pickup_date: input.pickup_date,
      return_date: input.return_date,
      pickup_location: input.pickup_location,
      dropoff_location: input.dropoff_location,
      duration_hours: input.duration_hours,
      relocation_profile_id: input.relocation_profile_id,
      workflow_step_id: input.workflow_step_id,
      quoted_price: input.quoted_price,
      currency: 'AED',
      status: 'pending',
    })
    .select('*, service:transport_services(*)')
    .single();

  if (error) throw error;
  return data as TransportBooking;
}

export async function getUserTransportBookings(userId: string): Promise<TransportBooking[]> {
  if (isMockMode) return [] as TransportBooking[];

  const { data, error } = await supabase!
    .from('transport_bookings')
    .select('*, service:transport_services(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as TransportBooking[];
}

export async function checkAvailability(
  serviceId: string, 
  date: Date
): Promise<AvailabilityResult> {
  if (isMockMode) {
    // Simulate some random availability
    const day = date.getDay();
    const isWeekend = day === 5 || day === 6; // Fri, Sat in UAE
    
    // 20% chance unavailable on weekends
    if (isWeekend && Math.random() < 0.2) {
      return {
        available: false,
        reason: 'High demand — fully booked',
        alternative_dates: [
          new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString(),
          new Date(date.getTime() + 48 * 60 * 60 * 1000).toISOString(),
        ],
      };
    }
    
    return {
      available: true,
      price_estimate: undefined, // Would be calculated based on date/service
    };
  }

  const { data, error } = await supabase!
    .rpc('check_transport_availability', {
      p_service_id: serviceId,
      p_date: date.toISOString(),
    });

  if (error) {
    // RPC not available - log error but return available to allow booking
    // The backend will validate availability when processing the booking
    console.error('Availability check failed:', error);
    return { available: true };
  }
  
  return data as AvailabilityResult;
}

export async function getAvailableTimeSlots(serviceId: string, date: string): Promise<TimeSlot[]> {
  if (isMockMode) {
    const service = MOCK_SERVICES.find(s => s.id === serviceId);
    const slots: TimeSlot[] = [];
    const base = new Date(date);
    
    // Generate slots based on service type
    let hours: number[] = [];
    
    if (service?.subcategory === 'jets') {
      hours = [6, 8, 10, 12, 14, 16, 18]; // Flight hours
    } else if (service?.subcategory === 'yachts') {
      hours = [9, 10, 11, 14, 15, 16, 17, 18]; // Yacht charter hours
    } else {
      hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; // Car rental hours
    }
    
    // Randomly mark some slots as unavailable
    const unavailable = hours.filter(() => Math.random() < 0.2);
    
    for (const h of hours) {
      base.setHours(h, 0, 0, 0);
      const label = base.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
      slots.push({
        time: base.toISOString(),
        label,
        available: !unavailable.includes(h),
      });
    }
    return slots;
  }

  const { data, error } = await supabase!
    .rpc('get_transport_time_slots', {
      p_service_id: serviceId,
      p_date: date,
    });

  if (error) {
    return [] as TimeSlot[];
  }
  
  return (data ?? []) as TimeSlot[];
}

// ─── Slug Generation Utility ────────────────────────────────────────────────────

export function generateTransportSlug(name: string, area?: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  if (area) {
    const areaSlug = area
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${base}-${areaSlug}`;
  }
  
  return base;
}

