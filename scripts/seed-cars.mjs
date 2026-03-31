import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Map section names to sub_subcategory slugs
const sectionMapping = {
  'ECONOMY CARS 2023 to 2025': 'economy',
  'STANDARD CARS': 'standard',
  'LUXURY CARS': 'luxury',
  'BUSINESS CARS': 'business',
  'SPORT CARS': 'sport',
  'ELECTRIC': 'electric'
};

// Create a slug from brand, model, year
function createSlug(brand, model, year) {
  const modelStr = String(model).toLowerCase().replace(/\s+/g, '-');
  const brandStr = brand.toLowerCase().replace(/\s+/g, '-');
  return `${brandStr}-${modelStr}-${year}`;
}

// Create display name
function createName(brand, model, year) {
  return `${brand} ${model} ${year}`;
}

// Get fuel type for electric cars
function getFuelType(section, carData) {
  if (section === 'ELECTRIC') return 'Electric';
  return carData.fuel || 'Petrol';
}

// Get image URL based on brand
function getCarImage(brand) {
  const brandImages = {
    'Nissan': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
    'Toyota': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
    'Kia': 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800',
    'Hyundai': 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=800',
    'Mitsubishi': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    'Chevrolet': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    'Renault': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    'Suzuki': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    'Honda': 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800',
    'Mazda': 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800',
    'VW': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    'Mercedes': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    'BMW': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    'Audi': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    'Lexus': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    'Genesis': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    'Volvo': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    'Lamborghini': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
    'Ferrari': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
    'McLaren': 'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=800',
    'Porsche': 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800',
    'Tesla': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
  };
  return brandImages[brand] || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800';
}

// Transform car data to transport_services format
function transformCar(car, section) {
  const subSubcategory = sectionMapping[section];
  const slug = createSlug(car.brand, car.model, car.year);
  const name = createName(car.brand, car.model, car.year);
  const fuel = getFuelType(section, car);

  return {
    category: 'transport',
    subcategory: 'cars',
    sub_subcategory: subSubcategory,
    name: name,
    slug: slug,
    description_short: `${car.year} ${car.brand} ${car.model} - ${subSubcategory.charAt(0).toUpperCase() + subSubcategory.slice(1)} car rental in Dubai`,
    description_long: `Rent the ${car.year} ${car.brand} ${car.model} in Dubai. Perfect for ${subSubcategory === 'economy' ? 'budget-conscious travelers' : subSubcategory === 'luxury' ? 'luxury experiences' : subSubcategory === 'sport' ? 'thrill seekers' : subSubcategory === 'electric' ? 'eco-conscious drivers' : 'comfortable city driving'}. Available for daily rental with flexible pickup locations across Dubai.`,
    hero_image: getCarImage(car.brand),
    gallery_images: [],
    highlights: [
      `${car.year} Model Year`,
      `${fuel} Engine`,
      car.seats ? `${car.seats} Seats` : '5 Seats',
      'Free Delivery',
      '24/7 Roadside Assistance'
    ],
    pricing_model: 'daily',
    price_from: car.daily_price_aed,
    price_currency: 'AED',
    price_display: `From AED ${car.daily_price_aed}/day`,
    availability_type: 'on_demand',
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    max_capacity: car.seats || 5,
    min_booking_hours: 24,
    advance_booking_hours: 4,
    specifications: {
      make: car.brand,
      model: String(car.model),
      year: car.year,
      seats: car.seats || 5,
      transmission: 'Automatic',
      fuel: fuel,
      category: subSubcategory
    },
    location: 'Dubai',
    area: 'Dubai',
    pickup_locations: ['Dubai Airport (DXB)', 'Dubai Marina', 'Downtown Dubai', 'Business Bay', 'JBR'],
    is_featured: subSubcategory === 'luxury' || subSubcategory === 'sport',
    is_trending: car.year === 2025,
    status: 'published',
    meta_title: `Rent ${name} in Dubai | Dubai À La Carte`,
    meta_description: `Rent a ${car.year} ${car.brand} ${car.model} in Dubai starting from AED ${car.daily_price_aed}/day. Free delivery, 24/7 support.`
  };
}

async function seedCars() {
  console.log('🚗 Starting car seed...\n');

  // Read the JSON file
  const jsonPath = join(__dirname, '..', 'car_sections.json');
  const rawData = readFileSync(jsonPath, 'utf-8');
  const carSections = JSON.parse(rawData);

  const allCars = [];

  // Transform all cars
  for (const [section, cars] of Object.entries(carSections)) {
    console.log(`📦 Processing ${section}: ${cars.length} cars`);
    for (const car of cars) {
      const transformed = transformCar(car, section);
      allCars.push(transformed);
    }
  }

  console.log(`\n📊 Total cars to insert: ${allCars.length}\n`);

  // Delete existing cars first (optional - comment out if you want to upsert)
  console.log('🗑️ Clearing existing car entries...');
  const { error: deleteError } = await supabase
    .from('transport_services')
    .delete()
    .eq('subcategory', 'cars');

  if (deleteError) {
    console.error('❌ Error deleting existing cars:', deleteError.message);
  } else {
    console.log('✅ Existing cars cleared\n');
  }

  // Insert in batches of 50
  const batchSize = 50;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < allCars.length; i += batchSize) {
    const batch = allCars.slice(i, i + batchSize);
    console.log(`📤 Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allCars.length / batchSize)}...`);

    const { data, error } = await supabase
      .from('transport_services')
      .insert(batch)
      .select('id, name');

    if (error) {
      console.error(`❌ Batch error:`, error.message);
      errorCount += batch.length;
    } else {
      successCount += data.length;
      console.log(`   ✅ Inserted ${data.length} cars`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`🏁 Seed complete!`);
  console.log(`   ✅ Successfully inserted: ${successCount} cars`);
  if (errorCount > 0) {
    console.log(`   ❌ Failed: ${errorCount} cars`);
  }
  console.log('='.repeat(50) + '\n');

  // Show summary by category
  console.log('📊 Summary by category:');
  for (const [section, cars] of Object.entries(carSections)) {
    const subcat = sectionMapping[section];
    console.log(`   ${subcat}: ${cars.length} cars`);
  }
}

// Run the seed
seedCars().catch(console.error);
