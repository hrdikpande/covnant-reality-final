-- =============================================================
-- 09_SEED_DATA.SQL
-- Default Super Admin User and Sample Properties
-- =============================================================

-- =============================================================
-- 1. SEED: Default Super Admin User
-- =============================================================
DO $$
DECLARE
  v_admin_id  UUID;
  v_email     TEXT := 'super-admin@covnantreality.com';
  v_full_name TEXT := 'Super Admin';
BEGIN
  -- ── 1. Check if the user already exists ────────────────────────────
  SELECT id INTO v_admin_id
  FROM auth.users
  WHERE email = v_email;

  -- ── 2. Create the auth user only if they don't exist yet ───────────
  IF v_admin_id IS NULL THEN
    v_admin_id := gen_random_uuid();

    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      raw_user_meta_data, raw_app_meta_data, role, aud, created_at,
      updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    )
    VALUES (
      v_admin_id, '00000000-0000-0000-0000-000000000000', v_email,
      crypt('password@123', gen_salt('bf')), NOW(),
      jsonb_build_object('full_name', v_full_name, 'role', 'admin', 'phone', ''),
      jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
      'authenticated', 'authenticated', NOW(), NOW(),
      '', '', '', ''
    );

    RAISE NOTICE '✅ Auth user created → id=%', v_admin_id;
  ELSE
    RAISE NOTICE 'ℹ️  Auth user already exists → id=%', v_admin_id;
  END IF;

  -- ── 3. Always sync user_metadata role to admin ──────────────────────
  UPDATE auth.users
  SET
    raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb,
    updated_at         = NOW()
  WHERE id = v_admin_id;

  -- ── 4. Upsert the profiles row ──────────────────────────────────────
  INSERT INTO public.profiles (
    id, full_name, email, phone, role, is_verified, created_at
  )
  VALUES (
    v_admin_id, v_full_name, v_email, '', 'admin', TRUE, NOW()
  )
  ON CONFLICT (id) DO UPDATE
    SET role        = 'admin',
        is_verified = TRUE,
        full_name   = EXCLUDED.full_name;

  RAISE NOTICE '✅ Admin seeded successfully → id=%, email=%', v_admin_id, v_email;
END $$;

-- =============================================================
-- 2. SEED: Sample Approved Properties for Homepage
-- =============================================================
DO $$
DECLARE
  v_owner_id UUID;
  v_prop_id  UUID;
BEGIN
  -- ── Resolve the admin user as owner ────────────────────────────────
  SELECT id INTO v_owner_id
  FROM auth.users
  WHERE email = 'super-admin@covnantreality.com'
  LIMIT 1;

  IF v_owner_id IS NULL THEN
    RAISE EXCEPTION 'Admin user not found — run seed_admin.sql first.';
  END IF;

  -- ── Helper: delete existing seed rows to make this idempotent ──────
  DELETE FROM property_media WHERE property_id IN (SELECT id FROM properties WHERE owner_id = v_owner_id);
  DELETE FROM properties WHERE owner_id = v_owner_id;

  -- 1. 3 BHK Apartment — Mumbai
  INSERT INTO properties (
    id, owner_id, title, description, listing_type, property_type, price, area_sqft, area_unit, bedrooms, bathrooms, furnishing, city, state, address, locality, status, is_verified, created_at
  ) VALUES (
    gen_random_uuid(), v_owner_id, '3 BHK Premium Apartment in Bandra', 'Spacious 3 BHK with stunning sea view.', 'sell', 'apartment', 45000000, 1850, 'sq ft', 3, 3, 'furnished', 'Mumbai', 'Maharashtra', 'Sea View Heights, Band Stand', 'Bandra West', 'approved', true, NOW() - INTERVAL '2 days'
  ) RETURNING id INTO v_prop_id;
  INSERT INTO property_media (property_id, media_url, media_type) VALUES
    (v_prop_id, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'image');

  -- 2. 2 BHK Apartment — Bangalore
  INSERT INTO properties (
    id, owner_id, title, description, listing_type, property_type, price, area_sqft, area_unit, bedrooms, bathrooms, furnishing, city, state, address, locality, status, is_verified, created_at
  ) VALUES (
    gen_random_uuid(), v_owner_id, '2 BHK Furnished Flat in Koramangala', 'Fully furnished apartment near tech parks.', 'rent', 'apartment', 35000, 1100, 'sq ft', 2, 2, 'furnished', 'Bangalore', 'Karnataka', 'Epsilon Residency', 'Koramangala', 'approved', true, NOW() - INTERVAL '1 day'
  ) RETURNING id INTO v_prop_id;
  INSERT INTO property_media (property_id, media_url, media_type) VALUES
    (v_prop_id, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'image');

  -- 3. Villa — Hyderabad
  INSERT INTO properties (
    id, owner_id, title, description, listing_type, property_type, price, area_sqft, area_unit, bedrooms, bathrooms, furnishing, city, state, address, locality, status, is_verified, created_at
  ) VALUES (
    gen_random_uuid(), v_owner_id, 'Luxury Villa with Private Pool in Jubilee Hills', '4 BHK villa with private pool.', 'sell', 'villa', 95000000, 5200, 'sq ft', 4, 5, 'furnished', 'Hyderabad', 'Telangana', 'Green Acres', 'Jubilee Hills', 'approved', true, NOW() - INTERVAL '3 days'
  ) RETURNING id INTO v_prop_id;
  INSERT INTO property_media (property_id, media_url, media_type) VALUES
    (v_prop_id, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'image');

  RAISE NOTICE '✅ 3 sample approved properties seeded successfully!';
END $$;
