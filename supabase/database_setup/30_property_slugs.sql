-- ─── Add slug column to properties table ────────────────────────────────────
-- This migration adds SEO-friendly slug support for property detail pages.
-- Slug pattern: {type}-{subtype}-in-{locality}-{city}-{state}-{shortId}

-- 1. Add the slug column
ALTER TABLE properties ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Create a unique index for fast slug lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_properties_slug 
  ON properties(slug) 
  WHERE slug IS NOT NULL;

-- 3. Create an index for prefix matching on id (used for short ID lookups)
CREATE INDEX IF NOT EXISTS idx_properties_id_prefix 
  ON properties(id text_pattern_ops);

-- Note: Run backfill-slugs.mjs after this migration to populate slugs
-- for all existing approved properties.
