import { Venue, Request } from '../../types';
import { enrichVenues } from './skillsMapping';

export const CATEGORIES = [
  { id: 'dining', label: 'Restaurants', icon: 'Utensils', desc: 'Fine dining & Michelin' },
  { id: 'beach-clubs', label: 'Beach Clubs', icon: 'Palmtree', desc: 'Day to night venues' },
  { id: 'nightlife', label: 'Night Clubs', icon: 'Music', desc: 'VIP & late night' },
  { id: 'dining-entertainment', label: 'Dining & Entertainment', icon: 'Mic2', desc: 'Dinner shows & performances' },
  { id: 'experiences', label: 'Experiences', icon: 'Star', desc: 'Curated adventures' },
  { id: 'yachts', label: 'Yachts', icon: 'Ship', desc: 'Private charters' },
  { id: 'travel', label: 'Travel', icon: 'Plane', desc: 'Private jets & transfers' },
  { id: 'car-rental', label: 'Car Rental', icon: 'Car', desc: 'Luxury fleet' },
  { id: 'business', label: 'Business', icon: 'Briefcase', desc: 'Legal & Corporate' },
  { id: 'shopping', label: 'Lifestyle', icon: 'ShoppingBag', desc: 'Personal shopping' },
];

import { VENUE_CATEGORIES } from './venuesData';

export const RAW_VENUES = [
  ...VENUE_CATEGORIES.flatMap(cat => {
    let categoryMap: string = cat.id;
    if (cat.id === 'restaurants') categoryMap = 'dining';
    else if (cat.id === 'night-clubs') categoryMap = 'nightlife';

    return cat.items.map((item, idx) => ({
      id: item.id,
      name: item.name,
      category: categoryMap as any,
      subcategory: cat.title,
      location: item.location,
      area: item.location,
      vibe_tags: item.tags,
      price_tier: item.priceRange.length,
      hero_image: '',
      gallery_images: [],
      description_short: item.vibe,
      description_long: item.seoDescription || item.vibe,
      highlights: item.tags.slice(0, 3),
      recommend_score: 95 - (idx % 10),
      is_trending: item.trending || false,
      opening_hours: 'Contact concierge',
      dress_code: 'Smart Elegant',
      booking_policy: 'Reservations recommended',
      best_time: 'Evening',
      who_its_for: 'Couples, Groups',
      cuisine: item.tags[0] || 'International',
      coordinates: item.coordinates
    }));
  }),
  {
    id: 'exp-platinum',
    name: 'Platinum Heritage',
    category: 'experiences',
    subcategory: 'Desert Safari',
    location: 'Dubai Desert Conservation Reserve',
    area: 'Desert',
    vibe_tags: ['Desert', 'Cultural', 'Nature'],
    price_tier: 4,
    hero_image: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1512453979798-5ea904ac6686?q=80&w=2663&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=2670&auto=format&fit=crop'
    ],
    description_short: 'The ultimate authentic luxury desert safari.',
    description_long: 'Explore the pristine Dubai Desert Conservation Reserve in a vintage Land Rover. Platinum Heritage offers the most authentic and luxurious desert experience, featuring a six-course dinner under the stars, falconry displays, and a retreat to a private oasis.',
    highlights: ['Vintage Land Rovers', 'Falconry', 'Private Oasis'],
    recommend_score: 99,
    is_featured: true,
    opening_hours: 'Duration: 7 Hours',
    dress_code: 'Comfortable Outdoor',
    booking_policy: 'Advance booking required.',
    best_time: 'Afternoon to Evening',
    who_its_for: 'Couples, Families, Culture Seekers',
    insider_tip: 'Book the "Heritage Collection" for the classic 1950s Land Rover experience.'
  },
  {
    id: 'exp-skydive',
    name: 'Skydive Dubai',
    category: 'experiences',
    subcategory: 'Aerial Adventure',
    location: 'Dubai Marina',
    area: 'Dubai Marina',
    vibe_tags: ['Sky', 'Adrenaline', 'Views'],
    price_tier: 4,
    hero_image: 'https://images.unsplash.com/photo-1526660690293-bcd32dc3b123?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?q=80&w=2668&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520697962402-9ae43b355823?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496660481065-9dc883447385?q=80&w=2670&auto=format&fit=crop'
    ],
    description_short: 'The world’s premier tandem skydiving experience.',
    description_long: 'Jump from 13,000 feet over the iconic Palm Jumeirah. Skydive Dubai offers a once-in-a-lifetime adrenaline rush with the most spectacular freefall views on the planet. Professional videography included.',
    highlights: ['Palm Views', '13,000ft Drop', 'Professional Video'],
    recommend_score: 98,
    is_featured: true,
    opening_hours: 'Duration: 3 Hours',
    dress_code: 'Athletic Wear',
    booking_policy: 'Strict weight limits apply.',
    best_time: 'Morning (Clear Skies)',
    who_its_for: 'Thrill Seekers, Bucket Listers',
    insider_tip: 'Winter mornings offer the crispest visibility for your video footage.'
  },
  {
    id: 'exp-balloon',
    name: 'Balloon Adventures',
    category: 'experiences',
    subcategory: 'Aerial Tour',
    location: 'Dubai Desert',
    area: 'Desert',
    vibe_tags: ['Sky', 'Sunrise', 'Peaceful'],
    price_tier: 4,
    hero_image: 'https://images.unsplash.com/photo-1505527264870-17936a281861?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1574974635848-185d883b63a2?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589712613501-c88f1d3c013b?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516939884455-1445c8652f83?q=80&w=2574&auto=format&fit=crop'
    ],
    description_short: 'Sunrise flight over the endless dunes.',
    description_long: 'Float 4,000 feet above the desert dunes as the sun rises over the Hajar Mountains. Witness roaming oryx and gazelles from above in a serene, magical experience followed by a gourmet breakfast.',
    highlights: ['Sunrise Views', 'Wildlife Spotting', 'Gourmet Breakfast'],
    recommend_score: 96,
    is_featured: false,
    opening_hours: 'Duration: 4 Hours (Sunrise)',
    dress_code: 'Layers (Chilly Morning)',
    booking_policy: 'Weather dependent.',
    best_time: 'Sunrise',
    who_its_for: 'Romance, Photography',
    insider_tip: 'The "Private Charter" allows you to customize the flight path and breakfast menu.'
  },
  {
    id: 'exp-deepdive',
    name: 'Deep Dive Dubai',
    category: 'experiences',
    subcategory: 'Aquatic Adventure',
    location: 'Nad Al Sheba',
    area: 'Nad Al Sheba',
    vibe_tags: ['Water', 'Indoor', 'Exclusive'],
    price_tier: 4,
    hero_image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=2575&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2673&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1682687221038-404670e01d46?q=80&w=2670&auto=format&fit=crop'
    ],
    description_short: 'Dive into the world’s deepest pool.',
    description_long: 'Explore a sunken city 60 meters underwater. Deep Dive Dubai is a world-record breaking facility that offers a unique diving experience in a controlled environment, complete with abandoned streetscapes and an apartment.',
    highlights: ['60m Depth', 'Sunken City', 'Underwater Habitat'],
    recommend_score: 97,
    is_featured: true,
    opening_hours: 'Duration: 2-3 Hours',
    dress_code: 'Swimwear',
    booking_policy: 'Certified divers or intro course.',
    best_time: 'Morning or Afternoon',
    who_its_for: 'Divers, Adventurers',
    insider_tip: 'Book the "Guided Tour" even if you are certified to find the hidden easter eggs in the sunken city.'
  },
  {
    id: 'exp-yacht',
    name: 'Private Yacht Charter',
    category: 'experiences',
    subcategory: 'Exclusive Event',
    location: 'Dubai Harbour',
    area: 'Dubai Marina',
    vibe_tags: ['Water', 'Luxury', 'Private'],
    price_tier: 4,
    hero_image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1605281317010-fe5ffe79b9b7?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2670&auto=format&fit=crop'
    ],
    description_short: 'Sunset cruise on a 100ft Azimut.',
    description_long: 'Experience Dubai from the water on a private superyacht. Sail around the Palm Jumeirah, anchor in the lagoon for a swim, and enjoy a private chef dinner on the deck with the skyline as your backdrop.',
    highlights: ['Private Chef', 'Water Toys', 'Skyline Views'],
    recommend_score: 95,
    is_featured: false,
    opening_hours: 'Duration: 4 Hours',
    dress_code: 'Nautical Chic',
    booking_policy: 'Full day or half day charters.',
    best_time: 'Sunset (4 PM - 8 PM)',
    who_its_for: 'Groups, Celebration, VIPs',
    insider_tip: 'Ask the captain to anchor near the Atlantis for the best firework views on special occasions.'
  }
] as any[];

export const MOCK_VENUES: Venue[] = enrichVenues(RAW_VENUES);

export const MOCK_REQUESTS: Request[] = [
  {
    id: 'r1',
    category: 'dining',
    request_type: 'booking',
    venue_name: 'Zuma',
    date_time: '2023-12-25T20:00:00',
    party_size: 2,
    status: 'confirmed',
    priority_score: 80,
    notes: 'Anniversary'
  },
  {
    id: 'r2',
    category: 'yachts',
    request_type: 'booking',
    date_time: '2023-12-31T14:00:00',
    party_size: 10,
    status: 'submitted',
    priority_score: 95,
    notes: 'NYE warm up'
  }
];
