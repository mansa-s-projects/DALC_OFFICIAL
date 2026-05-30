CREATE TABLE IF NOT EXISTS venue_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE venue_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on venue_categories" ON venue_categories FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS emirates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE emirates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on emirates" ON emirates FOR SELECT USING (true);
;
