# Feature: Travel

## Purpose

The Travel feature covers luxury accommodation across Dubai, presented in DALC under the `/travel` route. It spans iconic hotels, private Palm Jumeirah villas, and branded long-stay residences. The underlying feature slice remains `src/features/stays/`, but the product-facing experience is Travel.

---

## Architecture

### Pages
| Page | Route | Component |
|------|-------|-----------|
| Hub | `/travel` | `src/pages/travel/TravelHub.tsx` |
| Flights | `/travel/flights` | `src/pages/travel/Flights.tsx` |
| Hotels | `/travel/hotels` | `src/pages/travel/Hotels.tsx` |
| Villas | `/travel/villas` | `src/pages/travel/Villas.tsx` |
| Residences | `/travel/residences` | `src/pages/travel/Residences.tsx` |
| Detail | `/travel/:subcategory/:slug` | `src/features/stays/pages/PropertyDetail.tsx` |

### Hooks
| Hook | Purpose |
|------|---------|
| `useStays` (`src/features/stays/hooks/useStays.ts`) | Fetch and filter property listings |
| `useStaysBooking` (`src/features/stays/hooks/useStaysBooking.ts`) | Create + manage travel bookings |

### Service Library
`src/lib/stays.ts` — Contains `MOCK_PROPERTIES`, `getProperties()`, `getFeaturedProperties()`, `getAvailability()`, `checkAvailability()`, `calculatePrice()`, `createStaysBooking()`, `getUserBookings()`.

### Types
`src/features/stays/types.ts` — TypeScript definitions for all travel/stays entities. Re-exported via shim at `src/types/stays.ts`.

---

## Subcategories (3)

| Subcategory | DB Value | Examples |
|-------------|----------|---------|
| Hotels | `hotels` | Burj Al Arab, Armani Hotel, Atlantis The Royal |
| Villas | `villas` | Palm Jumeirah private villas, Emirates Hills estates |
| Residences | `residences` | Downtown branded apartments, Marina long-stay |

---

## User Flows

### Flow 1: Travel Discovery -> Booking

```
User lands on /travel (hub)
  -> Category cards: Flights / Hotels / Villas / Residences
  -> Featured properties grid from getFeaturedProperties()

User clicks "Hotels"
  -> /travel/hotels
  -> Filters: price range, bedrooms, bathrooms, max_guests, amenities
  -> Results displayed as property cards

User clicks hotel card
  -> /travel/hotels/:slug -> PropertyDetail
  -> Full property view: images, description, amenities, pricing
  -> Calendar: check availability for date range
  -> Price calculator: calculatePrice(checkIn, checkOut)
  -> "Book Now" CTA -> createStaysBooking(input)
```

### Flow 2: Availability Check

```
User selects check-in / check-out dates on PropertyDetail
  -> checkAvailability(propertyId, checkIn, checkOut) called
  -> Queries stays_availability for each date in range
  -> Returns: { available: boolean, unavailableDates: string[] }
  -> If available: shows price breakdown
  -> If unavailable: shows blocked dates on calendar
```

### Flow 3: Price Calculation

```
calculatePrice(propertyId, checkIn, checkOut, pricingModel):
  -> Computes number of nights
  -> Applies seasonal multiplier from seasonal_pricing JSONB
  -> Adds service fee percentage
  -> Adds security deposit (if required)
```

---

## Pricing Models

| Model | Description |
|-------|-------------|
| `nightly` | Standard per-night pricing |
| `monthly` | Long-stay monthly rate |
| `yearly` | Annual rental rate |
| `flexible` | Custom quote for extended stays |

---

## Database Schema

### `stays_properties`
```sql
id, supplier_id, subcategory, title, slug, description, short_description,
images (text[]), bedrooms, bathrooms, max_guests, amenities (text[]),
base_nightly_rate, monthly_rate, yearly_rate, pricing_model, currency,
seasonal_pricing (JSONB), min_stay_nights, max_stay_nights,
deposit_required, deposit_amount, deposit_percentage, service_fee_percentage,
location, address, district, coordinates (JSONB), is_published, is_featured,
rating, review_count, created_at, updated_at
```

### `stays_bookings`
```sql
id, property_id, user_id, relocation_profile_id, booking_reference,
check_in_date, check_out_date, nights, guests, nightly_rate,
total_nights_cost, service_fee, security_deposit, total_amount,
currency, status, booking_type, payment_status, payment_method,
special_requests, notes, created_at, updated_at
```

---

## Naming Note

- Product/route name: **Travel** (`/travel`)
- Underlying feature slice: **Stays** (`src/features/stays/`)
- Legacy `/stays/*` routes currently redirect to `/travel/*`