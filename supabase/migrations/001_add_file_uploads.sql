-- Migration: Add file upload support to registrations table
-- Created: 2025
-- Description: Adds columns for storing file upload information (URLs, metadata)

-- Add file upload columns to registrations table
ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS submission_file_url TEXT,
ADD COLUMN IF NOT EXISTS submission_file_name TEXT,
ADD COLUMN IF NOT EXISTS submission_file_size INTEGER,
ADD COLUMN IF NOT EXISTS submission_file_type TEXT,
ADD COLUMN IF NOT EXISTS submission_uploaded_at TIMESTAMP WITH TIME ZONE;

-- Add index for performance on file upload queries
CREATE INDEX IF NOT EXISTS idx_registrations_file_uploaded
  ON public.registrations(submission_uploaded_at DESC);

-- Add comments for documentation
COMMENT ON COLUMN public.registrations.submission_file_url
  IS 'Supabase Storage URL for uploaded submission file (ZIP, PDF, PPTX, DOC, DOCX, or images)';

COMMENT ON COLUMN public.registrations.submission_file_name
  IS 'Original filename of uploaded submission';

COMMENT ON COLUMN public.registrations.submission_file_size
  IS 'File size in bytes (max 52428800 = 50MB)';

COMMENT ON COLUMN public.registrations.submission_file_type
  IS 'MIME type of uploaded file (e.g., application/zip, application/pdf, image/png)';

COMMENT ON COLUMN public.registrations.submission_uploaded_at
  IS 'Timestamp when the file was uploaded to Supabase Storage';
