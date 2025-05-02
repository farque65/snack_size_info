/*
  # Update storage policies for image uploads

  1. Changes
    - Add policies to allow anonymous uploads and deletions
    - Ensure bucket exists with public access

  2. Security
    - Allow public access to images
    - Allow anonymous uploads
    - Allow image deletion
*/

-- Only create bucket if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('images', 'images', true);
  END IF;
END $$;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Public Access" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can delete images" ON storage.objects;
END $$;

-- Create new policies
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'images' );

CREATE POLICY "Anyone can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'images' );

CREATE POLICY "Anyone can delete images"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'images' );