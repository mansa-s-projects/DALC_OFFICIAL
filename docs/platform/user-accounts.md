# User Accounts

## Overview

User accounts are managed through Supabase Auth combined with the `profiles` table. Every authenticated user has a profile record that stores their DALC-specific data: role, tier, skills, and relocation stage.

---

## `profiles` Table

```sql
CREATE TABLE public.profiles (
  id               UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name        TEXT,
  avatar_url       TEXT,
  phone            TEXT,
  nationality      TEXT,
  date_of_birth    DATE,
  skills           TEXT[],         -- UserSkill[] declared interests
  relocation_stage TEXT,           -- UserStage enum
  tier             TEXT DEFAULT 'standard',  -- standard|gold|platinum|black
  role             TEXT DEFAULT 'user',       -- user|concierge|admin|supplier
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
```

Auto-created via trigger when user registers:
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
```

---

## User Roles

| Role | Description | Access |
|------|-------------|--------|
| `user` | Standard DALC user | All public pages + booking + requests |
| `concierge` | DALC staff member | Request management + venue view in admin |
| `admin` | DALC admin | Full admin dashboard |
| `supplier` | Service provider | Supplier portal (when built) |

Role is set on `profiles.role`. RLS policies check this to enforce access control.

---

## User Tiers

Tiers represent the user's membership level. Higher tiers unlock premium features and priority access.

| Tier | Description | Benefits |
|------|-------------|---------|
| `standard` | Default | Basic access to all verticals |
| `gold` | Mid-tier | Priority request handling, early access to new listings |
| `platinum` | High-tier | Dedicated concierge, exclusive event invitations |
| `black` | Ultra-luxury | Private manager, 24/7 on-call concierge, bespoke experiences |

**Current:** Tiers are stored but not enforced in product flows. Future: gate features by tier level.

Tier is manually assigned by admin in `profiles.tier`.

---

## UserSkill Enum

10 interest categories declared during onboarding:

```typescript
type UserSkill =
  | 'NIGHTLIFE' | 'ADVENTURE' | 'FOODIE'
  | 'WELLNESS'  | 'CULTURE'   | 'WATER_SPORTS'
  | 'MOTORSPORT'| 'AVIATION'  | 'YACHT' | 'BUSINESS';
```

Stored in `profiles.skills TEXT[]`. Used by the recommendation system to personalize content.

---

## UserStage Enum (Relocation)

Tracks where the user is in their Dubai relocation journey:

```typescript
type UserStage =
  | 'exploring'       // browsing and learning
  | 'planning'        // actively planning a move
  | 'in_progress'     // within a relocation workflow
  | 'arrived'         // recently arrived in Dubai
  | 'established';    // settled and living in Dubai
```

This feeds into onboarding flow branching and relocation content surfacing. If `stage = 'in_progress'`, the Move to Dubai pillar is featured prominently in the nav and home feed.

---

## Auth Flow

### Registration
```
User visits /register
  ↓
Fills: full_name, email, password
  ↓
supabase.auth.signUp({ email, password, options: { data: { full_name } } })
  ↓
Supabase creates auth.users record
  ↓
handle_new_user() trigger auto-creates profiles record
  ↓
User redirected to /onboarding
```

### Login
```
User visits /login
  ↓
supabase.auth.signInWithPassword({ email, password })
  ↓
Returns session (JWT)
  ↓
App.tsx auth listener: onAuthStateChange fires
  ↓
Fetches profiles record by auth.uid()
  ↓
Sets useAppStore({ session, profile })
  ↓
User redirected to / (home)
```

### Logout
```
supabase.auth.signOut()
  ↓
onAuthStateChange fires with null session
  ↓
useAppStore cleared: { session: null, profile: null }
  ↓
AuthGuard redirects to /login
```

---

## Onboarding Flow

`src/pages/Onboarding.tsx` — shown after first registration.

### Steps
1. **Welcome** — brief DALC pitch
2. **Skills selection** — select 1–10 interests from skill cards
3. **Relocation stage** — "Are you planning to move to Dubai?" → sets `relocation_stage`
4. **Done** — redirect to home

On completion:
```typescript
await supabase.from('profiles').update({
  skills: selectedSkills,
  relocation_stage: selectedStage
}).eq('id', user.id);
```

---

## Auth State in App

`src/store/useAppStore.ts` — global Zustand store:

```typescript
interface AppStore {
  session: Session | null;
  profile: Profile | null;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
}
```

`src/App.tsx` initializes auth:
```typescript
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    if (session) fetchProfile(session.user.id);
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
    setSession(session);
    if (session) fetchProfile(session.user.id);
    else setProfile(null);
  });

  return () => subscription.unsubscribe();
}, []);
```

---

## Profile Hook

`src/hooks/useUser.ts`

```typescript
// Reads from store (no extra fetch if already loaded)
const { profile, isLoading } = useUser();

// Update profile
const { mutate: updateProfile } = useUpdateProfile();
updateProfile({ full_name: 'New Name', skills: ['NIGHTLIFE', 'FOODIE'] });
```

---

## Profile Settings Page (Future)

Route: `/settings/profile`

Fields editable by user:
- `full_name`
- `phone`
- `nationality`
- `date_of_birth`
- `skills` (re-select interests)
- `relocation_stage`
- Avatar upload (Supabase Storage: `dalc-public/avatars/{user_id}`)

Password change: via `supabase.auth.updateUser({ password: newPassword })`.

---

## Scalability Notes

- **Social login:** Add Google / Apple OAuth via `supabase.auth.signInWithOAuth({ provider: 'google' })`. Profiles auto-created on first social login.
- **Phone auth:** Add UAE phone number (OTP) auth as an alternative login method.
- **Tier upgrade flow:** Admin sets tier. Future: self-service upgrade via Stripe subscription (`platinum` / `black` tiers become paid memberships).
- **Two-factor authentication:** Supabase supports TOTP 2FA — enable for admin and concierge roles as a security requirement.
- **GDPR / Data export:** Build a `/settings/data` page allowing users to download their data and request account deletion.
