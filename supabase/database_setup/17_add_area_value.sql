-- ==========================================
-- 17_ADD_AREA_VALUE.SQL
-- Add raw area_value column for dynamic units
-- ==========================================

-- 1. Add area_value column to properties if it does not exist
ALTER TABLE properties ADD COLUMN IF NOT EXISTS area_value NUMERIC;

-- 2. Populate the area_value with the existing area_sqft for any existing rows where area_value is currently null
UPDATE properties
SET area_value = area_sqft
WHERE area_value IS NULL;

-- Note: area_unit already exists and defaults to 'sq ft', so it'll match the existing area_sqft.
