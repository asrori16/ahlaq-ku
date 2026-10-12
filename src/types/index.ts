export interface Question {
  id: number;
  question: string;
  context?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  dalil?: {
    arabic?: string;
    source: string;
    meaning: string;
  };
}

export interface Chapter {
  id: number;
  number: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  semester: number;
  description: string;
  colorScheme: {
    bg: string;
    border: string;
    badge: string;
    accent: string;
  };
  durationMinutes: number;
  learningObjectives: string[];
  dalilUtama: {
    surah: string;
    arabic: string;
    transliteration: string;
    translation: string;
  };
  ebookPages: {
    pageNumber: number;
    title: string;
    subsections: {
      heading: string;
      content: string[];
      highlightQuote?: string;
      arabicQuote?: {
        text: string;
        source: string;
        meaning: string;
      };
      practicalTips?: string[];
    }[];
  }[];
  pdfContent: {
    moduleTitle: string;
    author: string;
    schoolLevel: string;
    totalStudyHours: string;
    summaryPoints: string[];
    caseStudies: {
      caseTitle: string;
      story: string;
      discussionQuestions: string[];
    }[];
  };
  videoTutorial: {
    title: string;
    youtubeId: string; // valid YouTube embed ID or fallback direct player
    durationSeconds: number;
    description: string;
    checkpoints: {
      timestampSeconds: number;
      label: string;
      questionPrompt: string;
      options: string[];
      correctOption: number;
      explanation: string;
    }[];
    chaptersList: {
      time: string;
      seconds: number;
      title: string;
    }[];
    keyTakeaways: string[];
  };
  pretest: Question[];
  posttest: Question[];
}

export interface AssessmentRecord {
  id: string;
  studentName: string;
  chapterId: number;
  chapterTitle: string;
  pretestScore: number;
  posttestScore: number;
  nGainScore: number;
  passed: boolean;
  timestamp: string;
  answersSummary?: {
    pretestAnswers: number[];
    posttestAnswers: number[];
  };
}

export interface StudentNote {
  id: string;
  studentName: string;
  chapterId: number;
  timestampSeconds: number;
  timestampFormatted: string;
  noteText: string;
  createdAt: string;
}

export interface StudentProgress {
  chapterId: number;
  videoWatched: boolean;
  videoWatchPercentage: number;
  pretestCompleted: boolean;
  pretestScore?: number;
  posttestCompleted: boolean;
  posttestScore?: number;
  ebookRead: boolean;
  notesCount: number;
}
