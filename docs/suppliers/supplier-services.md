# Supplier Services

## Overview

Suppliers manage their own service catalogue through the Supplier Portal. Each supplier category maps to a specific service table in the database. This document covers what each service type looks like, how it's managed, and how ownership is enforced.

---

## Service Table by Supplier Category

| Supplier Category | Service Table | Booking Table |
|------------------|---------------|---------------|
| `experiences` | `experience_services` | `experience_bookings` |
| `transport` | `transport_services` | `transport_bookings` |
| `stays` | `stays_properties` | `stays_bookings` |
| `business` | `business_services` | `business_bookings` |
| `nightlife` | `venues` | `requests` (via concierge) |

---

## Service Ownership Enforcement

Every service table has a `supplier_id UUID REFERENCES suppliers(id)` column. RLS policies ensure:

```sql
-- Suppliers can only manage services under their own supplier_id
CREATE POLICY "Supplier owns services"
  ON experience_services FOR ALL
  USING (
    supplier_id IN (
      SELECT id FROM suppliers WHERE user_id = auth.uid()
    )
  );
```

Same pattern applies to `transport_services`, `stays_properties`, `business_services`.

---

## Managing Experience Services

### Service Form Fields
```
Title               [text]
Subcategory         [select: nightlife|adventure|dining|water|sky|wellness|culture]
Service Type        [select: event|recurring|on_demand|seasonal]
Description         [textarea]
Short Description   [text, 160 chars]
Images              [upload multiple]

Pricing Model       [select: per_person|per_group|fixed|tiered|free]
Base Price          [number] (if not tiered)
Currency            [select, default: AED]
Tiers               [dynamic rows] (if pricing_model = tiered)
  ├─ Tier Name      [text]
  ├─ Tier Price     [number]
  └─ Tier Capacity  [number, optional]

Time Slots          [dynamic rows]
  ├─ Day of Week    [select Mon-Sun, for recurring]
  ├─ Start Time     [time]
  ├─ End Time       [time]
  └─ Capacity       [number]

Max Capacity        [number]
Duration (hours)    [number]
Min Participants    [number]
Max Participants    [number]
Includes            [tag input]
Excludes            [tag input]
Requirements        [tag input]
Location / Address  [text]
Tags                [tag input]

Publish             [toggle] → requires admin approval on first publish
```

---

## Managing Transport Services

### Service Form Fields
```
Title               [text]
Subcategory         [select: cars|yachts|jets]
Description         [textarea]
Images              [upload multiple]

Pricing Model       [select: per_day|per_hour|per_trip]
Price               [number]
Currency            [select, default: AED]

Capacity (passengers) [number]
Min Duration (hrs)  [number]
Max Duration (days) [number]
License Required    [checkbox: UAE driving license required?]

Specifications      [dynamic JSONB fields based on subcategory]

  IF cars:
  ├─ Make           [text: e.g. Rolls-Royce]
  ├─ Model          [text: e.g. Ghost]
  ├─ Year           [number]
  ├─ Color          [text]
  ├─ Transmission   [select: automatic|manual]
  ├─ Engine         [text: e.g. 6.75L V12]
  ├─ Horsepower     [number]
  └─ Features       [tag input]

  IF yachts:
  ├─ Length (ft)    [number]
  ├─ Cabins         [number]
  ├─ Crew           [text]
  ├─ Max Guests     [number]
  └─ Amenities      [tag input]

  IF jets:
  ├─ Aircraft Type  [text: e.g. Gulfstream G650]
  ├─ Seats          [number]
  ├─ Range (km)     [number]
  └─ Amenities      [tag input]

Availability Type   [select: on_demand|scheduled|by_request]
Tags                [tag input]
```

---

## Managing Stays Properties

### Service Form Fields
```
Title               [text]
Subcategory         [select: hotels|villas|residences]
Description         [textarea]
Short Description   [text]
Images              [upload multiple]

Pricing Model       [select: per_night|long_term|custom]
Base Nightly Rate   [number]
Currency            [select, default: AED]
Seasonal Pricing    [dynamic rows]
  ├─ Period Name    [text: e.g. "Summer 2025"]
  ├─ Start Date     [date]
  ├─ End Date       [date]
  └─ Nightly Rate   [number]

Max Guests          [number]
Bedrooms            [number]
Bathrooms           [number]
Area (sqft)         [number]
Location / Address  [text]
Amenities           [tag input: pool|gym|parking|concierge|...]
Tags                [tag input]

Availability Calendar → managed in SupplierAvailability page
```

---

## Managing Business Services

### Service Form Fields
```
Title               [text]
Subcategory         [select: company-formation|licensing|banking|tax|residency-investment]
Service Type        [select: consultation|document_service|full_package]
Description         [textarea]
Short Description   [text]

Base Price          [number]
Currency            [select, default: AED]
Duration (days est) [number]
Requirements        [tag input]
Includes            [tag input]

Consultation:
  ├─ Duration (min) [select: 30|60|90|120]
  └─ Available Slots [auto from Mon-Fri 09:00-17:00 logic]

Workflow Template   [select or custom] (used to auto-create workflow on booking)

Tags                [tag input]
```

---

## Service Publication Workflow

```
Supplier creates service (is_published = false, status = draft)
  ↓
Supplier submits for review (status = review_requested)
  ↓
Admin receives notification → reviews listing
  ↓
Admin approves → is_published = true → service goes live
   OR
Admin rejects → supplier notified → supplier revises
```

**After first approval:** Supplier can toggle `is_published` directly without re-approval (for minor changes). Major changes (pricing, subcategory) require re-approval.

---

## Image Management

Images are uploaded to Supabase Storage and the CDN URLs are stored as `TEXT[]` on each service record:

```typescript
// Upload flow
const { data } = await supabase.storage
  .from('dalc-supplier-assets')
  .upload(`services/${supplierId}/${serviceId}/${file.name}`, file);

const publicUrl = supabase.storage
  .from('dalc-supplier-assets')
  .getPublicUrl(data.path).data.publicUrl;

// Append to service
await supabase.from('experience_services')
  .update({ images: [...existing, publicUrl] })
  .eq('id', serviceId);
```

---

## Scalability Notes

- **Bulk upload:** Allow suppliers to import multiple services from a CSV or spreadsheet template.
- **Service templates:** Allow suppliers to clone an existing service as a starting point for a new listing.
- **Version control:** Track service edits so admins can see what changed between versions before approving updates.
- **Dynamic form schema:** Instead of hard-coded JSONB specification fields per subcategory, use a `service_schemas` config table. This makes adding new subcategories schema-driven without code changes.
- **AI-assisted listings:** Use GPT/Claude to suggest titles, descriptions, and tags based on minimal supplier input — reduces form friction and improves listing quality.
