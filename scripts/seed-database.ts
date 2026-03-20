import { supabase } from '../src/lib/supabase';
import { MOCK_VENUES } from '../src/data/mockData';
import { MOCK_SERVICES } from '../src/lib/transport';
import { MOCK_EXPERIENCES } from '../src/lib/experiences';

// Parse Venues.txt for additional data
const VENUES_DATA = {
  "partners": {
    "restaurants": [
      { "name": "Bagatelle", "location": "Fairmont SZR", "category": "Fine Dining" },
      { "name": "Verde", "location": "Four Seasons", "category": "Fine Dining" },
      { "name": "CouCou", "location": "Palm Jumeirah", "category": "Rooftop Dining" },
      { "name": "Amazonico", "location": "DIFC", "category": "Latin American" },
      { "name": "Il Gattopardo", "location": "DIFC", "category": "Italian" },
      { "name": "Bar de Pres", "location": "DIFC", "category": "Asian Fusion" },
      { "name": "1920", "location": "DIFC", "category": "Speakeasy/Dining" },
      { "name": "Nahate", "location": "DIFC", "category": "Fine Dining" },
      { "name": "Nobu", "location": "Atlantis The Palm", "category": "Japanese" },
      { "name": "Ling Ling", "location": "Atlantis The Royal", "category": "Asian" },
      { "name": "La Mar", "location": "Atlantis The Royal", "category": "Peruvian" },
      { "name": "Hakkasan", "location": "Atlantis The Palm", "category": "Cantonese" },
      { "name": "MamaBella", "location": "Kempinski Hotel", "category": "Italian" },
      { "name": "Woohoo", "location": "Kempinski Hotel", "category": "Dining" },
      { "name": "Ram & Roll", "location": "Kempinski Hotel", "category": "Dining" },
      { "name": "Tang", "location": "Downtown", "category": "Asian" },
      { "name": "Nazcaa", "location": "Downtown", "category": "Japanese-Peruvian" },
      { "name": "Krasota", "location": "Downtown", "category": "Immersive Dining" },
      { "name": "Salvaje", "location": "Downtown", "category": "Japanese" },
      { "name": "Villa Coconut", "location": "DIFC", "category": "Mediterranean" },
      { "name": "Shanghai Me", "location": "DIFC", "category": "Asian" },
      { "name": "Gal", "location": "Downtown", "category": "Mediterranean/Turkish" },
      { "name": "Urla", "location": "Downtown", "category": "Aegean" },
      { "name": "Coya", "location": "Four Seasons", "category": "Peruvian" },
      { "name": "Amelia", "location": "Downtown", "category": "Nikkei" },
      { "name": "Ce La Vi", "location": "Downtown", "category": "Asian Fusion" },
      { "name": "Sushi Samba", "location": "Palm Jumeirah", "category": "Japanese/Brazilian" },
      { "name": "La Niña", "location": "DIFC", "category": "Iberian/Latino" },
      { "name": "Opa", "location": "Fairmont SZR", "category": "Greek" },
      { "name": "Clap", "location": "DIFC", "category": "Japanese" },
      { "name": "Sexy Fish", "location": "DIFC", "category": "Asian" },
      { "name": "Nammos", "location": "Four Seasons Jumeirah", "category": "Mediterranean" },
      { "name": "Tattu", "location": "Ciel Dubai Marina", "category": "Chinese" }
    ],
    "beach_clubs": [
      { "name": "Verde Beach", "location": "Umm Suqeim" },
      { "name": "African Queen", "location": "J1" },
      { "name": "Sakhalin", "location": "J1" },
      { "name": "Gigi", "location": "J1" },
      { "name": "Baoli", "location": "J1" },
      { "name": "Ina", "location": "J1" },
      { "name": "Maison Revka", "location": "Bluewaters" },
      { "name": "Nikki Beach", "location": "Pearl Jumeirah" },
      { "name": "Nobu by the Beach", "location": "Atlantis The Royal" },
      { "name": "Casablanca Beach", "location": "Atlantis The Palm" },
      { "name": "Drift Beach", "location": "Dubai Marina" },
      { "name": "Playa", "location": "Palm Jumeirah" },
    ]
  }
};

// Transform Venues.txt data into venue format
function transformVenuesTxtData() {
  const venues = [];

  // Transform restaurants
  VENUES_DATA.partners.restaurants.forEach((restaurant, index) => {
    venues.push({
      id: `txt-rest-${index}`,
      name: restaurant.name,
      category: 'dining',
      subcategory: restaurant.category,
      location: restaurant.location,
      area: restaurant.location.split(' ')[0], // Extract area from location
      vibe_tags: ['Fine Dining', 'Curated'],
      price_tier: 4,
      hero_image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2670&auto=format&fit=crop',
      gallery_images: [],
      description_short: `${restaurant.category} at ${restaurant.location}`,
      description_long: `Experience exceptional ${restaurant.category.toLowerCase()} at ${restaurant.name}, located in ${restaurant.location}.`,
      highlights: ['Michelin-quality', 'Prime location'],
      recommend_score: 90,
      opening_hours: 'Daily: 6:00 PM - 12:00 AM',
      dress_code: 'Smart Casual',
      booking_policy: 'Reservations recommended',
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  });

  // Transform beach clubs
  VENUES_DATA.partners.beach_clubs.forEach((club, index) => {
    venues.push({
      id: `txt-club-${index}`,
      name: club.name,
      category: 'beach-clubs',
      subcategory: 'Beach Club',
      location: club.location,
      area: club.location,
      vibe_tags: ['Beach', 'Day to Night', 'Swim'],
      price_tier: 3,
      hero_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2670&auto=format&fit=crop',
      gallery_images: [],
      description_short: `Beach club experience at ${club.location}`,
      description_long: `Enjoy a full day and night at ${club.name}, featuring beach access, dining, and entertainment.`,
      highlights: ['Beach Access', 'Pool', 'Dining'],
      recommend_score: 85,
      opening_hours: 'Daily: 10:00 AM - 2:00 AM',
      dress_code: 'Beachwear',
      booking_policy: 'Day passes available',
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  });

  return venues;
}

async function seedDatabase() {
  console.log('🚀 Starting DALC database seeding...');

  if (!supabase) {
    console.error('❌ Supabase not configured. Check your environment variables.');
    return;
  }

  try {
    // 1. Seed Venues (from mockData.ts + Venues.txt)
    console.log('📍 Seeding venues...');
    const allVenues = [...MOCK_VENUES, ...transformVenuesTxtData()];

    for (const venue of allVenues) {
      const { error } = await supabase
        .from('venues')
        .upsert(venue, { onConflict: 'id' });

      if (error) {
        console.error(`❌ Failed to seed venue ${venue.name}:`, error);
      } else {
        console.log(`✅ Seeded venue: ${venue.name}`);
      }
    }

    // 2. Seed Transport Services
    console.log('🚗 Seeding transport services...');
    for (const service of MOCK_SERVICES) {
      const { error } = await supabase
        .from('transport_services')
        .upsert(service, { onConflict: 'id' });

      if (error) {
        console.error(`❌ Failed to seed transport ${service.name}:`, error);
      } else {
        console.log(`✅ Seeded transport: ${service.name}`);
      }
    }

    // 3. Seed Experience Services
    console.log('🎯 Seeding experience services...');
    for (const experience of MOCK_EXPERIENCES) {
      const { error } = await supabase
        .from('experience_services')
        .upsert(experience, { onConflict: 'id' });

      if (error) {
        console.error(`❌ Failed to seed experience ${experience.name}:`, error);
      } else {
        console.log(`✅ Seeded experience: ${experience.name}`);
      }
    }

    // 4. Seed Stays Properties (placeholder for now)
    console.log('🏨 Seeding stays properties...');
    // Add your stays mock data here when ready

    // 5. Seed Business Services (placeholder for now)
    console.log('💼 Seeding business services...');
    // Add your business mock data here when ready

    console.log('🎉 Database seeding complete!');

  } catch (error) {
    console.error('💥 Seeding failed:', error);
  }
}

// Run the seeder
seedDatabase();
