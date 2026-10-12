# AKHLAQ KU - Pembelajaran PAI & Budi Pekerti Kelas 11 SMA

Platform e-learning interaktif mata pelajaran Pendidikan Agama Islam & Budi Pekerti (Fase F - Kelas XI SMA/MA Kurikulum Merdeka). Dilengkapi materi E-Book & Modul PDF resmi, Video Tutorial Interaktif dengan Checkpoint, serta Asesmen Pre-Test & Post-Test terintegrasi database Supabase.

---

## Panduan Menjalankan Proyek di Komputer Lokal (Local Machine)

### 1. Prasyarat
Pastikan komputer Anda telah terinstal:
- **Node.js** versi 18 atau 20+ (Unduh di [nodejs.org](https://nodejs.org))
- **Git** (Opsional, jika clone dari GitHub)
- Editor kode seperti **Visual Studio Code**

---

### 2. Langkah Instalasi

1. **Ekstrak / Buka Folder Proyek** di VS Code atau terminal favorit Anda.
2. **Buat file `.env`**:
   Salin file `.env.example` menjadi `.env` di folder utama:
   ```bash
   cp .env.example .env
   ```
   Pastikan isi kredensial Supabase Anda di dalam file `.env`:
   ```env
   VITE_SUPABASE_URL="https://jquznspmctrxlrzkogxn.supabase.co"
   VITE_SUPABASE_ANON_KEY="sb_publishable_zRMtbk9De1lvKnGdQO_MWQ_bqjD08kV"
   ```

3. **Install Dependencies (Paket Node)**:
   Jalankan perintah berikut di terminal:
   ```bash
   npm install
   ```

4. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```

5. **Buka di Browser**:
   Buka browser Anda dan akses:
   ```text
   http://localhost:3000
   ```

---

### 3. Skema Database Supabase (Opsional)
Aplikasi sudah memiliki sistem *local sync fallback* otomatis. Namun, agar data nilai siswa tersimpan secara terpusat di cloud Supabase Anda, jalankan query berikut di menu **SQL Editor** pada dashboard Supabase Anda (`https://supabase.com/dashboard/project/jquznspmctrxlrzkogxn`):

```sql
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

-- Aktifkan Row Level Security (RLS)
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
```

---

### 4. Perintah Tambahan
- **Build untuk Production**: `npm run build`
- **Preview Hasil Build**: `npm run preview`
- **Pemeriksaan Type & Linter**: `npm run lint`
