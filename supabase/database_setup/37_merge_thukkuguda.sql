-- ==========================================
-- 37_MERGE_THUKKUGUDA.SQL
-- Specifically merges the misspelled "thukkuguda"
-- into the correct "tukkuguda" entity, and updates
-- all associated properties.
-- ==========================================

BEGIN;

DO $$
DECLARE
  v_canonical_id UUID;
  v_duplicate_id UUID;
BEGIN
  -- 1. Find the correct "tukkuguda" ID
  SELECT id INTO v_canonical_id 
  FROM localities 
  WHERE LOWER(TRIM(name)) = 'tukkuguda' 
  LIMIT 1;
  
  -- 2. Find the duplicate "thukkuguda" ID
  SELECT id INTO v_duplicate_id 
  FROM localities 
  WHERE LOWER(TRIM(name)) = 'thukkuguda' 
  LIMIT 1;

  -- 3. If both exist, perform the merge
  IF v_canonical_id IS NOT NULL AND v_duplicate_id IS NOT NULL THEN
    
    -- Reassign all properties from the duplicate to the canonical ID
    -- and update their text name to the correct spelling
    UPDATE properties
    SET locality_id = v_canonical_id,
        locality = 'tukkuguda'
    WHERE locality_id = v_duplicate_id OR LOWER(TRIM(locality)) = 'thukkuguda';

    -- Delete the duplicate "thukkuguda" locality
    DELETE FROM localities WHERE id = v_duplicate_id;
    
    RAISE NOTICE 'SUCCESS: Merged thukkuguda into tukkuguda!';
  ELSE
    RAISE NOTICE 'SKIPPED: Could not find both tukkuguda and thukkuguda. Ensure both exist.';
  END IF;
END $$;

COMMIT;
