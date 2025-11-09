-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('scrolls', 'scrolls', true),
  ('projects', 'projects', true),
  ('media', 'media', true);

-- Add file_url columns to tables
ALTER TABLE public.scrolls ADD COLUMN file_url TEXT;
ALTER TABLE public.projects ADD COLUMN image_url TEXT;
ALTER TABLE public.media ADD COLUMN file_url TEXT;

-- RLS policies for scrolls bucket
CREATE POLICY "Anyone can view scroll files"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'scrolls');

CREATE POLICY "Admins can upload scroll files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'scrolls' 
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update scroll files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'scrolls'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete scroll files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'scrolls'
    AND public.has_role(auth.uid(), 'admin')
  );

-- RLS policies for projects bucket
CREATE POLICY "Anyone can view project images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'projects');

CREATE POLICY "Admins can upload project images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'projects'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update project images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'projects'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete project images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'projects'
    AND public.has_role(auth.uid(), 'admin')
  );

-- RLS policies for media bucket
CREATE POLICY "Anyone can view media files"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'media');

CREATE POLICY "Admins can upload media files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'media'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update media files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'media'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete media files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'media'
    AND public.has_role(auth.uid(), 'admin')
  );