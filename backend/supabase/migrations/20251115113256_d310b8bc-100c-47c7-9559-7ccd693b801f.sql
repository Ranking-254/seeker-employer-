-- Create storage bucket for CV uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cvs', 'cvs', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for CV uploads
CREATE POLICY "Job seekers can upload their own CVs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'cvs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Job seekers can view their own CVs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'cvs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Job seekers can update their own CVs"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'cvs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Job seekers can delete their own CVs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'cvs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);