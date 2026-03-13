# Admin: Venues

## Overview

The Admin Venues section is the primary interface for managing the DALC venue catalogue. All venue creation, editing, publishing, and editorial curation happens here.

---

## Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/admin/venues` | `AdminVenues.tsx` | Venue catalogue list |
| `/admin/venues/new` | `AdminVenueForm.tsx` | Create new venue |
| `/admin/venues/:id` | `AdminVenueForm.tsx` | Edit existing venue |

---

## Venue List (`AdminVenues.tsx`)

### Columns
| Column | DB Field | Notes |
|--------|----------|-------|
| Name | `name` | Clickable → edit form |
| Category | `category` | Colored badge |
| Subcategory | `subcategory` | |
| Price Tier | `price_tier` | $ / $$ / $$$ / $$$$ |
| Published | `is_published` | Toggle switch (inline) |
| Featured | `is_featured` | Toggle switch (inline) |
| Created | `created_at` | Relative date |
| Actions | — | Edit \| Delete |

### Filters
- Category dropdown
- Published/Unpublished/All toggle
- Featured/All toggle
- Search by name

### Pagination
React Query infinite scroll or traditional pagination (20 per page).

---

## Venue Form (`AdminVenueForm.tsx`)

### Form Sections

#### Basic Info
```
Name          [text input]
Category      [dropdown: nightlife|dining|experiences|stays|transport|business|wellness]
Subcategory   [text input]
Price Tier    [select: $ | $$ | $$$ | $$$$]
Min Spend     [number input] (AED)
Supplier      [select linked supplier from suppliers table]
```

#### Content
```
Short Description   [text, 160 chars max]
Full Description    [textarea / rich text editor]
Tags                [chip input: add tag → press Enter]
```

#### Images
```
Images              [URL array input — add/remove/reorder]
                    [Preview row of thumbnails]
```

#### Location
```
Address             [text input]
City                [text, default: Dubai]
Coordinates Lat     [number input]
Coordinates Lng     [number input]
                    [Preview on mini-map when both filled]
```

#### Hours
```
Open Days           [multi-checkbox: Mon Tue Wed Thu Fri Sat Sun]
Opening Time        [time input]
Closing Time        [time input]
```

#### Contact
```
Website             [URL input]
Phone               [phone input]
```

#### Catalogue Settings
```
Is Published        [toggle]
Is Featured         [toggle]
```

---

## Venue Publish / Unpublish Workflow

Venues are not publicly visible until `is_published = true`.

**Standard workflow:**
1. Admin creates draft venue (`is_published = false`)
2. Internal review of content and images
3. Admin toggles `is_published = true` → venue appears on Explore and Venue pages

**Inline toggle shortcut:**
- Published toggle on venue list row
- Fires a PATCH: `{ is_published: !current_value }`
- Optimistic UI update, reverts on error

```typescript
// In useVenue or useVenues hook
async function togglePublishVenue(id: string, current: boolean) {
  await supabase
    .from('venues')
    .update({ is_published: !current })
    .eq('id', id)
    .throwOnError();
}
```

---

## Featured Venues

Venues with `is_featured = true` appear:
- On the Home page hero / featured strip
- In the top positions on the Explore page
- As priority pins on the map view

**Recommended:** Max 5–8 featured venues at a time. Too many featured = nothing feels special.

---

## Image Management

Images are stored as `TEXT[]` (URL array) in the `venues` table.

**Current approach:** Admin manually enters CDN / public image URLs.

**Target approach:**
1. Admin uploads image files in the form
2. Files uploaded to Supabase Storage: `dalc-public/venues/{venue-id}/{filename}`
3. Public CDN URL stored in `venues.images[]`

Bucket: `dalc-public` (public read, admin write only)

```typescript
// Upload image to Supabase Storage
const { data, error } = await supabase.storage
  .from('dalc-public')
  .upload(`venues/${venueId}/${file.name}`, file, {
    cacheControl: '3600',
    upsert: false
  });
const imageUrl = supabase.storage.from('dalc-public').getPublicUrl(data.path).data.publicUrl;
```

---

## Tags System

Tags allow flexible content categorization without adding new DB columns.

### Main tag groups used for venues:

**Vibe tags:** `vip` `rooftop` `beachclub` `terrace` `views` `underground`

**Feature tags:** `bottle-service` `dress-code` `live-music` `dj` `celebrity`

**Cuisine/Type tags:** `japanese` `mediterranean` `italian` `steakhouse` `brunch`

**Audience tags:** `date-night` `group-friendly` `corporate` `family`

**Time tags:** `late-night` `sunday-brunch` `happy-hour` `afterwork`

### Autocomplete input
Tags input in the form should autocomplete from existing tags in the DB:
```typescript
// Fetch distinct tags across all venues
const { data } = await supabase.rpc('get_all_venue_tags');
// Returns: string[]
```

---

## Slug Generation

Slugs are auto-generated from the venue name on creation:

```typescript
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')  // remove special chars
    .replace(/\s+/g, '-')      // spaces to hyphens
    .replace(/-+/g, '-')       // collapse hyphens
    .trim();
}
// "NYX DIFC" → "nyx-difc"
// "Ling Ling at Atlantis Royal" → "ling-ling-at-atlantis-royal"
```

Admin can override the slug. Slugs must be unique (enforced by DB UNIQUE constraint).

---

## Data Validation Rules

| Field | Validation |
|-------|-----------|
| `name` | Required, 2–120 chars |
| `slug` | Required, URL-safe, unique |
| `category` | Required, valid enum value |
| `coordinates.lat` | -90 to 90 |
| `coordinates.lng` | -180 to 180 |
| `images[0]` | At least 1 image URL required to publish |
| `open_days` | 1–7 days required |

---

## Scalability Notes

- **Venue versions/history:** Track edit history in a `venue_versions` table. Allow rollback to a previous version from the admin.
- **Bulk import:** CSV or spreadsheet import for creating many venues at once (useful for multi-city launch).
- **Supplier linking:** When a supplier is approved and activated, auto-suggest creating their venue listing.
- **SEO metadata:** Add `meta_title`, `meta_description`, `og_image` fields to venues for search engine optimization.
