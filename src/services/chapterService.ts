import { Chapter, Question } from '../types';
import { CHAPTERS_DATA } from '../data/chapters';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'akhlaqku_chapters_list';

export const getStoredChapters = (): Chapter[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // Inisialisasi awal hanya jika STORAGE_KEY belum pernah dibuat di browser (null)
    if (raw === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(CHAPTERS_DATA));
      return CHAPTERS_DATA;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(CHAPTERS_DATA));
      return CHAPTERS_DATA;
    }
    // Jika berupa array (termasuk [] jika materi sengaja dihapus), kembalikan apa adanya
    return parsed;
  } catch (e) {
    console.warn('Error reading stored chapters, falling back to default', e);
    return [];
  }
};

export const saveStoredChapters = (chapters: Chapter[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chapters));
  } catch (e) {
    console.error('Failed to save chapters', e);
  }
};

export const addChapter = async (data: {
  number?: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  semester: number;
  durationMinutes: number;
  description: string;
  surah: string;
  arabic: string;
  transliteration: string;
  translation: string;
  objectivesText?: string;
  youtubeId?: string;
  videoUrl?: string;
  videoFileName?: string;
  videoFileKey?: string;
  videoSourceType?: 'youtube' | 'upload';
  pdfFileUrl?: string;
  pdfFileName?: string;
  pdfFileKey?: string;
  subsectionsContent?: string;
  questions?: Question[];
}): Promise<Chapter> => {
  const currentChapters = getStoredChapters();
  const nextId = currentChapters.length > 0 ? Math.max(...currentChapters.map((c) => c.id)) + 1 : 1;
  const nextNumber = data.number?.trim() || (nextId < 10 ? `0${nextId}` : `${nextId}`);

  // Parse objectives
  const objectives = data.objectivesText
    ? data.objectivesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
    : [
        `Memahami dalil dan konsep ${data.title}.`,
        `Mengidentifikasi hikmah dan penerapan ${data.title} bagi pelajar SMA.`,
        `Mengamalkan sikap terpuji dalam kehidupan sehari-hari.`,
      ];

  const contentParagraphs = data.subsectionsContent
    ? data.subsectionsContent
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean)
    : [data.description];

  const initialQuestions: Question[] = (data.questions && data.questions.length > 0)
    ? data.questions
    : [
        {
          id: nextId * 100 + 1,
          question: `Apa makna utama dari materi ${data.title}?`,
          options: [
            'Mengamalkan nilai-nilai akhlakul karimah dalam pergaulan',
            'Sekadar menghafal definisi tanpa praktik',
            'Mengikuti budaya asing tanpa filter',
            'Menghindari silaturahmi dengan sesama',
          ],
          correctAnswer: 0,
          explanation: `Pemahaman akhlak Islam bertujuan untuk diamalkan dalam kehidupan nyata.`,
        },
      ];

  const pdfContentData = {
    moduleTitle: data.title,
    author: 'Tim MGMP PAI & Budi Pekerti',
    schoolLevel: 'SMA / SMK / MA Kelas 11',
    totalStudyHours: `${data.durationMinutes || 45} Menit (2 JP)`,
    summaryPoints: objectives,
    caseStudies: [
      {
        caseTitle: `Refleksi Akhlak: ${data.title}`,
        story: `Sebagai generasi muda muslim di era digital, bagaimana Anda mengimplementasikan ${data.title} di lingkungan sekolah dan masyarakat?`,
        discussionQuestions: [
          'Bagaimana tantangan terbesar dalam menjaga nilai ini hari ini?',
          'Apa langkah konkret yang dapat dilakukan oleh remaja muslim?',
        ],
      },
    ],
    pdfFileName: data.pdfFileName,
    pdfFileUrl: data.pdfFileUrl,
    pdfFileKey: data.pdfFileKey,
  };

  const videoTutorialData = {
    title: `Video Pembelajaran Interaktif: ${data.title}`,
    youtubeId: data.youtubeId?.trim() || 'qC03y3jV3pE',
    videoUrl: data.videoUrl,
    videoFileName: data.videoFileName,
    videoFileKey: data.videoFileKey,
    videoSourceType: data.videoSourceType || (data.videoUrl ? 'upload' : 'youtube'),
    durationSeconds: (data.durationMinutes || 45) * 60,
    description: data.description,
    checkpoints: [
      {
        timestampSeconds: 60,
        label: 'Pemahaman Dasar',
        questionPrompt: `Berdasarkan pengantar materi, apa inti dari ${data.title}?`,
        options: [
          'Menjaga kehormatan dan ketaatan syariat',
          'Mengikuti tren tanpa batas',
          'Mengabaikan adab pergaulan',
          'Bersikap acuh tak acuh',
        ],
        correctOption: 0,
        explanation: `Inti dari materi ini adalah menegakkan akhlak mulia dan ketaatan syariat.`,
      },
    ],
    chaptersList: [
      { time: '00:00', seconds: 0, title: 'Pengantar Materi' },
      { time: '05:00', seconds: 300, title: 'Kajian Dalil & Konsep' },
      { time: '10:00', seconds: 600, title: 'Penerapan Sehari-hari' },
    ],
    keyTakeaways: objectives,
    pdfFileName: data.pdfFileName,
    pdfFileUrl: data.pdfFileUrl,
    pdfFileKey: data.pdfFileKey,
  };

  const newChapter: Chapter = {
    id: nextId,
    number: nextNumber,
    title: data.title.trim(),
    shortTitle: data.shortTitle.trim() || data.title.trim().slice(0, 30),
    subtitle: data.subtitle.trim(),
    semester: data.semester,
    durationMinutes: Number(data.durationMinutes) || 45,
    description: data.description.trim(),
    colorScheme: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badge: 'bg-emerald-600',
      accent: 'emerald',
    },
    learningObjectives: objectives,
    dalilUtama: {
      surah: data.surah.trim() || "QS. Al-Hujurat [49]: 13",
      arabic: data.arabic.trim() || "يٰٓاَيُّهَا النَّاسُ اِنَّا خَلَقْنٰكُمْ مِّنْ ذَكَرٍ وَّاُنْثٰى",
      transliteration: data.transliteration.trim() || "Yā ayyuhan-nāsu innā khalaqnākum min dzakariw wa unṡā",
      translation: data.translation.trim() || "Wahai manusia! Sungguh, Kami telah menciptakan kamu dari seorang laki-laki dan seorang perempuan.",
    },
    pdfFileName: data.pdfFileName,
    pdfFileUrl: data.pdfFileUrl,
    pdfFileKey: data.pdfFileKey,
    ebookPages: [
      {
        pageNumber: 1,
        title: `Konsep & Hakikat: ${data.title}`,
        subsections: [
          {
            heading: `1. Pengertian dan Landasan Syariat`,
            content: contentParagraphs,
            highlightQuote: `Pengamalan ${data.title} adalah cermin kemuliaan akhlak seorang muslim.`,
          },
        ],
      },
    ],
    pdfContent: pdfContentData,
    videoTutorial: videoTutorialData,
    pretest: initialQuestions,
    posttest: initialQuestions,
  };

  const updated = [...currentChapters, newChapter];
  saveStoredChapters(updated);

  // Sync insert to Supabase
  try {
    const { error } = await supabase
      .from('chapters')
      .insert({
        number: newChapter.number,
        title: newChapter.title,
        short_title: newChapter.shortTitle,
        subtitle: newChapter.subtitle,
        semester: newChapter.semester,
        duration_minutes: newChapter.durationMinutes,
        description: newChapter.description,
        dalil_surah: newChapter.dalilUtama.surah,
        dalil_arabic: newChapter.dalilUtama.arabic,
        dalil_transliteration: newChapter.dalilUtama.transliteration,
        dalil_translation: newChapter.dalilUtama.translation,
        learning_objectives: newChapter.learningObjectives,
        ebook_pages: newChapter.ebookPages,
        pdf_content: pdfContentData,
        video_tutorial: videoTutorialData,
        pretest_questions: initialQuestions,
        posttest_questions: initialQuestions,
      });
    if (error) console.info('Supabase chapters insert note:', error.message);
  } catch (err) {
    console.warn('Supabase insert error caught:', err);
  }

  return newChapter;
};

export const updateChapter = async (
  id: number,
  data: Partial<Chapter> & { questions?: Question[] }
): Promise<boolean> => {
  const current = getStoredChapters();
  const index = current.findIndex((c) => c.id === id);
  if (index === -1) return false;

  const existing = current[index];

  // Pre-test & Post-test automatic synchronization
  let synchronizedQuestions: Question[] | undefined = undefined;
  if (data.questions !== undefined) {
    synchronizedQuestions = data.questions;
  } else if (data.pretest !== undefined) {
    synchronizedQuestions = data.pretest;
  } else if (data.posttest !== undefined) {
    synchronizedQuestions = data.posttest;
  }

  const newPdfFileName = data.pdfFileName !== undefined ? data.pdfFileName : existing.pdfFileName;
  const newPdfFileUrl = data.pdfFileUrl !== undefined ? data.pdfFileUrl : existing.pdfFileUrl;
  const newPdfFileKey = data.pdfFileKey !== undefined ? data.pdfFileKey : existing.pdfFileKey;

  const updatedPdfContent = {
    ...(existing.pdfContent || {}),
    ...(data.pdfContent || {}),
    moduleTitle: data.pdfContent?.moduleTitle || existing.pdfContent?.moduleTitle || existing.title || '',
    author: data.pdfContent?.author || existing.pdfContent?.author || 'Tim MGMP PAI & Budi Pekerti',
    schoolLevel: data.pdfContent?.schoolLevel || existing.pdfContent?.schoolLevel || 'SMA / SMK / MA Kelas 11',
    totalStudyHours: data.pdfContent?.totalStudyHours || existing.pdfContent?.totalStudyHours || `${existing.durationMinutes || 45} Menit (2 JP)`,
    summaryPoints: data.pdfContent?.summaryPoints || existing.pdfContent?.summaryPoints || existing.learningObjectives || [],
    caseStudies: data.pdfContent?.caseStudies || existing.pdfContent?.caseStudies || [],
    pdfFileName: newPdfFileName,
    pdfFileUrl: newPdfFileUrl,
    pdfFileKey: newPdfFileKey,
  };

  const updatedVideoTutorial = {
    ...existing.videoTutorial,
    ...(data.videoTutorial || {}),
    pdfFileName: newPdfFileName,
    pdfFileUrl: newPdfFileUrl,
    pdfFileKey: newPdfFileKey,
  };

  current[index] = {
    ...existing,
    ...data,
    ...(synchronizedQuestions !== undefined ? { pretest: synchronizedQuestions, posttest: synchronizedQuestions } : {}),
    number: data.number !== undefined ? data.number.trim() : existing.number,
    pdfFileName: newPdfFileName,
    pdfFileUrl: newPdfFileUrl,
    pdfFileKey: newPdfFileKey,
    pdfContent: updatedPdfContent,
    videoTutorial: updatedVideoTutorial,
  };
  saveStoredChapters(current);

  // Sync update to Supabase
  const updatedItem = current[index];
  const updatePayload: Record<string, unknown> = {
    number: updatedItem.number,
    title: updatedItem.title,
    short_title: updatedItem.shortTitle,
    subtitle: updatedItem.subtitle,
    semester: updatedItem.semester,
    duration_minutes: updatedItem.durationMinutes,
    description: updatedItem.description,
    dalil_surah: updatedItem.dalilUtama.surah,
    dalil_arabic: updatedItem.dalilUtama.arabic,
    dalil_transliteration: updatedItem.dalilUtama.transliteration,
    dalil_translation: updatedItem.dalilUtama.translation,
    learning_objectives: updatedItem.learningObjectives,
    ebook_pages: updatedItem.ebookPages,
    pdf_content: updatedPdfContent,
    video_tutorial: updatedVideoTutorial,
    updated_at: new Date().toISOString(),
  };
  if (synchronizedQuestions !== undefined) {
    updatePayload.pretest_questions = synchronizedQuestions;
    updatePayload.posttest_questions = synchronizedQuestions;
  }

  try {
    const { error } = await supabase
      .from('chapters')
      .update(updatePayload)
      .eq('id', id);
    if (error) console.info('Supabase chapters update note:', error.message);
  } catch (err) {
    console.warn('Supabase update error caught:', err);
  }

  return true;
};

/**
 * Update assessment questions for a specific chapter, automatically synchronizing both pretest and posttest
 */
export const updateChapterQuestions = (
  chapterId: number,
  questions: Question[]
): boolean => {
  const current = getStoredChapters();
  const index = current.findIndex((c) => c.id === chapterId);
  if (index === -1) return false;

  current[index] = {
    ...current[index],
    pretest: questions,
    posttest: questions,
  };
  saveStoredChapters(current);

  // Sync update to Supabase in background
  supabase
    .from('chapters')
    .update({
      pretest_questions: questions,
      posttest_questions: questions,
      updated_at: new Date().toISOString(),
    })
    .eq('id', chapterId)
    .then(({ error }) => {
      if (error) console.info('Supabase questions sync note:', error.message);
    });

  return true;
};

export const deleteChapter = (id: number): boolean => {
  const current = getStoredChapters();
  const filtered = current.filter((c) => c.id !== id);
  if (filtered.length === current.length) return false;

  saveStoredChapters(filtered);

  // Sync delete to Supabase in background
  supabase
    .from('chapters')
    .delete()
    .eq('id', id)
    .then(({ error }) => {
      if (error) console.info('Supabase chapters delete note:', error.message);
    });

  return true;
};

export const deleteAllChapters = async (): Promise<boolean> => {
  saveStoredChapters([]);
  try {
    const { error } = await supabase.from('chapters').delete().neq('id', 0);
    if (error) console.info('Supabase bulk delete chapters note:', error.message);
  } catch (e) {
    console.warn('Failed to bulk delete from Supabase:', e);
  }
  return true;
};

export const resetChaptersToDefault = (): Chapter[] => {
  saveStoredChapters(CHAPTERS_DATA);
  return CHAPTERS_DATA;
};

/**
 * Fetches chapters from Supabase and synchronizes them with localStorage.
 * Ensures student devices receive videos and materials uploaded by the teacher.
 */
export const syncChaptersFromSupabase = async (): Promise<Chapter[]> => {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.warn('Supabase chapters fetch note:', error.message);
      return getStoredChapters();
    }

    // Jika query ke Supabase berhasil:
    // Jika tabel di database kosong (karena materi telah dihapus seluruhnya)
    if (!data || data.length === 0) {
      saveStoredChapters([]);
      return [];
    }

    const currentLocal = getStoredChapters();

    // Map Supabase rows to full Chapter structure
    const remoteChapters: Chapter[] = data.map((row: Record<string, any>) => {
      const localMatch = currentLocal.find((c) => c.id === Number(row.id));
      const fallback = localMatch || CHAPTERS_DATA.find((c) => c.id === Number(row.id));

      const pdfFileName =
        row.pdf_content?.pdfFileName ||
        row.video_tutorial?.pdfFileName ||
        row.pdf_file_name ||
        localMatch?.pdfFileName ||
        fallback?.pdfFileName ||
        '';

      const pdfFileUrl =
        row.pdf_content?.pdfFileUrl ||
        row.video_tutorial?.pdfFileUrl ||
        row.pdf_file_url ||
        localMatch?.pdfFileUrl ||
        fallback?.pdfFileUrl ||
        '';

      const pdfFileKey =
        row.pdf_content?.pdfFileKey ||
        row.video_tutorial?.pdfFileKey ||
        row.pdf_file_key ||
        localMatch?.pdfFileKey ||
        fallback?.pdfFileKey ||
        '';

      const videoTutorial = row.video_tutorial || (fallback ? fallback.videoTutorial : {
        title: `Video Pembelajaran: ${row.title}`,
        youtubeId: 'qC03y3jV3pE',
        durationSeconds: 2700,
        description: row.description,
        checkpoints: [],
        chaptersList: [],
        keyTakeaways: [],
      });

      return {
        id: Number(row.id),
        number: row.number || (fallback ? fallback.number : '01'),
        title: row.title || (fallback ? fallback.title : 'Judul Materi'),
        shortTitle: row.short_title || (fallback ? fallback.shortTitle : row.title?.slice(0, 30) || ''),
        subtitle: row.subtitle || (fallback ? fallback.subtitle : ''),
        semester: Number(row.semester) || (fallback ? fallback.semester : 1),
        durationMinutes: Number(row.duration_minutes) || (fallback ? fallback.durationMinutes : 45),
        description: row.description || (fallback ? fallback.description : ''),
        colorScheme: fallback ? fallback.colorScheme : {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          badge: 'bg-emerald-600',
          accent: 'emerald',
        },
        learningObjectives: row.learning_objectives || (fallback ? fallback.learningObjectives : []),
        dalilUtama: {
          surah: row.dalil_surah || (fallback ? fallback.dalilUtama.surah : ''),
          arabic: row.dalil_arabic || (fallback ? fallback.dalilUtama.arabic : ''),
          transliteration: row.dalil_transliteration || (fallback ? fallback.dalilUtama.transliteration : ''),
          translation: row.dalil_translation || (fallback ? fallback.dalilUtama.translation : ''),
        },
        pdfFileName,
        pdfFileUrl,
        pdfFileKey,
        ebookPages: row.ebook_pages || (fallback ? fallback.ebookPages : []),
        pdfContent: {
          ...(fallback?.pdfContent || {}),
          ...(row.pdf_content || {}),
          moduleTitle: row.pdf_content?.moduleTitle || row.title || fallback?.pdfContent?.moduleTitle || 'Materi Pembelajaran',
          author: row.pdf_content?.author || fallback?.pdfContent?.author || 'Tim MGMP PAI & Budi Pekerti',
          schoolLevel: row.pdf_content?.schoolLevel || fallback?.pdfContent?.schoolLevel || 'SMA / SMK / MA Kelas 11',
          totalStudyHours: row.pdf_content?.totalStudyHours || fallback?.pdfContent?.totalStudyHours || `${row.duration_minutes || 45} Menit (2 JP)`,
          summaryPoints: row.pdf_content?.summaryPoints || fallback?.pdfContent?.summaryPoints || row.learning_objectives || [],
          caseStudies: row.pdf_content?.caseStudies || fallback?.pdfContent?.caseStudies || [],
          pdfFileName,
          pdfFileUrl,
          pdfFileKey,
        },
        videoTutorial: {
          ...videoTutorial,
          pdfFileName,
          pdfFileUrl,
          pdfFileKey,
        },
        pretest: row.pretest_questions || (fallback ? fallback.pretest : []),
        posttest: row.posttest_questions || (fallback ? fallback.posttest : []),
      };
    });

    // Supabase adalah sumber kebenaran (source of truth).
    // Simpan remoteChapters langsung ke localStorage sehingga materi yang dihapus di DB tidak muncul lagi
    const finalChapters = remoteChapters.sort((a, b) => a.id - b.id);
    saveStoredChapters(finalChapters);
    return finalChapters;
  } catch (err) {
    console.warn('Failed to sync chapters from Supabase, keeping cached version:', err);
    return getStoredChapters();
  }
};
