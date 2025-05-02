/*
  # Create storage bucket for images

  1. New Storage Bucket
    - Creates a new public bucket named 'images' for storing uploaded images
    - Enables public access for the bucket
    - Sets up appropriate security policies

  2. Security
    - Allows authenticated users to upload images
    - Allows public access for viewing images
*/

-- Create a new storage bucket for images
insert into storage.buckets (id, name, public)
values ('images', 'images', true);

-- Allow public access to images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'images' );

-- Allow authenticated users to upload images
create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (
    bucket_id = 'images'
    and auth.role() = 'authenticated'
  );