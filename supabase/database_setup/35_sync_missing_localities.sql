-- ==========================================
-- 35_SYNC_MISSING_LOCALITIES.SQL
-- Syncs missing (locality, pincode) pairs from properties
-- to the localities table, ensuring referential integrity.
-- ==========================================

BEGIN;

-- 1. Create a temporary table to capture what we insert for auditing
CREATE TEMP TABLE inserted_localities (
    name TEXT,
    pincode TEXT,
    city_id UUID
);

-- 2. Insert missing localities
-- Using DISTINCT ON (city_id, TRIM(pincode)) to ensure we only pick one
-- representative name if multiple properties have the same missing pincode.
WITH missing_localities AS (
  SELECT DISTINCT ON (p.city_id, TRIM(p.pincode)) 
    p.city_id, 
    p.locality AS name, 
    TRIM(p.pincode) AS pincode
  FROM properties p
  WHERE p.locality IS NOT NULL 
    AND p.pincode IS NOT NULL 
    AND TRIM(p.pincode) != '' 
    AND p.city_id IS NOT NULL
    AND NOT EXISTS (
      -- Check if this city + pincode combination already exists
      SELECT 1 
      FROM localities l 
      WHERE l.city_id = p.city_id 
        AND TRIM(l.pincode) = TRIM(p.pincode)
    )
  ORDER BY p.city_id, TRIM(p.pincode), p.created_at ASC
)
INSERT INTO localities (city_id, name, pincode)
SELECT city_id, name, pincode
FROM missing_localities
RETURNING name, pincode, city_id;

-- 3. Update properties that are missing a locality_id mapping
-- This ensures all properties point to their correct, newly inserted (or existing) locality.
UPDATE properties p
SET locality_id = l.id
FROM localities l
WHERE p.locality_id IS NULL 
  AND p.city_id = l.city_id 
  AND TRIM(p.pincode) = TRIM(l.pincode);

COMMIT;
