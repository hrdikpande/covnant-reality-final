-- ==========================================
-- 05_FUNCTIONS.SQL
-- RPC Functions and Business Logic
-- ==========================================

-- 1. submit_property(p_property jsonb)
CREATE OR REPLACE FUNCTION submit_property(p_property jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_property_id uuid;
  v_owner_id uuid := auth.uid();
  v_role text := auth.jwt() -> 'user_metadata' ->> 'role';
BEGIN
  -- Basic authentication check
  IF v_owner_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Block agent role
  IF v_role = 'agent' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Agents are not allowed to submit property listings');
  END IF;

  -- Insert property with forced values for security
  INSERT INTO properties (
    owner_id,
    title,
    description,
    listing_type,
    property_type,
    commercial_type,
    price,
    area_sqft,
    area_value,
    area_unit,
    bedrooms,
    bathrooms,
    furnishing,
    facing,
    floor,
    total_floors,
    possession_status,
    address,
    locality,
    locality_id,
    city,
    city_id,
    state,
    state_id,
    pincode,
    rera_number,
    status,
    is_verified,
    is_featured
  )
  VALUES (
    v_owner_id,
    p_property->>'title',
    p_property->>'description',
    (p_property->>'listing_type')::property_listing_type,
    (p_property->>'property_type')::property_type_category,
    p_property->>'commercial_type',
    (p_property->>'price')::numeric,
    (p_property->>'area_sqft')::numeric,
    (p_property->>'area_value')::numeric,
    COALESCE(p_property->>'area_unit', 'Sq ft'),
    (p_property->>'bedrooms')::int,
    (p_property->>'bathrooms')::int,
    (p_property->>'furnishing')::furnishing_status,
    p_property->>'facing',
    (p_property->>'floor')::int,
    (p_property->>'total_floors')::int,
    p_property->>'possession_status',
    p_property->>'address',
    p_property->>'locality',
    (p_property->>'locality_id')::uuid,
    p_property->>'city',
    (p_property->>'city_id')::uuid,
    p_property->>'state',
    (p_property->>'state_id')::uuid,
    p_property->>'pincode',
    p_property->>'rera_number',
    'pending', -- Force pending
    false,    -- Force unverified
    false     -- Force unfeatured
  )
  RETURNING id INTO v_property_id;

  -- Log activity
  INSERT INTO activity_logs (user_id, action, entity_type, entity_id)
  VALUES (v_owner_id, 'property_submitted', 'property', v_property_id);

  RETURN jsonb_build_object('success', true, 'property_id', v_property_id);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;


-- 2. search_properties(...)
CREATE OR REPLACE FUNCTION search_properties(
  p_city text DEFAULT NULL,
  p_city_id uuid DEFAULT NULL,
  p_state_id uuid DEFAULT NULL,
  p_locality_id uuid DEFAULT NULL,
  p_min_price numeric DEFAULT NULL,
  p_max_price numeric DEFAULT NULL,
  p_bedrooms int DEFAULT NULL,
  p_listing_type text DEFAULT NULL,
  p_is_verified boolean DEFAULT NULL,
  p_property_type text DEFAULT NULL,
  p_min_area numeric DEFAULT NULL,
  p_max_area numeric DEFAULT NULL,
  p_furnishing text DEFAULT NULL,
  p_query text DEFAULT NULL,
  p_agent_id uuid DEFAULT NULL,
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  owner_id uuid,
  title text,
  description text,
  listing_type property_listing_type,
  property_type property_type_category,
  commercial_type text,
  price numeric,
  area_sqft numeric,
  area_value numeric,
  area_unit text,
  bedrooms int,
  bathrooms int,
  furnishing furnishing_status,
  address text,
  city text,
  status property_status,
  is_verified boolean,
  is_featured boolean,
  created_at timestamptz,
  total_count bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Hard cap limit to 50
  IF p_limit IS NULL OR p_limit > 50 THEN
    p_limit := 50;
  END IF;

  RETURN QUERY
  SELECT 
    p.id, p.owner_id, p.title, p.description, p.listing_type, 
    p.property_type, p.commercial_type, p.price, p.area_sqft, p.area_value, p.area_unit, p.bedrooms, p.bathrooms, 
    p.furnishing, p.address, p.city, p.status, p.is_verified,
    p.is_featured,
    p.created_at,
    COUNT(*) OVER() as total_count
  FROM properties p
  WHERE p.status = 'approved'
    AND (p_city IS NULL OR p.city ILIKE '%' || p_city || '%')
    AND (p_city_id IS NULL OR p.city_id = p_city_id)
    AND (p_state_id IS NULL OR p.state_id = p_state_id)
    AND (p_locality_id IS NULL OR p.locality_id = p_locality_id)
    AND (p_min_price IS NULL OR p.price >= p_min_price)
    AND (p_max_price IS NULL OR p.price <= p_max_price)
    AND (p_bedrooms IS NULL OR p.bedrooms = p_bedrooms)
    AND (p_listing_type IS NULL OR p.listing_type::text = p_listing_type)
    AND (p_is_verified IS NULL OR p.is_verified = p_is_verified)
    AND (p_property_type IS NULL 
         OR (p_property_type = 'residential' AND p.property_type::text IN ('apartment', 'villa', 'house', 'plot'))
         OR p.property_type::text = p_property_type)
    AND (p_min_area IS NULL OR p.area_sqft >= p_min_area)
    AND (p_max_area IS NULL OR p.area_sqft <= p_max_area)
    AND (p_furnishing IS NULL OR p.furnishing::text = p_furnishing)
    AND (p_agent_id IS NULL OR p.owner_id = p_agent_id)
    AND (
      p_query IS NULL
      OR to_tsvector('english', coalesce(p.title, '') || ' ' || coalesce(p.description, ''))
         @@ plainto_tsquery('english', p_query)
    )
  ORDER BY p.is_featured DESC, p.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;


-- 3. approve_property(p_property_id uuid)
CREATE OR REPLACE FUNCTION approve_property(p_property_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized: Admin role required');
  END IF;

  UPDATE properties 
  SET status = 'approved', 
      is_verified = true 
  WHERE id = p_property_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Property not found');
  END IF;

  INSERT INTO activity_logs (user_id, action, entity_type, entity_id)
  VALUES (auth.uid(), 'property_approved', 'property', p_property_id);

  RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;


-- 4. reject_property(p_property_id uuid)
CREATE OR REPLACE FUNCTION reject_property(p_property_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized: Admin role required');
  END IF;

  UPDATE properties
  SET status = 'rejected'
  WHERE id = p_property_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Property not found');
  END IF;

  INSERT INTO activity_logs (user_id, action, entity_type, entity_id)
  VALUES (auth.uid(), 'property_rejected', 'property', p_property_id);

  RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;


-- 5. create_lead(...)
CREATE OR REPLACE FUNCTION create_lead(
  p_property_id uuid,
  p_name text,
  p_phone text,
  p_source lead_source
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_agent_id uuid;
  v_lead_id uuid;
  v_buyer_id uuid := auth.uid();
BEGIN
  SELECT owner_id INTO v_agent_id
  FROM properties
  WHERE id = p_property_id;

  IF v_agent_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Property not found');
  END IF;

  INSERT INTO leads (property_id, buyer_id, agent_id, name, phone, source, status)
  VALUES (p_property_id, v_buyer_id, v_agent_id, p_name, p_phone, p_source, 'new')
  RETURNING id INTO v_lead_id;

  RETURN jsonb_build_object('success', true, 'lead_id', v_lead_id);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;


-- 6. update_lead_status(...)
CREATE OR REPLACE FUNCTION update_lead_status(p_lead_id uuid, p_status lead_status)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM leads l
    LEFT JOIN profiles p ON p.id = v_user_id
    WHERE l.id = p_lead_id AND (l.agent_id = v_user_id OR p.role = 'admin')
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  UPDATE leads SET status = p_status WHERE id = p_lead_id;

  INSERT INTO activity_logs (user_id, action, entity_type, entity_id)
  VALUES (v_user_id, 'lead_status_updated', 'lead', p_lead_id);

  RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;


-- 7. book_site_visit(...)
CREATE OR REPLACE FUNCTION book_site_visit(p_property_id uuid, p_date date, p_time time)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_agent_id uuid;
  v_visit_id uuid;
  v_buyer_id uuid := auth.uid();
BEGIN
  IF v_buyer_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  SELECT owner_id INTO v_agent_id FROM properties WHERE id = p_property_id;
  IF v_agent_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Property not found');
  END IF;

  INSERT INTO site_visits (property_id, buyer_id, agent_id, visit_date, visit_time, status)
  VALUES (p_property_id, v_buyer_id, v_agent_id, p_date, p_time, 'requested')
  RETURNING id INTO v_visit_id;

  INSERT INTO activity_logs (user_id, action, entity_type, entity_id)
  VALUES (v_buyer_id, 'site_visit_booked', 'site_visit', v_visit_id);

  RETURN jsonb_build_object('success', true, 'visit_id', v_visit_id);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;


-- 8. confirm_site_visit(...)
CREATE OR REPLACE FUNCTION confirm_site_visit(p_visit_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM site_visits sv
    LEFT JOIN profiles p ON p.id = v_user_id
    WHERE sv.id = p_visit_id AND (sv.agent_id = v_user_id OR p.role = 'admin')
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  UPDATE site_visits SET status = 'confirmed' WHERE id = p_visit_id;

  INSERT INTO activity_logs (user_id, action, entity_type, entity_id)
  VALUES (v_user_id, 'site_visit_confirmed', 'site_visit', p_visit_id);

  RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;


-- 9. cancel_site_visit(...)
CREATE OR REPLACE FUNCTION cancel_site_visit(p_visit_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM site_visits sv
    LEFT JOIN profiles p ON p.id = v_user_id
    WHERE sv.id = p_visit_id AND (sv.buyer_id = v_user_id OR sv.agent_id = v_user_id OR p.role = 'admin')
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  UPDATE site_visits SET status = 'cancelled' WHERE id = p_visit_id;

  INSERT INTO activity_logs (user_id, action, entity_type, entity_id)
  VALUES (v_user_id, 'site_visit_cancelled', 'site_visit', p_visit_id);

  RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;
