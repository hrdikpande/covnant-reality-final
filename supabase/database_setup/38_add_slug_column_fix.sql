-- ==========================================
-- 38_ADD_SLUG_COLUMN_FIX.SQL
-- Fixes the "column p.slug does not exist" error
-- by adding the missing slug column to the properties table.
-- ==========================================

BEGIN;

-- 1. Add the slug column safely
ALTER TABLE properties ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Create a unique index for fast slug lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_properties_slug 
  ON properties(slug) 
  WHERE slug IS NOT NULL;

-- 3. Create an index for prefix matching on id (used for short ID lookups)
-- UUIDs must be cast to text for text_pattern_ops to work
CREATE INDEX IF NOT EXISTS idx_properties_id_prefix 
  ON properties((id::text) text_pattern_ops);

COMMIT;
