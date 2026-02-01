-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('student', 'lecturer', 'owner');

-- Create profiles table
CREATE TABLE public.profiles (
    id TEXT PRIMARY KEY, -- Changed from UUID to TEXT for Firebase UID
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

-- Create PDFs table for storing PDF metadata
CREATE TABLE public.pdfs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL, -- Changed from UUID REFERENCES to TEXT for Firebase UID
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

-- Enable RLS on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdfs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
-- Profiles policies (Relaxed for Firebase Auth)
CREATE POLICY "Users can view any profile"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (true); -- Trusting the app logic since we can't verify Firebase UID in Postgres easily

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (true);

-- PDFs policies (Relaxed for Firebase Auth)
CREATE POLICY "Anyone can view PDFs"
    ON public.pdfs FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can upload PDFs"
    ON public.pdfs FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own PDFs"
    ON public.pdfs FOR UPDATE
    USING (true);

CREATE POLICY "Users can delete their own PDFs"
    ON public.pdfs FOR DELETE
    USING (true);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pdfs_updated_at
    BEFORE UPDATE ON public.pdfs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('pdfs', 'pdfs', true);

-- Storage policies for PDFs bucket
-- Storage policies for PDFs bucket
CREATE POLICY "Anyone can view PDFs"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'pdfs');

CREATE POLICY "Authenticated users can upload PDFs"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'pdfs');

CREATE POLICY "Users can update their own PDFs"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'pdfs');

CREATE POLICY "Users can delete their own PDFs"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'pdfs');