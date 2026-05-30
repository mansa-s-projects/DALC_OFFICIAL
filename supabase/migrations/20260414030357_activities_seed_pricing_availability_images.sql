-- PRICING TIERS

INSERT INTO public.activity_pricing (activity_id, tier_name, description, price, pricing_model, max_guests, includes, sort_order)
SELECT a.id, v.tier_name, v.description, v.price, v.pricing_model, v.max_guests, v.includes, v.sort_order
FROM public.activities a,
(VALUES
  ('Lounge Access', 'Standard pool access with lounger', 300, 'per_person', 1, ARRAY['Pool access','Sun lounger','Towel service'], 1),
  ('Premium Lounger', 'Premium location lounger with fruit platter', 500, 'per_person', 1, ARRAY['Premium lounger','Welcome drink','Fresh fruit platter'], 2),
  ('Cabana', 'Private cabana for up to 4 guests', 1200, 'per_group', 4, ARRAY['Private cabana','Bottle of champagne','Gourmet snacks'], 3)
) AS v(tier_name, description, price, pricing_model, max_guests, includes, sort_order)
WHERE a.slug = 'aura-skypool-sunset-session';

INSERT INTO public.activity_pricing (activity_id, tier_name, description, price, pricing_model, max_guests, includes, sort_order)
SELECT a.id, v.tier_name, v.description, v.price, v.pricing_model, v.max_guests, v.includes, v.sort_order
FROM public.activities a,
(VALUES
  ('Standard VIP', 'VIP table for up to 4 guests', 1500, 'per_group', 4, ARRAY['VIP entry','Private table','1 premium bottle','Mixers'], 1),
  ('Premium VIP', 'Premium location table for up to 6 guests', 3000, 'per_group', 6, ARRAY['Priority VIP entry','Premium table','2 premium bottles','Champagne'], 2),
  ('Presidential', 'Best table in the house for up to 10 guests', 8000, 'per_group', 10, ARRAY['Express entry','Best table','3 premium bottles','Dom Perignon'], 3)
) AS v(tier_name, description, price, pricing_model, max_guests, includes, sort_order)
WHERE a.slug = 'white-dubai-vip-table';

INSERT INTO public.activity_pricing (activity_id, tier_name, description, price, pricing_model, max_guests, includes, sort_order)
SELECT a.id, v.tier_name, v.description, v.price, v.pricing_model, v.max_guests, v.includes, v.sort_order
FROM public.activities a,
(VALUES
  ('Standard', 'Shared wildlife drive experience', 950, 'per_person', 1, ARRAY['Shared wildlife drive','Dinner','Entertainment'], 1),
  ('Private Vehicle', 'Private Range Rover for up to 4', 4500, 'per_group', 4, ARRAY['Private Range Rover','Dedicated guide','Dinner','VIP seating'], 2)
) AS v(tier_name, description, price, pricing_model, max_guests, includes, sort_order)
WHERE a.slug = 'platinum-desert-safari-dinner';

INSERT INTO public.activity_pricing (activity_id, tier_name, description, price, pricing_model, max_guests, includes, sort_order)
SELECT a.id, v.tier_name, v.description, v.price, v.pricing_model, v.max_guests, v.includes, v.sort_order
FROM public.activities a,
(VALUES
  ('Standard', 'Tandem jump with photos and video', 2599, 'per_person', 1, ARRAY['Tandem jump','Professional photos','Edited video','Certificate'], 1),
  ('Premium', 'Jump with dedicated camera flyer', 3299, 'per_person', 1, ARRAY['Tandem jump','Dedicated camera flyer','Premium photos','Cinematic video'], 2)
) AS v(tier_name, description, price, pricing_model, max_guests, includes, sort_order)
WHERE a.slug = 'skydive-dubai-tandem-palm';

INSERT INTO public.activity_pricing (activity_id, tier_name, description, price, pricing_model, max_guests, includes, sort_order)
SELECT a.id, v.tier_name, v.description, v.price, v.pricing_model, v.max_guests, v.includes, v.sort_order
FROM public.activities a,
(VALUES
  ('Chefs Table', '20-course menu with kitchen views', 1200, 'per_person', 1, ARRAY['20-course tasting menu','Welcome cocktail'], 1),
  ('With Wine Pairing', 'Menu with premium wine pairing', 1800, 'per_person', 1, ARRAY['20-course tasting menu','Wine pairing','Welcome cocktail'], 2)
) AS v(tier_name, description, price, pricing_model, max_guests, includes, sort_order)
WHERE a.slug = 'tresind-studio-chefs-table';

INSERT INTO public.activity_pricing (activity_id, tier_name, description, price, pricing_model, max_guests, includes, sort_order)
SELECT a.id, v.tier_name, v.description, v.price, v.pricing_model, v.max_guests, v.includes, v.sort_order
FROM public.activities a,
(VALUES
  ('Shark Safari', '30-minute underwater walk', 850, 'per_person', 1, ARRAY['Safety briefing','Helmet dive','30-min underwater','Photos'], 1),
  ('Certified Dive', 'Full dive for certified divers', 1200, 'per_person', 1, ARRAY['All equipment','45-min dive','Professional guide','Photos','Video'], 2)
) AS v(tier_name, description, price, pricing_model, max_guests, includes, sort_order)
WHERE a.slug = 'atlantis-dive-shark-safari';

INSERT INTO public.activity_pricing (activity_id, tier_name, description, price, pricing_model, max_guests, includes, sort_order)
SELECT a.id, v.tier_name, v.description, v.price, v.pricing_model, v.max_guests, v.includes, v.sort_order
FROM public.activities a,
(VALUES
  ('Shared Flight', 'Shared helicopter experience', 1099, 'per_person', 1, ARRAY['22-min tour','Safety briefing','Commentary'], 1),
  ('Private Flight', 'Private helicopter for up to 5', 5499, 'per_group', 5, ARRAY['Private 22-min tour','Exclusive helicopter','Priority scheduling'], 2)
) AS v(tier_name, description, price, pricing_model, max_guests, includes, sort_order)
WHERE a.slug = 'helidubai-iconic-tour';

INSERT INTO public.activity_pricing (activity_id, tier_name, description, price, pricing_model, max_guests, includes, sort_order)
SELECT a.id, v.tier_name, v.description, v.price, v.pricing_model, v.max_guests, v.includes, v.sort_order
FROM public.activities a,
(VALUES
  ('Royal Hammam', '3-hour traditional ritual', 750, 'per_person', 1, ARRAY['Hammam access','Body exfoliation','Foam massage','Mud mask'], 1),
  ('Couples Ritual', 'Private hammam suite for two', 1400, 'per_group', 2, ARRAY['Private suite','Couples ritual','Champagne','Fresh fruit'], 2)
) AS v(tier_name, description, price, pricing_model, max_guests, includes, sort_order)
WHERE a.slug = 'talise-ottoman-royal-hammam';

INSERT INTO public.activity_pricing (activity_id, tier_name, description, price, pricing_model, max_guests, includes, sort_order)
SELECT a.id, v.tier_name, v.description, v.price, v.pricing_model, v.max_guests, v.includes, v.sort_order
FROM public.activities a,
(VALUES
  ('Group Tour', 'Small group tour (max 8)', 250, 'per_person', 1, ARRAY['Professional guide','Abra ride','Water'], 1),
  ('Private Tour', 'Private guide for up to 4', 800, 'per_group', 4, ARRAY['Private guide','Abra ride','Coffee tasting','Flexible pace'], 2)
) AS v(tier_name, description, price, pricing_model, max_guests, includes, sort_order)
WHERE a.slug = 'alfahidi-old-dubai-walking-tour';

INSERT INTO public.activity_pricing (activity_id, tier_name, description, price, pricing_model, max_guests, includes, sort_order)
SELECT a.id, v.tier_name, v.description, v.price, v.pricing_model, v.max_guests, v.includes, v.sort_order
FROM public.activities a,
(VALUES
  ('20 Minutes', '20-min taster ride', 600, 'per_person', 1, ARRAY['Jetcar rental','Life jacket','Orientation'], 1),
  ('30 Minutes', '30-min full experience', 900, 'per_person', 1, ARRAY['Jetcar rental','Life jacket','Orientation','Extended route'], 2),
  ('60 Minutes', '1-hour extended session', 1300, 'per_person', 1, ARRAY['Jetcar rental','Life jacket','Orientation','Full Marina tour'], 3)
) AS v(tier_name, description, price, pricing_model, max_guests, includes, sort_order)
WHERE a.slug = 'jetcar-drive-on-water';


-- AVAILABILITY RULES

INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', NULL, '15:00'::TIME, '19:00'::TIME, 60 FROM public.activities a WHERE a.slug = 'aura-skypool-sunset-session';
INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', NULL, '19:00'::TIME, '23:00'::TIME, 60 FROM public.activities a WHERE a.slug = 'aura-skypool-sunset-session';

INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', d.dow, '23:00'::TIME, '04:00'::TIME, 200
FROM public.activities a, (VALUES (4), (5), (6)) AS d(dow) WHERE a.slug = 'white-dubai-vip-table';

INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', NULL, '15:00'::TIME, '21:00'::TIME, 40 FROM public.activities a WHERE a.slug = 'platinum-desert-safari-dinner';

INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', NULL, '08:00'::TIME, '15:00'::TIME, 80 FROM public.activities a WHERE a.slug = 'skydive-dubai-tandem-palm';

INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', d.dow, '19:00'::TIME, '23:00'::TIME, 6
FROM public.activities a, (VALUES (2), (3), (4), (5), (6)) AS d(dow) WHERE a.slug = 'tresind-studio-chefs-table';

INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', NULL, '10:00'::TIME, '17:00'::TIME, 12 FROM public.activities a WHERE a.slug = 'atlantis-dive-shark-safari';

INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', NULL, '09:00'::TIME, '17:00'::TIME, 25 FROM public.activities a WHERE a.slug = 'helidubai-iconic-tour';

INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', NULL, '10:00'::TIME, '21:00'::TIME, 20 FROM public.activities a WHERE a.slug = 'talise-ottoman-royal-hammam';

INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', NULL, '09:00'::TIME, '12:00'::TIME, 8 FROM public.activities a WHERE a.slug = 'alfahidi-old-dubai-walking-tour';
INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', NULL, '16:00'::TIME, '19:00'::TIME, 8 FROM public.activities a WHERE a.slug = 'alfahidi-old-dubai-walking-tour';

INSERT INTO public.activity_availability (activity_id, availability_type, day_of_week, start_time, end_time, capacity)
SELECT a.id, 'recurring', NULL, '09:00'::TIME, '17:00'::TIME, 3 FROM public.activities a WHERE a.slug = 'jetcar-drive-on-water';


-- HERO IMAGES

INSERT INTO public.activity_images (activity_id, url, alt_text, type, sort_order)
SELECT a.id, v.url, v.alt_text, 'hero', 0
FROM public.activities a,
(VALUES
  ('aura-skypool-sunset-session', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2670&auto=format&fit=crop', 'Aura Skypool sunset view'),
  ('white-dubai-vip-table', 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2670&auto=format&fit=crop', 'WHITE Dubai nightclub'),
  ('platinum-desert-safari-dinner', 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?q=80&w=2674&auto=format&fit=crop', 'Dubai desert safari at sunset'),
  ('skydive-dubai-tandem-palm', 'https://images.unsplash.com/photo-1529661197280-63dc398c6b33?q=80&w=2670&auto=format&fit=crop', 'Skydiving over Palm Jumeirah'),
  ('tresind-studio-chefs-table', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop', 'Tresind Studio chefs table'),
  ('atlantis-dive-shark-safari', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2670&auto=format&fit=crop', 'Underwater shark diving at Atlantis'),
  ('helidubai-iconic-tour', 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2670&auto=format&fit=crop', 'Helicopter over Dubai skyline'),
  ('talise-ottoman-royal-hammam', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2670&auto=format&fit=crop', 'Ottoman spa hammam'),
  ('alfahidi-old-dubai-walking-tour', 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2670&auto=format&fit=crop', 'Al Fahidi historical district'),
  ('jetcar-drive-on-water', 'https://images.unsplash.com/photo-1476673160081-cf065bc4e7ce?q=80&w=2670&auto=format&fit=crop', 'Jetcar on water in Dubai Marina')
) AS v(slug, url, alt_text)
WHERE a.slug = v.slug;;
