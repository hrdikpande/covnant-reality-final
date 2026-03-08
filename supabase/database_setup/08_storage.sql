-- ==========================================
-- 08_STORAGE.SQL
-- Supabase Storage Buckets and Policies
-- ==========================================

-- 1. Create 'property-media' bucket (Public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-media', 'property-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Create 'kyc-documents' bucket (Private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc-documents', 'kyc-documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 3. Allow public read access to property-media
CREATE POLICY "Public Access to Property Media"
ON storage.objects FOR SELECT
USING ( bucket_id = 'property-media' );

-- 4. Allow authenticated users to upload to property-media
CREATE POLICY "Authenticated users can upload property media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-media' AND 
  auth.role() = 'authenticated'
);

-- 5. KYV Documents: Only owner can access their own folder
CREATE POLICY "Users can only access their own KYC documents"
ON storage.objects FOR ALL
USING (
  bucket_id = 'kyc-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 6. Create 'avatars' bucket (Public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 7. Allow public read access to avatars
CREATE POLICY "Public Access to Avatars"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- 8. Allow users to upload and manage their own avatars
CREATE POLICY "Users can upload their own avatars"
ON storage.objects FOR ALL
TO authenticated
USING ( bucket_id = 'avatars' )
WITH CHECK (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);
