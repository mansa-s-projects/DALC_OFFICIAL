-- Vendors
INSERT INTO public.vendors (id, name, slug, description, contact_whatsapp, emirate, is_verified, status)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Dubai À La Carte', 'dalc', 'Premium concierge and first-party activity provider.',
  '971585987600', 'Dubai', true, 'active'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.vendors (id, name, slug, description, emirate, is_verified, status) VALUES
  ('a0000000-0000-0000-0000-000000000002', 'Skydive Dubai', 'skydive-dubai', 'Professional skydiving over Palm Jumeirah and Desert.', 'Dubai', false, 'active'),
  ('a0000000-0000-0000-0000-000000000003', 'HeliDubai', 'helidubai', 'Helicopter tours over Dubai landmarks.', 'Dubai', false, 'active'),
  ('a0000000-0000-0000-0000-000000000004', 'Atlantis The Palm', 'atlantis-the-palm', 'Marine experiences and underwater adventures.', 'Dubai', false, 'active'),
  ('a0000000-0000-0000-0000-000000000005', 'Talise Ottoman Spa', 'talise-ottoman-spa', 'Luxury Ottoman spa at Jumeirah Zabeel Saray.', 'Dubai', false, 'active'),
  ('a0000000-0000-0000-0000-000000000006', 'Anantara The Palm', 'anantara-the-palm', 'Luxury spa and wellness resort.', 'Dubai', false, 'active'),
  ('a0000000-0000-0000-0000-000000000007', 'Tresind Studio', 'tresind-studio', 'Two Michelin-star progressive Indian dining.', 'Dubai', false, 'active'),
  ('a0000000-0000-0000-0000-000000000008', 'WHITE Dubai', 'white-dubai', 'Award-winning rooftop nightclub at Meydan.', 'Dubai', false, 'active'),
  ('a0000000-0000-0000-0000-000000000009', 'Aura Skypool', 'aura-skypool', 'World''s highest 360 infinity pool.', 'Dubai', false, 'active'),
  ('a0000000-0000-0000-0000-000000000010', 'Sonara Camp', 'sonara-camp', 'Premium desert dining and overnight camp.', 'Dubai', false, 'active')
ON CONFLICT (slug) DO NOTHING;

-- Top-Level Categories
INSERT INTO public.activity_categories (id, slug, name, description, sort_order, parent_id, is_active) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'desert-adventures', 'Desert Adventures', 'Dune buggies, ATVs, and off-road safaris in the Dubai desert.', 1, NULL, true),
  ('c0000000-0000-0000-0000-000000000002', 'water-activities', 'Water Activities', 'Jet skis, yacht charters, and high-speed water experiences.', 2, NULL, true),
  ('c0000000-0000-0000-0000-000000000003', 'aerial-and-adrenaline', 'Aerial and Adrenaline', 'Sky-focused and adrenaline-led experiences.', 3, NULL, true),
  ('c0000000-0000-0000-0000-000000000004', 'wellness', 'Wellness', 'Spa retreats, yoga sessions, and rejuvenating experiences.', 4, NULL, true),
  ('c0000000-0000-0000-0000-000000000005', 'tickets-and-culture', 'Tickets and Culture', 'Cultural tours, events, and curated access.', 5, NULL, true),
  ('c0000000-0000-0000-0000-000000000006', 'luxury-leisure', 'Luxury Leisure', 'Premium lifestyle bookings and luxury cars.', 6, NULL, true),
  ('c0000000-0000-0000-0000-000000000007', 'photography-experience', 'Photography and Experience', 'Unforgettable dress photoshoots in the desert.', 7, NULL, true),
  ('c0000000-0000-0000-0000-000000000008', 'signature-dining', 'Signature Dining', 'Exclusive gourmet dining experiences.', 8, NULL, true),
  ('c0000000-0000-0000-0000-000000000009', 'observation', 'Observation', 'Sky-high viewpoints and iconic observatory experiences.', 9, NULL, true)
ON CONFLICT (slug) DO NOTHING;

-- Subcategories
INSERT INTO public.activity_categories (slug, name, sort_order, parent_id, is_active) VALUES
  ('desert-safari', 'Desert Safari', 1, 'c0000000-0000-0000-0000-000000000001', true),
  ('quad-biking', 'Quad Biking', 2, 'c0000000-0000-0000-0000-000000000001', true),
  ('dune-buggy', 'Dune Buggy', 3, 'c0000000-0000-0000-0000-000000000001', true),
  ('horse-riding', 'Horse Riding', 4, 'c0000000-0000-0000-0000-000000000001', true),
  ('desert-camp', 'Desert Camp', 5, 'c0000000-0000-0000-0000-000000000001', true),
  ('jet-ski', 'Jet Ski', 1, 'c0000000-0000-0000-0000-000000000002', true),
  ('water-car', 'Water Car', 2, 'c0000000-0000-0000-0000-000000000002', true),
  ('scuba-diving', 'Scuba Diving', 3, 'c0000000-0000-0000-0000-000000000002', true),
  ('yacht-charter', 'Yacht Charter', 4, 'c0000000-0000-0000-0000-000000000002', true),
  ('helicopter-tour', 'Helicopter Tour', 1, 'c0000000-0000-0000-0000-000000000003', true),
  ('skydiving', 'Skydiving', 2, 'c0000000-0000-0000-0000-000000000003', true),
  ('zipline', 'Zipline', 3, 'c0000000-0000-0000-0000-000000000003', true),
  ('spa-resort', 'Spa Resort', 1, 'c0000000-0000-0000-0000-000000000004', true),
  ('yoga-retreat', 'Yoga Retreat', 2, 'c0000000-0000-0000-0000-000000000004', true),
  ('meditation', 'Meditation', 3, 'c0000000-0000-0000-0000-000000000004', true),
  ('heritage-walk', 'Heritage Walk', 1, 'c0000000-0000-0000-0000-000000000005', true),
  ('museum-tour', 'Museum Tour', 2, 'c0000000-0000-0000-0000-000000000005', true),
  ('art-gallery', 'Art Gallery', 3, 'c0000000-0000-0000-0000-000000000005', true),
  ('rooftop-lounges', 'Rooftop Lounges', 1, 'c0000000-0000-0000-0000-000000000006', true),
  ('clubs', 'Clubs', 2, 'c0000000-0000-0000-0000-000000000006', true),
  ('fine-dining', 'Fine Dining', 3, 'c0000000-0000-0000-0000-000000000006', true)
ON CONFLICT (slug) DO NOTHING;;
