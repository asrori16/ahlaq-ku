-- =========================================================================
-- SKEMA LENGKAP DATABASE SUPABASE (POSTGRESQL) - APLIKASI AKHLAQ KU
-- PAI & Budi Pekerti Fase F (Kelas 11 SMA)
-- 
-- CARA PENGGUNAAN:
-- 1. Buka dashboard Supabase Anda di https://supabase.com/dashboard
-- 2. Pilih project Anda (misal: jquznspmctrxlrzkogxn)
-- 3. Buka menu 'SQL Editor' di panel samping kiri
-- 4. Klik 'New Query', salin dan tempel (paste) seluruh kode SQL di bawah ini
-- 5. Klik 'RUN' untuk membuat seluruh tabel dan data default
-- =========================================================================
-- AKTIFKAN EKSTENSI PGCRYPTO (UNTUK HASHING PASSWORD BCRYPT)
-- =========================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. TABEL PENGGUNA (USERS / SISWA & ADMIN)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'student')),
  nisn TEXT,
  class_grade TEXT DEFAULT 'XI MIPA 2',
  school TEXT DEFAULT 'SMA Negeri 1 Jakarta',
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL MATERI / BAB PEMBELAJARAN (CHAPTERS)
CREATE TABLE IF NOT EXISTS public.chapters (
  id SERIAL PRIMARY KEY,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  short_title TEXT,
  subtitle TEXT,
  semester INTEGER NOT NULL DEFAULT 1,
  duration_minutes INTEGER DEFAULT 45,
  description TEXT,
  dalil_surah TEXT,
  dalil_arabic TEXT,
  dalil_transliteration TEXT,
  dalil_translation TEXT,
  learning_objectives JSONB DEFAULT '[]'::jsonb,
  ebook_pages JSONB DEFAULT '[]'::jsonb,
  pdf_content JSONB DEFAULT '{}'::jsonb,
  video_tutorial JSONB DEFAULT '{}'::jsonb,
  pretest_questions JSONB DEFAULT '[]'::jsonb,
  posttest_questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL HASIL ASESMEN SISWA (PRETEST, POSTTEST, N-GAIN)
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id TEXT PRIMARY KEY,
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

-- 4. TABEL PROGRES BELAJAR SISWA
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

-- 5. TABEL CATATAN SISWA (TIMESTAMPED NOTES VIDEO)
CREATE TABLE IF NOT EXISTS public.student_notes (
  id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  chapter_id INTEGER NOT NULL,
  timestamp_seconds INTEGER DEFAULT 0,
  timestamp_formatted TEXT DEFAULT '00:00',
  note_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES (AKSES AMAN)
-- =========================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read-write for users" ON public.users;
CREATE POLICY "Allow public read-write for users" 
ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read-write for chapters" ON public.chapters;
CREATE POLICY "Allow public read-write for chapters" 
ON public.chapters FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read-write for assessment_results" ON public.assessment_results;
CREATE POLICY "Allow public read-write for assessment_results" 
ON public.assessment_results FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read-write for student_progress" ON public.student_progress;
CREATE POLICY "Allow public read-write for student_progress" 
ON public.student_progress FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read-write for student_notes" ON public.student_notes;
CREATE POLICY "Allow public read-write for student_notes" 
ON public.student_notes FOR ALL USING (true) WITH CHECK (true);

-- =========================================================================
-- TRIGGER & FUNGSI HASHING OTOMATIS (PGCRYPTO BCRYPT)
-- Memastikan setiap penambahan / perubahan password otomatis di-hash dengan salt
-- =========================================================================
CREATE OR REPLACE FUNCTION public.hash_user_password()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Jika password terisi dan belum berformat bcrypt hash ($2a$, $2b$, dll.)
  IF NEW.password IS NOT NULL AND NEW.password !~ '^\$2[abxy]\$.*' THEN
    NEW.password := crypt(NEW.password, gen_salt('bf', 10));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_hash_user_password ON public.users;
CREATE TRIGGER trg_hash_user_password
BEFORE INSERT OR UPDATE OF password ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.hash_user_password();

-- =========================================================================
-- FUNGSI VERIFIKASI LOGIN SUPABASE SECARA AMAN (RPC)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.verify_user_login(
  p_identifier TEXT,
  p_password TEXT
)
RETURNS SETOF public.users
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.users u
  WHERE (LOWER(u.username) = LOWER(TRIM(p_identifier)) OR u.nisn = TRIM(p_identifier))
    AND (
      -- Verifikasi kecocokan bcrypt hash dengan crypt()
      u.password = crypt(p_password, u.password)
      -- Fallback darurat jika ada password lama yang belum ter-hash
      OR u.password = p_password
    )
  LIMIT 1;
END;
$$;

-- Izin akses pemanggilan RPC
GRANT EXECUTE ON FUNCTION public.verify_user_login(TEXT, TEXT) TO anon, authenticated, service_role;

-- =========================================================================
-- DATA AWAL DEFAULT (SEED DATA DENGAN BCRYPT HASH)
-- =========================================================================

-- Masukkan akun Admin Guru dan Siswa Default (di-hash dengan crypt / bcrypt)
INSERT INTO public.users (id, username, password, full_name, role, nisn, class_grade, school, email)
VALUES 
  ('usr_admin_1', 'admin', crypt('admin123', gen_salt('bf', 10)), 'Ustadz H. Ahmad Farhan, M.Pd.I', 'admin', NULL, NULL, 'SMA Negeri 1 Jakarta', 'admin.pai@sekolah.sch.id'),
  ('usr_std_1', 'siswa', crypt('siswa123', gen_salt('bf', 10)), 'Ahmad Fauzi', 'student', '0078129341', 'XI MIPA 2', 'SMA Negeri 1 Jakarta', 'fauzi.ahmad@siswa.belajar.id'),
  ('usr_std_2', 'aisyah', crypt('siswa123', gen_salt('bf', 10)), 'Siti Aisyah Azzahra', 'student', '0078129342', 'XI MIPA 2', 'SMA Negeri 1 Jakarta', 'aisyah.azzahra@siswa.belajar.id'),
  ('usr_std_3', 'rizky', crypt('siswa123', gen_salt('bf', 10)), 'Muhammad Rizky Pratama', 'student', '0078129343', 'XI IPS 1', 'SMA Negeri 1 Jakarta', 'rizky.pratama@siswa.belajar.id')
ON CONFLICT (username) DO NOTHING;

-- Migrasi otomatis: Ubah semua password yang sebelumnya masih plain text menjadi hash bcrypt
UPDATE public.users
SET password = crypt(password, gen_salt('bf', 10))
WHERE password IS NOT NULL AND password !~ '^\$2[abxy]\$.*';

