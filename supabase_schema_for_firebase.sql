-- ==========================================
-- SUPABASE SCHEMA FOR FIREBASE AUTH INTEGRATION
-- Run this entire script in your Supabase SQL Editor
-- ==========================================

-- 1. CLEANUP (If re-running on existing project)
DROP TABLE IF EXISTS public.pdfs CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;

-- 2. ENUMS
CREATE TYPE public.user_role AS ENUM ('student', 'lecturer', 'owner');

-- 3. PROFILES TABLE
-- Note: id is TEXT to match Firebase UID string format
CREATE TABLE public.profiles (
    id TEXT PRIMARY KEY, 
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'student',
    college_name TEXT,
    college_address TEXT,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PDFS TABLE
-- Stores metadata for uploaded files
CREATE TABLE public.pdfs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL, -- References Firebase UID
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    
    -- College info
    college_name TEXT NOT NULL,
    college_address TEXT NOT NULL,
    institution_details TEXT,
    
    -- Academic classification
    branch TEXT NOT NULL,
    year_of_study TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    
    -- Subject details
    subject_name TEXT NOT NULL,
    chapter TEXT NOT NULL,
    description TEXT,
    
    -- Upload info
    upload_role user_role NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    
    -- AI Summary
    ai_summary TEXT,
    summary_generated_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdfs ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES (PERMISSIVE FOR FIREBASE)
-- Since Firebase handles Auth, we trust the application to send valid requests.
-- We use "TRUE" to allow operations, as Supabase doesn't know the Firebase User.

-- Profiles Policies
CREATE POLICY "Allow Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow Public Insert Profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Public Update Profiles" ON public.profiles FOR UPDATE USING (true);

-- PDFs Policies
CREATE POLICY "Allow Public Read PDFs" ON public.pdfs FOR SELECT USING (true);
CREATE POLICY "Allow Public Insert PDFs" ON public.pdfs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Public Update PDFs" ON public.pdfs FOR UPDATE USING (true);
CREATE POLICY "Allow Public Delete PDFs" ON public.pdfs FOR DELETE USING (true);

-- 7. STORAGE BUCKET SETUP
-- Create the 'pdfs' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pdfs', 'pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- 8. STORAGE POLICIES
-- Allow public access to the 'pdfs' bucket
DROP POLICY IF EXISTS "Public Access PDF Bucket" ON storage.objects;
CREATE POLICY "Public Access PDF Bucket" 
ON storage.objects FOR ALL 
USING (bucket_id = 'pdfs') 
WITH CHECK (bucket_id = 'pdfs');

-- 9. TRIGGERS (Optional but recommended)
-- Auto-update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pdfs_updated_at
    BEFORE UPDATE ON public.pdfs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
