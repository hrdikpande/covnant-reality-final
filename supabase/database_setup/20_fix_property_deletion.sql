-- ==========================================
-- 20_FIX_PROPERTY_DELETION.SQL
-- Add missing DELETE policies for Property Owners
-- ==========================================

-- 1. Add DELETE policy for properties
-- This allows owners and admins to delete property listings
DROP POLICY IF EXISTS "Owners can delete own property" ON properties;
CREATE POLICY "Owners can delete own property" ON properties 
FOR DELETE USING (
  auth.uid() = owner_id OR 
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- 2. Add DELETE policy for property_media
-- This allows owners and admins to delete media records
DROP POLICY IF EXISTS "Owners can delete own property media" ON property_media;
CREATE POLICY "Owners can delete own property media" ON property_media 
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = property_media.property_id 
    AND (properties.owner_id = auth.uid() OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  ) OR
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Note: Other tables (leads, site_visits, reviews, etc.) already have ON DELETE CASCADE 
-- defined in their table creation scripts, so they will be cleaned up automatically.
