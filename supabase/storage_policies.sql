-- Storage Policies for Competition Submissions Bucket
-- These policies control who can upload, read, update, and delete files in the storage bucket

-- Allow public uploads to competition-submissions bucket
-- This enables the registration form to upload files without authentication
CREATE POLICY "Allow public uploads to competition-submissions"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'competition-submissions');

-- Allow users to update their own submissions
-- This allows re-uploading or modifying files before submission deadline
CREATE POLICY "Allow update own submissions in competition-submissions"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'competition-submissions');

-- Allow authenticated users (admins) to read all submissions
-- This enables admin dashboard to view and download all submitted files
CREATE POLICY "Allow authenticated read of competition-submissions"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'competition-submissions');

-- Allow authenticated users (admins) to delete submissions if needed
-- This is useful for removing inappropriate or duplicate files
CREATE POLICY "Allow authenticated delete of competition-submissions"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'competition-submissions');
