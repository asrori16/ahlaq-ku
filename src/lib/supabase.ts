import { createClient } from '@supabase/supabase-js';

// Credentials provided for AKHLAQ KU
export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 'https://jquznspmctrxlrzkogxn.supabase.co';

export const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_zRMtbk9De1lvKnGdQO_MWQ_bqjD08kV';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const STORAGE_BUCKET_NAME = 'akhlaqku-media';

// SQL snippet specifically for creating and configuring the Supabase Storage Bucket
export const STORAGE_SETUP_SQL = `-- ==========================================================
-- AKHLAQ KU - PENYIAPAN SUPABASE STORAGE BUCKET
-- Jalankan di Menu 'SQL Editor' Supabase Anda
-- ==========================================================

-- 1. Buat bucket 'akhlaqku-media' jika belum ada
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'akhlaqku-media',
  'akhlaqku-media',
  true,
  209715200, -- 200 MB limit
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Kebijakan Keamanan Storage (RLS)
DO $$
BEGIN
  -- Kebijakan Membaca / Menonton (Public)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access akhlaqku-media'
  ) THEN
    CREATE POLICY "Public Access akhlaqku-media" ON storage.objects FOR SELECT USING (bucket_id = 'akhlaqku-media');
  END IF;

  -- Kebijakan Unggah / Upload (Public)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Upload akhlaqku-media'
  ) THEN
    CREATE POLICY "Public Upload akhlaqku-media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'akhlaqku-media');
  END IF;

  -- Kebijakan Perbarui / Update
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Update akhlaqku-media'
  ) THEN
    CREATE POLICY "Public Update akhlaqku-media" ON storage.objects FOR UPDATE USING (bucket_id = 'akhlaqku-media');
  END IF;

  -- Kebijakan Hapus / Delete
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Delete akhlaqku-media'
  ) THEN
    CREATE POLICY "Public Delete akhlaqku-media" ON storage.objects FOR DELETE USING (bucket_id = 'akhlaqku-media');
  END IF;
END $$;
`;

// SQL Schema script for user reference/manual setup if tables do not exist yet
export const SQL_SCHEMA_SETUP = `-- ==========================================================
-- AKHLAQ KU - SKEMA DATABASE SUPABASE (KELAS 11 SMA)
-- Salin dan jalankan kode SQL ini di Menu: 'SQL Editor' Supabase Anda
-- ==========================================================

-- 1. Tabel Profil Siswa
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  school_name TEXT DEFAULT 'SMA Negeri 1',
  class_grade TEXT DEFAULT 'XI SMA',
  nisn TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Hasil Asesmen (Pretest & Posttest)
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  chapter_id INTEGER NOT NULL,
  chapter_title TEXT NOT NULL,
  pretest_score INTEGER NOT NULL DEFAULT 0,
  posttest_score INTEGER NOT NULL DEFAULT 0,
  n_gain_score NUMERIC(5,2) DEFAULT 0,
  passed BOOLEAN DEFAULT FALSE,
  answers_summary JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Catatan Pembelajaran Siswa (Timestamped Notes)
CREATE TABLE IF NOT EXISTS public.student_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  chapter_id INTEGER NOT NULL,
  timestamp_seconds INTEGER DEFAULT 0,
  timestamp_formatted TEXT DEFAULT '00:00',
  note_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Progres Belajar Siswa
CREATE TABLE IF NOT EXISTS public.student_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  chapter_id INTEGER NOT NULL,
  video_watched BOOLEAN DEFAULT FALSE,
  video_watch_percentage INTEGER DEFAULT 0,
  pretest_completed BOOLEAN DEFAULT FALSE,
  pretest_score INTEGER,
  posttest_completed BOOLEAN DEFAULT FALSE,
  posttest_score INTEGER,
  ebook_read BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_name, chapter_id)
);

-- 5. Tabel Bab / Materi Pembelajaran (Sinkronisasi Admin & Siswa)
CREATE TABLE IF NOT EXISTS public.chapters (
  id SERIAL PRIMARY KEY,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  short_title TEXT,
  subtitle TEXT,
  semester INTEGER DEFAULT 1,
  duration_minutes INTEGER DEFAULT 45,
  description TEXT,
  dalil_surah TEXT,
  dalil_arabic TEXT,
  dalil_transliteration TEXT,
  dalil_translation TEXT,
  learning_objectives JSONB,
  ebook_pages JSONB,
  pdf_content JSONB,
  video_tutorial JSONB,
  pretest_questions JSONB,
  posttest_questions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mengaktifkan Row Level Security (RLS) dengan Kebijakan Terbuka (Public Read/Write)
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-write for student_profiles" 
ON public.student_profiles FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read-write for assessment_results" 
ON public.assessment_results FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read-write for student_notes" 
ON public.student_notes FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read-write for student_progress" 
ON public.student_progress FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read-write for chapters" 
ON public.chapters FOR ALL USING (true) WITH CHECK (true);

-- ==========================================================
-- 6. Supabase Storage Bucket untuk Video MP4 & Dokumen PDF
-- ==========================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'akhlaqku-media',
  'akhlaqku-media',
  true,
  209715200, -- 200 MB
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access akhlaqku-media'
  ) THEN
    CREATE POLICY "Public Access akhlaqku-media" ON storage.objects FOR SELECT USING (bucket_id = 'akhlaqku-media');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Upload akhlaqku-media'
  ) THEN
    CREATE POLICY "Public Upload akhlaqku-media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'akhlaqku-media');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Update akhlaqku-media'
  ) THEN
    CREATE POLICY "Public Update akhlaqku-media" ON storage.objects FOR UPDATE USING (bucket_id = 'akhlaqku-media');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Delete akhlaqku-media'
  ) THEN
    CREATE POLICY "Public Delete akhlaqku-media" ON storage.objects FOR DELETE USING (bucket_id = 'akhlaqku-media');
  END IF;
END $$;
`;
