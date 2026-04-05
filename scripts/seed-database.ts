import { supabase } from '../src/lib/supabase';
import { MOCK_VENUES } from '../src/data/venues/mockData';
import { MOCK_SERVICES as MOCK_TRANSPORT_SERVICES } from '../src/lib/transport';
import { MOCK_EXPERIENCES } from '../src/lib/experiences';
import { MOCK_PROPERTIES } from '../src/lib/stays';
import { MOCK_SERVICES as MOCK_BUSINESS_SERVICES } from '../src/lib/business';

type SeedVenue = {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  location: string;
  area: string;
  vibe_tags: string[];
  price_tier: number;
  hero_image: string;
  gallery_images: string[];
  description_short: string;
  description_long: string;
  highlights: string[];
  recommend_score: number;
  opening_hours: string;
  dress_code: string;
  booking_policy: string;
  status: string;
  created_at: string;
  updated_at: string;
};

const PARTNER_VENUES = {
  restaurants: [
    { name: 'Bagatelle', location: 'Fairmont SZR', category: 'Fine Dining' },
    { name: 'Verde', location: 'Four Seasons', category: 'Fine Dining' },
    { name: 'CouCou', location: 'Palm Jumeirah', category: 'Rooftop Dining' },
    { name: 'Amazonico', location: 'DIFC', category: 'Latin American' },
    { name: 'Il Gattopardo', location: 'DIFC', category: 'Italian' },
    { name: 'Bar de Pres', location: 'DIFC', category: 'Asian Fusion' },
    { name: 'Nahate', location: 'DIFC', category: 'Fine Dining' },
    { name: 'Nobu', location: 'Atlantis The Palm', category: 'Japanese' },
    { name: 'Ling Ling', location: 'Atlantis The Royal', category: 'Asian' },
    { name: 'La Mar', location: 'Atlantis The Royal', category: 'Peruvian' },
    { name: 'Hakkasan', location: 'Atlantis The Palm', category: 'Cantonese' },
    { name: 'Tang', location: 'Downtown', category: 'Asian' },
    { name: 'Nazcaa', location: 'Downtown', category: 'Japanese-Peruvian' },
    { name: 'Krasota', location: 'Downtown', category: 'Immersive Dining' },
    { name: 'Salvaje', location: 'Downtown', category: 'Japanese' },
    { name: 'Shanghai Me', location: 'DIFC', category: 'Asian' },
    { name: 'Coya', location: 'Four Seasons', category: 'Peruvian' },
    { name: 'Amelia', location: 'Downtown', category: 'Nikkei' },
    { name: 'Ce La Vi', location: 'Downtown', category: 'Asian Fusion' },
    { name: 'Sushi Samba', location: 'Palm Jumeirah', category: 'Japanese/Brazilian' },
    { name: 'La Nina', location: 'DIFC', category: 'Iberian/Latino' },
    { name: 'Clap', location: 'DIFC', category: 'Japanese' },
    { name: 'Sexy Fish', location: 'DIFC', category: 'Asian' },
    { name: 'Nammos', location: 'Four Seasons Jumeirah', category: 'Mediterranean' },
    { name: 'Tattu', location: 'Ciel Dubai Marina', category: 'Chinese' },
  ],
  beachClubs: [
    { name: 'Verde Beach', location: 'Umm Suqeim' },
    { name: 'African Queen', location: 'J1' },
    { name: 'Sakhalin', location: 'J1' },
    { name: 'Gigi', location: 'J1' },
    { name: 'Baoli', location: 'J1' },
    { name: 'Ina', location: 'J1' },
    { name: 'Maison Revka', location: 'Bluewaters' },
    { name: 'Nikki Beach', location: 'Pearl Jumeirah' },
    { name: 'Nobu by the Beach', location: 'Atlantis The Royal' },
    { name: 'Casablanca Beach', location: 'Atlantis The Palm' },
    { name: 'Drift Beach', location: 'Dubai Marina' },
    { name: 'Playa', location: 'Palm Jumeirah' },
  ],
};

function transformPartnerVenues(): SeedVenue[] {
  const now = new Date().toISOString();
  const venues: SeedVenue[] = [];

  PARTNER_VENUES.restaurants.forEach((restaurant, index) => {
    venues.push({
      id: `seed-rest-${index}`,
      name: restaurant.name,
      category: 'dining',
      subcategory: restaurant.category,
      location: restaurant.location,
      area: restaurant.location.split(' ')[0],
      vibe_tags: ['Fine Dining', 'Curated'],
      price_tier: 4,
      hero_image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2670&auto=format&fit=crop',
      gallery_images: [],
      description_short: `${restaurant.category} at ${restaurant.location}`,
      description_long: `Experience exceptional ${restaurant.category.toLowerCase()} at ${restaurant.name}, located in ${restaurant.location}.`,
      highlights: ['Prime location', 'Curated by DALC'],
      recommend_score: 90,
      opening_hours: 'Daily: 6:00 PM - 12:00 AM',
      dress_code: 'Smart Casual',
      booking_policy: 'Reservations recommended',
      status: 'published',
      created_at: now,
      updated_at: now,
    });
  });

  PARTNER_VENUES.beachClubs.forEach((club, index) => {
    venues.push({
      id: `seed-beach-${index}`,
      name: club.name,
      category: 'beach-clubs',
      subcategory: 'Beach Club',
      location: club.location,
      area: club.location,
      vibe_tags: ['Beach', 'Day to Night', 'Swim'],
      price_tier: 3,
      hero_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2670&auto=format&fit=crop',
      gallery_images: [],
      description_short: `Beach club experience at ${club.location}`,
      description_long: `Enjoy a full day and night at ${club.name}, featuring beach access, dining, and entertainment.`,
      highlights: ['Beach Access', 'Pool', 'Dining'],
      recommend_score: 86,
      opening_hours: 'Daily: 10:00 AM - 2:00 AM',
      dress_code: 'Beachwear',
      booking_policy: 'Day passes available',
      status: 'published',
      created_at: now,
      updated_at: now,
    });
  });

  return venues;
}

async function upsertRows<T extends { id: string; name?: string }>(
  table: string,
  rows: T[],
  label: string,
) {
  for (const row of rows) {
    const { error } = await supabase!
      .from(table)
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.error(`Failed to seed ${label} ${row.name ?? row.id}:`, error);
    } else {
      console.log(`Seeded ${label}: ${row.name ?? row.id}`);
    }
  }
}

async function seedDatabase() {
  console.log('Starting DALC database seeding...');

  if (!supabase) {
    console.error('Supabase is not configured. Check your environment variables.');
    return;
  }

  try {
    const allVenues = [...MOCK_VENUES, ...transformPartnerVenues()];

    await upsertRows('venues', allVenues, 'venue');
    await upsertRows('transport_services', MOCK_TRANSPORT_SERVICES, 'transport service');
    await upsertRows('experience_services', MOCK_EXPERIENCES, 'experience');
    await upsertRows('stays_properties', MOCK_PROPERTIES, 'stay');
    await upsertRows('business_services', MOCK_BUSINESS_SERVICES, 'business service');

    console.log('Database seeding complete.');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
}

seedDatabase();
