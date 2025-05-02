# Image Manager

A modern, responsive image management system built with React, TypeScript, and Supabase. This application allows users to upload, organize, and manage images with features like albums, sorting, and easy URL sharing.

![Image Manager Preview](https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

## Features

- 📤 Drag-and-drop image upload
- 🗂️ Album organization
- 🔍 Image preview and URL sharing
- 📱 Fully responsive design
- ⚡ Real-time updates
- 🔄 Sorting capabilities
- 🎯 Pagination

## Prerequisites

Before you begin, ensure you have:
- Node.js 18.0.0 or higher
- A Supabase account

## Setup Instructions

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd image-manager
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Supabase**

   a. Create a new Supabase project at [supabase.com](https://supabase.com)
   
   b. In your Supabase project:
      - Go to Storage and create a new bucket named `images`
      - Enable public access for the bucket
      - Go to SQL Editor and run the following migrations in order:
        - Create storage bucket for images
        - Update storage policies
        - Add album system

   c. Create a `.env` file in the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start the development server**

```bash
npm run dev
```

## Supabase Integration Guide

### Storage Setup

The application uses Supabase Storage for image management. The setup includes:

1. **Create Storage Bucket**
   - Name: `images`
   - Access: Public
   - File size limit: Default (50MB)

2. **Storage Policies**
   ```sql
   -- Allow public access to images
   CREATE POLICY "Public Access"
     ON storage.objects FOR SELECT
     USING ( bucket_id = 'images' );

   -- Allow uploads
   CREATE POLICY "Anyone can upload images"
     ON storage.objects FOR INSERT
     WITH CHECK ( bucket_id = 'images' );

   -- Allow deletions
   CREATE POLICY "Anyone can delete images"
     ON storage.objects FOR DELETE
     USING ( bucket_id = 'images' );
   ```

### Database Tables

The application requires two main tables:

1. **Albums Table**
   ```sql
   CREATE TABLE public.albums (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     name text NOT NULL,
     description text,
     created_at timestamptz DEFAULT now()
   );
   ```

2. **Album Images Table**
   ```sql
   CREATE TABLE public.album_images (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     album_id uuid REFERENCES public.albums(id) ON DELETE CASCADE,
     image_path text NOT NULL,
     created_at timestamptz DEFAULT now()
   );
   ```

### Security Rules

Enable Row Level Security (RLS) and set up policies:

```sql
-- Enable RLS
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public albums access"
  ON public.albums
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public album_images access"
  ON public.album_images
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## Environment Variables

Required environment variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Building for Production

To create a production build:

```bash
npm run build
```

The build output will be in the `dist` directory.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Lucide React (for icons)

## License

MIT