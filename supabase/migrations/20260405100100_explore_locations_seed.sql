-- ==========================================
-- EXPLORE LOCATIONS SEED DATA
-- Dubai À La Carte - Comprehensive UAE Discovery
-- Generated: 2026-04-05
-- ==========================================

-- ─── DUBAI LANDMARKS ──────────────────────────────────────────────────────────

INSERT INTO public.explore_locations (
  id, name, short_description, long_description, latitude, longitude, emirate, area, category, subcategory,
  is_hidden_gem, is_featured, hero_image, gallery_images, tags, vibe, price_tier, opening_hours, best_time, insider_tip
) VALUES
('burj-khalifa', 'Burj Khalifa', 'The world''s tallest building at 828 meters, offering breathtaking views of Dubai from its observation decks.', 
 'Standing at 828 meters, Burj Khalifa is a global icon and the centerpiece of Downtown Dubai. The tower features multiple observation decks including At The Top (124th & 125th floors) and At The Top SKY (148th floor).',
 25.1972, 55.2744, 'Dubai', 'Downtown Dubai', 'Landmark', 'Skyscraper',
 false, true, '/images/explore/landmarks/burj-khalifa-hero.jpg', '{}', 
 '{"Iconic","Views","Architecture","Observation Deck","Must-Visit"}', 'Awe-inspiring architectural marvel', 4,
 'Daily 10:00 AM - 10:00 PM', 'Sunset for golden hour views', 'Book the SKY lounge for the most exclusive experience with private elevator access.'),

('dubai-fountain', 'Dubai Fountain', 'The world''s largest choreographed fountain system performing to music on Burj Khalifa Lake.',
 NULL, 25.1953, 55.2748, 'Dubai', 'Downtown Dubai', 'Attraction', 'Water Feature',
 false, true, '/images/explore/attractions/dubai-fountain-hero.jpg', '{}',
 '{"Free","Evening","Romantic","Photography","Family-Friendly"}', 'Mesmerizing water and light show', 1,
 'Evenings every 30 minutes from 6:00 PM', 'After 8 PM for full light effects', 'Take the Abra boat ride on the lake for a unique perspective of the show.'),

('palm-jumeirah', 'Palm Jumeirah', 'The iconic palm-shaped artificial island, home to luxury resorts and stunning beachfronts.',
 NULL, 25.1124, 55.1390, 'Dubai', 'Palm Jumeirah', 'Landmark', 'Island',
 false, true, '/images/explore/landmarks/palm-jumeirah-hero.jpg', '{}',
 '{"Luxury","Beach","Resort","Architecture","Iconic"}', 'Ultimate luxury island living', 4,
 NULL, 'Golden hour for stunning photographs', 'Visit the View at The Palm for a 360-degree panorama of the entire island.'),

('dubai-marina', 'Dubai Marina', 'A stunning waterfront promenade lined with skyscrapers, restaurants, and yachts.',
 NULL, 25.0772, 55.1334, 'Dubai', 'Dubai Marina', 'Landmark', 'Waterfront',
 false, true, '/images/explore/landmarks/dubai-marina-hero.jpg', '{}',
 '{"Waterfront","Dining","Nightlife","Walking","Yachts"}', 'Vibrant waterfront lifestyle', 3,
 NULL, 'Evening walk along the Marina Walk', 'Take a dinner cruise to see the marina skyline from the water.'),

('dubai-frame', 'Dubai Frame', 'A 150-meter tall architectural landmark offering panoramic views of old and new Dubai.',
 NULL, 25.2350, 55.3005, 'Dubai', 'Zabeel Park', 'Landmark', 'Architecture',
 false, true, '/images/explore/landmarks/dubai-frame-hero.jpg', '{}',
 '{"Views","Architecture","Photography","Museum","Family-Friendly"}', 'Bridge between old and new Dubai', 2,
 'Daily 9:00 AM - 9:00 PM', 'Sunset for the best lighting', 'The glass floor on Level 48 offers a thrilling transparent view downwards.'),

('museum-of-the-future', 'Museum of the Future', 'A stunning architectural and technological marvel exploring the possibilities of tomorrow.',
 NULL, 25.2195, 55.2817, 'Dubai', 'Trade Centre', 'Museum', 'Technology',
 false, true, '/images/explore/museums/museum-of-future-hero.jpg', '{}',
 '{"Futuristic","Technology","Architecture","Interactive","Innovation"}', 'Journey into tomorrow', 3,
 'Daily 10:00 AM - 9:30 PM', 'Early morning for shorter queues', 'Book tickets online in advance as they often sell out.'),

('atlantis-the-palm', 'Atlantis, The Palm', 'Iconic ocean-themed resort with world-class aquarium, water park, and restaurants.',
 NULL, 25.1304, 55.1172, 'Dubai', 'Palm Jumeirah', 'Landmark', 'Resort',
 false, true, '/images/explore/landmarks/atlantis-hero.jpg', '{}',
 '{"Resort","Aquarium","Water Park","Dining","Family"}', 'Ocean-inspired luxury', 4,
 NULL, 'Full day to explore all attractions', 'The Lost Chambers Aquarium has special late-night viewing sessions.'),

('burj-al-arab', 'Burj Al Arab', 'The world''s most luxurious hotel, shaped like a sail and standing on its own island.',
 NULL, 25.1412, 55.1854, 'Dubai', 'Jumeirah', 'Landmark', 'Hotel',
 false, true, '/images/explore/landmarks/burj-al-arab-hero.jpg', '{}',
 '{"Luxury","Iconic","Architecture","Dining","Photography"}', 'Ultimate luxury icon', 4,
 NULL, 'Sunset viewing from Jumeirah Beach', 'Book afternoon tea or dinner to experience the interior without staying.'),

('dubai-creek', 'Dubai Creek', 'Historic saltwater creek dividing Dubai, home to traditional abras and heritage activities.',
 NULL, 25.2658, 55.3052, 'Dubai', 'Deira/Bur Dubai', 'Cultural Site', 'Heritage',
 false, true, '/images/explore/cultural/dubai-creek-hero.jpg', '{}',
 '{"Heritage","Traditional","Abra","History","Souks"}', 'Traditional Dubai experience', 1,
 NULL, 'Early morning or sunset', 'Take an abra ride across the creek for just 1 AED.'),

('gold-souk', 'Gold Souk', 'World-famous traditional market with hundreds of retailers displaying gold jewelry.',
 NULL, 25.2867, 55.2972, 'Dubai', 'Deira', 'Shopping', 'Souk',
 false, false, '/images/explore/shopping/gold-souk-hero.jpg', '{}',
 '{"Shopping","Traditional","Gold","Jewelry","Heritage"}', 'Glittering gold paradise', 3,
 'Sat-Thu 10 AM-10 PM, Fri 4 PM-10 PM', 'Late afternoon for cooler temperatures', 'Always negotiate - prices are rarely fixed.'),

('al-fahidi-historic', 'Al Fahidi Historic District', 'A preserved historic neighborhood with traditional wind-tower architecture and art galleries.',
 NULL, 25.2631, 55.2974, 'Dubai', 'Bur Dubai', 'Cultural Site', 'Heritage',
 true, true, '/images/explore/cultural/al-fahidi-hero.jpg', '{}',
 '{"Heritage","Art","Architecture","Museums","Walking"}', 'Step back in time', 1,
 NULL, 'Late afternoon for golden light', 'Visit the Coffee Museum and XVA Gallery for hidden gems.'),

('madinat-jumeirah', 'Madinat Jumeirah', 'A luxurious Arabian resort with winding waterways, souks, and views of Burj Al Arab.',
 NULL, 25.1322, 55.1854, 'Dubai', 'Jumeirah', 'Landmark', 'Resort Complex',
 false, true, '/images/explore/landmarks/madinat-jumeirah-hero.jpg', '{}',
 '{"Luxury","Dining","Shopping","Architecture","Romantic"}', 'Arabian luxury reimagined', 4,
 NULL, 'Evening for magical lighting', 'Take an abra ride through the waterways for stunning Burj Al Arab views.'),

('difc', 'DIFC', 'Dubai International Financial Centre - home to world-class dining, art galleries, and architecture.',
 NULL, 25.2178, 55.2795, 'Dubai', 'DIFC', 'Landmark', 'Business District',
 false, true, '/images/explore/landmarks/difc-hero.jpg', '{}',
 '{"Dining","Art","Architecture","Nightlife","Business"}', 'Sophisticated financial hub', 4,
 NULL, 'Evening for rooftop lounges', 'Gate Village is a hidden art district within DIFC.'),

('dubai-mall', 'The Dubai Mall', 'One of the world''s largest shopping and entertainment destinations.',
 NULL, 25.1972, 55.2795, 'Dubai', 'Downtown Dubai', 'Shopping', 'Mall',
 false, true, '/images/explore/shopping/dubai-mall-hero.jpg', '{}',
 '{"Shopping","Entertainment","Aquarium","Ice Rink","Family"}', 'Ultimate retail therapy', 3,
 'Daily 10:00 AM - 12:00 AM', 'Weekday mornings for fewer crowds', 'The Dubai Aquarium viewing panel is free, but behind-the-scenes tours are worth it.'),

-- ─── HIDDEN GEMS ──────────────────────────────────────────────────────────────

('al-qudra-lakes', 'Al Qudra Lakes', 'A serene desert oasis with man-made lakes, flamingos, and stunning sunset views.',
 NULL, 24.9665, 55.2315, 'Dubai', 'Al Qudra', 'Hidden Gem', 'Nature',
 true, true, '/images/explore/hidden-gems/al-qudra-hero.jpg', '{}',
 '{"Nature","Desert","Flamingos","Sunset","Cycling","Photography"}', 'Desert serenity', 1,
 NULL, 'Sunset for magical light', 'Arrive early for birdwatching - flamingos are most active at dawn.'),

('love-lake', 'Love Lake', 'Two heart-shaped lakes in the desert, perfect for romantic strolls and stargazing.',
 NULL, 24.9485, 55.2105, 'Dubai', 'Al Qudra', 'Hidden Gem', 'Nature',
 true, true, '/images/explore/hidden-gems/love-lake-hero.jpg', '{}',
 '{"Romantic","Nature","Stargazing","Photography","Desert"}', 'Desert romance', 1,
 NULL, 'Night for stargazing away from city lights', 'Best viewed from drone footage to see the heart shapes.'),

('hatta-rock-pools', 'Hatta Rock Pools', 'Natural rock pools in the Hajar Mountains, perfect for cooling off and hiking.',
 NULL, 24.8180, 56.1160, 'Dubai', 'Hatta', 'Hidden Gem', 'Nature',
 true, true, '/images/explore/hidden-gems/hatta-pools-hero.jpg', '{}',
 '{"Nature","Swimming","Hiking","Mountains","Adventure"}', 'Mountain escape', 1,
 NULL, 'Morning before crowds arrive', 'Wear water shoes for the rocky terrain.'),

('hatta-dam', 'Hatta Dam', 'A stunning turquoise reservoir in the Hajar Mountains offering kayaking and hiking.',
 NULL, 24.8025, 56.0745, 'Dubai', 'Hatta', 'Hidden Gem', 'Nature',
 true, true, '/images/explore/hidden-gems/hatta-dam-hero.jpg', '{}',
 '{"Nature","Kayaking","Mountains","Adventure","Views"}', 'Mountain reservoir adventure', 2,
 NULL, 'Early morning for calm waters', 'Book kayaks or pedal boats in advance during weekends.'),

('ras-al-khor-wildlife', 'Ras Al Khor Wildlife Sanctuary', 'A wetland reserve home to hundreds of flamingos, visible from free viewing hides.',
 NULL, 25.1872, 55.3269, 'Dubai', 'Ras Al Khor', 'Hidden Gem', 'Nature',
 true, true, '/images/explore/hidden-gems/ras-al-khor-hero.jpg', '{}',
 '{"Wildlife","Flamingos","Nature","Free","Photography"}', 'Urban wildlife oasis', 1,
 'Sat-Thu 7:30 AM - 5:30 PM', 'Early morning for best birdwatching', 'Bring binoculars for the best viewing experience.'),

('fossil-rock', 'Fossil Rock', 'A dramatic desert rock formation with ancient marine fossils dating back millions of years.',
 NULL, 25.1510, 55.7870, 'Dubai', 'Margham', 'Hidden Gem', 'Nature',
 true, true, '/images/explore/hidden-gems/fossil-rock-hero.jpg', '{}',
 '{"Nature","Fossils","Desert","Geology","Adventure"}', 'Ancient geological wonder', 1,
 NULL, 'Early morning or late afternoon', 'Combine with a desert safari for a full adventure.'),

('coffee-museum', 'Coffee Museum', 'A charming museum in Al Fahidi dedicated to the history and culture of coffee.',
 NULL, 25.2628, 55.2965, 'Dubai', 'Al Fahidi', 'Hidden Gem', 'Museum',
 true, false, '/images/explore/hidden-gems/coffee-museum-hero.jpg', '{}',
 '{"Coffee","Culture","Heritage","Quirky","Al Fahidi"}', 'Coffee culture deep dive', 1,
 'Sat-Thu 9:00 AM - 5:00 PM', 'Any time - it''s rarely crowded', 'Try their specialty coffee after the tour.'),

-- ─── ABU DHABI ────────────────────────────────────────────────────────────────

('sheikh-zayed-mosque', 'Sheikh Zayed Grand Mosque', 'A stunning masterpiece of Islamic architecture and one of the world''s largest mosques.',
 NULL, 24.4128, 54.4749, 'Abu Dhabi', 'Abu Dhabi Island', 'Cultural Site', 'Mosque',
 false, true, '/images/explore/abudhabi/szm-hero.jpg', '{}',
 '{"Architecture","Religious","Iconic","Photography","Culture"}', 'Spiritual architectural marvel', 1,
 'Daily 9:00 AM - 10:00 PM (non-Muslims)', 'Sunset for golden light and night illumination', 'The night view with illumination is spectacular - visit after 7 PM.'),

('louvre-abu-dhabi', 'Louvre Abu Dhabi', 'A spectacular museum showcasing art and civilization from around the world.',
 NULL, 24.5337, 54.3987, 'Abu Dhabi', 'Saadiyat Island', 'Museum', 'Art',
 false, true, '/images/explore/abudhabi/louvre-hero.jpg', '{}',
 '{"Art","Architecture","Culture","World-Class","Photography"}', 'Universal museum experience', 3,
 'Tue-Sun 10:00 AM - 6:30 PM', 'Early morning for quiet galleries', 'The Rain of Light under the dome is magical - don''t miss it.'),

('yas-island', 'Yas Island', 'An entertainment hub home to Ferrari World, Yas Waterworld, and Warner Bros World.',
 NULL, 24.4895, 54.5969, 'Abu Dhabi', 'Yas Island', 'Attraction', 'Entertainment',
 false, true, '/images/explore/abudhabi/yas-island-hero.jpg', '{}',
 '{"Theme Parks","Entertainment","Family","F1","Adventure"}', 'Thrill-seeker paradise', 4,
 NULL, 'Full day required for each park', 'Buy multi-park passes for best value if visiting multiple attractions.'),

('qasr-al-watan', 'Qasr Al Watan', 'The magnificent Presidential Palace showcasing Arabian architecture and heritage.',
 NULL, 24.4616, 54.3055, 'Abu Dhabi', 'Abu Dhabi Island', 'Landmark', 'Palace',
 false, true, '/images/explore/abudhabi/qasr-hero.jpg', '{}',
 '{"Architecture","Palace","Culture","Photography","History"}', 'Arabian grandeur', 3,
 'Daily 10:00 AM - 8:00 PM', 'Evening for the Palace in Motion light show', 'Stay for the evening light show - it''s included in admission.'),

('mangrove-national-park', 'Mangrove National Park', 'A protected ecosystem offering kayaking through serene mangrove forests.',
 NULL, 24.4568, 54.4158, 'Abu Dhabi', 'Eastern Mangroves', 'Hidden Gem', 'Nature',
 true, true, '/images/explore/abudhabi/mangroves-hero.jpg', '{}',
 '{"Nature","Kayaking","Wildlife","Eco-Tourism","Adventure"}', 'Nature immersion', 2,
 NULL, 'Early morning for calm waters and wildlife', 'Book a sunrise tour for the best wildlife sightings.'),

-- ─── OTHER EMIRATES ───────────────────────────────────────────────────────────

('sharjah-art-foundation', 'Sharjah Art Foundation', 'A world-class contemporary art space in the Heritage Area of Sharjah.',
 NULL, 25.3619, 55.3842, 'Sharjah', 'Arts Area', 'Museum', 'Art',
 true, true, '/images/explore/sharjah/saf-hero.jpg', '{}',
 '{"Art","Contemporary","Culture","Free","Architecture"}', 'Cultural enlightenment', 1,
 'Sat-Thu 8:00 AM - 8:00 PM', 'Morning for quiet contemplation', 'Explore the heritage houses converted into galleries.'),

('jebel-jais', 'Jebel Jais', 'The UAE''s highest mountain offering zip-lining, hiking, and stunning views.',
 NULL, 25.9513, 56.0829, 'Ras Al Khaimah', 'Jebel Jais', 'Mountain', 'Peak',
 false, true, '/images/explore/rak/jebel-jais-hero.jpg', '{}',
 '{"Mountain","Adventure","Zip-line","Hiking","Views"}', 'Mountain adventure', 2,
 NULL, 'Early morning for cooler temperatures', 'The world''s longest zip-line (Jais Flight) is here - book in advance.'),

('wadi-shawka', 'Wadi Shawka', 'A scenic wadi in Ras Al Khaimah perfect for hiking and rock pool swimming.',
 NULL, 25.1545, 56.0180, 'Ras Al Khaimah', 'Hajar Mountains', 'Hidden Gem', 'Nature',
 true, true, '/images/explore/rak/wadi-shawka-hero.jpg', '{}',
 '{"Nature","Hiking","Swimming","Mountain","Adventure"}', 'Mountain wadi adventure', 1,
 NULL, 'After rainfall for best pools', 'The dam at the end of the trail is an excellent picnic spot.'),

('khor-fakkan', 'Khor Fakkan Beach', 'A beautiful crescent-shaped beach on the Gulf of Oman with a renovated corniche.',
 NULL, 25.3424, 56.3523, 'Sharjah', 'Khor Fakkan', 'Coastal', 'Beach',
 true, true, '/images/explore/sharjah/khor-fakkan-hero.jpg', '{}',
 '{"Beach","Coast","Snorkeling","Nature","Day Trip"}', 'East coast escape', 1,
 NULL, 'Morning for swimming, sunset for views', 'The Shees Park nearby has excellent hiking trails.'),

('mleiha-archaeological', 'Mleiha Archaeological Centre', 'A fascinating journey through 100,000 years of human history in the UAE.',
 NULL, 25.1372, 55.8833, 'Sharjah', 'Mleiha', 'Hidden Gem', 'Archaeological',
 true, true, '/images/explore/sharjah/mleiha-hero.jpg', '{}',
 '{"History","Archaeology","Desert","Adventure","Tours"}', 'Ancient history adventure', 2,
 NULL, 'Sunset for desert tours', 'Book the stargazing tour for an unforgettable experience.'),

-- ─── DESERT & NATURE ──────────────────────────────────────────────────────────

('dubai-desert-conservation', 'Dubai Desert Conservation Reserve', 'A protected desert sanctuary offering authentic safari experiences and wildlife encounters.',
 NULL, 24.8573, 55.4120, 'Dubai', 'Al Marmoom', 'Desert', 'Wildlife',
 false, true, '/images/explore/desert/ddcr-hero.jpg', '{}',
 '{"Safari","Wildlife","Nature","Luxury","Exclusive"}', 'Authentic desert immersion', 4,
 NULL, 'Early morning or sunset', 'Stay overnight at Al Maha Resort for the full experience.'),

('hajar-mountains', 'Hajar Mountains', 'Ancient mountain range offering dramatic landscapes, wadis, and adventure activities.',
 NULL, 25.0500, 56.0500, 'Ras Al Khaimah', 'Hajar Mountains', 'Mountain', 'Range',
 false, true, '/images/explore/mountains/hajar-hero.jpg', '{}',
 '{"Mountain","Hiking","Nature","Adventure","Views"}', 'Rugged mountain beauty', 1,
 NULL, 'October to April (cooler months)', 'Many wadis fill with water after rain - check conditions.'),

-- ─── VIEWPOINTS ───────────────────────────────────────────────────────────────

('view-at-the-palm', 'The View at The Palm', 'A 360-degree observation deck on the 52nd floor of The Palm Tower.',
 NULL, 25.1096, 55.1388, 'Dubai', 'Palm Jumeirah', 'Viewpoint', 'Observation',
 false, true, '/images/explore/viewpoints/palm-view-hero.jpg', '{}',
 '{"Views","Photography","Skyline","Palm","Sunset"}', 'Palm panorama', 3,
 'Daily 10:00 AM - 10:00 PM', 'Sunset for golden palm views', 'Upgrade to the infinity pool for the ultimate experience.'),

('sky-views-observatory', 'Sky Views Observatory', 'Glass-floored observation deck with panoramic views of Burj Khalifa and Downtown Dubai.',
 NULL, 25.2048, 55.2708, 'Dubai', 'Downtown Dubai', 'Viewpoint', 'Observation',
 false, true, '/images/explore/viewpoints/sky-views-hero.jpg', '{}',
 '{"Views","Glass Floor","Skyline","Burj Khalifa","Adventure"}', 'Thrilling city views', 3,
 'Daily 10:00 AM - 10:00 PM', 'Golden hour for best lighting', 'Try the Edge Walk for an adrenaline-pumping experience.'),

('at-the-top-burj', 'At The Top - Burj Khalifa', 'Iconic observation decks on the 124th, 125th, and 148th floors of Burj Khalifa.',
 NULL, 25.1972, 55.2744, 'Dubai', 'Downtown Dubai', 'Viewpoint', 'Observation',
 false, true, '/images/explore/viewpoints/burj-top-hero.jpg', '{}',
 '{"Views","Iconic","Skyline","World Record","Must-Visit"}', 'World''s highest views', 4,
 'Daily 10:00 AM - 10:00 PM', 'Sunset for magical transition', 'Book SKY (148th floor) for the most exclusive lounge experience.')

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  updated_at = now();

-- ─── VENUES AS EXPLORE LOCATIONS ──────────────────────────────────────────────

INSERT INTO public.explore_locations (
  id, name, short_description, latitude, longitude, emirate, area, category, subcategory,
  is_hidden_gem, is_featured, hero_image, tags, vibe, price_tier, source_venue_id
) VALUES
-- Restaurants
('venue-bagatelle', 'Bagatelle', 'Experience the ultimate French-Mediterranean dining at Bagatelle Dubai. World-class cuisine, electric atmosphere, and unforgettable nights.', 25.2048, 55.2708, 'Dubai', 'Fairmont SZR', 'Restaurant', 'French', false, true, '/images/restaurants/Bagatelle/image1.jpg', '{"French","Fine Dining","Party"}', 'Elegant, lively dinner', 4, 'bagatelle'),
('venue-amazonico', 'Amazonico', 'Journey through the Amazon at Amazonico DIFC — a rainforest-inspired culinary adventure blending Latin and Asian flavors.', 25.2178, 55.2795, 'Dubai', 'DIFC', 'Restaurant', 'Latin', false, true, '/images/restaurants/Amazonico/image1.jpg', '{"Latin","Asian Fusion","Lively"}', 'Lively tropical dining', 4, 'amazonico'),
('venue-nobu', 'Nobu', 'Dine at the legendary Nobu Atlantis The Palm. World-renowned Japanese-Peruvian fusion with celebrity chef cuisine.', 25.1020, 55.1480, 'Dubai', 'Atlantis The Palm', 'Restaurant', 'Japanese', false, true, '/images/restaurants/Nobu/image1.jpg', '{"Japanese","World-Renowned"}', 'World-renowned Japanese', 4, 'nobu'),
('venue-coya', 'Coya', 'Immerse in premium Peruvian dining at Coya Four Seasons. Pisco mastery, ceviche artistry, and vibrant Latin atmosphere.', 25.2040, 55.2710, 'Dubai', 'Four Seasons', 'Restaurant', 'Peruvian', false, true, '/images/restaurants/Coya/image1.jpg', '{"Peruvian","Premium"}', 'Premium Peruvian experience', 4, 'coya'),
('venue-hakkasan', 'Hakkasan', 'Experience award-winning Cantonese cuisine at Hakkasan Atlantis The Palm. Michelin-recognized dining and exceptional dim sum.', 25.0761, 55.1340, 'Dubai', 'Atlantis The Royal', 'Restaurant', 'Chinese', false, true, '/images/restaurants/Hakkasan/image1.jpg', '{"Chinese","Award-Winning"}', 'Award-winning Chinese', 4, 'hakkasan'),
('venue-sexy-fish', 'Sexy Fish', 'Dive into glamorous seafood at Sexy Fish DIFC. Stunning design, exceptional Asian seafood, and underwater wonder.', 25.2178, 55.2840, 'Dubai', 'DIFC', 'Restaurant', 'Asian', false, true, '/images/restaurants/Sexy_Fish/image1.jpg', '{"Asian","Seafood","Glamorous"}', 'Glamorous seafood', 4, 'sexy-fish'),
('venue-shanghai-me', 'Shanghai Me', 'Experience upscale Chinese chic at Shanghai Me DIFC. Sophisticated dim sum, elegant décor, and refined atmosphere.', 25.2178, 55.2815, 'Dubai', 'DIFC', 'Restaurant', 'Chinese', false, true, '/images/restaurants/Shanghai_Me/image1.jpg', '{"Chinese","Chic"}', 'Upscale Chinese chic', 4, 'shanghai-me'),

-- Beach Clubs
('venue-nikki-beach', 'Nikki Beach', 'Join the iconic global phenomenon at Nikki Beach Pearl Jumeirah. World-famous beach club with international DJs.', 25.1124, 55.1410, 'Dubai', 'Pearl Jumeirah', 'Beach Club', 'International', false, true, '/images/beach_clubs/Nikki_Beach/image1.jpg', '{"International","Iconic"}', 'Iconic global beach club', 4, 'nikki-beach'),
('venue-drift-beach', 'Drift Beach', 'Escape to serenity at Drift Beach Dubai Marina. Mediterranean-inspired beach club with crystal waters.', 25.1124, 55.1420, 'Dubai', 'Dubai Marina', 'Beach Club', 'Mediterranean', false, true, '/images/beach_clubs/Drift_Beach/image1.jpg', '{"Mediterranean","Serene"}', 'Serene beachfront escape', 4, 'drift-beach'),
('venue-verde-beach', 'Verde Beach', 'Unwind at Verde Beach Umm Suqeim — Italian sophistication meets beachfront relaxation.', 25.0936, 55.1508, 'Dubai', 'Umm Suqeim', 'Beach Club', 'Italian', false, true, '/images/beach_clubs/Verde_Beach/image1.jpg', '{"Italian","Beach","Sophisticated"}', 'Sophisticated beachside', 4, 'verde-beach'),
('venue-gigi-beach', 'Gigi', 'Indulge in Italian beach luxury at Gigi J1. Riviera-style glamour and exceptional cuisine.', 25.0881, 55.1475, 'Dubai', 'J1', 'Beach Club', 'Italian', false, true, '/images/beach_clubs/Gigi/image1.jpg', '{"Italian","Beach","Luxury"}', 'Italian beach luxury', 4, 'gigi-beach'),
('venue-terra-solis', 'Terra Solis', 'Journey to Tomorrowland at Terra Solis Jebel Ali. Desert oasis with world-class festivals.', 25.0100, 55.3200, 'Dubai', 'Jebel Ali Desert', 'Beach Club', 'Festival', false, false, '/images/beach_clubs/Terra_Solis/image1.jpg', '{"Desert","Boho","Festival"}', 'Desert oasis experience', 3, 'terra-solis'),

-- Night Clubs
('venue-soho-garden', 'Soho Garden', 'Join the festival at Soho Garden Meydan. Multi-venue experience with world-class DJs.', 25.1680, 55.3070, 'Dubai', 'Meydan', 'Nightlife', 'Festival', false, true, '/images/nightclubs/Soho_Garden/image1.jpg', '{"Festival","Multi-Venue"}', 'Festival-style nightlife', 3, 'soho-garden'),
('venue-iris', 'Iris', 'Ascend to open-air rooftop nights at Iris Meydan. Stunning views and vibrant atmosphere.', 25.1951, 55.2716, 'Dubai', 'Meydan', 'Nightlife', 'Rooftop', false, true, '/images/nightclubs/Iris/image1.jpg', '{"Rooftop","Open-Air"}', 'Open-air rooftop nights', 3, 'iris'),
('venue-nyx', 'Nyx', 'Enter luxury underground at Nyx by Gaia DIFC. Exclusive atmosphere and sophisticated crowd.', 25.2178, 55.2800, 'Dubai', 'DIFC', 'Nightlife', 'Luxury', false, true, '/images/nightclubs/Nyx/image1.jpg', '{"Luxury","Underground"}', 'Luxury underground', 4, 'nyx'),
('venue-rasputine', 'Rasputine', 'Enter Parisian nightlife elegance at Rasputine DIFC. Exclusive atmosphere and VIP experience.', 25.2178, 55.2812, 'Dubai', 'DIFC', 'Nightlife', 'Parisian', false, true, '/images/nightclubs/Rasputine/image1.jpg', '{"Parisian","Exclusive"}', 'Parisian nightlife', 4, 'rasputine'),
('venue-secret-room', 'Secret Room', 'Find hidden exclusivity at Secret Room Downtown. VIP entrance and intimate setting.', 25.2178, 55.2826, 'Dubai', 'Downtown', 'Nightlife', 'Hidden', false, true, '/images/nightclubs/Secret_Room/image1.jpg', '{"Hidden","VIP"}', 'Hidden exclusive venue', 4, 'secret-room'),

-- Dining & Entertainment
('venue-billionaire', 'Billionaire', 'Indulge in the ultimate dinner spectacle at Billionaire Downtown. World-class entertainment and exceptional cuisine.', 25.1951, 55.2720, 'Dubai', 'Downtown', 'Nightlife', 'Dinner Show', false, true, '/images/dining_entertainment/Billionaire/image1.jpg', '{"Dinner Show","Luxury","Iconic"}', 'Ultimate dinner spectacle', 4, 'billionaire'),
('venue-adaline', 'Adaline', 'Immerse in theatrical dining at Adaline DIFC. Dinner show spectacle with immersive storytelling.', 25.2040, 55.2718, 'Dubai', 'DIFC', 'Nightlife', 'Immersive', false, true, '/images/dining_entertainment/Adaline/image1.jpg', '{"Immersive","Dinner Show"}', 'Immersive dinner show', 4, 'adaline'),
('venue-dream', 'Dream', 'Enter theatrical dining at Dream JBR. Spectacular shows and immersive experiences.', 25.2009, 55.2700, 'Dubai', 'JBR', 'Nightlife', 'Theatrical', false, true, '/images/dining_entertainment/Dream/image1.jpg', '{"Theatrical","Dinner Show"}', 'Theatrical dining experience', 4, 'dream')

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  updated_at = now();
