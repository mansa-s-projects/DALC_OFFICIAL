CREATE TABLE IF NOT EXISTS venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category_id UUID REFERENCES venue_categories(id),
    emirate_id UUID REFERENCES emirates(id),
    location TEXT,
    lat NUMERIC,
    lng NUMERIC,
    price_tier INTEGER CHECK (price_tier >= 1 AND price_tier <= 4),
    vibe TEXT,
    tags TEXT[] DEFAULT '{}',
    hero_image_url TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    description_short TEXT,
    description_long TEXT,
    seo_description TEXT,
    highlights TEXT[] DEFAULT '{}',
    dress_code TEXT,
    booking_policy TEXT,
    best_time TEXT,
    who_its_for TEXT,
    opening_hours TEXT,
    is_trending BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    recommend_score NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on venues" ON venues FOR SELECT USING (status = 'published');

CREATE TABLE IF NOT EXISTS experience_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subcategory TEXT NOT NULL,
    duration TEXT,
    min_age INTEGER,
    is_popular BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    hero_image_url TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    description_short TEXT,
    description_long TEXT,
    highlights TEXT[] DEFAULT '{}',
    inclusions TEXT[] DEFAULT '{}',
    exclusions TEXT[] DEFAULT '{}',
    meeting_point TEXT,
    lat NUMERIC,
    lng NUMERIC,
    cancellation_policy TEXT,
    pricing_tiers JSONB,
    time_slots JSONB,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    emirate_id UUID REFERENCES emirates(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE experience_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on experience_services" ON experience_services FOR SELECT USING (status = 'published');

CREATE TABLE IF NOT EXISTS transport_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('car', 'yacht', 'jet', 'chauffeur')),
    category TEXT,
    brand TEXT,
    model TEXT,
    year INTEGER,
    daily_price_aed NUMERIC,
    fuel_type TEXT,
    seats INTEGER,
    image_url TEXT,
    is_popular BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE transport_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on transport_items" ON transport_items FOR SELECT USING (status = 'published');;
