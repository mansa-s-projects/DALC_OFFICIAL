-- ============================================================
-- Activities System — Seed Data
-- Phase 2: Categories, default vendor, and initial activities
-- from the existing MOCK_EXPERIENCES dataset
-- ============================================================

-- ─── Default Vendor ─────────────────────────────────────────
-- DALC first-party activities vendor

INSERT INTO public.vendors (id, name, slug, description, contact_whatsapp, emirate, is_verified, status)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Dubai À La Carte',
  'dalc',
  'Premium concierge and first-party activity provider.',
  '971585987600',
  'Dubai',
  true,
  'active'
)
ON CONFLICT (slug) DO NOTHING;

-- ─── Third-party vendor stubs ───────────────────────────────

INSERT INTO public.vendors (id, name, slug, description, emirate, is_verified, status) VALUES
  ('a0000000-0000-0000-0000-000000000002', 'Skydive Dubai', 'skydive-dubai', 'Professional skydiving over Palm Jumeirah and Desert.', 'Dubai', false, 'active'),
  ('a0000000-0000-0000-0000-000000000003', 'HeliDubai', 'helidubai', 'Helicopter tours over Dubai landmarks.', 'Dubai', false, 'active'),
  ('a0000000-0000-0000-0000-000000000004', 'Atlantis The Palm', 'atlantis-the-palm', 'Marine experiences and underwater adventures.', 'Dubai', false, 'active'),
  ('a0000000-0000-0000-0000-000000000005', 'Talise Ottoman Spa', 'talise-ottoman-spa', 'Luxury Ottoman spa at Jumeirah Zabeel Saray.', 'Dubai', false, 'active'),
  ('a0000000-0000-0000-0000-000000000006', 'Anantara The Palm', 'anantara-the-palm', 'Luxury spa and wellness resort.', 'Dubai', false, 'active'),
  ('a0000000-0000-0000-0000-000000000007', 'Tresind Studio', 'tresind-studio', 'Two Michelin-star progressive Indian dining.', 'Dubai', false, 'active'),
  ('a0000000-0000-0000-0000-000000000008', 'WHITE Dubai', 'white-dubai', 'Award-winning rooftop nightclub at Meydan.', 'Dubai', false, 'active'),
  ('a0000000-0000-0000-0000-000000000009', 'Aura Skypool', 'aura-skypool', 'World''s highest 360° infinity pool.', 'Dubai', false, 'active'),
  ('a0000000-0000-0000-0000-000000000010', 'Sonara Camp', 'sonara-camp', 'Premium desert dining and overnight camp.', 'Dubai', false, 'active')
ON CONFLICT (slug) DO NOTHING;


-- ─── Top-Level Categories ───────────────────────────────────

INSERT INTO public.activity_categories (id, slug, name, description, sort_order, parent_id, is_active) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'desert-adventures', 'Desert Adventures', 'Dune buggies, ATVs, and off-road safaris in the Dubai desert.', 1, NULL, true),
  ('c0000000-0000-0000-0000-000000000002', 'water-activities', 'Water Activities', 'Jet skis, yacht charters, and high-speed water experiences along the Dubai coastline.', 2, NULL, true),
  ('c0000000-0000-0000-0000-000000000003', 'aerial-and-adrenaline', 'Aerial & Adrenaline', 'Sky-focused and adrenaline-led experiences.', 3, NULL, true),
  ('c0000000-0000-0000-0000-000000000004', 'wellness', 'Wellness', 'Spa retreats, yoga sessions, and rejuvenating experiences for mind and body.', 4, NULL, true),
  ('c0000000-0000-0000-0000-000000000005', 'tickets-and-culture', 'Tickets & Culture', 'Cultural tours, events, and curated access.', 5, NULL, true),
  ('c0000000-0000-0000-0000-000000000006', 'luxury-leisure', 'Luxury Leisure', 'Premium lifestyle bookings and luxury cars.', 6, NULL, true),
  ('c0000000-0000-0000-0000-000000000007', 'photography-experience', 'Photography & Experience', 'Unforgettable dress photoshoots in the desert or at the stud farm.', 7, NULL, true),
  ('c0000000-0000-0000-0000-000000000008', 'signature-dining', 'Signature Dining', 'Exclusive gourmet dining experiences under the stars or at the stud farm.', 8, NULL, true),
  ('c0000000-0000-0000-0000-000000000009', 'observation', 'Observation', 'Sky-high viewpoints and iconic observatory experiences.', 9, NULL, true)
ON CONFLICT (slug) DO NOTHING;

-- ─── Subcategories ──────────────────────────────────────────

INSERT INTO public.activity_categories (slug, name, sort_order, parent_id, is_active) VALUES
  -- Desert Adventures subs
  ('desert-safari', 'Desert Safari', 1, 'c0000000-0000-0000-0000-000000000001', true),
  ('quad-biking', 'Quad Biking', 2, 'c0000000-0000-0000-0000-000000000001', true),
  ('dune-buggy', 'Dune Buggy', 3, 'c0000000-0000-0000-0000-000000000001', true),
  ('horse-riding', 'Horse Riding', 4, 'c0000000-0000-0000-0000-000000000001', true),
  ('desert-camp', 'Desert Camp', 5, 'c0000000-0000-0000-0000-000000000001', true),
  -- Water Activities subs
  ('jet-ski', 'Jet Ski', 1, 'c0000000-0000-0000-0000-000000000002', true),
  ('water-car', 'Water Car', 2, 'c0000000-0000-0000-0000-000000000002', true),
  ('scuba-diving', 'Scuba Diving', 3, 'c0000000-0000-0000-0000-000000000002', true),
  ('yacht-charter', 'Yacht Charter', 4, 'c0000000-0000-0000-0000-000000000002', true),
  -- Aerial subs
  ('helicopter-tour', 'Helicopter Tour', 1, 'c0000000-0000-0000-0000-000000000003', true),
  ('skydiving', 'Skydiving', 2, 'c0000000-0000-0000-0000-000000000003', true),
  ('zipline', 'Zipline', 3, 'c0000000-0000-0000-0000-000000000003', true),
  -- Wellness subs
  ('spa-resort', 'Spa Resort', 1, 'c0000000-0000-0000-0000-000000000004', true),
  ('yoga-retreat', 'Yoga Retreat', 2, 'c0000000-0000-0000-0000-000000000004', true),
  ('meditation', 'Meditation', 3, 'c0000000-0000-0000-0000-000000000004', true),
  -- Culture subs
  ('heritage-walk', 'Heritage Walk', 1, 'c0000000-0000-0000-0000-000000000005', true),
  ('museum-tour', 'Museum Tour', 2, 'c0000000-0000-0000-0000-000000000005', true),
  ('art-gallery', 'Art Gallery', 3, 'c0000000-0000-0000-0000-000000000005', true),
  -- Luxury Leisure subs
  ('rooftop-lounges', 'Rooftop Lounges', 1, 'c0000000-0000-0000-0000-000000000006', true),
  ('clubs', 'Clubs', 2, 'c0000000-0000-0000-0000-000000000006', true),
  ('fine-dining', 'Fine Dining', 3, 'c0000000-0000-0000-0000-000000000006', true)
ON CONFLICT (slug) DO NOTHING;


-- ─── Activities (from MOCK_EXPERIENCES) ─────────────────────
-- Migrating the 15 key experiences from lib/experiences.ts

-- Helper: get subcategory ID
-- We use direct UUID refs for the category mappings

-- 1. Aura Skypool Lounge
INSERT INTO public.activities (
  vendor_id, category_id, slug, name, description_short, description_long,
  highlights, vibe_tags, service_type, duration_minutes, max_capacity,
  location, area, venue_name, age_minimum, dress_code,
  requirements, included, excluded,
  is_featured, is_trending, trending_score, booking_count, status
) VALUES (
  'a0000000-0000-0000-0000-000000000009',
  (SELECT id FROM public.activity_categories WHERE slug = 'rooftop-lounges' LIMIT 1),
  'aura-skypool-sunset-session',
  'Aura Skypool Lounge — Sunset Session',
  'The world''s highest 360° infinity pool with panoramic views of the Palm Jumeirah.',
  'Experience the iconic Aura Skypool, suspended 200 meters in the air on the 50th floor of the Palm Tower. This sunset session includes premium lounger access, welcome drink, and unparalleled views of the Dubai skyline as the sun dips below the horizon.',
  ARRAY['360° infinity pool access', 'Palm Jumeirah skyline views', 'Premium sun lounger', 'Welcome champagne cocktail'],
  ARRAY['Luxury', 'Views', 'Instagram-worthy', 'Romantic'],
  'recurring', 240, 120,
  'Dubai', 'Palm Jumeirah', 'Aura Skypool', 21,
  'Smart casual. Swimwear acceptable with cover-up.',
  ARRAY['Valid ID', 'Advance booking required'],
  ARRAY['Pool access', 'Sun lounger', 'Welcome drink', 'Towel service'],
  ARRAY['Food and beverages', 'Spa treatments', 'Transportation'],
  true, true, 98, 1247, 'published'
) ON CONFLICT (slug) DO NOTHING;

-- 2. WHITE Dubai
INSERT INTO public.activities (
  vendor_id, category_id, slug, name, description_short, description_long,
  highlights, vibe_tags, service_type, duration_minutes, max_capacity,
  location, area, venue_name, age_minimum, dress_code,
  requirements, included, excluded,
  is_featured, is_trending, trending_score, booking_count, status
) VALUES (
  'a0000000-0000-0000-0000-000000000008',
  (SELECT id FROM public.activity_categories WHERE slug = 'clubs' LIMIT 1),
  'white-dubai-vip-table',
  'WHITE Dubai — VIP Table Experience',
  'Dubai''s ultimate rooftop nightclub with world-class DJs and skyline views.',
  'WHITE Dubai is an award-winning outdoor rooftop nightclub at Meydan Racecourse Grandstand. This VIP table experience includes priority entry, premium bottle service, and a private table with unmatched views of the dance floor and Dubai skyline.',
  ARRAY['VIP skip-the-line entry', 'Private table with premium location', 'Bottle service included', 'World-class DJ performances'],
  ARRAY['Party', 'High-energy', 'Celebrity hotspot', 'Luxury'],
  'recurring', 300, 400,
  'Dubai', 'Meydan', 'WHITE Dubai', 21,
  'Smart elegant. No sportswear or flip-flops.',
  ARRAY['Valid ID or passport', 'Advance reservation required'],
  ARRAY['VIP entry', 'Private table', 'Bottle service', 'Mixers'],
  ARRAY['Additional beverages', 'Food', 'Transportation'],
  true, true, 95, 2156, 'published'
) ON CONFLICT (slug) DO NOTHING;

-- 3. Platinum Desert Safari
INSERT INTO public.activities (
  vendor_id, category_id, slug, name, description_short, description_long,
  highlights, vibe_tags, service_type, duration_minutes, max_capacity,
  location, area, age_minimum,
  requirements, included, excluded,
  is_featured, is_trending, trending_score, booking_count, status
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  (SELECT id FROM public.activity_categories WHERE slug = 'desert-safari' LIMIT 1),
  'platinum-desert-safari-dinner',
  'Platinum Desert Safari & Dinner',
  'Luxury desert safari with wildlife drive, falcon show, and gourmet dinner under the stars.',
  'Experience the Dubai Desert Conservation Reserve in ultimate luxury. This platinum safari includes a private wildlife drive in a Range Rover, interactive falcon demonstration, camel ride, and a 6-course gourmet dinner at an exclusive desert camp with live entertainment.',
  ARRAY['Private Range Rover wildlife drive', 'Interactive falcon demonstration', '6-course gourmet dinner', 'Traditional live entertainment'],
  ARRAY['Adventure', 'Luxury', 'Nature', 'Authentic'],
  'recurring', 360, 40,
  'Dubai Desert Conservation Reserve', 'Lahbab', 5,
  ARRAY['Comfortable clothing recommended', 'Hotel pickup included'],
  ARRAY['Hotel pickup/drop-off', 'Wildlife drive', 'Falcon show', 'Camel ride', 'Dinner', 'Entertainment'],
  ARRAY['Alcoholic beverages', 'Personal expenses', 'Gratuities'],
  true, true, 92, 1847, 'published'
) ON CONFLICT (slug) DO NOTHING;

-- 4. Skydive Dubai
INSERT INTO public.activities (
  vendor_id, category_id, slug, name, description_short, description_long,
  highlights, vibe_tags, service_type, duration_minutes, max_capacity,
  location, area, venue_name, age_minimum,
  requirements, included, excluded,
  is_featured, is_trending, trending_score, booking_count, status
) VALUES (
  'a0000000-0000-0000-0000-000000000002',
  (SELECT id FROM public.activity_categories WHERE slug = 'skydiving' LIMIT 1),
  'skydive-dubai-tandem-palm',
  'Skydive Dubai — Tandem Palm Jump',
  'The ultimate adrenaline rush — tandem skydive over the iconic Palm Jumeirah.',
  'Experience the world''s most spectacular skydiving location. Jump from 13,000 feet with a certified instructor and freefall at 120mph over the stunning Palm Jumeirah, with breathtaking views of the Dubai coastline, Burj Al Arab, and the Arabian Gulf.',
  ARRAY['Tandem jump from 13,000 feet', '60-second freefall experience', 'Views of Palm Jumeirah & Burj Al Arab', 'Professional photos & video included'],
  ARRAY['Adrenaline', 'Bucket-list', 'Extreme', 'Unforgettable'],
  'recurring', 180, 80,
  'Dubai', 'Al Seyahi Street', 'Skydive Dubai', 18,
  ARRAY['Weight limit: 100kg max', 'Valid ID required', 'Good health condition'],
  ARRAY['Tandem jump', 'All equipment', 'Training briefing', 'Photos & video', 'Certificate'],
  ARRAY['Insurance', 'Transportation', 'Additional photos'],
  true, true, 96, 3421, 'published'
) ON CONFLICT (slug) DO NOTHING;

-- 5. Tresind Studio
INSERT INTO public.activities (
  vendor_id, category_id, slug, name, description_short, description_long,
  highlights, vibe_tags, service_type, duration_minutes, max_capacity,
  location, area, venue_name, age_minimum, dress_code,
  requirements, included, excluded,
  is_featured, is_trending, trending_score, booking_count, status
) VALUES (
  'a0000000-0000-0000-0000-000000000007',
  (SELECT id FROM public.activity_categories WHERE slug = 'fine-dining' LIMIT 1),
  'tresind-studio-chefs-table',
  'Tresind Studio — Chef''s Table Experience',
  'Intimate 20-course progressive Indian dining at the Chef''s Table.',
  'Tresind Studio is Dubai''s most celebrated progressive Indian restaurant, holding two Michelin stars. The Chef''s Table experience offers an intimate 20-course tasting menu with front-row seats to the kitchen action, personally curated and presented by Chef Himanshu Saini.',
  ARRAY['20-course progressive tasting menu', 'Front-row kitchen views', 'Personal interaction with Chef', 'Wine pairing available'],
  ARRAY['Fine Dining', 'Michelin-starred', 'Intimate', 'Culinary Art'],
  'recurring', 240, 12,
  'Dubai', 'Palm Jumeirah', 'Tresind Studio', 12,
  'Smart elegant',
  ARRAY['Advance booking essential', 'Dietary requirements must be advised'],
  ARRAY['20-course tasting menu', 'Welcome cocktail', 'Coffee/tea'],
  ARRAY['Wine pairing (optional)', 'Additional beverages', 'Gratuities'],
  true, true, 94, 892, 'published'
) ON CONFLICT (slug) DO NOTHING;

-- 6. Shark Safari
INSERT INTO public.activities (
  vendor_id, category_id, slug, name, description_short, description_long,
  highlights, vibe_tags, service_type, duration_minutes, max_capacity,
  location, area, venue_name, age_minimum,
  requirements, included, excluded,
  is_featured, is_trending, trending_score, booking_count, status
) VALUES (
  'a0000000-0000-0000-0000-000000000004',
  (SELECT id FROM public.activity_categories WHERE slug = 'scuba-diving' LIMIT 1),
  'atlantis-dive-shark-safari',
  'Atlantis Dive — Shark Safari Experience',
  'Dive among sharks, rays, and 65,000 marine animals at Atlantis The Palm.',
  'Experience the ultimate underwater adventure at the Ambassador Lagoon, a 11-million-liter marine habitat. The Shark Safari uses specialized helmets that allow you to walk underwater and breathe naturally while surrounded by sharks, rays, and thousands of colorful fish. No diving certification required.',
  ARRAY['Walk underwater in shark tank', 'No diving certification needed', 'Professional underwater photos', 'Marine life education session'],
  ARRAY['Underwater', 'Adventure', 'Family-friendly', 'Unique'],
  'recurring', 120, 12,
  'Dubai', 'Palm Jumeirah', 'Atlantis The Palm', 8,
  ARRAY['Good health condition', 'No diving experience required'],
  ARRAY['All equipment', 'Safety briefing', 'Underwater walk', 'Photos'],
  ARRAY['Wetsuit rental', 'Additional photos', 'Aquarium entry'],
  true, true, 89, 1567, 'published'
) ON CONFLICT (slug) DO NOTHING;

-- 7. HeliDubai Iconic Tour
INSERT INTO public.activities (
  vendor_id, category_id, slug, name, description_short, description_long,
  highlights, vibe_tags, service_type, duration_minutes, max_capacity,
  location, area, venue_name, age_minimum,
  requirements, included, excluded,
  is_featured, is_trending, trending_score, booking_count, status
) VALUES (
  'a0000000-0000-0000-0000-000000000003',
  (SELECT id FROM public.activity_categories WHERE slug = 'helicopter-tour' LIMIT 1),
  'helidubai-iconic-tour',
  'HeliDubai — Iconic Tour (22 min)',
  'Breathtaking helicopter tour over Dubai''s most iconic landmarks.',
  'See Dubai from a whole new perspective with this 22-minute helicopter tour. Soar above the Palm Jumeirah, circle the Burj Al Arab, glide past the World Islands, and witness the towering Burj Khalifa from the sky. An unforgettable experience for any Dubai visitor.',
  ARRAY['22-minute aerial tour', 'Views of Burj Khalifa & Palm Jumeirah', 'Luxury Airbus H130 helicopter', 'Live commentary from pilot'],
  ARRAY['Views', 'Luxury', 'Photography', 'Bucket-list'],
  'recurring', 60, 25,
  'Dubai', 'Dubai Police Academy', 'HeliDubai', 2,
  ARRAY['Valid ID required', 'Weight limit applies'],
  ARRAY['22-min helicopter tour', 'Safety briefing', 'Live commentary'],
  ARRAY['Transportation', 'Photos (available for purchase)', 'Insurance'],
  true, true, 91, 2134, 'published'
) ON CONFLICT (slug) DO NOTHING;

-- 8. Royal Hammam
INSERT INTO public.activities (
  vendor_id, category_id, slug, name, description_short, description_long,
  highlights, vibe_tags, service_type, duration_minutes, max_capacity,
  location, area, venue_name, age_minimum, dress_code,
  requirements, included, excluded,
  is_featured, is_trending, trending_score, booking_count, status
) VALUES (
  'a0000000-0000-0000-0000-000000000005',
  (SELECT id FROM public.activity_categories WHERE slug = 'spa-resort' LIMIT 1),
  'talise-ottoman-royal-hammam',
  'Talise Ottoman Spa — Royal Hammam Ritual',
  'Luxurious Turkish hammam experience in Dubai''s largest spa.',
  'Immerse yourself in centuries-old Ottoman bathing traditions at Talise Ottoman Spa, one of the largest and most luxurious spas in the Middle East. This 3-hour Royal Hammam ritual includes full body exfoliation, foam massage, mud mask, and relaxation in the opulent marble surroundings.',
  ARRAY['3-hour royal hammam ritual', 'Marble hamam chamber', 'Full body exfoliation & foam massage', 'Access to spa facilities'],
  ARRAY['Relaxation', 'Luxury', 'Traditional', 'Rejuvenating'],
  'recurring', 180, 20,
  'Dubai', 'Jumeirah Zabeel Saray', 'Talise Ottoman Spa', 16,
  'Spa robes provided',
  ARRAY['Advance booking recommended', 'Arrive 15 minutes early'],
  ARRAY['Hammam ritual', 'Spa access', 'Towels', 'Slippers', 'Refreshments'],
  ARRAY['Additional treatments', 'Products', 'Gratuities'],
  true, false, 78, 743, 'published'
) ON CONFLICT (slug) DO NOTHING;

-- 9. Old Dubai Walking Tour
INSERT INTO public.activities (
  vendor_id, category_id, slug, name, description_short, description_long,
  highlights, vibe_tags, service_type, duration_minutes, max_capacity,
  location, area, venue_name, age_minimum, dress_code,
  requirements, included, excluded,
  is_featured, is_trending, trending_score, booking_count, status
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  (SELECT id FROM public.activity_categories WHERE slug = 'heritage-walk' LIMIT 1),
  'alfahidi-old-dubai-walking-tour',
  'Al Fahidi Historical — Old Dubai Walking Tour',
  'Discover the historic heart of Dubai on this guided heritage walk through Al Fahidi.',
  'Step back in time and explore Dubai''s oldest neighborhood, Al Fahidi Historical District. This intimate walking tour takes you through narrow lanes, wind-tower houses, and traditional courtyards. Visit the Coffee Museum, cross the creek by abra, and explore the vibrant souks with an expert local guide.',
  ARRAY['Guided heritage walk', 'Coffee Museum visit', 'Traditional abra boat ride', 'Gold & Spice Souk exploration'],
  ARRAY['Cultural', 'Educational', 'Authentic', 'Photography'],
  'recurring', 180, 16,
  'Dubai', 'Bur Dubai', 'Al Fahidi Historical District', 0,
  'Modest dress recommended',
  ARRAY['Comfortable walking shoes', 'Sun protection'],
  ARRAY['Professional guide', 'Abra ride', 'Water', 'Coffee tasting', 'Souk visits'],
  ARRAY['Meals', 'Personal purchases', 'Gratuities'],
  false, false, 72, 428, 'published'
) ON CONFLICT (slug) DO NOTHING;

-- 10. Jetcar
INSERT INTO public.activities (
  vendor_id, category_id, slug, name, description_short, description_long,
  highlights, vibe_tags, service_type, duration_minutes, max_capacity,
  location, area, venue_name, age_minimum,
  requirements, included, excluded,
  is_featured, is_trending, trending_score, booking_count, status
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  (SELECT id FROM public.activity_categories WHERE slug = 'water-car' LIMIT 1),
  'jetcar-drive-on-water',
  'Jetcar — Drive on Water',
  'The world''s first water car — drive a jet-powered supercar across the Arabian Gulf.',
  'The Jetcar is unlike anything you''ve experienced. Built to resemble a sports car but powered by a marine jet engine, it lets you literally drive on water at thrilling speeds. Drift, spin, and cruise along the Dubai Marina coastline in this head-turning, Instagram-breaking machine.',
  ARRAY['World''s first water car', 'Jet-powered supercar body', 'No license required', 'Dubai Marina coastline route'],
  ARRAY['Unique', 'Adrenaline', 'Instagram', 'VIP', 'One-of-a-kind'],
  'on_demand', 20, 3,
  'Dubai', 'Dubai Marina', 'DALC Water Sports', 16,
  ARRAY['Valid ID', 'Brief orientation included'],
  ARRAY['Jetcar rental', 'Life jacket', 'Orientation session', 'Fuel'],
  ARRAY['Photos/video', 'Insurance', 'Transportation'],
  true, true, 95, 423, 'published'
) ON CONFLICT (slug) DO NOTHING;


-- ─── Pricing Tiers ──────────────────────────────────────────
-- Insert pricing for each activity

-- Aura Skypool pricing
INSERT INTO public.activity_pricing (activity_id, tier_name, description, price, pricing_model, max_guests, includes, sort_order)
SELECT a.id, t.tier_name, t.description, t.price, t.pricing_model, t.max_guests, t.includes, t.sort_order
FROM public.activities a,
(VALUES
  ('Lounge Access', 'Standard pool access with lounger', 300, 'per_person', 1, ARRAY['Pool access', 'Sun lounger', 'Towel service'], 1),
  ('Premium Lounger', 'Premium location lounger with fruit platter', 500, 'per_person', 1, ARRAY['Premium lounger', 'Welcome drink', 'Fresh fruit platter', 'Towel service'], 2),
  ('Cabana', 'Private cabana for up to 4 guests with dedicated service', 1200, 'per_group', 4, ARRAY['Private cabana', 'Bottle of champagne', 'Gourmet snacks', 'Priority access'], 3)
) AS t(tier_name, description, price, pricing_model, max_guests, includes, sort_order)
WHERE a.slug = 'aura-skypool-sunset-session';

-- WHITE Dubai pricing
INSERT INTO public.activity_pricing (activity_id, tier_name, description, price, pricing_model, max_guests, includes, sort_order)
SELECT a.id, t.tier_name, t.description, t.price, t.pricing_model, t.max_guests, t.includes, t.sort_order
FROM public.activities a,
(VALUES
  ('Standard VIP', 'VIP table for up to 4 guests', 1500, 'per_group', 4, ARRAY['VIP entry', 'Private table', '1 premium bottle', 'Mixers'], 1),
  ('Premium VIP', 'Premium location table for up to 6 guests', 3000, 'per_group', 6, ARRAY['Priority VIP entry', 'Premium table location', '2 premium bottles', 'Champagne', 'Dedicated host'], 2),
  ('Presidential', 'Best table in the house for up to 10 guests', 8000, 'per_group', 10, ARRAY['Express entry', 'Best table location', '3 premium bottles', 'Dom Perignon', 'Personal security', 'Private host'], 3)
) AS t(tier_name, description, price, pricing_model, max_guests, includes, sort_order)
WHERE a.slug = 'white-dubai-vip-table';

-- Desert Safari pricing
INSERT INTO public.activity_pricing (activity_id, tier_name, description, price, pricing_model, max_guests, includes, sort_order)
SELECT a.id, t.tier_name, t.description, t.price, t.pricing_model, t.max_guests, t.includes, t.sort_order
FROM public.activities a,
(VALUES
  ('Standard', 'Shared wildlife drive experience', 950, 'per_person', 1, ARRAY['Shared wildlife drive', 'Dinner', 'Entertainment'], 1),
  ('Private Vehicle', 'Private Range Rover for up to 4 guests', 4500, 'per_group', 4, ARRAY['Private Range Rover', 'Dedicated guide', 'Dinner', 'VIP seating'], 2)
) AS t(tier_name, description, price, pricing_model, max_guests, includes, sort_order)
WHERE a.slug = 'platinum-desert-safari-dinner';

-- Skydive pricing
INSERT INTO public.activity_pricing (activity_id, tier_name, description, price, pricing_model, max_guests, includes, sort_order)
SELECT a.id, t.tier_name, t.description, t.price, t.pricing_model, t.max_guests, t.includes, t.sort_order
FROM public.activities a,
(VALUES
  ('Standard', 'Tandem jump with photos & video', 2599, 'per_person', 1, ARRAY['Tandem jump', 'Professional photos', 'Edited video', 'Certificate'], 1),
  ('Premium', 'Jump with dedicated camera flyer', 3299, 'per_person', 1, ARRAY['Tandem jump', 'Dedicated camera flyer', 'Premium photos', 'Cinematic video edit', 'Certificate', 'Priority scheduling'], 2)
) AS t(tier_name, description, price, pricing_model, max_guests, includes, sort_order)
WHERE a.slug = 'skydive-dubai-tandem-palm';

-- Tresind Studio pricing
INSERT INTO public.activity_pricing (activity_id, tier_name, description, price, pricing_model, max_guests, includes, sort_order)
SELECT a.id, t.tier_name, t.description, t.price, t.pricing_model, t.max_guests, t.includes, t.sort_order
FROM public.activities a,
(VALUES
  ('Chef''s Table', '20-course menu with kitchen views', 1200, 'per_person', 1, ARRAY['20-course tasting menu', 'Welcome cocktail'], 1),
  ('With Wine Pairing', 'Menu with premium wine pairing', 1800, 'per_person', 1, ARRAY['20-course tasting menu', 'Wine pairing', 'Welcome cocktail'], 2)
) AS t(tier_name, description, price, pricing_model, max_guests, includes, sort_order)
WHERE a.slug = 'tresind-studio-chefs-table';

-- Shark Safari pricing
INSERT INTO public.activity_pricing (activity_id, tier_name, description, price, pricing_model, max_guests, includes, sort_order)
SELECT a.id, t.tier_name, t.description, t.price, t.pricing_model, t.max_guests, t.includes, t.sort_order
FROM public.activities a,
(VALUES
  ('Shark Safari', '30-minute underwater walk', 850, 'per_person', 1, ARRAY['Safety briefing', 'Helmet dive', '30-min underwater', 'Photos'], 1),
  ('Certified Dive', 'Full dive for certified divers', 1200, 'per_person', 1, ARRAY['All equipment', '45-min dive', 'Professional guide', 'Photos', 'Video'], 2)
) AS t(tier_name, description, price, pricing_model, max_guests, includes, sort_order)
WHERE a.slug = 'atlantis-dive-shark-safari';

-- HeliDubai pricing
INSERT INTO public.activity_pricing (activity_id, tier_name, description, price, pricing_model, max_guests, includes, sort_order)
SELECT a.id, t.tier_name, t.description, t.price, t.pricing_model, t.max_guests, t.includes, t.sort_order
FROM public.activities a,
(VALUES
  ('Shared Flight', 'Shared helicopter experience', 1099, 'per_person', 1, ARRAY['22-min tour', 'Safety briefing', 'Commentary'], 1),
  ('Private Flight', 'Private helicopter for up to 5 guests', 5499, 'per_group', 5, ARRAY['Private 22-min tour', 'Exclusive helicopter', 'Priority scheduling'], 2)
) AS t(tier_name, description, price, pricing_model, max_guests, includes, sort_order)
WHERE a.slug = 'helidubai-iconic-tour';

-- Hammam pricing
INSERT INTO public.activity_pricing (activity_id, tier_name, description, price, pricing_model, max_guests, includes, sort_order)
SELECT a.id, t.tier_name, t.description, t.price, t.pricing_model, t.max_guests, t.includes, t.sort_order
FROM public.activities a,
(VALUES
  ('Royal Hammam', '3-hour traditional ritual', 750, 'per_person', 1, ARRAY['Hammam access', 'Body exfoliation', 'Foam massage', 'Mud mask', 'Relaxation time'], 1),
  ('Couples Ritual', 'Private hammam suite for two', 1400, 'per_group', 2, ARRAY['Private suite', 'Couples ritual', 'Champagne', 'Fresh fruit', 'Spa products to take home'], 2)
) AS t(tier_name, description, price, pricing_model, max_guests, includes, sort_order)
WHERE a.slug = 'talise-ottoman-royal-hammam';

-- Walking Tour pricing
INSERT INTO public.activity_pricing (activity_id, tier_name, description, price, pricing_model, max_guests, includes, sort_order)
SELECT a.id, t.tier_name, t.description, t.price, t.pricing_model, t.max_guests, t.includes, t.sort_order
FROM public.activities a,
(VALUES
  ('Group Tour', 'Small group tour (max 8)', 250, 'per_person', 1, ARRAY['Professional guide', 'Abra ride', 'Water'], 1),
  ('Private Tour', 'Private guide for up to 4 guests', 800, 'per_group', 4, ARRAY['Private guide', 'Abra ride', 'Coffee tasting', 'Flexible pace'], 2)
) AS t(tier_name, description, price, pricing_model, max_guests, includes, sort_order)
WHERE a.slug = 'alfahidi-old-dubai-walking-tour';

-- Jetcar pricing
INSERT INTO public.activity_pricing (activity_id, tier_name, description, price, pricing_model, max_guests, includes, sort_order)
SELECT a.id, t.tier_name, t.description, t.price, t.pricing_model, t.max_guests, t.includes, t.sort_order
FROM public.activities a,
(VALUES
  ('20 Minutes', '20-min taster ride', 600, 'per_person', 1, ARRAY['Jetcar rental', 'Life jacket', 'Orientation'], 1),
  ('30 Minutes', '30-min full experience', 900, 'per_person', 1, ARRAY['Jetcar rental', 'Life jacket', 'Orientation', 'Extended route'], 2),
  ('60 Minutes', '1-hour extended session', 1300, 'per_person', 1, ARRAY['Jetcar rental', 'Life jacket', 'Orientation', 'Full Marina tour'], 3)
) AS t(tier_name, description, price, pricing_model, max_guests, includes, sort_order)
WHERE a.slug = 'jetcar-drive-on-water';


-- ─── Availability Rules ─────────────────────────────────────

-- Aura Skypool: Daily, two sessions
INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', NULL, '15:00'::TIME, '19:00'::TIME, 60
FROM public.activities a WHERE a.slug = 'aura-skypool-sunset-session';

INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', NULL, '19:00'::TIME, '23:00'::TIME, 60
FROM public.activities a WHERE a.slug = 'aura-skypool-sunset-session';

-- WHITE Dubai: Thu/Fri/Sat nights
INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', d.dow, '23:00'::TIME, '04:00'::TIME, 200
FROM public.activities a, (VALUES (4), (5), (6)) AS d(dow)
WHERE a.slug = 'white-dubai-vip-table';

-- Desert Safari: Daily
INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', NULL, '15:00'::TIME, '21:00'::TIME, 40
FROM public.activities a WHERE a.slug = 'platinum-desert-safari-dinner';

-- Skydive Dubai: Daily
INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', NULL, '08:00'::TIME, '15:00'::TIME, 80
FROM public.activities a WHERE a.slug = 'skydive-dubai-tandem-palm';

-- Tresind Studio: Tue-Sat evenings
INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', d.dow, '19:00'::TIME, '23:00'::TIME, 6
FROM public.activities a, (VALUES (2), (3), (4), (5), (6)) AS d(dow)
WHERE a.slug = 'tresind-studio-chefs-table';

-- Shark Safari: Daily
INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', NULL, '10:00'::TIME, '17:00'::TIME, 12
FROM public.activities a WHERE a.slug = 'atlantis-dive-shark-safari';

-- HeliDubai: Daily
INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', NULL, '09:00'::TIME, '17:00'::TIME, 25
FROM public.activities a WHERE a.slug = 'helidubai-iconic-tour';

-- Hammam: Daily
INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', NULL, '10:00'::TIME, '21:00'::TIME, 20
FROM public.activities a WHERE a.slug = 'talise-ottoman-royal-hammam';

-- Walking Tour: Daily, two sessions
INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', NULL, '09:00'::TIME, '12:00'::TIME, 8
FROM public.activities a WHERE a.slug = 'alfahidi-old-dubai-walking-tour';

INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', NULL, '16:00'::TIME, '19:00'::TIME, 8
FROM public.activities a WHERE a.slug = 'alfahidi-old-dubai-walking-tour';

-- Jetcar: Daily
INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', NULL, '09:00'::TIME, '17:00'::TIME, 3
FROM public.activities a WHERE a.slug = 'jetcar-drive-on-water';


-- ─── Hero Images ────────────────────────────────────────────

INSERT INTO public.activity_images (activity_id, url, alt_text, type, sort_order)
SELECT a.id, t.url, t.alt_text, 'hero', 0
FROM public.activities a,
(VALUES
  ('aura-skypool-sunset-session', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2670&auto=format&fit=crop', 'Aura Skypool sunset view'),
  ('white-dubai-vip-table', 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2670&auto=format&fit=crop', 'WHITE Dubai nightclub'),
  ('platinum-desert-safari-dinner', 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?q=80&w=2674&auto=format&fit=crop', 'Dubai desert safari at sunset'),
  ('skydive-dubai-tandem-palm', 'https://images.unsplash.com/photo-1529661197280-63dc398c6b33?q=80&w=2670&auto=format&fit=crop', 'Skydiving over Palm Jumeirah'),
  ('tresind-studio-chefs-table', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop', 'Tresind Studio chef''s table'),
  ('atlantis-dive-shark-safari', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2670&auto=format&fit=crop', 'Underwater shark diving at Atlantis'),
  ('helidubai-iconic-tour', 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2670&auto=format&fit=crop', 'Helicopter over Dubai skyline'),
  ('talise-ottoman-royal-hammam', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2670&auto=format&fit=crop', 'Ottoman spa hammam'),
  ('alfahidi-old-dubai-walking-tour', 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2670&auto=format&fit=crop', 'Al Fahidi historical district'),
  ('jetcar-drive-on-water', 'https://images.unsplash.com/photo-1476673160081-cf065bc4e7ce?q=80&w=2670&auto=format&fit=crop', 'Jetcar on water in Dubai Marina')
) AS t(slug, url, alt_text)
WHERE a.slug = t.slug;
