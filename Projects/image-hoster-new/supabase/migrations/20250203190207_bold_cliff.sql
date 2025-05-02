/*
  # Add album system

  1. New Tables
    - `albums`
      - `id` (uuid, primary key)
      - `name` (text, album name)
      - `description` (text, optional)
      - `created_at` (timestamp)
    - `album_images`
      - `id` (uuid, primary key)
      - `album_id` (uuid, foreign key to albums)
      - `image_path` (text, references storage.objects)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Allow public access for all operations
*/

-- Create albums table
CREATE TABLE IF NOT EXISTS public.albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create album_images junction table
CREATE TABLE IF NOT EXISTS public.album_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid REFERENCES public.albums(id) ON DELETE CASCADE,
  image_path text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_images ENABLE ROW LEVEL SECURITY;

-- Create policies for albums
CREATE POLICY "Public albums access"
  ON public.albums
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policies for album_images
CREATE POLICY "Public album_images access"
  ON public.album_images
  FOR ALL
  USING (true)
  WITH CHECK (true);