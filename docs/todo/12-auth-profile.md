# TODO: Auth, User Profile & Tier System

> Priority: 🟡 MEDIUM — Auth works; tier gating and profile depth are missing

---

## Current State

| Feature | Status |
|---------|--------|
| Sign In / Sign Up | ✅ Working via Supabase Auth |
| `<AuthGuard>` on protected routes | ✅ Working |
| `<AdminGuard>` on admin routes | ✅ Working |
| Profile page (`/profile`) | ✅ Exists |
| `profiles.tier` field | ✅ Stored in DB (gold / platinum / black) |
| Tier-based feature gating | ❌ Not implemented |
| Onboarding completion flow | ❌ Missing |
| Avatar upload | ❌ Missing |
| Interests / personalization setup | ❌ Missing |
| Skill-based recommendation | ❌ Missing |
| My Bookings section in profile | ⚠️ Unclear if complete |

---

## Tasks

### Task 1: Tier-Based Feature Gating

`profiles.tier` values: `'gold' | 'platinum' | 'black'`

**Features to gate**:

| Feature | Gold | Platinum | Black |
|---------|------|---------|-------|
| Standard booking | ✅ | ✅ | ✅ |
| Concierge request | ✅ | ✅ | ✅ |
| Jet charter | ❌ | ✅ | ✅ |
| Residency by Investment | ❌ | ✅ | ✅ |
| Dedicated concierge (priority queue) | ❌ | ❌ | ✅ |
| "Black Card" exclusive experiences | ❌ | ❌ | ✅ |
| Private villa bookings | ❌ | ✅ | ✅ |

**Implementation**:

```tsx
// src/hooks/useTierGate.ts
export function useTierGate(requiredTier: 'gold' | 'platinum' | 'black') {
  const { user } = useAuth();
  const tierRank = { gold: 1, platinum: 2, black: 3 };
  const userRank = tierRank[user?.tier ?? 'gold'];
  const requiredRank = tierRank[requiredTier];
  return userRank >= requiredRank;
}
```

Use in components:
```tsx
const canBookJet = useTierGate('platinum');

{canBookJet ? (
  <BookingForm />
) : (
  <TierUpgradePrompt required="platinum" />
)}
```

**`TierUpgradePrompt` component**: Shows a sleek modal/card: "This service is available to Platinum & Black card members. Upgrade your membership to access."

---

### Task 2: Onboarding Completion Flow

After a user signs up for the first time, route them through a 3-step onboarding wizard:

**Route**: `/onboarding` (guarded by `AuthGuard` and `!profiles.onboarding_completed`)

**Step 1: "What are you here for?"**
Multi-select intent:
- [ ] Relocating to Dubai
- [ ] Business setup
- [ ] Leisure & experiences
- [ ] Property investment
- [ ] Just exploring

**Step 2: "Personalize your experience"**
Select interests from tags:
- [ ] Nightlife, [ ] Fine Dining, [ ] Water Sports, [ ] Yoga & Wellness, [ ] Golf, [ ] Art & Culture, [ ] Fast Cars, [ ] Luxury Yachts, [ ] Skydiving, [ ] Desert Safaris

**Step 3: "Your membership"**
Show tier benefits comparison. User starts at `gold` by default. Option to "Upgrade to Platinum/Black" (links to pricing page).

**On complete**: Update `profiles.onboarding_completed = true`, save `profiles.intents[]` and `profiles.interests[]`.

---

### Task 3: Avatar Upload

On Profile page, add avatar upload:

```tsx
// Click on avatar circle → opens file picker
// Upload to: supabase.storage.from('avatars').upload(`${userId}.jpg`, file)
// Get public URL → update profiles.avatar_url
```

Show upload progress and crop tool (optional: use `react-image-cropper`).

---

### Task 4: Profile Page — My Bookings Section

The Profile page should have tabs for:
- Overview
- My Bookings (all verticals: transport, experiences, stays)
- My Requests (concierge)
- Saved
- Documents (for relocation users)
- Settings

**My Bookings** aggregates across:
```tsx
// Parallel queries:
const { data: transportBookings } = useMyTransportBookings(userId);
const { data: experienceBookings } = useMyExperienceBookings(userId);
const { data: stayBookings } = useMyStayBookings(userId);
```

Display in a unified timeline: most recent first.

---

### Task 5: Profile Settings

Settings tab on Profile page:
- Update full name
- Update phone number
- Update email (requires Supabase Auth `updateUser`)
- Change password
- Notification preferences (see `13-notifications.md`)
- Privacy settings (who can contact me)
- Delete account (soft delete — sets `profiles.is_deleted = true`)

---

### Task 6: Public-Facing Supplier Profile (Separate)

Suppliers have `is_supplier = true` in profiles. They need a different profile experience:
- This is documented in `docs/todo/15-supplier-portal.md`

---

### Task 7: Session Management

Show active sessions:
- "You are logged in on 2 devices"
- Sign out all sessions button (calls `supabase.auth.signOut({ scope: 'global' })`)

---

### Task 8: Social Sign-In (Optional Phase 2)

- Google OAuth via Supabase Auth
- Apple Sign-In (important for iOS users)

Configure in Supabase dashboard + add buttons to sign-in page.

---

## Critical Auth Bug Check

Run audit of all auth-related pages:
- [ ] Verify login form uses `supabase.auth.signInWithPassword()`
- [ ] Verify sign-up creates a row in `profiles` table (via trigger or explicit INSERT)
- [ ] Verify `<AuthGuard>` redirects to `/login` for unauthenticated deep links
- [ ] Verify JWT refresh is handled (Supabase handles automatically, but check for stale session errors)
- [ ] Check `onAuthStateChange` subscription cleans up on unmount

---

## Acceptance Criteria

- [ ] `useTierGate` hook implemented and used on tier-gated features
- [ ] `TierUpgradePrompt` shown when user tier is insufficient
- [ ] Onboarding 3-step wizard shown on first login
- [ ] `profiles.interests[]` and `profiles.intents[]` saved after onboarding
- [ ] Avatar upload works and updates profile immediately
- [ ] Profile page has tabs: Bookings, Requests, Saved, Documents, Settings
- [ ] Settings: name, phone, email, password updates work
- [ ] Session management shows active sessions
