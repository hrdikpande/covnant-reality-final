-- ==========================================
-- 33_PINCODE_UNIQUENESS.SQL
-- Resolves duplicate localities by Pincode and enforces uniqueness
-- ==========================================

-- 1. Deduplicate localities by reassigning properties to the canonical locality based on Pincode and City
DO $$
DECLARE
  dup_record RECORD;
  canonical_id UUID;
BEGIN
  -- Loop over all non-empty pincodes per city that have more than 1 entry
  FOR dup_record IN
    SELECT city_id, TRIM(pincode) as p_code
    FROM localities
    WHERE pincode IS NOT NULL AND TRIM(pincode) != ''
    GROUP BY city_id, TRIM(pincode)
    HAVING COUNT(*) > 1
  LOOP
    -- Get the oldest locality ID to keep as the canonical one
    SELECT id INTO canonical_id
    FROM localities
    WHERE city_id = dup_record.city_id AND TRIM(pincode) = dup_record.p_code
    ORDER BY created_at ASC
    LIMIT 1;

    -- Update properties to point to the canonical locality ID
    UPDATE properties
    SET locality_id = canonical_id
    WHERE locality_id IN (
      SELECT id FROM localities 
      WHERE city_id = dup_record.city_id AND TRIM(pincode) = dup_record.p_code AND id != canonical_id
    );

    -- Delete the duplicate localities
    DELETE FROM localities
    WHERE city_id = dup_record.city_id AND TRIM(pincode) = dup_record.p_code AND id != canonical_id;
  END LOOP;
END $$;

-- 2. Drop the name-based unique constraint (since Pincode is now the primary unique identifier)
ALTER TABLE localities DROP CONSTRAINT IF EXISTS localities_city_id_name_key;

-- 3. Add a partial unique index to enforce unique pincodes within a city (ignoring empty strings and NULLs)
DROP INDEX IF EXISTS localities_pincode_unique_idx;
DROP INDEX IF EXISTS localities_city_pincode_unique_idx;
CREATE UNIQUE INDEX localities_city_pincode_unique_idx ON localities (city_id, TRIM(pincode)) WHERE pincode IS NOT NULL AND TRIM(pincode) != '';
