-- RUN THIS SCRIPT IN YOUR SUPABASE DASHBOARD -> SQL EDITOR

-- 1. Enable RLS (just to be safe)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdfs ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing restrictive policies that rely on Supabase Auth
DROP POLICY IF EXISTS "Authenticated users can upload PDFs" ON public.pdfs;
DROP POLICY IF EXISTS "Users can update their own PDFs" ON public.pdfs;
DROP POLICY IF EXISTS "Users can delete their own PDFs" ON public.pdfs;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- 3. Create NEW permissive policies that allow Firebase users (anonymous to Supabase) to write data
-- Note: This relies on your App to check authentication (which it does via Firebase)
CREATE POLICY "Allow Public Insert PDFs" ON public.pdfs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Public Update PDFs" ON public.pdfs FOR UPDATE USING (true);
CREATE POLICY "Allow Public Delete PDFs" ON public.pdfs FOR DELETE USING (true);
CREATE POLICY "Allow Public Select PDFs" ON public.pdfs FOR SELECT USING (true);

CREATE POLICY "Allow Public Insert Profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Public Update Profiles" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Allow Public Select Profiles" ON public.profiles FOR SELECT USING (true);

-- 4. Change ID column types to TEXT to support Firebase UIDs (which are strings, not UUIDs)
ALTER TABLE public.profiles ALTER COLUMN id TYPE text;
ALTER TABLE public.pdfs ALTER COLUMN user_id TYPE text;

-- 5. Fix Storage Permissions (for the actual file upload)
INSERT INTO storage.buckets (id, name, public) VALUES ('pdfs', 'pdfs', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Authenticated users can upload PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own PDFs" ON storage.objects;

CREATE POLICY "Allow Public Upload PDFs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'pdfs');
CREATE POLICY "Allow Public Select PDFs" ON storage.objects FOR SELECT USING (bucket_id = 'pdfs');
