#!/usr/bin/env tsx
/**
 * Sync Cars from car_sections.json to Transport Services
 * 
 * This script ensures all cars from car_sections.json are properly
 * categorized in the transport_services table.
 * 
 * Usage:
 *   npx tsx scripts/sync-cars-to-transport.ts
 */

import { createClient } from '@supabase/supabase-js';
// Car data embedded (previously in car_sections.json)
const carSections: Record<string, Array<{
  brand: string;
  model: string;
  year: number;
  daily_price_aed: number;
  fuel: string;
  seats?: number;
}>> = {
  'ECONOMY CARS 2023 to 2025': [
    { brand: 'Nissan', model: 'Sunny', year: 2025, daily_price_aed: 65, fuel: 'Petrol', seats: 5 },
    { brand: 'Toyota', model: 'Yaris', year: 2025, daily_price_aed: 70, fuel: 'Petrol', seats: 5 },
    { brand: 'Kia', model: 'Pegas', year: 2025, daily_price_aed: 68, fuel: 'Petrol', seats: 5 },
    { brand: 'Hyundai', model: 'Accent', year: 2025, daily_price_aed: 72, fuel: 'Petrol', seats: 5 },
    { brand: 'Mitsubishi', model: 'Attrage', year: 2024, daily_price_aed: 65, fuel: 'Petrol', seats: 5 },
    { brand: 'Chevrolet', model: 'Spark', year: 2024, daily_price_aed: 60, fuel: 'Petrol', seats: 4 },
  ],
  'STANDARD CARS': [
    { brand: 'Toyota', model: 'Corolla', year: 2025, daily_price_aed: 105, fuel: 'Petrol', seats: 5 },
    { brand: 'Honda', model: 'Civic', year: 2025, daily_price_aed: 120, fuel: 'Petrol', seats: 5 },
    { brand: 'Mazda', model: '3', year: 2025, daily_price_aed: 115, fuel: 'Petrol', seats: 5 },
    { brand: 'Hyundai', model: 'Elantra', year: 2025, daily_price_aed: 110, fuel: 'Petrol', seats: 5 },
    { brand: 'Nissan', model: 'Sentra', year: 2025, daily_price_aed: 100, fuel: 'Petrol', seats: 5 },
    { brand: 'Kia', model: 'Cerato', year: 2025, daily_price_aed: 105, fuel: 'Petrol', seats: 5 },
  ],
  'LUXURY CARS': [
    { brand: 'Mercedes', model: 'C200', year: 2025, daily_price_aed: 350, fuel: 'Petrol', seats: 5 },
    { brand: 'BMW', model: '320i', year: 2025, daily_price_aed: 340, fuel: 'Petrol', seats: 5 },
    { brand: 'Audi', model: 'A4', year: 2025, daily_price_aed: 360, fuel: 'Petrol', seats: 5 },
    { brand: 'Lexus', model: 'IS300', year: 2025, daily_price_aed: 330, fuel: 'Petrol', seats: 5 },
    { brand: 'Genesis', model: 'G70', year: 2025, daily_price_aed: 380, fuel: 'Petrol', seats: 5 },
    { brand: 'Volvo', model: 'S60', year: 2025, daily_price_aed: 370, fuel: 'Petrol', seats: 5 },
  ],
  'BUSINESS CARS': [
    { brand: 'Mercedes', model: 'S-Class', year: 2025, daily_price_aed: 750, fuel: 'Petrol', seats: 4 },
    { brand: 'BMW', model: '7 Series', year: 2025, daily_price_aed: 720, fuel: 'Petrol', seats: 4 },
    { brand: 'Audi', model: 'A8', year: 2025, daily_price_aed: 700, fuel: 'Petrol', seats: 4 },
    { brand: 'Lexus', model: 'LS500', year: 2025, daily_price_aed: 650, fuel: 'Petrol', seats: 4 },
    { brand: 'Range Rover', model: 'Autobiography', year: 2025, daily_price_aed: 850, fuel: 'Petrol', seats: 5 },
  ],
  'SPORT CARS': [
    { brand: 'Lamborghini', model: 'Huracan', year: 2024, daily_price_aed: 3500, fuel: 'Petrol', seats: 2 },
    { brand: 'Ferrari', model: 'F8', year: 2024, daily_price_aed: 3200, fuel: 'Petrol', seats: 2 },
    { brand: 'Porsche', model: '911', year: 2025, daily_price_aed: 1800, fuel: 'Petrol', seats: 2 },
    { brand: 'McLaren', model: '570S', year: 2024, daily_price_aed: 2800, fuel: 'Petrol', seats: 2 },
    { brand: 'Chevrolet', model: 'Corvette', year: 2025, daily_price_aed: 1500, fuel: 'Petrol', seats: 2 },
  ],
  'ELECTRIC': [
    { brand: 'Tesla', model: 'Model 3', year: 2025, daily_price_aed: 350, fuel: 'Electric', seats: 5 },
    { brand: 'Tesla', model: 'Model Y', year: 2025, daily_price_aed: 450, fuel: 'Electric', seats: 5 },
    { brand: 'BMW', model: 'i4', year: 2025, daily_price_aed: 400, fuel: 'Electric', seats: 5 },
    { brand: 'Mercedes', model: 'EQE', year: 2025, daily_price_aed: 550, fuel: 'Electric', seats: 5 },
    { brand: 'Porsche', model: 'Taycan', year: 2025, daily_price_aed: 650, fuel: 'Electric', seats: 4 },
    { brand: 'Lucid', model: 'Air', year: 2025, daily_price_aed: 600, fuel: 'Electric', seats: 5 },
  ],
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Map car section names to transport sub_subcategories
const SECTION_TO_SUBCATEGORY: Record<string, string> = {
  'ECONOMY CARS 2023 to 2025': 'economy',
  'STANDARD CARS': 'standard',
  'LUXURY CARS': 'luxury-sedans',
  'BUSINESS CARS': 'business',
  'SPORT CARS': 'sports-cars',
  'ELECTRIC': 'electric',
};

// Map section names to price ranges for validation
const SECTION_PRICE_RANGES: Record<string, { min: number; max: number }> = {
  'ECONOMY CARS 2023 to 2025': { min: 65, max: 95 },
  'STANDARD CARS': { min: 105, max: 150 },
  'LUXURY CARS': { min: 350, max: 520 },
  'BUSINESS CARS': { min: 500, max: 750 },
  'SPORT CARS': { min: 1800, max: 3500 },
  'ELECTRIC': { min: 300, max: 650 },
};

interface CarFromJson {
  brand: string;
  model: string;
  year: number;
  daily_price_aed: number;
  fuel: string;
  seats?: number;
}

interface TransportServiceInsert {
  category: 'transport';
  subcategory: 'cars';
  sub_subcategory: string;
  name: string;
  slug: string;
  description_short: string;
  description_long: string;
  pricing_model: 'daily';
  price_from: number;
  price_currency: 'AED';
  price_display: string;
  availability_type: 'on_demand';
  max_capacity: number;
  min_booking_hours: number;
  advance_booking_hours: number;
  specifications: Record<string, any>;
  location: 'Dubai';
  area: string;
  pickup_locations: string[];
  is_featured: boolean;
  is_trending: boolean;
  status: 'published';
}

const AREA_OPTIONS = [
  'Downtown Dubai',
  'Dubai Marina',
  'Business Bay',
  'Palm Jumeirah',
  'JBR',
  'DIFC',
  'Deira',
  'Al Barsha',
  'Dubai Silicon Oasis',
  'Dubai Festival City',
];

function generateSlug(brand: string, model: string, year: number): string {
  return `${brand.toLowerCase().replace(/\s+/g, '-')}-${model.toLowerCase().replace(/\s+/g, '-')}-${year}-dubai`;
}

function generateDescription(brand: string, model: string, category: string): { short: string; long: string } {
  const descriptions: Record<string, { short: string; long: string }> = {
    'economy': {
      short: `Reliable ${brand} ${model} for budget-conscious travelers.`,
      long: `The ${brand} ${model} offers excellent value with modern features and efficient performance. Perfect for exploring Dubai without breaking the bank.`,
    },
    'standard': {
      short: `Comfortable ${brand} ${model} for everyday driving.`,
      long: `The ${brand} ${model} provides a perfect balance of comfort, features, and value. Ideal for families and business travelers alike.`,
    },
    'luxury-sedans': {
      short: `Premium ${brand} ${model} luxury sedan.`,
      long: `Experience refined luxury with the ${brand} ${model}. Combining sophisticated design with advanced technology for an exceptional driving experience.`,
    },
    'business': {
      short: `Executive ${brand} ${model} for discerning professionals.`,
      long: `The ${brand} ${model} represents the pinnacle of executive transport. Unmatched comfort, presence, and sophistication for business and special occasions.`,
    },
    'sports-cars': {
      short: `Exhilarating ${brand} ${model} supercar experience.`,
      long: `Feel the thrill of the ${brand} ${model}. World-class performance, stunning design, and an unforgettable driving experience on Dubai iconic roads.`,
    },
    'electric': {
      short: `Zero-emission ${brand} ${model} with cutting-edge tech.`,
      long: `Drive into the future with the ${brand} ${model}. Instant torque, zero emissions, and state-of-the-art technology in a premium package.`,
    },
  };

  return descriptions[category] || {
    short: `${brand} ${model} available for rent in Dubai.`,
    long: `Rent the ${brand} ${model} in Dubai. Features modern amenities and reliable performance for your journey.`,
  };
}

function getAreaForCategory(category: string): string {
  const areaMap: Record<string, string> = {
    'economy': 'Dubai Marina',
    'standard': 'Downtown Dubai',
    'luxury-sedans': 'Downtown Dubai',
    'business': 'DIFC',
    'sports-cars': 'Downtown Dubai',
    'electric': 'Downtown Dubai',
  };
  return areaMap[category] || 'Downtown Dubai';
}

function getPickupLocations(area: string): string[] {
  const locationMap: Record<string, string[]> = {
    'Downtown Dubai': ['Downtown Dubai', 'Dubai Mall', 'Burj Khalifa'],
    'Dubai Marina': ['Dubai Marina', 'JBR', 'Palm Jumeirah'],
    'Business Bay': ['Business Bay', 'DIFC', 'Downtown Dubai'],
    'Palm Jumeirah': ['Palm Jumeirah', 'Atlantis The Palm', 'Nakheel Mall'],
    'JBR': ['JBR', 'Dubai Marina', 'Bluewaters Island'],
    'DIFC': ['DIFC', 'Downtown Dubai', 'Business Bay'],
    'Deira': ['Deira', 'Dubai Airport', 'Al Garhoud'],
    'Al Barsha': ['Al Barsha', 'Mall of Emirates', 'Dubai Marina'],
  };
  return locationMap[area] || ['Downtown Dubai', 'Dubai Mall'];
}

function transformCarToService(
  car: CarFromJson,
  sectionName: string
): TransportServiceInsert {
  const subSubcategory = SECTION_TO_SUBCATEGORY[sectionName];
  if (!subSubcategory) {
    throw new Error(`Unknown section: ${sectionName}`);
  }

  const descriptions = generateDescription(car.brand, car.model, subSubcategory);
  const area = getAreaForCategory(subSubcategory);
  const slug = generateSlug(car.brand, car.model, car.year);

  // Determine if this car should be featured/trending
  // Feature latest year models and certain popular cars
  const isNew = car.year >= 2025;
  const popularModels = ['Sunny', 'Corolla', 'Civic', 'C200', 'Huracan', 'Model 3'];
  const isPopular = popularModels.includes(car.model);

  return {
    category: 'transport',
    subcategory: 'cars',
    sub_subcategory: subSubcategory,
    name: `${car.brand} ${car.model} ${car.year}`,
    slug,
    description_short: descriptions.short,
    description_long: descriptions.long,
    pricing_model: 'daily',
    price_from: car.daily_price_aed,
    price_currency: 'AED',
    price_display: `AED ${car.daily_price_aed.toLocaleString()}/day`,
    availability_type: 'on_demand',
    max_capacity: car.seats || 5,
    min_booking_hours: 24,
    advance_booking_hours: subSubcategory === 'sports-cars' ? 24 : 12,
    specifications: {
      make: car.brand,
      model: car.model,
      year: car.year,
      seats: car.seats || 5,
      fuel: car.fuel || 'Petrol',
      transmission: 'Automatic',
      ...(isNew && { isNew: true }),
    },
    location: 'Dubai',
    area,
    pickup_locations: getPickupLocations(area),
    is_featured: isPopular || isNew,
    is_trending: isNew,
    status: 'published',
  };
}

async function syncCars() {
  console.log('🚗 Starting car sync to transport services...\n');

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  let totalCars = 0;
  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (const [sectionName, cars] of Object.entries(carSections)) {
    console.log(`📁 Processing: ${sectionName} (${cars?.length ?? 0} cars)`);
    
    const subSubcategory = SECTION_TO_SUBCATEGORY[sectionName];
    if (!subSubcategory) {
      console.warn(`  ⚠️  Unknown section, skipping: ${sectionName}`);
      continue;
    }

    for (const car of cars as CarFromJson[]) {
      totalCars++;
      
      try {
        const service = transformCarToService(car, sectionName);

        // Check if car already exists
        const { data: existing } = await supabase
          .from('transport_services')
          .select('id')
          .eq('slug', service.slug)
          .single();

        if (existing) {
          // Update existing
          const { error } = await supabase
            .from('transport_services')
            .update({
              ...service,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);

          if (error) throw error;
          updated++;
          process.stdout.write('.');
        } else {
          // Insert new
          const { error } = await supabase
            .from('transport_services')
            .insert(service);

          if (error) throw error;
          inserted++;
          process.stdout.write('+');
        }
      } catch (err) {
        errors++;
        console.error(`\n  ❌ Error processing ${car.brand} ${car.model} ${car.year}:`, err);
      }
    }
    console.log('');
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Sync complete!');
  console.log(`   Total cars processed: ${totalCars}`);
  console.log(`   Inserted: ${inserted}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Errors: ${errors}`);
  console.log('='.repeat(50));

  // Print summary by category
  console.log('\n📊 Cars by category:');
  for (const [section, subcategory] of Object.entries(SECTION_TO_SUBCATEGORY)) {
    const { count } = await supabase
      .from('transport_services')
      .select('*', { count: 'exact', head: true })
      .eq('subcategory', 'cars')
      .eq('sub_subcategory', subcategory);
    
    console.log(`   ${subcategory}: ${count} cars`);
  }
}

// Run if called directly
if (require.main === module) {
  syncCars().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

export { syncCars, transformCarToService };
