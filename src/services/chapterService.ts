import { Chapter, Question } from '../types';
import { CHAPTERS_DATA } from '../data/chapters';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'akhlaqku_chapters_list';

export const getStoredChapters = (): Chapter[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(CHAPTERS_DATA));
      return CHAPTERS_DATA;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(CHAPTERS_DATA));
      return CHAPTERS_DATA;
    }
    return parsed;
  } catch (e) {
    console.warn('Error reading stored chapters, falling back to default', e);
    return CHAPTERS_DATA;
  }
};

export const saveStoredChapters = (chapters: Chapter[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chapters));
  } catch (e) {
    console.error('Failed to save chapters', e);
  }
};

export const addChapter = (data: {
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
}): Chapter => {
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
    pdfContent: {
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
    },
    videoTutorial: {
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
    },
    pretest: initialQuestions,
    posttest: initialQuestions,
  };

  const updated = [...currentChapters, newChapter];
  saveStoredChapters(updated);

  // Sync insert to Supabase in background
  supabase
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
      video_tutorial: newChapter.videoTutorial,
      pretest_questions: initialQuestions,
      posttest_questions: initialQuestions,
    })
    .then(({ error }) => {
      if (error) console.info('Supabase chapters insert note:', error.message);
    });

  return newChapter;
};

export const updateChapter = (
  id: number,
  data: Partial<Chapter> & { questions?: Question[] }
): boolean => {
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

  current[index] = {
    ...existing,
    ...data,
    ...(synchronizedQuestions !== undefined ? { pretest: synchronizedQuestions, posttest: synchronizedQuestions } : {}),
    number: data.number !== undefined ? data.number.trim() : existing.number,
    videoTutorial: data.videoTutorial
      ? { ...existing.videoTutorial, ...data.videoTutorial }
      : existing.videoTutorial,
  };
  saveStoredChapters(current);

  // Sync update to Supabase in background
  const updatePayload: Record<string, unknown> = {
    title: data.title,
    short_title: data.shortTitle,
    subtitle: data.subtitle,
    semester: data.semester,
    duration_minutes: data.durationMinutes,
    description: data.description,
  };
  if (synchronizedQuestions !== undefined) {
    updatePayload.pretest_questions = synchronizedQuestions;
    updatePayload.posttest_questions = synchronizedQuestions;
  }

  supabase
    .from('chapters')
    .update(updatePayload)
    .eq('id', id)
    .then(({ error }) => {
      if (error) console.info('Supabase chapters update note:', error.message);
    });

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

export const resetChaptersToDefault = (): Chapter[] => {
  saveStoredChapters(CHAPTERS_DATA);
  return CHAPTERS_DATA;
};
