-- ==========================================
-- 25_FIX_PROFILES_RECURSION.SQL
-- Resolves "infinite recursion" RLS bugs
-- ==========================================

-- 1. Create a SECURITY DEFINER helper function to safely bypass RLS
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role::text FROM profiles WHERE id = auth.uid();
$$;

-- 2. Drop the recursive policy from the profiles table
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

-- 3. Recreate it using the safe helper function
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT
  USING (public.get_user_role() = 'admin');

-- 4. Just in case, also ensure the Service Role policy is fully secure without recursion
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
CREATE POLICY "Service role can insert profiles" ON profiles FOR INSERT 
  WITH CHECK ((SELECT auth.role()) = 'service_role');
