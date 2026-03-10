-- ==========================================
-- SUPABASE STORAGE SETUP FOR CARTALIK
-- RUN THIS IN THE SUPABASE SQL EDITOR
-- ==========================================

-- 1. Create the 'profiles' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Clear existing policies for this bucket to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile photo" ON storage.objects;

-- 3. Set up Storage Policies (RLS)
-- Allow anyone to view profile photos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'profiles' );

-- Allow authenticated users to upload files to their own folder
-- The folder name matches the user's ID
CREATE POLICY "Users can upload own profile photo"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own files
CREATE POLICY "Users can update own profile photo"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own profile photo"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Add PDF URL columns to profiles table
-- RUN THIS if you haven't added these columns yet
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cv_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS catalogue_url TEXT;
