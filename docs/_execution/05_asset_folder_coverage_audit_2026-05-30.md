# Asset Folder Coverage Audit — 2026-05-30

## Scope

Audit of service and venue coverage against folders under `public/images`.

Primary comparison sources:
- `src/data/venues/venuesData.ts`
- `src/features/nightlife/pages/Restaurants.tsx`
- `src/features/nightlife/pages/NightClubs.tsx`
- `src/features/experiences/waterData.ts`
- `src/features/experiences/catalog.ts`
- `src/lib/experiences.ts`

## Summary

Fully covered by dedicated folders:
- Restaurants
- Nightclubs
- Dining & Entertainment

Missing dedicated venue folders:
- Beach Clubs: 2

Not folderized per service today, but services exist in code:
- Water Activities: 5
- Aristo Desert: 5
- Signature Dining: 4

Not a service-folder category:
- Desserts

## Missing Dedicated Folders

| Category | Service | Current State | Recommended Folder |
| --- | --- | --- | --- |
| Beach Clubs | O Beach | Present in venue data, missing in `public/images/beach_clubs` | `public/images/beach_clubs/O_Beach` |
| Beach Clubs | Zetta Pool | Present in venue data, missing in `public/images/beach_clubs` | `public/images/beach_clubs/Zetta_Pool` |
| Water Activities | Yamaha VX Deluxe 1050cc | Only flat image files exist in `public/images/water-activities` | `public/images/water-activities/yamaha-vx-deluxe` |
| Water Activities | Yamaha JetBlaster | Only flat image files exist in `public/images/water-activities` | `public/images/water-activities/yamaha-jetblaster` |
| Water Activities | Yamaha GP HO 1900cc | Only flat image files exist in `public/images/water-activities` | `public/images/water-activities/yamaha-gp-ho-1900cc` |
| Water Activities | Yamaha FX SVHO 260HP | Only flat image files exist in `public/images/water-activities` | `public/images/water-activities/yamaha-fx-svho-260hp` |
| Water Activities | Jetcar | No dedicated local folder or file set | `public/images/water-activities/jetcar` |
| Aristo Desert | Aristo Desert — Pool Day Pass | Only shared flat images exist in `public/images/Aristodesert` | `public/images/Aristodesert/pool-day-pass` |
| Aristo Desert | Aristo Desert — Private Villa (5 Hours) | Only shared flat images exist in `public/images/Aristodesert` | `public/images/Aristodesert/private-villa-5-hours` |
| Aristo Desert | Aristo Desert — Overnight Stay | Only shared flat images exist in `public/images/Aristodesert` | `public/images/Aristodesert/overnight-stay` |
| Aristo Desert | Aristo Desert — Football Activity | Only shared flat images exist in `public/images/Aristodesert` | `public/images/Aristodesert/football-activity` |
| Aristo Desert | Aristo Desert — Desert Pause Experience | Only shared flat images exist in `public/images/Aristodesert` | `public/images/Aristodesert/desert-pause-experience` |
| Signature Dining | Gourmet Dinner on Embers | Only flat image files exist in `public/images/Signature Dining` | `public/images/Signature Dining/gourmet-dinner-on-embers` |
| Signature Dining | Private Desert Dinner Experience | Only flat image files exist in `public/images/Signature Dining` | `public/images/Signature Dining/private-desert-dinner-experience` |
| Signature Dining | Dinner in the Sky – Dubai | Only flat image files exist in `public/images/Signature Dining` | `public/images/Signature Dining/dinner-in-the-sky-dubai` |
| Signature Dining | Dhow Cruise Dinner – Dubai Marina | Only flat image files exist in `public/images/Signature Dining` | `public/images/Signature Dining/dhow-cruise-dinner-dubai-marina` |

## Code References

### Beach Clubs

Source inventory:
- `src/data/venues/venuesData.ts`

Current folder branch:
- `public/images/beach_clubs`

Missing from folder branch while present in data:
- `O Beach`
- `Zetta Pool`

### Water Activities

Source inventory:
- `src/features/experiences/waterData.ts`

Current folder branch:
- `public/images/water-activities`

Current local files:
- `yamaha-fx-svho.jpg`
- `yamaha-gp-ho.jpg`
- `yamaha-jetblaster.jpg`
- `yamaha-vx-deluxe.jpg`

Gap:
- The branch is not organized into one folder per service.
- `Jetcar` has no matching dedicated local asset folder.

### Aristo Desert

Source inventory:
- `src/lib/experiences.ts`

Current folder branch:
- `public/images/Aristodesert`

Current local files:
- `image1.png`
- `image2.png`
- `image3.png`

Gap:
- All Aristo Desert services currently reuse shared images instead of dedicated service folders.

Classification note:
- Aristo Desert should be treated as a desert activity branch, not a dessert branch.
- If a future top-level branch is introduced for desert activities, move `public/images/Aristodesert` under that branch during the same change set that updates all code references.
- Recommended future destination: `public/images/desert-adventures/Aristodesert`
- Do not move the folder in isolation while paths still reference `/images/Aristodesert/...`.

### Signature Dining

Source inventory:
- `src/features/experiences/catalog.ts`

Current folder branch:
- `public/images/Signature Dining`

Current local files:
- `Dhow Cruise Dinner.png`
- `Dinner in the Sky – Dubai.png`
- `Gourmet Dinner on Embers.png`
- `Private Desert Dinner Experience.png`

Gap:
- Assets exist, but not in per-service folders.

## Notes

### Desserts

`Desserts` appears as menu-section content, not as a standalone service category or image-folder branch.

Relevant files:
- `src/features/nightlife/pages/Restaurants.tsx`
- `src/features/nightlife/pages/BeachClubs.tsx`
- `src/features/stays/pages/VillasList.tsx`

No `public/images/desserts` branch is currently implied by the codebase.

## Safe Next Steps

1. Create the missing folders listed above.
2. Move or duplicate existing shared images into those service folders where needed.
3. Update image references in:
   - `src/features/experiences/waterData.ts`
   - `src/features/experiences/catalog.ts`
   - `src/lib/experiences.ts`
   - `src/data/venues/venueImages.ts`
4. Run a broken-asset sweep after the path migration.

## Aristo Desert Migration Rule

If `desert-adventures` is added as a new image branch, migrate Aristo Desert only as an atomic refactor:

1. Create `public/images/desert-adventures/Aristodesert`
2. Move or copy the current Aristo Desert assets into that location
3. Replace all `/images/Aristodesert/...` references across the codebase
4. Validate pages that currently consume those assets before removing the old branch
