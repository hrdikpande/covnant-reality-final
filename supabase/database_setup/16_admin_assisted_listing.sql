-- ==========================================
-- 16_ADMIN_ASSISTED_LISTING.SQL
-- Schema, RPC, and RLS updates for Admin Assisted Listing
-- ==========================================

-- 1. Add missing ownership fields to `properties` table safely
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS builder_id UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS created_by_admin BOOLEAN DEFAULT FALSE;

-- 2. Create new RPC for Admin Property Submission
CREATE OR REPLACE FUNCTION admin_submit_property(p_property jsonb, p_target_owner_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_property_id uuid;
  v_role text := auth.jwt() -> 'user_metadata' ->> 'role';
BEGIN
  -- Strict Admin check
  IF v_role != 'admin' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only admins can use this feature');
  END IF;

  -- Insert property exactly as normal users do, but with injected owner_id and created_by_admin
  INSERT INTO properties (
    owner_id, 
    created_by_admin,
    title, description, listing_type, property_type, commercial_type, price,
    area_sqft, area_value, area_unit, bedrooms, bathrooms, furnishing, facing, floor,
    total_floors, possession_status, address, locality, locality_id, city,
    city_id, state, state_id, pincode, rera_number, status, is_verified, is_featured
  )
  VALUES (
    p_target_owner_id,
    true,
    p_property->>'title', p_property->>'description', (p_property->>'listing_type')::property_listing_type,
    (p_property->>'property_type')::property_type_category, p_property->>'commercial_type',
    (p_property->>'price')::numeric, (p_property->>'area_sqft')::numeric, (p_property->>'area_value')::numeric, COALESCE(p_property->>'area_unit', 'Sq ft'),
    (p_property->>'bedrooms')::int, (p_property->>'bathrooms')::int, (p_property->>'furnishing')::furnishing_status,
    p_property->>'facing', (p_property->>'floor')::int, (p_property->>'total_floors')::int,
    p_property->>'possession_status', p_property->>'address', p_property->>'locality',
    (p_property->>'locality_id')::uuid, p_property->>'city', (p_property->>'city_id')::uuid,
    p_property->>'state', (p_property->>'state_id')::uuid, p_property->>'pincode',
    p_property->>'rera_number', 'approved', true, false -- Auto-approve Admin created listings
  )
  RETURNING id INTO v_property_id;

  -- Log administrative creation
  INSERT INTO activity_logs (user_id, action, entity_type, entity_id)
  VALUES (auth.uid(), 'admin_property_created', 'property', v_property_id);

  RETURN jsonb_build_object('success', true, 'property_id', v_property_id);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- 3. Modify RLS Policies to allow Admins to insert any property
DROP POLICY IF EXISTS "Owners and admins can insert properties" ON properties;
DROP POLICY IF EXISTS "Owners can insert properties" ON properties;
DROP POLICY IF EXISTS "Admins can insert any property" ON properties;

CREATE POLICY "Owners can insert properties" ON properties 
FOR INSERT WITH CHECK (
  auth.uid() = owner_id AND (auth.jwt() -> 'user_metadata' ->> 'role' = 'owner')
);

CREATE POLICY "Admins can insert any property" ON properties 
FOR INSERT WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
);
