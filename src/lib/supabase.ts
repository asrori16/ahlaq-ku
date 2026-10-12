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

-- Mengaktifkan Row Level Security (RLS) dengan Kebijakan Terbuka (Public Read/Write)
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-write for student_profiles" 
ON public.student_profiles FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read-write for assessment_results" 
ON public.assessment_results FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read-write for student_notes" 
ON public.student_notes FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read-write for student_progress" 
ON public.student_progress FOR ALL USING (true) WITH CHECK (true);
`;
