import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Next.js sets current working directory, we need to load from relative root
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Force ts-node to ignore types inside imported files, we just want their payload
import { VENUE_CATEGORIES, VENUE_COORDINATES } from '../src/data/venues/venuesData.js';
import { MOCK_EXPERIENCES } from '../src/lib/experiences.js';
import { CAR_CATEGORIES } from '../src/data/transport/carsData.js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials in .env.local");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("🌱 Seeding started...");

  // 1. Emirate
  console.log("Creating Emirates...");
  const { data: emirate, error: emErr } = await supabase.from('emirates').upsert({
    slug: 'dubai', name: 'Dubai'
  }, { onConflict: 'slug' }).select().single();
  
  if (emErr) throw emErr;
  const emirateId = emirate?.id;
  console.log(`✅ Dubai emirate recorded (${emirateId})`);

  // 2. Categories
  console.log("Creating Venue Categories...");
  const catMap = new Map();
  for (const cat of VENUE_CATEGORIES) {
     const { data, error } = await supabase.from('venue_categories').upsert({
        slug: cat.id,
        label: cat.title
     }, { onConflict: 'slug' }).select().single();
     if (error) console.error("Category err:", error);
     if (data) catMap.set(cat.id, data.id);
  }
  console.log(`✅ Created ${catMap.size} venue categories`);

  // 3. Venues
  console.log("Creating Venues...");
  let venueCount = 0;
  for (const cat of VENUE_CATEGORIES) {
      const dbCatId = catMap.get(cat.id);
      for (const v of cat.items) {
          const coords = VENUE_COORDINATES[v.id] || { lat: null, lng: null };
          const { error } = await supabase.from('venues').upsert({
              slug: v.id,
              name: v.name,
              category_id: dbCatId,
              emirate_id: emirateId,
              location: v.location,
              lat: coords.lat,
              lng: coords.lng,
              price_tier: v.priceRange ? v.priceRange.length : 2,
              vibe: v.vibe,
              tags: v.tags || [],
              is_trending: v.trending || false,
              is_new: v.isNew || false,
              status: 'published'
          }, { onConflict: 'slug' });
          if (error) {
            console.error(`Venue error [${v.id}]:`, error);
          } else {
             venueCount++;
          }
      }
  }
  console.log(`✅ Seeded ${venueCount} venues`);

  // 4. Experiences
  console.log("Creating Experiences...");
  let expCount = 0;
  for (const exp of MOCK_EXPERIENCES) {
      const { error } = await supabase.from('experience_services').upsert({
          slug: exp.slug || exp.id,
          title: exp.name || exp.title || 'Unknown',
          subcategory: exp.subcategory || 'general',
          duration: exp.duration?.toString(),
          min_age: exp.minAge || null,
          is_popular: exp.isPopular || false,
          hero_image_url: exp.hero_image || exp.heroImage,
          description_short: exp.description_short || exp.description,
          description_long: exp.description_long,
          highlights: exp.highlights || [],
          inclusions: exp.inclusions || [],
          status: 'published',
          emirate_id: emirateId
      }, { onConflict: 'slug' });
      if (error) {
        console.error(`Exp error [${exp.id}]:`, error);
      } else {
         expCount++;
      }
  }
  console.log(`✅ Seeded ${expCount} experiences`);

  // 5. Cars
  console.log("Creating Transport (Cars)...");
  let carCount = 0;
  for (const cat of CAR_CATEGORIES) {
      for (const car of cat.items) {
          const { error } = await supabase.from('transport_items').upsert({
              slug: car.id,
              type: 'car',
              category: cat.id,
              brand: car.brand || car.name.split(' ')[0], 
              model: car.name,
              daily_price_aed: parseInt(car.price?.replace(/[^0-9]/g, '') || '0'),
              seats: car.passengers || car.seats || 4,
              image_url: car.image,
              is_popular: car.isTrending || false,
              status: 'published'
          }, { onConflict: 'slug' });
          if (error) {
             console.error(`Car error [${car.id}]:`, error);
          } else {
             carCount++;
          }
      }
  }
  console.log(`✅ Seeded ${carCount} cars`);

  console.log("🚀 All seeding complete!");
}

seed().catch(console.error);
