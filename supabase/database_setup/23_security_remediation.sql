-- ==========================================
-- 23_SECURITY_REMEDIATION.SQL
-- Comprehensive security & performance fixes
-- Idempotent — safe to run multiple times
-- ==========================================

-- ══════════════════════════════════════════
-- SECTION 1: Enable RLS on location tables
-- ══════════════════════════════════════════

ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE localities ENABLE ROW LEVEL SECURITY;

-- Public read (reference data)
DROP POLICY IF EXISTS "Anyone can read states" ON states;
CREATE POLICY "Anyone can read states" ON states FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can read cities" ON cities;
CREATE POLICY "Anyone can read cities" ON cities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can read localities" ON localities;
CREATE POLICY "Anyone can read localities" ON localities FOR SELECT USING (true);

-- Admin write (via profiles.role)
DROP POLICY IF EXISTS "Admins can manage states" ON states;
CREATE POLICY "Admins can manage states" ON states FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can manage cities" ON cities;
CREATE POLICY "Admins can manage cities" ON cities FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can manage localities" ON localities;
CREATE POLICY "Admins can manage localities" ON localities FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin'));

-- district_integrations: only if it exists
DO $do1$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'district_integrations') THEN
    EXECUTE 'ALTER TABLE district_integrations ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can read district_integrations" ON district_integrations';
    EXECUTE 'CREATE POLICY "Anyone can read district_integrations" ON district_integrations FOR SELECT USING (true)';
    EXECUTE 'DROP POLICY IF EXISTS "Admins can manage district_integrations" ON district_integrations';
    EXECUTE 'CREATE POLICY "Admins can manage district_integrations" ON district_integrations FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = ''admin''))';
  END IF;
END $do1$;


-- ══════════════════════════════════════════
-- SECTION 2: Replace user_metadata RLS policies
--            with profiles.role lookups
--            + fix auth_rls_initplan (select wrappers)
-- ══════════════════════════════════════════

-- ── PROFILES ──
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = (select auth.uid()) AND p.role = 'admin'));

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT
  USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE
  USING ((select auth.uid()) = id);

-- ── PROJECTS ──
DROP POLICY IF EXISTS "Admins can manage all projects" ON projects;
CREATE POLICY "Admins can manage all projects" ON projects FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin'));

DROP POLICY IF EXISTS "Builders can manage own projects" ON projects;
CREATE POLICY "Builders can manage own projects" ON projects FOR ALL
  USING ((select auth.uid()) = builder_id)
  WITH CHECK ((select auth.uid()) = builder_id);

-- ── PROJECT UNITS ──
DROP POLICY IF EXISTS "Admins can manage all project units" ON project_units;
CREATE POLICY "Admins can manage all project units" ON project_units FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin'));

DROP POLICY IF EXISTS "Builders can manage units for own projects" ON project_units;
CREATE POLICY "Builders can manage units for own projects" ON project_units FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND builder_id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND builder_id = (select auth.uid())));

-- ── PROPERTIES ──
DROP POLICY IF EXISTS "Owners can insert properties" ON properties;
CREATE POLICY "Owners can insert properties" ON properties FOR INSERT
  WITH CHECK (
    (select auth.uid()) = owner_id
    AND EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'owner')
  );

DROP POLICY IF EXISTS "Admins can insert any property" ON properties;
CREATE POLICY "Admins can insert any property" ON properties FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin'));

DROP POLICY IF EXISTS "Owners can update own property" ON properties;
CREATE POLICY "Owners can update own property" ON properties FOR UPDATE
  USING ((select auth.uid()) = owner_id);

DROP POLICY IF EXISTS "Admins can update any property" ON properties;
CREATE POLICY "Admins can update any property" ON properties FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin'));

DROP POLICY IF EXISTS "Owners can view own properties" ON properties;
CREATE POLICY "Owners can view own properties" ON properties FOR SELECT
  USING ((select auth.uid()) = owner_id);

DROP POLICY IF EXISTS "Admins can view all properties" ON properties;
CREATE POLICY "Admins can view all properties" ON properties FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin'));

DROP POLICY IF EXISTS "Owners can delete own property" ON properties;
CREATE POLICY "Owners can delete own property" ON properties FOR DELETE
  USING (
    (select auth.uid()) = owner_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin')
  );

-- Owners and admins insert policy from 07 (already replaced above via 16)
DROP POLICY IF EXISTS "Owners and admins can insert properties" ON properties;

-- ── PROPERTY MEDIA ──
DROP POLICY IF EXISTS "Admins can manage all property media" ON property_media;
CREATE POLICY "Admins can manage all property media" ON property_media FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin'));

DROP POLICY IF EXISTS "Owners can insert media for own property" ON property_media;
CREATE POLICY "Owners can insert media for own property" ON property_media FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM properties WHERE id = property_id AND owner_id = (select auth.uid())));

DROP POLICY IF EXISTS "Owners can view own property media" ON property_media;
CREATE POLICY "Owners can view own property media" ON property_media FOR SELECT
  USING (EXISTS (SELECT 1 FROM properties WHERE id = property_id AND owner_id = (select auth.uid())));

DROP POLICY IF EXISTS "Owners can delete own property media" ON property_media;
CREATE POLICY "Owners can delete own property media" ON property_media FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_media.property_id
      AND properties.owner_id = (select auth.uid())
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin')
  );

-- ── PROPERTY VIEWS ──
DROP POLICY IF EXISTS "Owners can see views for own properties" ON property_views;
CREATE POLICY "Owners can see views for own properties" ON property_views FOR SELECT
  USING (EXISTS (SELECT 1 FROM properties WHERE id = property_id AND owner_id = (select auth.uid())));

DROP POLICY IF EXISTS "Admins can see all property views" ON property_views;
CREATE POLICY "Admins can see all property views" ON property_views FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin'));

-- ── SAVED PROPERTIES ──
DROP POLICY IF EXISTS "Users manage own saved properties" ON saved_properties;
CREATE POLICY "Users manage own saved properties" ON saved_properties FOR ALL
  USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

-- ── SAVED SEARCHES ──
DROP POLICY IF EXISTS "Users manage own searches" ON saved_searches;
CREATE POLICY "Users manage own searches" ON saved_searches FOR ALL
  USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

-- ── LEADS ──
DROP POLICY IF EXISTS "Buyers can see own leads" ON leads;
CREATE POLICY "Buyers can see own leads" ON leads FOR SELECT
  USING ((select auth.uid()) = buyer_id);

DROP POLICY IF EXISTS "Agents can see assigned leads" ON leads;
CREATE POLICY "Agents can see assigned leads" ON leads FOR SELECT
  USING ((select auth.uid()) = agent_id);

DROP POLICY IF EXISTS "Admins can see all leads" ON leads;
CREATE POLICY "Admins can see all leads" ON leads FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin'));

DROP POLICY IF EXISTS "Agents can update assigned leads" ON leads;
CREATE POLICY "Agents can update assigned leads" ON leads FOR UPDATE
  USING ((select auth.uid()) = agent_id);

DROP POLICY IF EXISTS "Admins can update all leads" ON leads;
CREATE POLICY "Admins can update all leads" ON leads FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin'));

DROP POLICY IF EXISTS "Owners can see leads for own properties" ON leads;
CREATE POLICY "Owners can see leads for own properties" ON leads FOR SELECT
  USING (EXISTS (SELECT 1 FROM properties WHERE id = leads.property_id AND owner_id = (select auth.uid())));

-- ── FOLLOWUPS ──
DROP POLICY IF EXISTS "Agents can see own followups" ON followups;
CREATE POLICY "Agents can see own followups" ON followups FOR SELECT
  USING ((select auth.uid()) = agent_id);

DROP POLICY IF EXISTS "Agents can insert own followups" ON followups;
CREATE POLICY "Agents can insert own followups" ON followups FOR INSERT
  WITH CHECK ((select auth.uid()) = agent_id);

DROP POLICY IF EXISTS "Agents can update own followups" ON followups;
CREATE POLICY "Agents can update own followups" ON followups FOR UPDATE
  USING ((select auth.uid()) = agent_id);

DROP POLICY IF EXISTS "Agents can delete own followups" ON followups;
CREATE POLICY "Agents can delete own followups" ON followups FOR DELETE
  USING ((select auth.uid()) = agent_id);

DROP POLICY IF EXISTS "Admins can see all followups" ON followups;
CREATE POLICY "Admins can see all followups" ON followups FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin'));

-- ── ALERTS ──
DROP POLICY IF EXISTS "Users manage own alerts" ON alerts;
CREATE POLICY "Users manage own alerts" ON alerts FOR ALL
  USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

-- ── SITE VISITS ──
DROP POLICY IF EXISTS "Buyers can see own site visits" ON site_visits;
CREATE POLICY "Buyers can see own site visits" ON site_visits FOR SELECT
  USING ((select auth.uid()) = buyer_id);

DROP POLICY IF EXISTS "Agents can see site visits for own properties" ON site_visits;
CREATE POLICY "Agents can see site visits for own properties" ON site_visits FOR SELECT
  USING (EXISTS (SELECT 1 FROM properties WHERE id = property_id AND owner_id = (select auth.uid())));

DROP POLICY IF EXISTS "Admins can see all site visits" ON site_visits;
CREATE POLICY "Admins can see all site visits" ON site_visits FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin'));

DROP POLICY IF EXISTS "Buyers can requested site visits" ON site_visits;
CREATE POLICY "Buyers can requested site visits" ON site_visits FOR INSERT
  WITH CHECK ((select auth.uid()) = buyer_id);

-- ── ACTIVITY LOGS ──
DROP POLICY IF EXISTS "Users can see own activity logs" ON activity_logs;
CREATE POLICY "Users can see own activity logs" ON activity_logs FOR SELECT
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Admins can see all activity logs" ON activity_logs;
CREATE POLICY "Admins can see all activity logs" ON activity_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND role = 'admin'));

DROP POLICY IF EXISTS "Authenticated users can insert own activity logs" ON activity_logs;
CREATE POLICY "Authenticated users can insert own activity logs" ON activity_logs FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

-- ── PROPERTY REVIEWS ──
DROP POLICY IF EXISTS "Authenticated users can write reviews" ON property_reviews;
CREATE POLICY "Authenticated users can write reviews" ON property_reviews FOR INSERT
  TO authenticated WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own reviews" ON property_reviews;
CREATE POLICY "Users can update their own reviews" ON property_reviews FOR UPDATE
  TO authenticated USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own reviews" ON property_reviews;
CREATE POLICY "Users can delete their own reviews" ON property_reviews FOR DELETE
  TO authenticated USING ((select auth.uid()) = user_id);

-- ── FLOOR PLAN REQUESTS ──
-- Remove user_metadata-based policy, keep profiles-based one
DROP POLICY IF EXISTS "Admins can manage all floor plan requests" ON floor_plan_requests;

DROP POLICY IF EXISTS "Admins by profile can manage all floor plan requests" ON floor_plan_requests;
CREATE POLICY "Admins by profile can manage all floor plan requests" ON floor_plan_requests FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = (select auth.uid()) AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "Users can request floor plan access" ON floor_plan_requests;
CREATE POLICY "Users can request floor plan access" ON floor_plan_requests FOR INSERT
  WITH CHECK ((select auth.uid()) = requester_id);

DROP POLICY IF EXISTS "Users can view own requests" ON floor_plan_requests;
CREATE POLICY "Users can view own requests" ON floor_plan_requests FOR SELECT
  USING ((select auth.uid()) = requester_id);

DROP POLICY IF EXISTS "Owners can view requests for own properties" ON floor_plan_requests;
CREATE POLICY "Owners can view requests for own properties" ON floor_plan_requests FOR SELECT
  USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = floor_plan_requests.property_id AND properties.owner_id = (select auth.uid())));

DROP POLICY IF EXISTS "Owners can update requests for own properties" ON floor_plan_requests;
CREATE POLICY "Owners can update requests for own properties" ON floor_plan_requests FOR UPDATE
  USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = floor_plan_requests.property_id AND properties.owner_id = (select auth.uid())));

-- ── SEARCH CATEGORIES / SUBTYPES (if they exist) ──


-- ══════════════════════════════════════════
-- SECTION 3: Fix function_search_path_mutable
-- ══════════════════════════════════════════

CREATE OR REPLACE FUNCTION validate_property_location()
RETURNS TRIGGER AS $fn1$
DECLARE
  v_state_id UUID;
  v_city_id UUID;
  v_pincode TEXT;
BEGIN
  IF NEW.city_id IS NOT NULL THEN
    SELECT state_id INTO v_state_id FROM cities WHERE id = NEW.city_id;
    IF v_state_id != NEW.state_id THEN
      RAISE EXCEPTION 'City does not belong to the selected State';
    END IF;
  END IF;
  IF NEW.locality_id IS NOT NULL THEN
    SELECT city_id, pincode INTO v_city_id, v_pincode FROM localities WHERE id = NEW.locality_id;
    IF v_city_id != NEW.city_id THEN
      RAISE EXCEPTION 'Locality does not belong to the selected City';
    END IF;
    IF NEW.pincode IS DISTINCT FROM v_pincode THEN
      RAISE EXCEPTION 'Pincode must match the locality pincode';
    END IF;
  END IF;
  RETURN NEW;
END;
$fn1$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION check_property_update()
RETURNS TRIGGER AS $fn2$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    IF (OLD.status IS DISTINCT FROM NEW.status) OR
       (OLD.is_verified IS DISTINCT FROM NEW.is_verified) OR
       (OLD.is_featured IS DISTINCT FROM NEW.is_featured) THEN
      RAISE EXCEPTION 'Only admins can modify status, verification, or promotional flags.';
    END IF;
  END IF;
  RETURN NEW;
END;
$fn2$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DO $do2$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'prevent_circular_district_integration') THEN
    EXECUTE 'ALTER FUNCTION prevent_circular_district_integration() SET search_path = public';
  END IF;
END $do2$;


-- ══════════════════════════════════════════
-- SECTION 4: REVOKE EXECUTE from anon
-- ══════════════════════════════════════════

REVOKE EXECUTE ON FUNCTION admin_submit_property(jsonb, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION approve_property(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION reject_property(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION update_lead_status(uuid, lead_status) FROM anon;
REVOKE EXECUTE ON FUNCTION confirm_site_visit(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION cancel_site_visit(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION check_property_update() FROM anon, authenticated;


-- ══════════════════════════════════════════
-- SECTION 5: Update function bodies
--            to use profiles.role
-- ══════════════════════════════════════════

CREATE OR REPLACE FUNCTION submit_property(p_property jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn3$
DECLARE
  v_property_id uuid;
  v_owner_id uuid := auth.uid();
  v_role text;
  v_status property_status;
  v_is_verified boolean;
BEGIN
  IF v_owner_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  SELECT role::text INTO v_role FROM profiles WHERE id = v_owner_id;
  IF v_role = 'agent' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Agents are not allowed to submit property listings');
  END IF;
  IF v_role = 'admin' THEN
    v_status := 'approved';
    v_is_verified := true;
  ELSE
    v_status := 'pending';
    v_is_verified := false;
  END IF;
  INSERT INTO properties (
    owner_id, title, description, listing_type, property_type, commercial_type,
    price, area_sqft, area_value, area_unit, bedrooms, bathrooms, furnishing,
    facing, floor, total_floors, possession_status, address, locality, locality_id,
    city, city_id, state, state_id, pincode, landmark, rera_number,
    contact_number, whatsapp_number, allow_phone, allow_whatsapp, allow_chat,
    amenities, status, is_verified, is_featured
  ) VALUES (
    v_owner_id, p_property->>'title', p_property->>'description',
    (p_property->>'listing_type')::property_listing_type,
    (p_property->>'property_type')::property_type_category,
    p_property->>'commercial_type', (p_property->>'price')::numeric,
    (p_property->>'area_sqft')::numeric, (p_property->>'area_value')::numeric,
    COALESCE(p_property->>'area_unit', 'Sq ft'),
    (p_property->>'bedrooms')::int, (p_property->>'bathrooms')::int,
    (p_property->>'furnishing')::furnishing_status, p_property->>'facing',
    (p_property->>'floor')::int, (p_property->>'total_floors')::int,
    p_property->>'possession_status', p_property->>'address',
    p_property->>'locality', (p_property->>'locality_id')::uuid,
    p_property->>'city', (p_property->>'city_id')::uuid,
    p_property->>'state', (p_property->>'state_id')::uuid,
    p_property->>'pincode', p_property->>'landmark', p_property->>'rera_number',
    p_property->>'contact_number', p_property->>'whatsapp_number',
    COALESCE((p_property->>'allow_phone')::boolean, true),
    COALESCE((p_property->>'allow_whatsapp')::boolean, true),
    COALESCE((p_property->>'allow_chat')::boolean, true),
    ARRAY(SELECT jsonb_array_elements_text(p_property->'amenities')),
    v_status, v_is_verified, false
  ) RETURNING id INTO v_property_id;
  INSERT INTO activity_logs (user_id, action, entity_type, entity_id)
  VALUES (v_owner_id, 'property_submitted', 'property', v_property_id);
  RETURN jsonb_build_object('success', true, 'property_id', v_property_id);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$fn3$;

CREATE OR REPLACE FUNCTION admin_submit_property(p_property jsonb, p_target_owner_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn4$
DECLARE
  v_property_id uuid;
  v_role text;
BEGIN
  SELECT role::text INTO v_role FROM profiles WHERE id = auth.uid();
  IF v_role != 'admin' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only admins can use this feature');
  END IF;
  INSERT INTO properties (
    owner_id, created_by_admin, title, description, listing_type, property_type,
    commercial_type, price, area_sqft, area_value, area_unit, bedrooms, bathrooms,
    furnishing, facing, floor, total_floors, possession_status, address, locality,
    locality_id, city, city_id, state, state_id, pincode, rera_number,
    status, is_verified, is_featured
  ) VALUES (
    p_target_owner_id, true, p_property->>'title', p_property->>'description',
    (p_property->>'listing_type')::property_listing_type,
    (p_property->>'property_type')::property_type_category,
    p_property->>'commercial_type', (p_property->>'price')::numeric,
    (p_property->>'area_sqft')::numeric, (p_property->>'area_value')::numeric,
    COALESCE(p_property->>'area_unit', 'Sq ft'),
    (p_property->>'bedrooms')::int, (p_property->>'bathrooms')::int,
    (p_property->>'furnishing')::furnishing_status, p_property->>'facing',
    (p_property->>'floor')::int, (p_property->>'total_floors')::int,
    p_property->>'possession_status', p_property->>'address', p_property->>'locality',
    (p_property->>'locality_id')::uuid, p_property->>'city',
    (p_property->>'city_id')::uuid, p_property->>'state',
    (p_property->>'state_id')::uuid, p_property->>'pincode',
    p_property->>'rera_number', 'approved', true, false
  ) RETURNING id INTO v_property_id;
  INSERT INTO activity_logs (user_id, action, entity_type, entity_id)
  VALUES (auth.uid(), 'admin_property_created', 'property', v_property_id);
  RETURN jsonb_build_object('success', true, 'property_id', v_property_id);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$fn4$;


-- ══════════════════════════════════════════
-- SECTION 6: Storage bucket listing fix
-- ══════════════════════════════════════════

DROP POLICY IF EXISTS "Public Access to Avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to Property Media" ON storage.objects;

-- Narrowed: only authenticated users can list/download (public URLs still work)
CREATE POLICY "Public Access to Avatars" ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Public Access to Property Media" ON storage.objects FOR SELECT
  USING (bucket_id = 'property-media' AND auth.role() = 'authenticated');


-- ══════════════════════════════════════════
-- DONE — Run Supabase linter to verify
-- ══════════════════════════════════════════
