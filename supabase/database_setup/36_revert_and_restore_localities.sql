-- ==========================================
-- 36_REVERT_AND_RESTORE_LOCALITIES.SQL
-- Reverts strict pincode uniqueness to allow
-- multiple localities (e.g. Mankhal, Thukkuguda)
-- to correctly share the same pincode, and restores
-- any missing localities from the properties table.
-- ==========================================

BEGIN;

-- 1. Remove the strict "One Locality Per Pincode" rule
DROP INDEX IF EXISTS localities_city_pincode_unique_idx;
DROP INDEX IF EXISTS localities_pincode_unique_idx;
ALTER TABLE localities DROP CONSTRAINT IF EXISTS localities_city_id_name_pincode_key;

-- 2. Clean up any existing duplicate names in localities before adding the index
-- (Just in case there are exact duplicate names currently in the DB)
WITH duplicate_names AS (
  SELECT id, city_id, LOWER(TRIM(name)) AS normalized_name,
         ROW_NUMBER() OVER (PARTITION BY city_id, LOWER(TRIM(name)) ORDER BY created_at ASC) as row_num
  FROM localities
)
DELETE FROM localities
WHERE id IN (SELECT id FROM duplicate_names WHERE row_num > 1);

-- 3. Enforce "Unique Name Per City" rule (case-insensitive)
DROP INDEX IF EXISTS localities_city_name_unique_idx;
CREATE UNIQUE INDEX localities_city_name_unique_idx 
ON localities (city_id, LOWER(TRIM(name)));

-- 4. Restore missing localities from properties based on NAME
-- We group by name so we only insert each distinct spelling once
WITH missing_localities AS (
  SELECT DISTINCT ON (p.city_id, LOWER(TRIM(p.locality))) 
    p.city_id, 
    TRIM(p.locality) AS name, 
    TRIM(p.pincode) AS pincode
  FROM properties p
  WHERE p.locality IS NOT NULL 
    AND TRIM(p.locality) != ''
    AND p.pincode IS NOT NULL 
    AND p.city_id IS NOT NULL
    AND NOT EXISTS (
      -- Check if this specific name already exists in the localities table
      SELECT 1 
      FROM localities l 
      WHERE l.city_id = p.city_id 
        AND LOWER(TRIM(l.name)) = LOWER(TRIM(p.locality))
    )
  ORDER BY p.city_id, LOWER(TRIM(p.locality)), p.created_at ASC
)
INSERT INTO localities (city_id, name, pincode)
SELECT city_id, name, pincode
FROM missing_localities
RETURNING name, pincode, city_id;

-- 5. Sweep through properties and re-link them to the correct restored locality
UPDATE properties p
SET locality_id = l.id
FROM localities l
WHERE p.city_id = l.city_id 
  AND LOWER(TRIM(p.locality)) = LOWER(TRIM(l.name))
  -- Only update if the property currently has no locality_id OR it points to a different spelling/merged record
  AND (p.locality_id IS NULL OR p.locality_id != l.id);

COMMIT;
