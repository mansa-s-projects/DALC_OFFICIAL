import { supabase } from './supabase';
import { queryPublished } from './supabase-query';
import type {
  StaysProperty,
  StaysBooking,
  StaysAvailability,
  StaysFilters,
  StaysBookingInput,
  PriceBreakdown,
  PropertyStatus,
  SeasonalPricing,
} from '../features/stays/types';

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_PROPERTIES: StaysProperty[] = [
  // ─── Hotels ────────────────────────────────────────────────────────────────
  {
    id: 'mock-stay-1',
    subcategory: 'hotels',
    name: 'Burj Al Arab Jumeirah',
    slug: 'burj-al-arab-jumeirah',
    description_short: 'The world\'s most iconic hotel, a masterpiece of modern Dubai.',
    description_long: 'Rising on its own man-made island, Burj Al Arab is the pinnacle of hospitality. With butler service, private beach access, and opulent suites, it defines Arabian excellence.',
    location: 'Dubai',
    area: 'Jumeirah Beach',
    address: 'Jumeirah Beach Road',
    hero_image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2525&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop',
    ],
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    square_meters: 170,
    star_rating: 5,
    hotel_chain: 'Jumeirah',
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Room Service', 'Concierge', 'Beach Access', 'Helipad', 'Butler Service'],
    amenities_highlight: ['Butler Service', 'Private Beach', 'Helipad', 'Spa'],
    pricing_model: 'nightly',
    base_price: 8500,
    price_currency: 'AED',
    price_display: 'From AED 8,500/night',
    instant_booking: true,
    check_in_time: '15:00',
    check_out_time: '12:00',
    is_featured: true,
    popularity_score: 98,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-stay-2',
    subcategory: 'hotels',
    name: 'Armani Hotel Dubai',
    slug: 'armani-hotel-dubai',
    description_short: 'Refined elegance in the heart of Burj Khalifa.',
    description_long: 'Designed by Giorgio Armani, this sophisticated hotel occupies concourse levels to floors 8 and 38-39 of Burj Khalifa.',
    location: 'Dubai',
    area: 'Downtown Dubai',
    hero_image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    square_meters: 65,
    star_rating: 5,
    hotel_chain: 'Armani',
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym'],
    amenities_highlight: ['Designer Interiors', 'Burj Khalifa Access'],
    pricing_model: 'nightly',
    base_price: 3200,
    price_currency: 'AED',
    price_display: 'From AED 3,200/night',
    instant_booking: true,
    check_in_time: '15:00',
    check_out_time: '12:00',
    is_featured: true,
    popularity_score: 92,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-stay-hotel-3',
    subcategory: 'hotels',
    name: 'Atlantis The Royal',
    slug: 'atlantis-the-royal',
    description_short: 'The newest icon of Dubai, where premium living reaches new heights.',
    description_long: 'Atlantis The Royal redefines the meaning of premium hospitality with sky pools, world-class dining by celebrity chefs, and breathtaking views.',
    location: 'Dubai',
    area: 'Palm Jumeirah',
    hero_image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2680&auto=format&fit=crop',
    gallery_images: [],
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    square_meters: 85,
    star_rating: 5,
    hotel_chain: 'Atlantis',
    amenities: ['WiFi', 'Pool', 'Sky Pool', 'Beach Access'],
    amenities_highlight: ['Sky Pool', 'Celebrity Dining', 'Private Beach'],
    pricing_model: 'nightly',
    base_price: 4500,
    price_currency: 'AED',
    price_display: 'From AED 4,500/night',
    instant_booking: true,
    check_in_time: '15:00',
    check_out_time: '11:00',
    is_featured: true,
    popularity_score: 96,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-stay-hotel-4',
    subcategory: 'hotels',
    name: 'Bulgari Resort Dubai',
    slug: 'bulgari-resort-dubai',
    description_short: 'A Mediterranean oasis on Jumeira Bay Island.',
    description_long: 'The Bulgari Resort Dubai brings Italian style to the Middle East with a private marina.',
    location: 'Dubai',
    area: 'Jumeira Bay',
    hero_image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    square_meters: 70,
    star_rating: 5,
    hotel_chain: 'Bulgari',
    amenities: ['WiFi', 'Pool', 'Marina', 'Beach Access'],
    amenities_highlight: ['Private Island', 'Marina', 'Italian Design'],
    pricing_model: 'nightly',
    base_price: 5500,
    price_currency: 'AED',
    price_display: 'From AED 5,500/night',
    instant_booking: true,
    check_in_time: '15:00',
    check_out_time: '12:00',
    is_featured: false,
    popularity_score: 94,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-stay-hotel-5',
    subcategory: 'hotels',
    name: 'One&Only The Palm',
    slug: 'one-and-only-the-palm',
    description_short: 'An exclusive beach resort on the West Crescent of Palm Jumeirah.',
    description_long: 'Experience a sanctuary of secluded refinement with low-rise mansions and beach villas nestled within gardens.',
    location: 'Dubai',
    area: 'Palm Jumeirah',
    hero_image: 'https://images.unsplash.com/photo-1561501900-3701fa6a0f64?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    square_meters: 65,
    star_rating: 5,
    hotel_chain: 'One&Only',
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Beach Access'],
    amenities_highlight: ['Secluded Sanctuary', 'Beachfront', 'Personalized Service'],
    pricing_model: 'nightly',
    base_price: 4200,
    price_currency: 'AED',
    price_display: 'From AED 4,200/night',
    instant_booking: true,
    check_in_time: '15:00',
    check_out_time: '12:00',
    is_featured: true,
    popularity_score: 93,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ─── Villas ────────────────────────────────────────────────────────────────
  {
    id: 'mock-stay-3',
    subcategory: 'villas',
    name: 'Palm Jumeirah Signature Villa',
    slug: 'palm-jumeirah-signature-villa',
    description_short: 'Stunning beachfront villa on the iconic Palm Jumeirah.',
    description_long: 'Experience ultimate privacy in this 5-bedroom signature villa with private beach and infinity pool.',
    location: 'Dubai',
    area: 'Palm Jumeirah',
    hero_image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop',
    gallery_images: [],
    bedrooms: 5,
    bathrooms: 6,
    max_guests: 10,
    square_meters: 650,
    beachfront: true,
    private_pool: true,
    amenities: ['WiFi', 'Private Pool', 'Beach Access', 'BBQ', 'Housekeeping'],
    amenities_highlight: ['Private Beach', 'Infinity Pool', 'Housekeeping'],
    pricing_model: 'nightly',
    base_price: 15000,
    price_currency: 'AED',
    price_display: 'From AED 15,000/night',
    instant_booking: false,
    check_in_time: '16:00',
    check_out_time: '11:00',
    is_featured: true,
    popularity_score: 95,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-stay-4',
    subcategory: 'villas',
    name: 'Emirates Hills Premium Estate',
    slug: 'emirates-hills-premium-estate',
    description_short: 'Prestigious address in Dubai\'s most exclusive neighborhood.',
    description_long: 'This magnificent 7-bedroom estate sits on the fairways of the Montgomerie Golf Course.',
    location: 'Dubai',
    area: 'Emirates Hills',
    hero_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    bedrooms: 7,
    bathrooms: 8,
    max_guests: 14,
    square_meters: 1200,
    private_pool: true,
    amenities: ['WiFi', 'Private Pool', 'Gym', 'Cinema', 'Security'],
    amenities_highlight: ['Golf Course View', 'Private Cinema', 'Spa Room'],
    pricing_model: 'nightly',
    base_price: 25000,
    price_currency: 'AED',
    price_display: 'From AED 25,000/night',
    instant_booking: false,
    check_in_time: '15:00',
    check_out_time: '12:00',
    is_featured: true,
    popularity_score: 90,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-stay-villa-3',
    subcategory: 'villas',
    name: 'Jumeirah Islands Modern Villa',
    slug: 'jumeirah-islands-modern-villa',
    description_short: 'Sleek contemporary villa with lake views.',
    description_long: 'Recently renovated 4-bedroom villa offering open-plan living and high-end finishes.',
    location: 'Dubai',
    area: 'Jumeirah Islands',
    hero_image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    bedrooms: 4,
    bathrooms: 4,
    max_guests: 8,
    square_meters: 450,
    private_pool: true,
    amenities: ['WiFi', 'Private Pool', 'Garden'],
    amenities_highlight: ['Lake View', 'Modern Design'],
    pricing_model: 'nightly',
    base_price: 6500,
    price_currency: 'AED',
    price_display: 'From AED 6,500/night',
    instant_booking: true,
    check_in_time: '15:00',
    check_out_time: '11:00',
    is_featured: false,
    popularity_score: 85,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-stay-villa-4',
    subcategory: 'villas',
    name: 'Dubai Hills Fairway Villa',
    slug: 'dubai-hills-fairway-villa',
    description_short: 'Architectural masterpiece overlooking the Dubai Hills Golf Course.',
    description_long: 'Floor-to-ceiling windows and minimalist design define this ultra-modern 6-bedroom villa.',
    location: 'Dubai',
    area: 'Dubai Hills',
    hero_image: 'https://images.unsplash.com/photo-1628592102751-ba83b03bc42e?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    bedrooms: 6,
    bathrooms: 7,
    max_guests: 12,
    square_meters: 550,
    private_pool: true,
    amenities: ['WiFi', 'Private Pool', 'Garden', 'Security'],
    amenities_highlight: ['Golf Course View', 'Modernist Architecture'],
    pricing_model: 'nightly',
    base_price: 18000,
    price_currency: 'AED',
    price_display: 'From AED 18,000/night',
    instant_booking: false,
    check_in_time: '15:00',
    check_out_time: '11:00',
    is_featured: true,
    popularity_score: 88,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // ─── Residences ────────────────────────────────────────────────────────────
  {
    id: 'mock-stay-5',
    subcategory: 'residences',
    name: 'Downtown Dubai Premium Apartment',
    slug: 'downtown-dubai-premium-apartment',
    description_short: 'Stylish furnished apartment with Burj Khalifa views.',
    description_long: 'Fully furnished 2-bedroom apartment in the heart of Downtown Dubai.',
    location: 'Dubai',
    area: 'Downtown Dubai',
    hero_image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2680&auto=format&fit=crop',
    gallery_images: [],
    bedrooms: 2,
    bathrooms: 2,
    max_guests: 4,
    square_meters: 110,
    furnished: true,
    lease_terms: ['6_months', '12_months'],
    amenities: ['WiFi', 'Pool', 'Gym', 'Parking'],
    amenities_highlight: ['Burj Khalifa View', 'Furnished', 'Central Location'],
    pricing_model: 'monthly',
    base_price: 35000,
    price_currency: 'AED',
    price_display: 'AED 35,000/month',
    instant_booking: true,
    check_in_time: '14:00',
    check_out_time: '12:00',
    is_featured: true,
    popularity_score: 88,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-stay-6',
    subcategory: 'residences',
    name: 'Dubai Marina Waterfront Residence',
    slug: 'dubai-marina-waterfront-residence',
    description_short: 'Modern 3-bedroom residence with marina views.',
    description_long: 'Waterfront living in one of Dubai Marina\'s premium towers.',
    location: 'Dubai',
    area: 'Dubai Marina',
    hero_image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    bedrooms: 3,
    bathrooms: 3,
    max_guests: 6,
    square_meters: 165,
    furnished: true,
    lease_terms: ['12_months'],
    amenities: ['WiFi', 'Pool', 'Gym', 'Balcony'],
    amenities_highlight: ['Marina View', 'Furnished', 'Concierge'],
    pricing_model: 'monthly',
    base_price: 28000,
    price_currency: 'AED',
    price_display: 'AED 28,000/month',
    instant_booking: true,
    check_in_time: '14:00',
    check_out_time: '12:00',
    is_featured: false,
    popularity_score: 85,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-stay-residence-3',
    subcategory: 'residences',
    name: 'City Walk Modern Loft',
    slug: 'city-walk-modern-loft',
    description_short: 'Minimalist industrial loft in the trendy City Walk district.',
    description_long: 'Unique 1-bedroom loft features high ceilings and industrial aesthetic.',
    location: 'Dubai',
    area: 'City Walk',
    hero_image: 'https://images.unsplash.com/photo-1536376074432-ef22da854492?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    square_meters: 95,
    furnished: true,
    lease_terms: ['12_months'],
    amenities: ['WiFi', 'Pool', 'Retail Access'],
    amenities_highlight: ['Industrial Design', 'Retail Community'],
    pricing_model: 'monthly',
    base_price: 22000,
    price_currency: 'AED',
    price_display: 'AED 22,000/month',
    instant_booking: true,
    check_in_time: '14:00',
    check_out_time: '11:00',
    is_featured: true,
    popularity_score: 91,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-stay-residence-4',
    subcategory: 'residences',
    name: 'Bluewaters Island Apartment',
    slug: 'bluewaters-island-apartment',
    description_short: 'Exclusive island living home to Ain Dubai.',
    description_long: 'Modern 2-bedroom apartment with stunning sea views and pedestrian-friendly island life.',
    location: 'Dubai',
    area: 'Bluewaters Island',
    hero_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    bedrooms: 2,
    bathrooms: 2,
    max_guests: 4,
    square_meters: 130,
    furnished: true,
    lease_terms: ['12_months'],
    amenities: ['WiFi', 'Pool', 'Beach Access'],
    amenities_highlight: ['Ain Dubai View', 'Island Life', 'Modern Finishes'],
    pricing_model: 'monthly',
    base_price: 45000,
    price_currency: 'AED',
    price_display: 'AED 45,000/month',
    instant_booking: true,
    check_in_time: '14:00',
    check_out_time: '12:00',
    is_featured: true,
    popularity_score: 89,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

function getSeasonalMultiplier(date: Date, seasonalPricing?: SeasonalPricing[]): number {
  if (!seasonalPricing || seasonalPricing.length === 0) return 1;
  const month = date.getMonth() + 1;
  for (const season of seasonalPricing) {
    if (season.start_month <= season.end_month) {
      if (month >= season.start_month && month <= season.end_month) return season.multiplier;
    } else {
      if (month >= season.start_month || month <= season.end_month) return season.multiplier;
    }
  }
  return 1;
}

function generateMockAvailability(propertyId: string, startDate: string, endDate: string): StaysAvailability[] {
  const availability: StaysAvailability[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const rand = Math.random();
    let status: PropertyStatus = 'available';
    if (rand > 0.95) status = 'booked';
    else if (rand > 0.85) status = 'limited';
    availability.push({ property_id: propertyId, date: dateStr, status });
  }
  return availability;
}

// ─── Service Functions ────────────────────────────────────────────────────────

export async function getProperties(filters?: StaysFilters): Promise<StaysProperty[]> {
  return queryPublished<StaysProperty>({
    table: 'stays_properties',
    orderBy: { column: 'popularity_score', ascending: false },
    filters: {
      subcategory: filters?.subcategory ? { op: 'eq', value: filters.subcategory } : undefined,
      location: filters?.location ? { op: 'ilike', value: filters.location } : undefined,
      area: filters?.area ? { op: 'ilike', value: filters.area } : undefined,
      bedrooms: filters?.bedrooms ? { op: 'gte', value: filters.bedrooms } : undefined,
      bathrooms: filters?.bathrooms ? { op: 'gte', value: filters.bathrooms } : undefined,
      base_price_min: filters?.price_min != null ? { op: 'gte', value: filters.price_min, column: 'base_price' } : undefined,
      base_price_max: filters?.price_max != null ? { op: 'lte', value: filters.price_max, column: 'base_price' } : undefined,
      star_rating: filters?.star_rating ? { op: 'eq', value: filters.star_rating } : undefined,
      beachfront: filters?.beachfront != null ? { op: 'eq', value: filters.beachfront } : undefined,
      private_pool: filters?.private_pool != null ? { op: 'eq', value: filters.private_pool } : undefined,
      furnished: filters?.furnished != null ? { op: 'eq', value: filters.furnished } : undefined,
      instant_booking: filters?.instant_booking != null ? { op: 'eq', value: filters.instant_booking } : undefined,
      is_featured: filters?.is_featured != null ? { op: 'eq', value: filters.is_featured } : undefined,
    },
  });
}

export async function getPropertyBySlug(slug: string): Promise<StaysProperty | null> {
  const { data, error } = await supabase.from('stays_properties').select('*').eq('slug', slug).eq('status', 'published').single();
  if (error) {
    console.error('[getPropertyBySlug] Supabase error:', error.message);
    return null;
  }
  return data as StaysProperty | null;
}

export async function getPropertyById(id: string): Promise<StaysProperty | null> {
  const { data, error } = await supabase.from('stays_properties').select('*').eq('id', id).single();
  if (error) {
    console.error('[getPropertyById] Supabase error:', error.message);
    return null;
  }
  return data as StaysProperty | null;
}

export async function getFeaturedProperties(subcategory?: string): Promise<StaysProperty[]> {
  let query = supabase.from('stays_properties').select('*').eq('status', 'published').eq('is_featured', true).order('popularity_score', { ascending: false }).limit(6);
  if (subcategory) query = query.eq('subcategory', subcategory);
  const { data, error } = await query;
  if (error) {
    console.error('[getFeaturedProperties] Supabase error:', error.message);
    return [];
  }
  return (data ?? []) as StaysProperty[];
}

export async function getAvailability(propertyId: string, startDate: string, endDate: string): Promise<StaysAvailability[]> {
  const { data, error } = await supabase.from('stays_availability').select('*').eq('property_id', propertyId).gte('date', startDate).lte('date', endDate).order('date', { ascending: true });
  if (error) {
    console.error('[getAvailability] Supabase error:', error.message);
    return [];
  }
  return (data ?? []) as StaysAvailability[];
}

export async function checkAvailability(propertyId: string, checkIn: string, checkOut: string): Promise<{ available: boolean; message?: string }> {
  const availability = await getAvailability(propertyId, checkIn, checkOut);
  const unavailable = availability.filter(a => a.status === 'booked');
  if (unavailable.length > 0) return { available: false, message: 'Some dates in your selection are not available.' };
  const limited = availability.filter(a => a.status === 'limited');
  if (limited.length > 0) return { available: true, message: 'Limited availability - book soon!' };
  return { available: true };
}

export async function calculatePrice(propertyId: string, checkIn: string, checkOut: string): Promise<PriceBreakdown | null> {
  const property = await getPropertyById(propertyId);
  if (!property) return null;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  let basePriceTotal = 0;
  let seasonalAdjustment = 0;
  for (let i = 0; i < nights; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const multiplier = getSeasonalMultiplier(date, property.seasonal_pricing);
    const nightlyRate = property.base_price * multiplier;
    basePriceTotal += property.base_price;
    seasonalAdjustment += (nightlyRate - property.base_price);
  }
  const cleaningFee = property.cleaning_fee ?? 0;
  const serviceFee = property.service_fee ?? Math.round(basePriceTotal * 0.1);
  const securityDeposit = property.security_deposit ?? 0;
  const discountAmount = 0;
  const totalPrice = basePriceTotal + seasonalAdjustment + cleaningFee + serviceFee + securityDeposit + discountAmount;
  const pricePerNightAvg = Math.round(totalPrice / nights);
  return { nights, nightly_rate: property.base_price, base_price_total: basePriceTotal, seasonal_adjustment: seasonalAdjustment, cleaning_fee: cleaningFee, service_fee: serviceFee, security_deposit: securityDeposit, discount_amount: discountAmount, total_price: totalPrice, currency: property.price_currency, price_per_night_avg: pricePerNightAvg };
}

export async function createStaysBooking(input: StaysBookingInput): Promise<StaysBooking> {
  const property = await getPropertyById(input.property_id);
  if (!property) throw new Error('Property not found');
  const priceBreakdown = await calculatePrice(input.property_id, input.check_in, input.check_out);
  if (!priceBreakdown) throw new Error('Could not calculate price');

  const bookingInsertPayload = {
    property_id: input.property_id,
    user_id: input.user_id,
    check_in: input.check_in,
    check_out: input.check_out,
    guests: input.guests,
    guest_name: input.guest_name,
    guest_email: input.guest_email,
    guest_phone: input.guest_phone,
    special_requests: input.special_requests,
    nights: priceBreakdown.nights,
    base_price_total: priceBreakdown.base_price_total,
    seasonal_adjustment: priceBreakdown.seasonal_adjustment,
    cleaning_fee: priceBreakdown.cleaning_fee,
    service_fee: priceBreakdown.service_fee,
    security_deposit: priceBreakdown.security_deposit,
    discount_amount: priceBreakdown.discount_amount,
    total_price: priceBreakdown.total_price,
    currency: priceBreakdown.currency,
    status: 'pending',
  };

  const { data, error } = await supabase
    .from('stays_bookings')
    .insert(bookingInsertPayload)
    .select('id,property_id,user_id,check_in,check_out,guests,guest_name,guest_email,guest_phone,special_requests,nights,base_price_total,seasonal_adjustment,cleaning_fee,service_fee,security_deposit,discount_amount,total_price,currency,status,confirmation_code,cancellation_reason,cancelled_at,created_at,updated_at,confirmed_at,checked_in_at,checked_out_at,property:stays_properties(id,name,slug,subcategory,location,area,hero_image,base_price,price_currency,price_display,status)')
    .single();

  if (error) throw error;
  if (!data?.id) throw new Error('Stays booking creation failed: missing booking id');
  return data as unknown as StaysBooking;
}

export async function getUserBookings(userId: string): Promise<StaysBooking[]> {
  const { data, error } = await supabase
    .from('stays_bookings')
    .select('id,property_id,user_id,check_in,check_out,guests,guest_name,guest_email,guest_phone,special_requests,nights,base_price_total,seasonal_adjustment,cleaning_fee,service_fee,security_deposit,discount_amount,total_price,currency,status,confirmation_code,cancellation_reason,cancelled_at,created_at,updated_at,confirmed_at,checked_in_at,checked_out_at,property:stays_properties(id,name,slug,subcategory,location,area,hero_image,base_price,price_currency,price_display,status)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[getUserBookings] Supabase error:', error.message);
    return [];
  }
  return (data ?? []) as unknown as StaysBooking[];
}
