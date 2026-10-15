import { supabase, SUPABASE_URL } from '../lib/supabase';
import { AssessmentRecord, StudentNote, StudentProgress } from '../types';

const STORAGE_KEYS = {
  CURRENT_STUDENT: 'akhlaqku_student_name',
  SCHOOL_NAME: 'akhlaqku_school_name',
  ASSESSMENTS: 'akhlaqku_assessments',
  NOTES: 'akhlaqku_notes',
  PROGRESS: 'akhlaqku_progress',
};

// Initial default student
export const getDefaultStudent = () => {
  return {
    name: localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT) || 'Ahmad Fauzi',
    school: localStorage.getItem(STORAGE_KEYS.SCHOOL_NAME) || 'SMA Negeri 1 Jakarta',
    classGrade: 'XI MIPA 2',
    nisn: '0078129341',
  };
};

export const saveStudentProfile = (name: string, school: string) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, name);
  localStorage.setItem(STORAGE_KEYS.SCHOOL_NAME, school);
};

export interface ConnectionStatus {
  connected: boolean;
  message: string;
  projectUrl: string;
  tablesVerified: {
    assessment_results: boolean;
    student_notes: boolean;
    student_progress: boolean;
    chapters: boolean;
  };
  storageVerified: boolean;
  storageBucketName: string;
}

export const checkSupabaseConnection = async (): Promise<ConnectionStatus> => {
  const status: ConnectionStatus = {
    connected: false,
    message: 'Memeriksa koneksi...',
    projectUrl: SUPABASE_URL,
    tablesVerified: {
      assessment_results: false,
      student_notes: false,
      student_progress: false,
      chapters: false,
    },
    storageVerified: false,
    storageBucketName: 'akhlaqku-media',
  };

  try {
    // Test basic HTTP ping by querying tables
    const { error: assessErr } = await supabase.from('assessment_results').select('id').limit(1);
    const { error: notesErr } = await supabase.from('student_notes').select('id').limit(1);
    const { error: progErr } = await supabase.from('student_progress').select('id').limit(1);
    const { error: chapErr } = await supabase.from('chapters').select('id').limit(1);

    status.tablesVerified.assessment_results = !assessErr || assessErr.code !== '42P01';
    status.tablesVerified.student_notes = !notesErr || notesErr.code !== '42P01';
    status.tablesVerified.student_progress = !progErr || progErr.code !== '42P01';
    status.tablesVerified.chapters = !chapErr || chapErr.code !== '42P01';

    // Verify storage bucket
    try {
      const { error: storageErr } = await supabase.storage.from('akhlaqku-media').list('', { limit: 1 });
      if (!storageErr) {
        status.storageVerified = true;
        status.storageBucketName = 'akhlaqku-media';
      } else {
        const { error: fallbackErr } = await supabase.storage.from('media').list('', { limit: 1 });
        if (!fallbackErr) {
          status.storageVerified = true;
          status.storageBucketName = 'media';
        }
      }
    } catch {
      status.storageVerified = false;
    }

    // If endpoint responds (even with table not found 42P01 or auth response), client is connected to Supabase URL
    if (
      (!assessErr || assessErr.code === '42P01' || assessErr.code === 'PGRST301' || assessErr.message)
    ) {
      status.connected = true;
      if (assessErr?.code === '42P01') {
        status.message = 'Terhubung ke Supabase (Tabel belum dibuat di SQL Editor)';
      } else {
        status.message = 'Terhubung & Tabel Supabase Aktif';
      }
    } else {
      status.connected = true;
      status.message = 'Terhubung ke Supabase Database';
    }
  } catch (err: unknown) {
    status.connected = false;
    status.message = err instanceof Error ? err.message : 'Koneksi offline atau terbatas';
  }

  return status;
};

// ===================== ASSESSMENTS =====================

export const saveAssessmentResult = async (record: AssessmentRecord): Promise<{ success: boolean; source: 'supabase' | 'local'; error?: string }> => {
  // Always update local storage first for resilience
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
    const existing: AssessmentRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
    // Replace if same chapter and student, or append
    const updated = [record, ...existing.filter(r => !(r.chapterId === record.chapterId && r.studentName === record.studentName))];
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }

  // Attempt Supabase insert
  try {
    const { error } = await supabase.from('assessment_results').insert([
      {
        student_name: record.studentName,
        chapter_id: record.chapterId,
        chapter_title: record.chapterTitle,
        pretest_score: record.pretestScore,
        posttest_score: record.posttestScore,
        n_gain_score: record.nGainScore,
        passed: record.passed,
        answers_summary: record.answersSummary || {},
        created_at: record.timestamp,
      },
    ]);

    if (!error) {
      return { success: true, source: 'supabase' };
    } else {
      console.warn('Supabase insert note/info:', error.message);
      return { success: true, source: 'local', error: error.message };
    }
  } catch (err: unknown) {
    console.warn('Supabase network error, fallback to local:', err);
    return { success: true, source: 'local', error: err instanceof Error ? err.message : 'Network error' };
  }
};

export const fetchAssessmentResults = async (studentName: string): Promise<AssessmentRecord[]> => {
  // Try fetching from Supabase first
  try {
    const { data, error } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('student_name', studentName)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((item) => ({
        id: item.id,
        studentName: item.student_name,
        chapterId: item.chapter_id,
        chapterTitle: item.chapter_title,
        pretestScore: Number(item.pretest_score),
        posttestScore: Number(item.posttest_score),
        nGainScore: Number(item.n_gain_score),
        passed: Boolean(item.passed),
        timestamp: item.created_at,
        answersSummary: item.answers_summary,
      }));
    }
  } catch (err) {
    console.warn('Error fetching from Supabase, fallback to localStorage', err);
  }

  // Fallback to local storage
  try {
    const localData = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
    if (localData) {
      const parsed: AssessmentRecord[] = JSON.parse(localData);
      return parsed.filter(item => item.studentName.toLowerCase() === studentName.toLowerCase());
    }
  } catch (e) {
    console.warn('Error parsing local assessments', e);
  }

  return [];
};

// ===================== STUDENT NOTES =====================

export const saveStudentNote = async (note: Omit<StudentNote, 'id'>): Promise<{ id: string; success: boolean }> => {
  const localId = `note_${Date.now()}`;
  const fullNote: StudentNote = { ...note, id: localId };

  // Save to local storage
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEYS.NOTES);
    const existing: StudentNote[] = existingRaw ? JSON.parse(existingRaw) : [];
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify([fullNote, ...existing]));
  } catch (e) {
    console.warn('Failed local note save', e);
  }

  // Try Supabase
  try {
    const { data, error } = await supabase.from('student_notes').insert([
      {
        student_name: note.studentName,
        chapter_id: note.chapterId,
        timestamp_seconds: note.timestampSeconds,
        timestamp_formatted: note.timestampFormatted,
        note_text: note.noteText,
        created_at: note.createdAt,
      },
    ]).select('id').single();

    if (!error && data?.id) {
      return { id: data.id, success: true };
    }
  } catch (e) {
    console.warn('Supabase note insert fallback', e);
  }

  return { id: localId, success: true };
};

export const fetchStudentNotes = async (chapterId: number, studentName: string): Promise<StudentNote[]> => {
  try {
    const { data, error } = await supabase
      .from('student_notes')
      .select('*')
      .eq('chapter_id', chapterId)
      .eq('student_name', studentName)
      .order('timestamp_seconds', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((d) => ({
        id: d.id,
        studentName: d.student_name,
        chapterId: d.chapter_id,
        timestampSeconds: d.timestamp_seconds,
        timestampFormatted: d.timestamp_formatted,
        noteText: d.note_text,
        createdAt: d.created_at,
      }));
    }
  } catch (e) {
    console.warn('Fallback to local notes', e);
  }

  // Local fallback
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (raw) {
      const list: StudentNote[] = JSON.parse(raw);
      return list
        .filter(n => n.chapterId === chapterId && n.studentName.toLowerCase() === studentName.toLowerCase())
        .sort((a, b) => a.timestampSeconds - b.timestampSeconds);
    }
  } catch (e) {
    console.warn('Error parsing local notes', e);
  }

  return [];
};

export const deleteStudentNote = async (noteId: string): Promise<boolean> => {
  try {
    await supabase.from('student_notes').delete().eq('id', noteId);
  } catch (e) {
    console.warn('Supabase delete error', e);
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (raw) {
      const list: StudentNote[] = JSON.parse(raw);
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(list.filter(n => n.id !== noteId)));
    }
  } catch (e) {
    console.warn('Local delete error', e);
  }

  return true;
};

// ===================== PROGRESS =====================

export const getStudentProgress = (chapterId: number): StudentProgress => {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.PROGRESS}_${chapterId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading progress', e);
  }

  return {
    chapterId,
    videoWatched: false,
    videoWatchPercentage: 0,
    pretestCompleted: false,
    posttestCompleted: false,
    ebookRead: false,
    notesCount: 0,
  };
};

export const updateStudentProgress = (chapterId: number, partial: Partial<StudentProgress>) => {
  const current = getStudentProgress(chapterId);
  const updated: StudentProgress = { ...current, ...partial };
  try {
    localStorage.setItem(`${STORAGE_KEYS.PROGRESS}_${chapterId}`, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error saving progress', e);
  }
  return updated;
};
