-- ==========================================
-- 40_CLEANUP_SURA_ADDRESSES.SQL
-- Cleans up dummy/wrong address data starting 
-- with "sura" from the properties table.
-- ==========================================

BEGIN;

UPDATE properties
SET address = ''
WHERE address ILIKE 'sura%';

-- Also clean up if it's anywhere in the address string
UPDATE properties
SET address = regexp_replace(address, 'sura\d+k', '', 'gi')
WHERE address ILIKE '%sura%';

-- Trim any leftover commas or spaces if the address is now just punctuation
UPDATE properties
SET address = TRIM(BOTH ', ' FROM address)
WHERE address IS NOT NULL;

-- If address becomes completely empty after trimming, set it to NULL
UPDATE properties
SET address = NULL
WHERE address = '';

COMMIT;
