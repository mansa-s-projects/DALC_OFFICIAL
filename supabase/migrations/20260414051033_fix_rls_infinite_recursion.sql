-- 1. Create security definer functions to bypass RLS recursion loops
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'concierge')
  );
$$;

-- 2. Drop the recursive profiles policy
DROP POLICY IF EXISTS "Staff can view all profiles" ON profiles;

-- 3. Recreate the policy using the security definer function
CREATE POLICY "Staff can view all profiles"
ON profiles FOR SELECT
USING (public.is_staff());

-- 4. Fix explore_locations admin policy to use the helper
DROP POLICY IF EXISTS "Admins can manage explore locations" ON explore_locations;

CREATE POLICY "Admins can manage explore locations"
ON explore_locations FOR ALL
USING (public.is_admin());;
