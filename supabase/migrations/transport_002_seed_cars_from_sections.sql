-- Migration: Seed transport_services with properly categorized cars from car_sections.json
-- This fixes the car categorization issue where cars were in wrong sections

-- First, clear existing car entries to avoid duplicates
DELETE FROM transport_services WHERE subcategory = 'cars';

-- Insert Economy Cars (65-95 AED/day)
INSERT INTO transport_services (
  category, subcategory, sub_subcategory, name, slug, description_short, description_long,
  pricing_model, price_from, price_currency, price_display, availability_type,
  max_capacity, min_booking_hours, advance_booking_hours, specifications,
  location, area, pickup_locations, is_featured, is_trending, status
) VALUES
  ('transport', 'cars', 'economy', 'Nissan Sunny 2023', 'nissan-sunny-2023-dubai', 
   'Reliable economy sedan perfect for city driving.', 'The Nissan Sunny offers excellent fuel efficiency and comfortable seating for 5. Ideal for budget-conscious travelers exploring Dubai.',
   'daily', 70, 'AED', 'AED 70/day', 'on_demand', 5, 24, 12,
   '{"make": "Nissan", "model": "Sunny", "year": 2023, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Dubai Marina', ARRAY['Dubai Marina', 'Downtown Dubai', 'Dubai Airport'], false, false, 'published'),
   
  ('transport', 'cars', 'economy', 'Nissan Sunny 2024', 'nissan-sunny-2024-dubai', 
   'Reliable economy sedan perfect for city driving.', 'The Nissan Sunny offers excellent fuel efficiency and comfortable seating for 5. Ideal for budget-conscious travelers exploring Dubai.',
   'daily', 75, 'AED', 'AED 75/day', 'on_demand', 5, 24, 12,
   '{"make": "Nissan", "model": "Sunny", "year": 2024, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Dubai Marina', ARRAY['Dubai Marina', 'Downtown Dubai', 'Dubai Airport'], true, true, 'published'),
   
  ('transport', 'cars', 'economy', 'Nissan Sunny 2025', 'nissan-sunny-2025-dubai', 
   'Brand new economy sedan with modern features.', 'The latest Nissan Sunny with updated styling and technology. Great value for money with excellent fuel economy.',
   'daily', 85, 'AED', 'AED 85/day', 'on_demand', 5, 24, 12,
   '{"make": "Nissan", "model": "Sunny", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Dubai Marina', ARRAY['Dubai Marina', 'Downtown Dubai', 'Dubai Airport'], false, true, 'published'),

  ('transport', 'cars', 'economy', 'Toyota Yaris 2023', 'toyota-yaris-2023-dubai', 
   'Compact and efficient hatchback.', 'The Toyota Yaris combines Japanese reliability with modern safety features. Perfect for navigating Dubai busy streets.',
   'daily', 80, 'AED', 'AED 80/day', 'on_demand', 5, 24, 12,
   '{"make": "Toyota", "model": "Yaris", "year": 2023, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Downtown Dubai', ARRAY['Downtown Dubai', 'Dubai Mall', 'Burj Khalifa'], false, false, 'published'),
   
  ('transport', 'cars', 'economy', 'Toyota Yaris 2024', 'toyota-yaris-2024-dubai', 
   'Compact and efficient hatchback.', 'The Toyota Yaris combines Japanese reliability with modern safety features. Perfect for navigating Dubai busy streets.',
   'daily', 85, 'AED', 'AED 85/day', 'on_demand', 5, 24, 12,
   '{"make": "Toyota", "model": "Yaris", "year": 2024, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Downtown Dubai', ARRAY['Downtown Dubai', 'Dubai Mall', 'Burj Khalifa'], true, true, 'published'),
   
  ('transport', 'cars', 'economy', 'Toyota Yaris 2025', 'toyota-yaris-2025-dubai', 
   'Latest generation Yaris with enhanced features.', 'The 2025 Toyota Yaris brings updated design and technology while maintaining its reputation for reliability and efficiency.',
   'daily', 95, 'AED', 'AED 95/day', 'on_demand', 5, 24, 12,
   '{"make": "Toyota", "model": "Yaris", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Downtown Dubai', ARRAY['Downtown Dubai', 'Dubai Mall', 'Burj Khalifa'], false, true, 'published'),

  ('transport', 'cars', 'economy', 'Kia Picanto 2023', 'kia-picanto-2023-dubai', 
   'Compact city car with surprising interior space.', 'The Kia Picanto is perfect for solo travelers or couples. Easy to park and economical to run.',
   'daily', 65, 'AED', 'AED 65/day', 'on_demand', 4, 24, 12,
   '{"make": "Kia", "model": "Picanto", "year": 2023, "seats": 4, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'JBR', ARRAY['JBR', 'Dubai Marina', 'JLT'], false, false, 'published'),
   
  ('transport', 'cars', 'economy', 'Kia Picanto 2024', 'kia-picanto-2024-dubai', 
   'Compact city car with surprising interior space.', 'The Kia Picanto is perfect for solo travelers or couples. Easy to park and economical to run.',
   'daily', 70, 'AED', 'AED 70/day', 'on_demand', 4, 24, 12,
   '{"make": "Kia", "model": "Picanto", "year": 2024, "seats": 4, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'JBR', ARRAY['JBR', 'Dubai Marina', 'JLT'], false, false, 'published'),
   
  ('transport', 'cars', 'economy', 'Kia Picanto 2025', 'kia-picanto-2025-dubai', 
   'Updated compact with modern tech features.', 'The 2025 Picanto offers great value with touchscreen infotainment and advanced safety features.',
   'daily', 80, 'AED', 'AED 80/day', 'on_demand', 4, 24, 12,
   '{"make": "Kia", "model": "Picanto", "year": 2025, "seats": 4, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'JBR', ARRAY['JBR', 'Dubai Marina', 'JLT'], false, true, 'published'),

  ('transport', 'cars', 'economy', 'Hyundai Accent 2023', 'hyundai-accent-2023-dubai', 
   'Spacious economy sedan with excellent value.', 'The Hyundai Accent offers more interior space than typical economy cars, making it great for small families.',
   'daily', 75, 'AED', 'AED 75/day', 'on_demand', 5, 24, 12,
   '{"make": "Hyundai", "model": "Accent", "year": 2023, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Business Bay', ARRAY['Business Bay', 'Downtown Dubai', 'DIFC'], false, false, 'published'),
   
  ('transport', 'cars', 'economy', 'Hyundai Accent 2024', 'hyundai-accent-2024-dubai', 
   'Spacious economy sedan with excellent value.', 'The Hyundai Accent offers more interior space than typical economy cars, making it great for small families.',
   'daily', 80, 'AED', 'AED 80/day', 'on_demand', 5, 24, 12,
   '{"make": "Hyundai", "model": "Accent", "year": 2024, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Business Bay', ARRAY['Business Bay', 'Downtown Dubai', 'DIFC'], false, false, 'published'),
   
  ('transport', 'cars', 'economy', 'Hyundai Accent 2025', 'hyundai-accent-2025-dubai', 
   'Latest Accent with premium touches.', 'The 2025 Hyundai Accent brings near-luxury features to the economy segment with updated styling and technology.',
   'daily', 90, 'AED', 'AED 90/day', 'on_demand', 5, 24, 12,
   '{"make": "Hyundai", "model": "Accent", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Business Bay', ARRAY['Business Bay', 'Downtown Dubai', 'DIFC'], false, true, 'published'),

  ('transport', 'cars', 'economy', 'Mitsubishi Attrage 2023', 'mitsubishi-attrage-2023-dubai', 
   'Ultra-efficient sedan with great fuel economy.', 'The Mitsubishi Attrage is designed for efficiency without compromising on comfort. Perfect for long drives.',
   'daily', 70, 'AED', 'AED 70/day', 'on_demand', 5, 24, 12,
   '{"make": "Mitsubishi", "model": "Attrage", "year": 2023, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Deira', ARRAY['Deira', 'Bur Dubai', 'Dubai Airport'], false, false, 'published'),
   
  ('transport', 'cars', 'economy', 'Mitsubishi Attrage 2024', 'mitsubishi-attrage-2024-dubai', 
   'Ultra-efficient sedan with great fuel economy.', 'The Mitsubishi Attrage is designed for efficiency without compromising on comfort. Perfect for long drives.',
   'daily', 75, 'AED', 'AED 75/day', 'on_demand', 5, 24, 12,
   '{"make": "Mitsubishi", "model": "Attrage", "year": 2024, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Deira', ARRAY['Deira', 'Bur Dubai', 'Dubai Airport'], false, false, 'published'),
   
  ('transport', 'cars', 'economy', 'Mitsubishi Attrage 2025', 'mitsubishi-attrage-2025-dubai', 
   'Updated Attrage with modern connectivity.', 'The 2025 Mitsubishi Attrage adds smartphone connectivity and safety features to its efficient package.',
   'daily', 85, 'AED', 'AED 85/day', 'on_demand', 5, 24, 12,
   '{"make": "Mitsubishi", "model": "Attrage", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Deira', ARRAY['Deira', 'Bur Dubai', 'Dubai Airport'], false, true, 'published'),

  ('transport', 'cars', 'economy', 'Chevrolet Spark 2023', 'chevrolet-spark-2023-dubai', 
   'Compact city runabout with character.', 'The Chevrolet Spark is fun to drive and easy to park. Great for urban exploration.',
   'daily', 65, 'AED', 'AED 65/day', 'on_demand', 4, 24, 12,
   '{"make": "Chevrolet", "model": "Spark", "year": 2023, "seats": 4, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Al Barsha', ARRAY['Al Barsha', 'Mall of Emirates', 'Dubai Marina'], false, false, 'published'),
   
  ('transport', 'cars', 'economy', 'Chevrolet Spark 2024', 'chevrolet-spark-2024-dubai', 
   'Compact city runabout with character.', 'The Chevrolet Spark is fun to drive and easy to park. Great for urban exploration.',
   'daily', 70, 'AED', 'AED 70/day', 'on_demand', 4, 24, 12,
   '{"make": "Chevrolet", "model": "Spark", "year": 2024, "seats": 4, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Al Barsha', ARRAY['Al Barsha', 'Mall of Emirates', 'Dubai Marina'], false, false, 'published'),
   
  ('transport', 'cars', 'economy', 'Chevrolet Spark 2025', 'chevrolet-spark-2025-dubai', 
   'Updated Spark with fresh styling.', 'The 2025 Chevrolet Spark brings bold styling and tech upgrades to the compact segment.',
   'daily', 80, 'AED', 'AED 80/day', 'on_demand', 4, 24, 12,
   '{"make": "Chevrolet", "model": "Spark", "year": 2025, "seats": 4, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Al Barsha', ARRAY['Al Barsha', 'Mall of Emirates', 'Dubai Marina'], false, true, 'published'),

  ('transport', 'cars', 'economy', 'Renault Symbol 2024', 'renault-symbol-2024-dubai', 
   'European design meets practicality.', 'The Renault Symbol offers distinctive styling and a comfortable ride at an affordable price point.',
   'daily', 75, 'AED', 'AED 75/day', 'on_demand', 5, 24, 12,
   '{"make": "Renault", "model": "Symbol", "year": 2024, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Dubai Silicon Oasis', ARRAY['Dubai Silicon Oasis', 'Academic City', 'Dubai Airport'], false, false, 'published'),

  ('transport', 'cars', 'economy', 'Suzuki Ciaz 2025', 'suzuki-ciaz-2025-dubai', 
   'Spacious sedan with premium touches.', 'The Suzuki Ciaz offers segment-leading rear legroom and premium features uncommon in this price range.',
   'daily', 90, 'AED', 'AED 90/day', 'on_demand', 5, 24, 12,
   '{"make": "Suzuki", "model": "Ciaz", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Dubai Festival City', ARRAY['Dubai Festival City', 'Garhoud', 'Dubai Airport'], false, true, 'published');

-- Insert Standard Cars (105-150 AED/day)
INSERT INTO transport_services (
  category, subcategory, sub_subcategory, name, slug, description_short, description_long,
  pricing_model, price_from, price_currency, price_display, availability_type,
  max_capacity, min_booking_hours, advance_booking_hours, specifications,
  location, area, pickup_locations, is_featured, is_trending, status
) VALUES
  ('transport', 'cars', 'standard', 'Toyota Corolla 2023', 'toyota-corolla-2023-dubai', 
   'The world best-selling sedan, perfected.', 'The Toyota Corolla offers legendary reliability, spacious interior, and modern safety features. Perfect for families and business travelers alike.',
   'daily', 110, 'AED', 'AED 110/day', 'on_demand', 5, 24, 12,
   '{"make": "Toyota", "model": "Corolla", "year": 2023, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Downtown Dubai', ARRAY['Downtown Dubai', 'Dubai Mall', 'Business Bay'], true, true, 'published'),
   
  ('transport', 'cars', 'standard', 'Toyota Corolla 2024', 'toyota-corolla-2024-dubai', 
   'The world best-selling sedan, perfected.', 'The Toyota Corolla offers legendary reliability, spacious interior, and modern safety features. Perfect for families and business travelers alike.',
   'daily', 120, 'AED', 'AED 120/day', 'on_demand', 5, 24, 12,
   '{"make": "Toyota", "model": "Corolla", "year": 2024, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Downtown Dubai', ARRAY['Downtown Dubai', 'Dubai Mall', 'Business Bay'], true, true, 'published'),
   
  ('transport', 'cars', 'standard', 'Toyota Corolla 2025', 'toyota-corolla-2025-dubai', 
   'Latest Corolla with hybrid option available.', 'The 2025 Toyota Corolla brings enhanced styling, improved fuel efficiency, and Toyota Safety Sense standard.',
   'daily', 130, 'AED', 'AED 130/day', 'on_demand', 5, 24, 12,
   '{"make": "Toyota", "model": "Corolla", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Downtown Dubai', ARRAY['Downtown Dubai', 'Dubai Mall', 'Business Bay'], false, true, 'published'),

  ('transport', 'cars', 'standard', 'Honda Civic 2023', 'honda-civic-2023-dubai', 
   'Sporty sedan with premium feel.', 'The Honda Civic combines engaging driving dynamics with a upscale interior. A drivers car in the standard segment.',
   'daily', 120, 'AED', 'AED 120/day', 'on_demand', 5, 24, 12,
   '{"make": "Honda", "model": "Civic", "year": 2023, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Dubai Marina', ARRAY['Dubai Marina', 'JBR', 'Palm Jumeirah'], false, false, 'published'),
   
  ('transport', 'cars', 'standard', 'Honda Civic 2024', 'honda-civic-2024-dubai', 
   'Sporty sedan with premium feel.', 'The Honda Civic combines engaging driving dynamics with a upscale interior. A drivers car in the standard segment.',
   'daily', 130, 'AED', 'AED 130/day', 'on_demand', 5, 24, 12,
   '{"make": "Honda", "model": "Civic", "year": 2024, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Dubai Marina', ARRAY['Dubai Marina', 'JBR', 'Palm Jumeirah'], true, true, 'published'),
   
  ('transport', 'cars', 'standard', 'Honda Civic 2025', 'honda-civic-2025-dubai', 
   'Refined Civic with turbocharged performance.', 'The 2025 Honda Civic offers refined ride quality, turbocharged power, and class-leading technology.',
   'daily', 140, 'AED', 'AED 140/day', 'on_demand', 5, 24, 12,
   '{"make": "Honda", "model": "Civic", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Dubai Marina', ARRAY['Dubai Marina', 'JBR', 'Palm Jumeirah'], false, true, 'published'),

  ('transport', 'cars', 'standard', 'Hyundai Elantra 2023', 'hyundai-elantra-2023-dubai', 
   'Bold styling meets practicality.', 'The Hyundai Elantra stands out with its distinctive design while offering excellent value and features.',
   'daily', 110, 'AED', 'AED 110/day', 'on_demand', 5, 24, 12,
   '{"make": "Hyundai", "model": "Elantra", "year": 2023, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Business Bay', ARRAY['Business Bay', 'DIFC', 'Downtown Dubai'], false, false, 'published'),
   
  ('transport', 'cars', 'standard', 'Hyundai Elantra 2024', 'hyundai-elantra-2024-dubai', 
   'Bold styling meets practicality.', 'The Hyundai Elantra stands out with its distinctive design while offering excellent value and features.',
   'daily', 120, 'AED', 'AED 120/day', 'on_demand', 5, 24, 12,
   '{"make": "Hyundai", "model": "Elantra", "year": 2024, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Business Bay', ARRAY['Business Bay', 'DIFC', 'Downtown Dubai'], false, false, 'published'),
   
  ('transport', 'cars', 'standard', 'Hyundai Elantra 2025', 'hyundai-elantra-2025-dubai', 
   'Updated Elantra with premium interior.', 'The 2025 Hyundai Elantra brings near-luxury interior quality and advanced driver assistance features.',
   'daily', 130, 'AED', 'AED 130/day', 'on_demand', 5, 24, 12,
   '{"make": "Hyundai", "model": "Elantra", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Business Bay', ARRAY['Business Bay', 'DIFC', 'Downtown Dubai'], false, true, 'published'),

  ('transport', 'cars', 'standard', 'Kia Cerato 2023', 'kia-cerato-2023-dubai', 
   'Value-packed sedan with premium features.', 'The Kia Cerato offers exceptional value with features typically found in more expensive vehicles.',
   'daily', 105, 'AED', 'AED 105/day', 'on_demand', 5, 24, 12,
   '{"make": "Kia", "model": "Cerato", "year": 2023, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'JBR', ARRAY['JBR', 'Dubai Marina', 'Bluewaters Island'], false, false, 'published'),
   
  ('transport', 'cars', 'standard', 'Kia Cerato 2024', 'kia-cerato-2024-dubai', 
   'Value-packed sedan with premium features.', 'The Kia Cerato offers exceptional value with features typically found in more expensive vehicles.',
   'daily', 115, 'AED', 'AED 115/day', 'on_demand', 5, 24, 12,
   '{"make": "Kia", "model": "Cerato", "year": 2024, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'JBR', ARRAY['JBR', 'Dubai Marina', 'Bluewaters Island'], false, false, 'published'),
   
  ('transport', 'cars', 'standard', 'Kia Cerato 2025', 'kia-cerato-2025-dubai', 
   'Latest Cerato with bold new styling.', 'The 2025 Kia Cerato features dramatic new styling and upgraded technology throughout.',
   'daily', 125, 'AED', 'AED 125/day', 'on_demand', 5, 24, 12,
   '{"make": "Kia", "model": "Cerato", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'JBR', ARRAY['JBR', 'Dubai Marina', 'Bluewaters Island'], false, true, 'published'),

  ('transport', 'cars', 'standard', 'Mazda 3 2023', 'mazda-3-2023-dubai', 
   'Premium feel in the standard segment.', 'The Mazda 3 offers near-luxury interior quality and engaging driving dynamics that set it apart.',
   'daily', 120, 'AED', 'AED 120/day', 'on_demand', 5, 24, 12,
   '{"make": "Mazda", "model": "3", "year": 2023, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Palm Jumeirah', ARRAY['Palm Jumeirah', 'Atlantis The Palm', 'Nakheel Mall'], false, false, 'published'),
   
  ('transport', 'cars', 'standard', 'Mazda 3 2024', 'mazda-3-2024-dubai', 
   'Premium feel in the standard segment.', 'The Mazda 3 offers near-luxury interior quality and engaging driving dynamics that set it apart.',
   'daily', 130, 'AED', 'AED 130/day', 'on_demand', 5, 24, 12,
   '{"make": "Mazda", "model": "3", "year": 2024, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Palm Jumeirah', ARRAY['Palm Jumeirah', 'Atlantis The Palm', 'Nakheel Mall'], false, false, 'published'),
   
  ('transport', 'cars', 'standard', 'Mazda 3 2025', 'mazda-3-2025-dubai', 
   'Refined Mazda 3 with turbo power.', 'The 2025 Mazda 3 offers available turbocharged power and a premium experience that rivals luxury brands.',
   'daily', 140, 'AED', 'AED 140/day', 'on_demand', 5, 24, 12,
   '{"make": "Mazda", "model": "3", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Palm Jumeirah', ARRAY['Palm Jumeirah', 'Atlantis The Palm', 'Nakheel Mall'], false, true, 'published'),

  ('transport', 'cars', 'standard', 'Nissan Altima 2023', 'nissan-altima-2023-dubai', 
   'Spacious midsize sedan with comfort focus.', 'The Nissan Altima offers generous interior space and a comfortable ride, perfect for longer journeys.',
   'daily', 130, 'AED', 'AED 130/day', 'on_demand', 5, 24, 12,
   '{"make": "Nissan", "model": "Altima", "year": 2023, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Deira', ARRAY['Deira', 'Dubai Airport', 'Al Garhoud'], false, false, 'published'),
   
  ('transport', 'cars', 'standard', 'Nissan Altima 2024', 'nissan-altima-2024-dubai', 
   'Spacious midsize sedan with comfort focus.', 'The Nissan Altima offers generous interior space and a comfortable ride, perfect for longer journeys.',
   'daily', 140, 'AED', 'AED 140/day', 'on_demand', 5, 24, 12,
   '{"make": "Nissan", "model": "Altima", "year": 2024, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Deira', ARRAY['Deira', 'Dubai Airport', 'Al Garhoud'], false, false, 'published'),
   
  ('transport', 'cars', 'standard', 'Nissan Altima 2025', 'nissan-altima-2025-dubai', 
   'Updated Altima with enhanced tech.', 'The 2025 Nissan Altima brings ProPILOT Assist and improved connectivity to the midsize segment.',
   'daily', 150, 'AED', 'AED 150/day', 'on_demand', 5, 24, 12,
   '{"make": "Nissan", "model": "Altima", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Deira', ARRAY['Deira', 'Dubai Airport', 'Al Garhoud'], false, true, 'published'),

  ('transport', 'cars', 'standard', 'VW Jetta 2025', 'vw-jetta-2025-dubai', 
   'German engineering at accessible prices.', 'The Volkswagen Jetta offers solid build quality and refined driving dynamics from a legendary automaker.',
   'daily', 150, 'AED', 'AED 150/day', 'on_demand', 5, 24, 12,
   '{"make": "VW", "model": "Jetta", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Al Barsha', ARRAY['Al Barsha', 'Mall of Emirates', 'Dubai Marina'], false, true, 'published');

-- Insert Luxury Cars (350-520 AED/day)
INSERT INTO transport_services (
  category, subcategory, sub_subcategory, name, slug, description_short, description_long,
  pricing_model, price_from, price_currency, price_display, availability_type,
  max_capacity, min_booking_hours, advance_booking_hours, specifications,
  location, area, pickup_locations, is_featured, is_trending, status
) VALUES
  ('transport', 'cars', 'luxury-sedans', 'Mercedes C200 2023', 'mercedes-c200-2023-dubai', 
   'Entry-level luxury with Mercedes prestige.', 'The Mercedes-Benz C200 offers the brand renowned quality and comfort at an accessible luxury price point.',
   'daily', 350, 'AED', 'AED 350/day', 'on_demand', 5, 24, 12,
   '{"make": "Mercedes", "model": "C200", "year": 2023, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Downtown Dubai', ARRAY['Downtown Dubai', 'Dubai Mall', 'Burj Khalifa'], false, false, 'published'),
   
  ('transport', 'cars', 'luxury-sedans', 'Mercedes C200 2024', 'mercedes-c200-2024-dubai', 
   'Entry-level luxury with Mercedes prestige.', 'The Mercedes-Benz C200 offers the brand renowned quality and comfort at an accessible luxury price point.',
   'daily', 400, 'AED', 'AED 400/day', 'on_demand', 5, 24, 12,
   '{"make": "Mercedes", "model": "C200", "year": 2024, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Downtown Dubai', ARRAY['Downtown Dubai', 'Dubai Mall', 'Burj Khalifa'], true, true, 'published'),
   
  ('transport', 'cars', 'luxury-sedans', 'Mercedes C200 2025', 'mercedes-c200-2025-dubai', 
   'Latest C-Class with S-Class technology.', 'The 2025 Mercedes C200 inherits features from the flagship S-Class, offering cutting-edge luxury.',
   'daily', 450, 'AED', 'AED 450/day', 'on_demand', 5, 24, 12,
   '{"make": "Mercedes", "model": "C200", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Downtown Dubai', ARRAY['Downtown Dubai', 'Dubai Mall', 'Burj Khalifa'], false, true, 'published'),

  ('transport', 'cars', 'luxury-sedans', 'BMW 520i 2023', 'bmw-520i-2023-dubai', 
   'The ultimate driving machine in executive size.', 'The BMW 5 Series balances dynamic handling with executive comfort. Perfect for business travelers who enjoy driving.',
   'daily', 400, 'AED', 'AED 400/day', 'on_demand', 5, 24, 12,
   '{"make": "BMW", "model": "520i", "year": 2023, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Business Bay', ARRAY['Business Bay', 'DIFC', 'Downtown Dubai'], false, false, 'published'),
   
  ('transport', 'cars', 'luxury-sedans', 'BMW 520i 2024', 'bmw-520i-2024-dubai', 
   'The ultimate driving machine in executive size.', 'The BMW 5 Series balances dynamic handling with executive comfort. Perfect for business travelers who enjoy driving.',
   'daily', 450, 'AED', 'AED 450/day', 'on_demand', 5, 24, 12,
   '{"make": "BMW", "model": "520i", "year": 2024, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Business Bay', ARRAY['Business Bay', 'DIFC', 'Downtown Dubai'], true, true, 'published'),
   
  ('transport', 'cars', 'luxury-sedans', 'BMW 520i 2025', 'bmw-520i-2025-dubai', 
   'Refined 5 Series with latest technology.', 'The 2025 BMW 520i offers enhanced comfort and the latest iDrive system with curved displays.',
   'daily', 500, 'AED', 'AED 500/day', 'on_demand', 5, 24, 12,
   '{"make": "BMW", "model": "520i", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Business Bay', ARRAY['Business Bay', 'DIFC', 'Downtown Dubai'], false, true, 'published'),

  ('transport', 'cars', 'luxury-sedans', 'Audi A6 2023', 'audi-a6-2023-dubai', 
   'Sophisticated luxury with understated elegance.', 'The Audi A6 combines refined comfort with advanced technology wrapped in timeless design.',
   'daily', 420, 'AED', 'AED 420/day', 'on_demand', 5, 24, 12,
   '{"make": "Audi", "model": "A6", "year": 2023, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Dubai Marina', ARRAY['Dubai Marina', 'JBR', 'Bluewaters Island'], false, false, 'published'),
   
  ('transport', 'cars', 'luxury-sedans', 'Audi A6 2024', 'audi-a6-2024-dubai', 
   'Sophisticated luxury with understated elegance.', 'The Audi A6 combines refined comfort with advanced technology wrapped in timeless design.',
   'daily', 470, 'AED', 'AED 470/day', 'on_demand', 5, 24, 12,
   '{"make": "Audi", "model": "A6", "year": 2024, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Dubai Marina', ARRAY['Dubai Marina', 'JBR', 'Bluewaters Island'], false, false, 'published'),
   
  ('transport', 'cars', 'luxury-sedans', 'Audi A6 2025', 'audi-a6-2025-dubai', 
   'Updated A6 with mild-hybrid efficiency.', 'The 2025 Audi A6 adds mild-hybrid technology for improved efficiency without compromising performance.',
   'daily', 520, 'AED', 'AED 520/day', 'on_demand', 5, 24, 12,
   '{"make": "Audi", "model": "A6", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Dubai Marina', ARRAY['Dubai Marina', 'JBR', 'Bluewaters Island'], false, true, 'published'),

  ('transport', 'cars', 'luxury-sedans', 'Lexus ES350 2023', 'lexus-es350-2023-dubai', 
   'Japanese luxury with legendary reliability.', 'The Lexus ES350 offers a serene driving experience with impeccable build quality and reliability.',
   'daily', 380, 'AED', 'AED 380/day', 'on_demand', 5, 24, 12,
   '{"make": "Lexus", "model": "ES350", "year": 2023, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Palm Jumeirah', ARRAY['Palm Jumeirah', 'Atlantis The Palm', 'Nakheel Mall'], false, false, 'published'),
   
  ('transport', 'cars', 'luxury-sedans', 'Lexus ES350 2024', 'lexus-es350-2024-dubai', 
   'Japanese luxury with legendary reliability.', 'The Lexus ES350 offers a serene driving experience with impeccable build quality and reliability.',
   'daily', 420, 'AED', 'AED 420/day', 'on_demand', 5, 24, 12,
   '{"make": "Lexus", "model": "ES350", "year": 2024, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Palm Jumeirah', ARRAY['Palm Jumeirah', 'Atlantis The Palm', 'Nakheel Mall'], false, false, 'published'),
   
  ('transport', 'cars', 'luxury-sedans', 'Lexus ES350 2025', 'lexus-es350-2025-dubai', 
   'Refined ES with enhanced safety features.', 'The 2025 Lexus ES350 adds Lexus Safety System+ 3.0 for comprehensive driver assistance.',
   'daily', 470, 'AED', 'AED 470/day', 'on_demand', 5, 24, 12,
   '{"make": "Lexus", "model": "ES350", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Palm Jumeirah', ARRAY['Palm Jumeirah', 'Atlantis The Palm', 'Nakheel Mall'], false, true, 'published'),

  ('transport', 'cars', 'luxury-sedans', 'Genesis G80 2024', 'genesis-g80-2024-dubai', 
   'Korean luxury challenging the establishment.', 'The Genesis G80 delivers exceptional value with premium materials and advanced technology.',
   'daily', 450, 'AED', 'AED 450/day', 'on_demand', 5, 24, 12,
   '{"make": "Genesis", "model": "G80", "year": 2024, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'JBR', ARRAY['JBR', 'Dubai Marina', 'Bluewaters Island'], true, true, 'published'),
   
  ('transport', 'cars', 'luxury-sedans', 'Genesis G80 2025', 'genesis-g80-2025-dubai', 
   'Updated G80 with refined details.', 'The 2025 Genesis G80 enhances its already impressive package with subtle refinements and new features.',
   'daily', 500, 'AED', 'AED 500/day', 'on_demand', 5, 24, 12,
   '{"make": "Genesis", "model": "G80", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'JBR', ARRAY['JBR', 'Dubai Marina', 'Bluewaters Island'], false, true, 'published'),

  ('transport', 'cars', 'luxury-sedans', 'Volvo S90 2025', 'volvo-s90-2025-dubai', 
   'Scandinavian luxury with safety leadership.', 'The Volvo S90 offers minimalist elegance and industry-leading safety technology.',
   'daily', 480, 'AED', 'AED 480/day', 'on_demand', 5, 24, 12,
   '{"make": "Volvo", "model": "S90", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'DIFC', ARRAY['DIFC', 'Downtown Dubai', 'Business Bay'], false, true, 'published');

-- Insert Business Cars (500-750 AED/day)
INSERT INTO transport_services (
  category, subcategory, sub_subcategory, name, slug, description_short, description_long,
  pricing_model, price_from, price_currency, price_display, availability_type,
  max_capacity, min_booking_hours, advance_booking_hours, specifications,
  location, area, pickup_locations, is_featured, is_trending, status
) VALUES
  ('transport', 'cars', 'business', 'Mercedes E300 2023', 'mercedes-e300-2023-dubai', 
   'Executive sedan for discerning professionals.', 'The Mercedes E-Class is the benchmark for executive transport, offering unmatched comfort and presence.',
   'daily', 500, 'AED', 'AED 500/day', 'on_demand', 5, 24, 12,
   '{"make": "Mercedes", "model": "E300", "year": 2023, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'DIFC', ARRAY['DIFC', 'Downtown Dubai', 'Business Bay'], false, false, 'published'),
   
  ('transport', 'cars', 'business', 'Mercedes E300 2024', 'mercedes-e300-2024-dubai', 
   'Executive sedan for discerning professionals.', 'The Mercedes E-Class is the benchmark for executive transport, offering unmatched comfort and presence.',
   'daily', 550, 'AED', 'AED 550/day', 'on_demand', 5, 24, 12,
   '{"make": "Mercedes", "model": "E300", "year": 2024, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'DIFC', ARRAY['DIFC', 'Downtown Dubai', 'Business Bay'], true, true, 'published'),
   
  ('transport', 'cars', 'business', 'Mercedes E300 2025', 'mercedes-e300-2025-dubai', 
   'Latest E-Class with cutting-edge technology.', 'The 2025 Mercedes E300 raises the bar with advanced MBUX hyperscreen and enhanced driving aids.',
   'daily', 600, 'AED', 'AED 600/day', 'on_demand', 5, 24, 12,
   '{"make": "Mercedes", "model": "E300", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'DIFC', ARRAY['DIFC', 'Downtown Dubai', 'Business Bay'], false, true, 'published'),

  ('transport', 'cars', 'business', 'BMW 730Li 2023', 'bmw-730li-2023-dubai', 
   'Flagship luxury for the ultimate arrival.', 'The BMW 7 Series offers first-class rear accommodations and commanding road presence.',
   'daily', 600, 'AED', 'AED 600/day', 'on_demand', 5, 24, 12,
   '{"make": "BMW", "model": "730Li", "year": 2023, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Downtown Dubai', ARRAY['Downtown Dubai', 'Burj Khalifa', 'Dubai Mall'], false, false, 'published'),
   
  ('transport', 'cars', 'business', 'BMW 730Li 2024', 'bmw-730li-2024-dubai', 
   'Flagship luxury for the ultimate arrival.', 'The BMW 7 Series offers first-class rear accommodations and commanding road presence.',
   'daily', 650, 'AED', 'AED 650/day', 'on_demand', 5, 24, 12,
   '{"make": "BMW", "model": "730Li", "year": 2024, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Downtown Dubai', ARRAY['Downtown Dubai', 'Burj Khalifa', 'Dubai Mall'], true, true, 'published'),
   
  ('transport', 'cars', 'business', 'BMW 730Li 2025', 'bmw-730li-2025-dubai', 
   'The new 7 Series with theater screen.', 'The 2025 BMW 730Li features a 31-inch 8K theater screen for rear passengers and enhanced luxury.',
   'daily', 700, 'AED', 'AED 700/day', 'on_demand', 5, 24, 12,
   '{"make": "BMW", "model": "730Li", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Downtown Dubai', ARRAY['Downtown Dubai', 'Burj Khalifa', 'Dubai Mall'], false, true, 'published'),

  ('transport', 'cars', 'business', 'Audi A8 2023', 'audi-a8-2023-dubai', 
   'Understated executive excellence.', 'The Audi A8 delivers sophisticated luxury with advanced technology in an elegant, understated package.',
   'daily', 650, 'AED', 'AED 650/day', 'on_demand', 5, 24, 12,
   '{"make": "Audi", "model": "A8", "year": 2023, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Business Bay', ARRAY['Business Bay', 'DIFC', 'Downtown Dubai'], false, false, 'published'),
   
  ('transport', 'cars', 'business', 'Audi A8 2024', 'audi-a8-2024-dubai', 
   'Understated executive excellence.', 'The Audi A8 delivers sophisticated luxury with advanced technology in an elegant, understated package.',
   'daily', 700, 'AED', 'AED 700/day', 'on_demand', 5, 24, 12,
   '{"make": "Audi", "model": "A8", "year": 2024, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Business Bay', ARRAY['Business Bay', 'DIFC', 'Downtown Dubai'], false, false, 'published'),
   
  ('transport', 'cars', 'business', 'Audi A8 2025', 'audi-a8-2025-dubai', 
   'Updated A8 with predictive suspension.', 'The 2025 Audi A8 features predictive active suspension that reads the road ahead for unmatched comfort.',
   'daily', 750, 'AED', 'AED 750/day', 'on_demand', 5, 24, 12,
   '{"make": "Audi", "model": "A8", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Business Bay', ARRAY['Business Bay', 'DIFC', 'Downtown Dubai'], false, true, 'published'),

  ('transport', 'cars', 'business', 'Lexus LS500 2024', 'lexus-ls500-2024-dubai', 
   'Japanese flagship with craftsmanship focus.', 'The Lexus LS500 showcases Japanese omotenashi hospitality through exceptional craftsmanship and comfort.',
   'daily', 650, 'AED', 'AED 650/day', 'on_demand', 5, 24, 12,
   '{"make": "Lexus", "model": "LS500", "year": 2024, "seats": 5, "fuel": "Petrol", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Palm Jumeirah', ARRAY['Palm Jumeirah', 'Atlantis The Palm', 'Burj Al Arab'], true, true, 'published'),
   
  ('transport', 'cars', 'business', 'Lexus LS500 2025', 'lexus-ls500-2025-dubai', 
   'Refined LS with enhanced refinement.', 'The 2025 Lexus LS500 further refines its exceptional quietness and ride comfort.',
   'daily', 700, 'AED', 'AED 700/day', 'on_demand', 5, 24, 12,
   '{"make": "Lexus", "model": "LS500", "year": 2025, "seats": 5, "fuel": "Petrol", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Palm Jumeirah', ARRAY['Palm Jumeirah', 'Atlantis The Palm', 'Burj Al Arab'], false, true, 'published');

-- Insert Sport Cars (1800-3500 AED/day)
INSERT INTO transport_services (
  category, subcategory, sub_subcategory, name, slug, description_short, description_long,
  pricing_model, price_from, price_currency, price_display, availability_type,
  max_capacity, min_booking_hours, advance_booking_hours, specifications,
  location, area, pickup_locations, is_featured, is_trending, status
) VALUES
  ('transport', 'cars', 'sports-cars', 'Lamborghini Huracan 2023', 'lamborghini-huracan-2023-dubai', 
   'Italian supercar excellence.', 'The Lamborghini Huracan delivers raw V10 power and head-turning presence. An unforgettable driving experience.',
   'daily', 2800, 'AED', 'AED 2,800/day', 'on_demand', 2, 24, 24,
   '{"make": "Lamborghini", "model": "Huracan", "year": 2023, "seats": 2, "fuel": "Petrol", "transmission": "Automatic", "engine": "V10"}'::jsonb,
   'Dubai', 'Downtown Dubai', ARRAY['Downtown Dubai', 'Burj Khalifa', 'Dubai Mall'], false, true, 'published'),
   
  ('transport', 'cars', 'sports-cars', 'Lamborghini Huracan 2024', 'lamborghini-huracan-2024-dubai', 
   'Italian supercar excellence.', 'The Lamborghini Huracan delivers raw V10 power and head-turning presence. An unforgettable driving experience.',
   'daily', 3000, 'AED', 'AED 3,000/day', 'on_demand', 2, 24, 24,
   '{"make": "Lamborghini", "model": "Huracan", "year": 2024, "seats": 2, "fuel": "Petrol", "transmission": "Automatic", "engine": "V10"}'::jsonb,
   'Dubai', 'Downtown Dubai', ARRAY['Downtown Dubai', 'Burj Khalifa', 'Dubai Mall'], true, true, 'published'),
   
  ('transport', 'cars', 'sports-cars', 'Lamborghini Huracan 2025', 'lamborghini-huracan-2025-dubai', 
   'Latest Huracan with STO influence.', 'The 2025 Lamborghini Huracan incorporates racing technology from the track-focused STO variant.',
   'daily', 3200, 'AED', 'AED 3,200/day', 'on_demand', 2, 24, 24,
   '{"make": "Lamborghini", "model": "Huracan", "year": 2025, "seats": 2, "fuel": "Petrol", "transmission": "Automatic", "engine": "V10", "isNew": true}'::jsonb,
   'Dubai', 'Downtown Dubai', ARRAY['Downtown Dubai', 'Burj Khalifa', 'Dubai Mall'], false, true, 'published'),

  ('transport', 'cars', 'sports-cars', 'Ferrari F8 2023', 'ferrari-f8-2023-dubai', 
   'Pure Ferrari passion and performance.', 'The Ferrari F8 Tributo represents the pinnacle of Ferrari V8 engineering with breathtaking performance.',
   'daily', 3000, 'AED', 'AED 3,000/day', 'on_demand', 2, 24, 24,
   '{"make": "Ferrari", "model": "F8", "year": 2023, "seats": 2, "fuel": "Petrol", "transmission": "Automatic", "engine": "V8 Twin-Turbo"}'::jsonb,
   'Dubai', 'Palm Jumeirah', ARRAY['Palm Jumeirah', 'Atlantis The Palm', 'Burj Al Arab'], false, true, 'published'),
   
  ('transport', 'cars', 'sports-cars', 'Ferrari F8 2024', 'ferrari-f8-2024-dubai', 
   'Pure Ferrari passion and performance.', 'The Ferrari F8 Tributo represents the pinnacle of Ferrari V8 engineering with breathtaking performance.',
   'daily', 3200, 'AED', 'AED 3,200/day', 'on_demand', 2, 24, 24,
   '{"make": "Ferrari", "model": "F8", "year": 2024, "seats": 2, "fuel": "Petrol", "transmission": "Automatic", "engine": "V8 Twin-Turbo"}'::jsonb,
   'Dubai', 'Palm Jumeirah', ARRAY['Palm Jumeirah', 'Atlantis The Palm', 'Burj Al Arab'], true, true, 'published'),
   
  ('transport', 'cars', 'sports-cars', 'Ferrari F8 2025', 'ferrari-f8-2025-dubai', 
   'F8 Tributo with racing pedigree.', 'The 2025 Ferrari F8 continues the legacy of award-winning Ferrari V8 performance.',
   'daily', 3500, 'AED', 'AED 3,500/day', 'on_demand', 2, 24, 24,
   '{"make": "Ferrari", "model": "F8", "year": 2025, "seats": 2, "fuel": "Petrol", "transmission": "Automatic", "engine": "V8 Twin-Turbo", "isNew": true}'::jsonb,
   'Dubai', 'Palm Jumeirah', ARRAY['Palm Jumeirah', 'Atlantis The Palm', 'Burj Al Arab'], false, true, 'published'),

  ('transport', 'cars', 'sports-cars', 'McLaren 720S 2023', 'mclaren-720s-2023-dubai', 
   'Engineering excellence from Woking.', 'The McLaren 720S combines cutting-edge aerodynamics with a potent twin-turbo V8 for supercar performance.',
   'daily', 2800, 'AED', 'AED 2,800/day', 'on_demand', 2, 24, 24,
   '{"make": "McLaren", "model": "720S", "year": 2023, "seats": 2, "fuel": "Petrol", "transmission": "Automatic", "engine": "V8 Twin-Turbo"}'::jsonb,
   'Dubai', 'Dubai Marina', ARRAY['Dubai Marina', 'JBR', 'Bluewaters Island'], false, true, 'published'),
   
  ('transport', 'cars', 'sports-cars', 'McLaren 720S 2024', 'mclaren-720s-2024-dubai', 
   'Engineering excellence from Woking.', 'The McLaren 720S combines cutting-edge aerodynamics with a potent twin-turbo V8 for supercar performance.',
   'daily', 3000, 'AED', 'AED 3,000/day', 'on_demand', 2, 24, 24,
   '{"make": "McLaren", "model": "720S", "year": 2024, "seats": 2, "fuel": "Petrol", "transmission": "Automatic", "engine": "V8 Twin-Turbo"}'::jsonb,
   'Dubai', 'Dubai Marina', ARRAY['Dubai Marina', 'JBR', 'Bluewaters Island'], false, true, 'published'),
   
  ('transport', 'cars', 'sports-cars', 'McLaren 720S 2025', 'mclaren-720s-2025-dubai', 
   '720S with latest McLaren tech.', 'The 2025 McLaren 720S features enhanced connectivity and refined dynamics.',
   'daily', 3300, 'AED', 'AED 3,300/day', 'on_demand', 2, 24, 24,
   '{"make": "McLaren", "model": "720S", "year": 2025, "seats": 2, "fuel": "Petrol", "transmission": "Automatic", "engine": "V8 Twin-Turbo", "isNew": true}'::jsonb,
   'Dubai', 'Dubai Marina', ARRAY['Dubai Marina', 'JBR', 'Bluewaters Island'], false, true, 'published'),

  ('transport', 'cars', 'sports-cars', 'Porsche 911 Turbo 2023', 'porsche-911-turbo-2023-dubai', 
   'The everyday supercar perfected.', 'The Porsche 911 Turbo offers breathtaking performance with genuine everyday usability and comfort.',
   'daily', 1800, 'AED', 'AED 1,800/day', 'on_demand', 4, 24, 24,
   '{"make": "Porsche", "model": "911 Turbo", "year": 2023, "seats": 4, "fuel": "Petrol", "transmission": "PDK", "engine": "Flat-6 Twin-Turbo"}'::jsonb,
   'Dubai', 'JBR', ARRAY['JBR', 'Dubai Marina', 'Palm Jumeirah'], true, true, 'published'),
   
  ('transport', 'cars', 'sports-cars', 'Porsche 911 Turbo 2024', 'porsche-911-turbo-2024-dubai', 
   'The everyday supercar perfected.', 'The Porsche 911 Turbo offers breathtaking performance with genuine everyday usability and comfort.',
   'daily', 2000, 'AED', 'AED 2,000/day', 'on_demand', 4, 24, 24,
   '{"make": "Porsche", "model": "911 Turbo", "year": 2024, "seats": 4, "fuel": "Petrol", "transmission": "PDK", "engine": "Flat-6 Twin-Turbo"}'::jsonb,
   'Dubai', 'JBR', ARRAY['JBR', 'Dubai Marina', 'Palm Jumeirah'], false, true, 'published'),
   
  ('transport', 'cars', 'sports-cars', 'Porsche 911 Turbo 2025', 'porsche-911-turbo-2025-dubai', 
   '992 generation Turbo with hybrid assist.', 'The 2025 Porsche 911 Turbo adds mild-hybrid technology for even more performance.',
   'daily', 2200, 'AED', 'AED 2,200/day', 'on_demand', 4, 24, 24,
   '{"make": "Porsche", "model": "911 Turbo", "year": 2025, "seats": 4, "fuel": "Petrol", "transmission": "PDK", "engine": "Flat-6 Twin-Turbo", "isNew": true}'::jsonb,
   'Dubai', 'JBR', ARRAY['JBR', 'Dubai Marina', 'Palm Jumeirah'], false, true, 'published');

-- Insert Electric Cars (300-650 AED/day)
INSERT INTO transport_services (
  category, subcategory, sub_subcategory, name, slug, description_short, description_long,
  pricing_model, price_from, price_currency, price_display, availability_type,
  max_capacity, min_booking_hours, advance_booking_hours, specifications,
  location, area, pickup_locations, is_featured, is_trending, status
) VALUES
  ('transport', 'cars', 'electric', 'Tesla Model 3 2023', 'tesla-model-3-2023-dubai', 
   'The electric car that changed everything.', 'The Tesla Model 3 offers impressive range, cutting-edge technology, and a minimalist interior design.',
   'daily', 300, 'AED', 'AED 300/day', 'on_demand', 5, 24, 12,
   '{"make": "Tesla", "model": "Model 3", "year": 2023, "seats": 5, "fuel": "Electric", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Downtown Dubai', ARRAY['Downtown Dubai', 'Dubai Mall', 'Burj Khalifa'], true, true, 'published'),
   
  ('transport', 'cars', 'electric', 'Tesla Model 3 2024', 'tesla-model-3-2024-dubai', 
   'The electric car that changed everything.', 'The Tesla Model 3 offers impressive range, cutting-edge technology, and a minimalist interior design.',
   'daily', 350, 'AED', 'AED 350/day', 'on_demand', 5, 24, 12,
   '{"make": "Tesla", "model": "Model 3", "year": 2024, "seats": 5, "fuel": "Electric", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Downtown Dubai', ARRAY['Downtown Dubai', 'Dubai Mall', 'Burj Khalifa'], true, true, 'published'),
   
  ('transport', 'cars', 'electric', 'Tesla Model 3 2025', 'tesla-model-3-2025-dubai', 
   'Highland refresh with enhanced features.', 'The 2025 Tesla Model 3 Highland brings improved interior quality, quieter cabin, and longer range.',
   'daily', 400, 'AED', 'AED 400/day', 'on_demand', 5, 24, 12,
   '{"make": "Tesla", "model": "Model 3", "year": 2025, "seats": 5, "fuel": "Electric", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Downtown Dubai', ARRAY['Downtown Dubai', 'Dubai Mall', 'Burj Khalifa'], false, true, 'published'),

  ('transport', 'cars', 'electric', 'Tesla Model Y 2023', 'tesla-model-y-2023-dubai', 
   'Electric SUV with Tesla performance.', 'The Tesla Model Y combines the efficiency of an EV with the practicality of an SUV.',
   'daily', 350, 'AED', 'AED 350/day', 'on_demand', 5, 24, 12,
   '{"make": "Tesla", "model": "Model Y", "year": 2023, "seats": 5, "fuel": "Electric", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Dubai Marina', ARRAY['Dubai Marina', 'JBR', 'Palm Jumeirah'], false, false, 'published'),
   
  ('transport', 'cars', 'electric', 'Tesla Model Y 2024', 'tesla-model-y-2024-dubai', 
   'Electric SUV with Tesla performance.', 'The Tesla Model Y combines the efficiency of an EV with the practicality of an SUV.',
   'daily', 400, 'AED', 'AED 400/day', 'on_demand', 5, 24, 12,
   '{"make": "Tesla", "model": "Model Y", "year": 2024, "seats": 5, "fuel": "Electric", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Dubai Marina', ARRAY['Dubai Marina', 'JBR', 'Palm Jumeirah'], false, false, 'published'),
   
  ('transport', 'cars', 'electric', 'Tesla Model Y 2025', 'tesla-model-y-2025-dubai', 
   'Updated Model Y with Juniper refresh.', 'The 2025 Tesla Model Y Juniper brings refreshed styling and enhanced features.',
   'daily', 450, 'AED', 'AED 450/day', 'on_demand', 5, 24, 12,
   '{"make": "Tesla", "model": "Model Y", "year": 2025, "seats": 5, "fuel": "Electric", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Dubai Marina', ARRAY['Dubai Marina', 'JBR', 'Palm Jumeirah'], false, true, 'published'),

  ('transport', 'cars', 'electric', 'Tesla Model S 2024', 'tesla-model-s-2024-dubai', 
   'Flagship Tesla sedan with Ludicrous performance.', 'The Tesla Model S offers supercar acceleration with luxury sedan comfort and exceptional range.',
   'daily', 600, 'AED', 'AED 600/day', 'on_demand', 5, 24, 12,
   '{"make": "Tesla", "model": "Model S", "year": 2024, "seats": 5, "fuel": "Electric", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Palm Jumeirah', ARRAY['Palm Jumeirah', 'Atlantis The Palm', 'Burj Al Arab'], true, true, 'published'),
   
  ('transport', 'cars', 'electric', 'Tesla Model S 2025', 'tesla-model-s-2025-dubai', 
   'Latest Model S with refined interior.', 'The 2025 Tesla Model S brings further refinements to its already impressive package.',
   'daily', 650, 'AED', 'AED 650/day', 'on_demand', 5, 24, 12,
   '{"make": "Tesla", "model": "Model S", "year": 2025, "seats": 5, "fuel": "Electric", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'Palm Jumeirah', ARRAY['Palm Jumeirah', 'Atlantis The Palm', 'Burj Al Arab'], false, true, 'published'),

  ('transport', 'cars', 'electric', 'BMW i4 2024', 'bmw-i4-2024-dubai', 
   'BMW driving dynamics go electric.', 'The BMW i4 delivers the brand renowned driving pleasure in a zero-emission package.',
   'daily', 500, 'AED', 'AED 500/day', 'on_demand', 5, 24, 12,
   '{"make": "BMW", "model": "i4", "year": 2024, "seats": 5, "fuel": "Electric", "transmission": "Automatic"}'::jsonb,
   'Dubai', 'Business Bay', ARRAY['Business Bay', 'DIFC', 'Downtown Dubai'], true, true, 'published'),

  ('transport', 'cars', 'electric', 'Mercedes EQE 2025', 'mercedes-eqe-2025-dubai', 
   'Mercedes luxury meets electric efficiency.', 'The Mercedes EQE brings the brand luxury and technology to the electric sedan segment.',
   'daily', 600, 'AED', 'AED 600/day', 'on_demand', 5, 24, 12,
   '{"make": "Mercedes", "model": "EQE", "year": 2025, "seats": 5, "fuel": "Electric", "transmission": "Automatic", "isNew": true}'::jsonb,
   'Dubai', 'DIFC', ARRAY['DIFC', 'Downtown Dubai', 'Business Bay'], false, true, 'published');

-- Create index for faster car category queries
CREATE INDEX IF NOT EXISTS idx_transport_services_car_category 
ON transport_services(subcategory, sub_subcategory) 
WHERE subcategory = 'cars';

-- Verify the migration
SELECT sub_subcategory, COUNT(*) as count 
FROM transport_services 
WHERE subcategory = 'cars' 
GROUP BY sub_subcategory 
ORDER BY count DESC;
