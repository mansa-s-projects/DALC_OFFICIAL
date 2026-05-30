CREATE TABLE IF NOT EXISTS booking_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    venue_id UUID REFERENCES venues(id),
    experience_id UUID REFERENCES experience_services(id),
    transport_id UUID REFERENCES transport_items(id),
    status TEXT DEFAULT 'submitted',
    request_type TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own booking requests" ON booking_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own booking requests" ON booking_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS concierge_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    assigned_admin UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'submitted',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE concierge_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own concierge requests" ON concierge_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own concierge requests" ON concierge_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    venue_id UUID REFERENCES venues(id),
    experience_id UUID REFERENCES experience_services(id),
    transport_id UUID REFERENCES transport_items(id),
    booking_request_id UUID REFERENCES booking_requests(id),
    status TEXT DEFAULT 'pending',
    total_price_aed NUMERIC,
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    booking_id UUID REFERENCES bookings(id),
    amount_aed NUMERIC,
    currency TEXT DEFAULT 'AED',
    gateway TEXT,
    gateway_reference TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);;
