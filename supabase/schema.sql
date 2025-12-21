-- Kids Web Competition Registration Database Schema
-- Run this SQL in your Supabase SQL Editor to create the registrations table

-- Create registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    age VARCHAR(20) NOT NULL,
    school VARCHAR(255) NOT NULL,
    parent_name VARCHAR(100) NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    category VARCHAR(20) NOT NULL,
    experience VARCHAR(20) NOT NULL,
    agree_terms BOOLEAN NOT NULL DEFAULT false,
    agree_newsletter BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for registration form)
CREATE POLICY "Allow public inserts" ON public.registrations
    FOR INSERT
    WITH CHECK (true);

-- Create policy to allow authenticated users to read all registrations
-- (for admin dashboard in the future)
CREATE POLICY "Allow authenticated read" ON public.registrations
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_registrations_updated_at
    BEFORE UPDATE ON public.registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE public.registrations IS 'Stores registration data for the kids web design competition';
COMMENT ON COLUMN public.registrations.id IS 'Unique identifier for each registration';
COMMENT ON COLUMN public.registrations.email IS 'Student email address (unique)';
COMMENT ON COLUMN public.registrations.parent_email IS 'Parent/Guardian email address';
COMMENT ON COLUMN public.registrations.category IS 'Age category for competition';
COMMENT ON COLUMN public.registrations.experience IS 'Coding experience level';
COMMENT ON COLUMN public.registrations.agree_terms IS 'Whether user agreed to terms and conditions';
COMMENT ON COLUMN public.registrations.agree_newsletter IS 'Whether user wants to receive newsletters';
