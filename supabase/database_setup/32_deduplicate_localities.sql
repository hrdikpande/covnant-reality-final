-- ==========================================
-- 32_DEDUPLICATE_LOCALITIES.SQL
-- Resolves duplicate locality names within the same city
-- ==========================================

-- 1. First, update the trigger function to relax the pincode strict match
-- We do this BEFORE updating properties to prevent the old trigger from blocking the update
CREATE OR REPLACE FUNCTION validate_property_location()
RETURNS TRIGGER AS $$
DECLARE
  v_state_id UUID;
  v_city_id UUID;
  v_pincode TEXT;
BEGIN
  -- 1. Validate City belongs to State
  IF NEW.city_id IS NOT NULL THEN
    SELECT state_id INTO v_state_id FROM cities WHERE id = NEW.city_id;
    IF v_state_id != NEW.state_id THEN
      RAISE EXCEPTION 'City does not belong to the selected State';
    END IF;
  END IF;

  -- 2. Validate Locality belongs to City
  IF NEW.locality_id IS NOT NULL THEN
    SELECT city_id, pincode INTO v_city_id, v_pincode FROM localities WHERE id = NEW.locality_id;
    IF v_city_id != NEW.city_id THEN
      RAISE EXCEPTION 'Locality does not belong to the selected City';
    END IF;
    
    -- 3. Relaxed pincode logic: auto-fill from locality if not provided
    -- We removed the strict check so properties can retain alternative real-world pincodes
    IF NEW.pincode IS NULL OR NEW.pincode = '' THEN
      NEW.pincode := v_pincode;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Deduplicate localities by reassigning properties to the canonical locality
DO $$
DECLARE
  dup_record RECORD;
  canonical_id UUID;
BEGIN
  -- Loop over all city_id, name combinations that have more than 1 entry
  FOR dup_record IN
    SELECT city_id, name
    FROM localities
    GROUP BY city_id, name
    HAVING COUNT(*) > 1
  LOOP
    -- Get the oldest locality ID to keep as the canonical one
    SELECT id INTO canonical_id
    FROM localities
    WHERE city_id = dup_record.city_id AND name = dup_record.name
    ORDER BY created_at ASC
    LIMIT 1;

    -- Update properties to point to the canonical locality ID
    UPDATE properties
    SET locality_id = canonical_id
    WHERE locality_id IN (
      SELECT id FROM localities 
      WHERE city_id = dup_record.city_id AND name = dup_record.name AND id != canonical_id
    );

    -- Delete the duplicate localities
    DELETE FROM localities
    WHERE city_id = dup_record.city_id AND name = dup_record.name AND id != canonical_id;
  END LOOP;
END $$;

-- 3. Drop the old constraint that allowed duplicates with different pincodes
ALTER TABLE localities DROP CONSTRAINT IF EXISTS localities_city_id_name_pincode_key;

-- 4. Add the new constraint to enforce unique names within a city
ALTER TABLE localities ADD CONSTRAINT localities_city_id_name_key UNIQUE(city_id, name);
