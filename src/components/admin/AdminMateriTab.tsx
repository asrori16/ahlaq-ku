import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  FileText, 
  Video, 
  Upload, 
  CheckCircle2, 
  HelpCircle, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle
} from 'lucide-react';
import { Chapter, Question } from '../../types';
import { 
  addChapter, 
  updateChapter, 
  deleteChapter, 
  updateChapterQuestions 
} from '../../services/chapterService';
import { saveMediaBlob } from '../../services/mediaStorage';

interface AdminMateriTabProps {
  chapters: Chapter[];
  onRefreshChapters: () => void;
  showToast: (msg: string) => void;
}

export const AdminMateriTab: React.FC<AdminMateriTabProps> = ({
  chapters,
  onRefreshChapters,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [semesterFilter, setSemesterFilter] = useState<'all' | '1' | '2'>('all');

  // Modals for Materi
  const [isAddChapterOpen, setIsAddChapterOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Dedicated Quick Assessment Manager Modal per Chapter
  const [managingAssessmentChapter, setManagingAssessmentChapter] = useState<Chapter | null>(null);

  // Sub-modal for drafting / editing a single Question
  const [isQuestionEditorOpen, setIsQuestionEditorOpen] = useState(false);
  const [questionEditorTarget, setQuestionEditorTarget] = useState<'chapter-form' | 'quick-manager'>('chapter-form');
  const [editingQuestionIndexInForm, setEditingQuestionIndexInForm] = useState<number | null>(null);
  const [editingQuestionInManager, setEditingQuestionInManager] = useState<Question | null>(null);

  // Question Editor Form Fields
  const [qFormText, setQFormText] = useState('');
  const [qFormContext, setQFormContext] = useState('');
  const [qFormOptions, setQFormOptions] = useState<string[]>(['', '', '', '']);
  const [qFormCorrect, setQFormCorrect] = useState<number>(0);
  const [qFormExplanation, setQFormExplanation] = useState('');
  const [qShowDalil, setQShowDalil] = useState(false);
  const [qDalilSource, setQDalilSource] = useState('');
  const [qDalilArabic, setQDalilArabic] = useState('');
  const [qDalilMeaning, setQDalilMeaning] = useState('');
  const [qEditorError, setQEditorError] = useState<string | null>(null);

  // Main Form state for Chapter
  const [chapterForm, setChapterForm] = useState({
    number: '01',
    title: '',
    shortTitle: '',
    subtitle: '',
    semester: 1,
    durationMinutes: 45,
    description: '',
    surah: "QS. Al-Hujurat [49]: 13",
    arabic: "يٰٓاَيُّهَا النَّاسُ اِنَّا خَلَقْنٰكُمْ مِّنْ ذَكَرٍ وَّاُنْثٰى",
    transliteration: "Yā ayyuhan-nāsu innā khalaqnākum min dzakariw wa unṡā",
    translation: "Wahai manusia! Sungguh, Kami telah menciptakan kamu dari seorang laki-laki dan seorang perempuan.",
    objectivesText: '',
    pdfFileName: '',
    pdfFileUrl: '',
    pdfFileKey: '',
    videoSourceType: 'upload' as 'upload' | 'youtube',
    videoFileName: '',
    videoUrl: '',
    videoFileKey: '',
    youtubeId: 'qC03y3jV3pE',
    subsectionsContent: '',
    assessmentQuestions: [] as Question[],
  });

  // Selected file objects from input
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  // Helper to get option letter A, B, C, D
  const getOptionLetter = (idx: number) => String.fromCharCode(65 + idx);

  // ================= OPEN ADD CHAPTER MODAL =================
  const handleOpenAddChapter = () => {
    setEditingChapter(null);
    setSelectedPdfFile(null);
    setSelectedVideoFile(null);
    setVideoPreviewUrl(null);

    const nextNum = chapters.length > 0 
      ? Math.max(...chapters.map((c) => parseInt(c.number, 10) || c.id)) + 1 
      : 1;
    const formattedNext = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;

    const starterQuestion: Question = {
      id: Date.now(),
      question: 'Apa hikmah dan tujuan utama mengamalkan nilai-nilai akhlak mulia dalam materi ini?',
      options: [
        'Membentuk akhlakul karimah dan memperkuat ketakwaan kepada Allah SWT',
        'Mencari pujian dan pengakuan kehormatan dari sesama manusia',
        'Sekadar memenuhi formalitas dan hafalan materi ujian sekolah',
        'Menunjukkan keunggulan wawasan pribadi di hadapan khalayak',
      ],
      correctAnswer: 0,
      explanation: 'Setiap pembelajaran akhlak Islam bertujuan menanamkan ketakwaan tulus serta pembentukan budi pekerti luhur dalam keseharian.',
    };

    setChapterForm({
      number: formattedNext,
      title: '',
      shortTitle: '',
      subtitle: '',
      semester: 1,
      durationMinutes: 45,
      description: '',
      surah: "QS. Al-Isra' [17]: 32",
      arabic: "وَلَا تَقْرَبُوا الزِّنٰىٓ اِنَّهٗ كَانَ فَاحِشَةً ۗوَسَاۤءَ سَبِيْلًا",
      transliteration: "Wa lā taqrabuz-zinā innahū kāna fāḥisyah",
      translation: "Dan janganlah kamu mendekati zina; (zina) itu sungguh suatu perbuatan keji.",
      objectivesText: "Menganalisis dalil syariat terkait materi.\nMemahami hikmah dan implementasi bagi remaja SMA.\nMenjaga adab islami dalam kehidupan sehari-hari.",
      pdfFileName: '',
      pdfFileUrl: '',
      pdfFileKey: '',
      videoSourceType: 'upload',
      videoFileName: '',
      videoUrl: '',
      videoFileKey: '',
      youtubeId: 'qC03y3jV3pE',
      subsectionsContent: '',
      assessmentQuestions: [starterQuestion],
    });
    setIsAddChapterOpen(true);
  };

  // ================= OPEN EDIT CHAPTER MODAL =================
  const handleOpenEditChapter = (ch: Chapter) => {
    setEditingChapter(ch);
    setSelectedPdfFile(null);
    setSelectedVideoFile(null);
    setVideoPreviewUrl(ch.videoTutorial.videoUrl || null);

    const existingQuestions = (ch.pretest && ch.pretest.length > 0)
      ? ch.pretest
      : (ch.posttest && ch.posttest.length > 0)
        ? ch.posttest
        : [];

    setChapterForm({
      number: ch.number,
      title: ch.title,
      shortTitle: ch.shortTitle,
      subtitle: ch.subtitle,
      semester: ch.semester,
      durationMinutes: ch.durationMinutes,
      description: ch.description,
      surah: ch.dalilUtama.surah,
      arabic: ch.dalilUtama.arabic,
      transliteration: ch.dalilUtama.transliteration,
      translation: ch.dalilUtama.translation,
      objectivesText: ch.learningObjectives.join('\n'),
      pdfFileName: ch.pdfFileName || '',
      pdfFileUrl: ch.pdfFileUrl || '',
      pdfFileKey: ch.pdfFileKey || '',
      videoSourceType: ch.videoTutorial.videoUrl || ch.videoTutorial.videoFileKey ? 'upload' : 'youtube',
      videoFileName: ch.videoTutorial.videoFileName || '',
      videoUrl: ch.videoTutorial.videoUrl || '',
      videoFileKey: ch.videoTutorial.videoFileKey || '',
      youtubeId: ch.videoTutorial.youtubeId || '',
      subsectionsContent: ch.ebookPages[0]?.subsections[0]?.content.join('\n\n') || '',
      assessmentQuestions: [...existingQuestions],
    });
    setIsAddChapterOpen(true);
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedPdfFile(file);
      setChapterForm((prev) => ({
        ...prev,
        pdfFileName: file.name,
      }));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedVideoFile(file);
      const tempUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(tempUrl);
      setChapterForm((prev) => ({
        ...prev,
        videoFileName: file.name,
      }));
    }
  };

  const handleRemovePdf = () => {
    setSelectedPdfFile(null);
    setChapterForm((prev) => ({
      ...prev,
      pdfFileName: '',
      pdfFileUrl: '',
      pdfFileKey: '',
    }));
  };

  const handleRemoveVideo = () => {
    setSelectedVideoFile(null);
    setVideoPreviewUrl(null);
    setChapterForm((prev) => ({
      ...prev,
      videoFileName: '',
      videoUrl: '',
      videoFileKey: '',
    }));
  };

  // ================= SAVE CHAPTER =================
  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterForm.title.trim()) {
      showToast('Judul materi wajib diisi');
      return;
    }
    if (!chapterForm.number.trim()) {
      showToast('Nomor Bab wajib diisi');
      return;
    }

    setIsSaving(true);
    try {
      let finalPdfFileKey = chapterForm.pdfFileKey;
      let finalPdfFileUrl = chapterForm.pdfFileUrl;
      let finalPdfFileName = chapterForm.pdfFileName;

      if (selectedPdfFile) {
        const pdfKey = `pdf_${Date.now()}_${selectedPdfFile.name.replace(/\s+/g, '_')}`;
        finalPdfFileUrl = await saveMediaBlob(pdfKey, selectedPdfFile);
        finalPdfFileKey = pdfKey;
        finalPdfFileName = selectedPdfFile.name;
      }

      let finalVideoFileKey = chapterForm.videoFileKey;
      let finalVideoUrl = chapterForm.videoUrl;
      let finalVideoFileName = chapterForm.videoFileName;

      if (selectedVideoFile) {
        const videoKey = `video_${Date.now()}_${selectedVideoFile.name.replace(/\s+/g, '_')}`;
        finalVideoUrl = await saveMediaBlob(videoKey, selectedVideoFile);
        finalVideoFileKey = videoKey;
        finalVideoFileName = selectedVideoFile.name;
      }

      if (editingChapter) {
        updateChapter(editingChapter.id, {
          number: chapterForm.number.trim(),
          title: chapterForm.title.trim(),
          shortTitle: chapterForm.shortTitle || chapterForm.title.slice(0, 30),
          subtitle: chapterForm.subtitle,
          semester: Number(chapterForm.semester),
          durationMinutes: Number(chapterForm.durationMinutes) || 45,
          description: chapterForm.description,
          pdfFileName: finalPdfFileName,
          pdfFileUrl: finalPdfFileUrl,
          pdfFileKey: finalPdfFileKey,
          dalilUtama: {
            surah: chapterForm.surah,
            arabic: chapterForm.arabic,
            transliteration: chapterForm.transliteration,
            translation: chapterForm.translation,
          },
          videoTutorial: {
            title: `Video Pembelajaran: ${chapterForm.title}`,
            youtubeId: chapterForm.youtubeId?.trim() || 'qC03y3jV3pE',
            videoUrl: chapterForm.videoSourceType === 'upload' ? finalVideoUrl : undefined,
            videoFileName: chapterForm.videoSourceType === 'upload' ? finalVideoFileName : undefined,
            videoFileKey: chapterForm.videoSourceType === 'upload' ? finalVideoFileKey : undefined,
            videoSourceType: chapterForm.videoSourceType,
            durationSeconds: (Number(chapterForm.durationMinutes) || 45) * 60,
            description: chapterForm.description,
            checkpoints: editingChapter.videoTutorial.checkpoints || [],
            chaptersList: editingChapter.videoTutorial.chaptersList || [],
            keyTakeaways: editingChapter.videoTutorial.keyTakeaways || [],
          },
          questions: chapterForm.assessmentQuestions,
        });
        showToast(`Bab ${chapterForm.number} berhasil diperbarui`);
      } else {
        addChapter({
          number: chapterForm.number.trim(),
          title: chapterForm.title.trim(),
          shortTitle: chapterForm.shortTitle,
          subtitle: chapterForm.subtitle,
          semester: Number(chapterForm.semester),
          durationMinutes: Number(chapterForm.durationMinutes) || 45,
          description: chapterForm.description,
          surah: chapterForm.surah,
          arabic: chapterForm.arabic,
          transliteration: chapterForm.transliteration,
          translation: chapterForm.translation,
          objectivesText: chapterForm.objectivesText,
          pdfFileName: finalPdfFileName,
          pdfFileUrl: finalPdfFileUrl,
          pdfFileKey: finalPdfFileKey,
          videoSourceType: chapterForm.videoSourceType,
          videoUrl: chapterForm.videoSourceType === 'upload' ? finalVideoUrl : undefined,
          videoFileName: chapterForm.videoSourceType === 'upload' ? finalVideoFileName : undefined,
          videoFileKey: chapterForm.videoSourceType === 'upload' ? finalVideoFileKey : undefined,
          youtubeId: chapterForm.youtubeId,
          subsectionsContent: chapterForm.subsectionsContent,
          questions: chapterForm.assessmentQuestions,
        });
        showToast(`Bab ${chapterForm.number} berhasil ditambahkan`);
      }

      setIsAddChapterOpen(false);
      onRefreshChapters();
    } catch (err) {
      console.error('Error saving chapter:', err);
      showToast('Gagal menyimpan materi');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteChapter = (ch: Chapter) => {
    if (confirm(`Hapus Bab ${ch.number}: "${ch.title}"?`)) {
      deleteChapter(ch.id);
      showToast(`Bab ${ch.number} telah dihapus`);
      onRefreshChapters();
    }
  };

  // ================= QUESTION EDITOR LOGIC =================
  const resetQuestionEditor = () => {
    setQFormText('');
    setQFormContext('');
    setQFormOptions(['', '', '', '']);
    setQFormCorrect(0);
    setQFormExplanation('');
    setQShowDalil(false);
    setQDalilSource('');
    setQDalilArabic('');
    setQDalilMeaning('');
    setQEditorError(null);
    setEditingQuestionIndexInForm(null);
    setEditingQuestionInManager(null);
  };

  const handleOpenAddQuestionInForm = () => {
    resetQuestionEditor();
    setQuestionEditorTarget('chapter-form');
    setIsQuestionEditorOpen(true);
  };

  const handleOpenEditQuestionInForm = (idx: number) => {
    const q = chapterForm.assessmentQuestions[idx];
    if (!q) return;
    setQuestionEditorTarget('chapter-form');
    setEditingQuestionIndexInForm(idx);
    setQFormText(q.question);
    setQFormContext(q.context || '');
    setQFormOptions(q.options && q.options.length >= 4 ? [...q.options] : [
      q.options?.[0] || '',
      q.options?.[1] || '',
      q.options?.[2] || '',
      q.options?.[3] || '',
    ]);
    setQFormCorrect(q.correctAnswer ?? 0);
    setQFormExplanation(q.explanation || '');
    if (q.dalil && (q.dalil.source || q.dalil.arabic || q.dalil.meaning)) {
      setQShowDalil(true);
      setQDalilSource(q.dalil.source || '');
      setQDalilArabic(q.dalil.arabic || '');
      setQDalilMeaning(q.dalil.meaning || '');
    } else {
      setQShowDalil(false);
    }
    setQEditorError(null);
    setIsQuestionEditorOpen(true);
  };

  const handleDeleteQuestionInForm = (idx: number) => {
    const updated = chapterForm.assessmentQuestions.filter((_, i) => i !== idx);
    setChapterForm((prev) => ({
      ...prev,
      assessmentQuestions: updated,
    }));
    showToast('Soal dihapus dari bab');
  };

  const handleOpenAddQuestionInManager = () => {
    resetQuestionEditor();
    setQuestionEditorTarget('quick-manager');
    setIsQuestionEditorOpen(true);
  };

  const handleOpenEditQuestionInManager = (q: Question) => {
    setQuestionEditorTarget('quick-manager');
    setEditingQuestionInManager(q);
    setQFormText(q.question);
    setQFormContext(q.context || '');
    setQFormOptions(q.options && q.options.length >= 4 ? [...q.options] : [
      q.options?.[0] || '',
      q.options?.[1] || '',
      q.options?.[2] || '',
      q.options?.[3] || '',
    ]);
    setQFormCorrect(q.correctAnswer ?? 0);
    setQFormExplanation(q.explanation || '');
    if (q.dalil && (q.dalil.source || q.dalil.arabic || q.dalil.meaning)) {
      setQShowDalil(true);
      setQDalilSource(q.dalil.source || '');
      setQDalilArabic(q.dalil.arabic || '');
      setQDalilMeaning(q.dalil.meaning || '');
    } else {
      setQShowDalil(false);
    }
    setQEditorError(null);
    setIsQuestionEditorOpen(true);
  };

  const handleDuplicateQuestionInManager = (q: Question) => {
    if (!managingAssessmentChapter) return;
    const currentList = managingAssessmentChapter.pretest || managingAssessmentChapter.posttest || [];
    const duplicated: Question = {
      ...q,
      id: Date.now(),
      question: `${q.question} (Salinan)`,
      options: [...q.options],
      dalil: q.dalil ? { ...q.dalil } : undefined,
    };
    const updatedList = [...currentList, duplicated];
    updateChapterQuestions(managingAssessmentChapter.id, updatedList);
    onRefreshChapters();
    setManagingAssessmentChapter({
      ...managingAssessmentChapter,
      pretest: updatedList,
      posttest: updatedList,
    });
    showToast('Soal berhasil diduplikasi');
  };

  const handleDeleteQuestionInManager = (qId: number) => {
    if (!managingAssessmentChapter) return;
    const currentList = managingAssessmentChapter.pretest || managingAssessmentChapter.posttest || [];
    const updatedList = currentList.filter((q) => q.id !== qId);
    updateChapterQuestions(managingAssessmentChapter.id, updatedList);
    onRefreshChapters();
    setManagingAssessmentChapter({
      ...managingAssessmentChapter,
      pretest: updatedList,
      posttest: updatedList,
    });
    showToast('Soal dihapus');
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();

    if (!qFormText.trim()) {
      setQEditorError('Pertanyaan wajib diisi.');
      return;
    }
    if (qFormOptions.some((opt) => !opt.trim())) {
      setQEditorError('Semua 4 pilihan jawaban harus diisi.');
      return;
    }
    if (!qFormExplanation.trim()) {
      setQEditorError('Pembahasan kunci jawaban wajib diisi.');
      return;
    }

    const questionObj: Question = {
      id: questionEditorTarget === 'quick-manager' && editingQuestionInManager
        ? editingQuestionInManager.id
        : Date.now(),
      question: qFormText.trim(),
      context: qFormContext.trim() ? qFormContext.trim() : undefined,
      options: qFormOptions.map((o) => o.trim()),
      correctAnswer: qFormCorrect,
      explanation: qFormExplanation.trim(),
      dalil: (qDalilSource.trim() || qDalilArabic.trim() || qDalilMeaning.trim()) ? {
        source: qDalilSource.trim(),
        arabic: qDalilArabic.trim() ? qDalilArabic.trim() : undefined,
        meaning: qDalilMeaning.trim(),
      } : undefined,
    };

    if (questionEditorTarget === 'chapter-form') {
      if (editingQuestionIndexInForm !== null) {
        const updated = [...chapterForm.assessmentQuestions];
        updated[editingQuestionIndexInForm] = questionObj;
        setChapterForm((prev) => ({ ...prev, assessmentQuestions: updated }));
        showToast('Soal diperbarui');
      } else {
        setChapterForm((prev) => ({
          ...prev,
          assessmentQuestions: [...prev.assessmentQuestions, questionObj],
        }));
        showToast('Soal ditambahkan');
      }
    } else {
      if (!managingAssessmentChapter) return;
      const currentList = managingAssessmentChapter.pretest || managingAssessmentChapter.posttest || [];
      let updatedList: Question[];

      if (editingQuestionInManager) {
        updatedList = currentList.map((q) => q.id === editingQuestionInManager.id ? questionObj : q);
      } else {
        updatedList = [...currentList, questionObj];
      }

      updateChapterQuestions(managingAssessmentChapter.id, updatedList);
      onRefreshChapters();
      setManagingAssessmentChapter({
        ...managingAssessmentChapter,
        pretest: updatedList,
        posttest: updatedList,
      });
      showToast('Soal berhasil disimpan');
    }

    setIsQuestionEditorOpen(false);
    resetQuestionEditor();
  };

  const filteredChapters = chapters.filter((c) => {
    const matchSem = semesterFilter === 'all' || c.semester === Number(semesterFilter);
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSem && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* ================= CLEAN ACTION & FILTER BAR ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-800"
            />
          </div>

          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value as 'all' | '1' | '2')}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="all">Semua Semester</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleOpenAddChapter}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Bab</span>
        </button>
      </div>

      {/* ================= CLEAN CHAPTER LIST CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredChapters.map((ch) => {
          const hasUploadedPdf = Boolean(ch.pdfFileName || ch.pdfFileUrl || ch.pdfFileKey);
          const hasUploadedVideo = Boolean(ch.videoTutorial.videoFileName || ch.videoTutorial.videoUrl || ch.videoTutorial.videoFileKey);
          const questionCount = ch.pretest?.length || ch.posttest?.length || 0;

          return (
            <div
              key={ch.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-2">
                {/* Header row: Bab badge & Semester */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200/60">
                      Bab {ch.number}
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-slate-500 font-medium text-[11px]">
                      Semester {ch.semester}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {ch.durationMinutes} menit
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {ch.subtitle || ch.description}
                  </p>
                </div>

                {/* Subtle meta indicators */}
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 flex-wrap">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {questionCount} Soal
                  </span>
                  {hasUploadedPdf && (
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded flex items-center gap-1">
                      <FileText className="w-3 h-3 text-slate-500" />
                      PDF
                    </span>
                  )}
                  {hasUploadedVideo && (
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded flex items-center gap-1">
                      <Video className="w-3 h-3 text-slate-500" />
                      Video
                    </span>
                  )}
                  {ch.dalilUtama.surah && (
                    <span className="text-slate-400 truncate max-w-[180px]">
                      {ch.dalilUtama.surah}
                    </span>
                  )}
                </div>
              </div>

              {/* Clean Action buttons */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setManagingAssessmentChapter(ch)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Soal ({questionCount})</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditChapter(ch)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteChapter(ch)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Hapus Bab"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredChapters.length === 0 && (
        <div className="bg-white p-8 text-center rounded-xl border border-slate-200 text-slate-400 text-xs">
          Tidak ada materi yang sesuai.
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: TAMBAH / EDIT BAB MATERI (DILENGKAPI INPUT ASESMEN)              */}
      {/* ========================================================================= */}
      {isAddChapterOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-5 sm:p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4 sticky top-0 bg-white z-10">
              <h2 className="text-base font-bold text-slate-900">
                {editingChapter ? `Edit Bab ${editingChapter.number}` : 'Tambah Bab Baru'}
              </h2>
              <button
                type="button"
                onClick={() => setIsAddChapterOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChapter} className="space-y-4 text-xs sm:text-sm">
              {/* Identitas Bab */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Bab *
                  </label>
                  <input
                    type="text"
                    value={chapterForm.number}
                    onChange={(e) => setChapterForm({ ...chapterForm, number: e.target.value })}
                    placeholder="01"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold text-center focus:ring-1 focus:ring-emerald-600"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Judul Bab *
                  </label>
                  <input
                    type="text"
                    value={chapterForm.title}
                    onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                    placeholder="Contoh: Menjaga Kehormatan Diri (Iffah)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 text-slate-900 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Semester
                  </label>
                  <select
                    value={chapterForm.semester}
                    onChange={(e) => setChapterForm({ ...chapterForm, semester: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Topik Singkat
                  </label>
                  <input
                    type="text"
                    value={chapterForm.shortTitle}
                    onChange={(e) => setChapterForm({ ...chapterForm, shortTitle: e.target.value })}
                    placeholder="Contoh: Iffah & Batas Pergaulan"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Durasi (Menit)
                  </label>
                  <input
                    type="number"
                    value={chapterForm.durationMinutes}
                    onChange={(e) => setChapterForm({ ...chapterForm, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subjudul
                </label>
                <input
                  type="text"
                  value={chapterForm.subtitle}
                  onChange={(e) => setChapterForm({ ...chapterForm, subtitle: e.target.value })}
                  placeholder="Gambaran singkat materi..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={2}
                  value={chapterForm.description}
                  onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
                  placeholder="Uraian ringkas tujuan dan materi bab..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              {/* Upload PDF */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <span className="text-xs font-semibold text-slate-800 block">
                  Modul Dokumen PDF
                </span>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-slate-300 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-xs text-slate-700">
                      {selectedPdfFile ? selectedPdfFile.name : chapterForm.pdfFileName ? `Ganti File (${chapterForm.pdfFileName})` : 'Pilih Berkas PDF (.pdf)'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handlePdfChange}
                      className="hidden"
                    />
                  </label>

                  {(selectedPdfFile || chapterForm.pdfFileName) && (
                    <button
                      type="button"
                      onClick={handleRemovePdf}
                      className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>

              {/* Video Pembelajaran */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">
                    Video Pembelajaran
                  </span>
                  <div className="flex items-center bg-white p-0.5 rounded-md border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setChapterForm({ ...chapterForm, videoSourceType: 'upload' })}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        chapterForm.videoSourceType === 'upload'
                          ? 'bg-emerald-700 text-white'
                          : 'text-slate-600'
                      }`}
                    >
                      Upload MP4
                    </button>
                    <button
                      type="button"
                      onClick={() => setChapterForm({ ...chapterForm, videoSourceType: 'youtube' })}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        chapterForm.videoSourceType === 'youtube'
                          ? 'bg-emerald-700 text-white'
                          : 'text-slate-600'
                      }`}
                    >
                      YouTube
                    </button>
                  </div>
                </div>

                {chapterForm.videoSourceType === 'upload' ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-slate-300 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-slate-600" />
                        <span className="text-xs text-slate-700">
                          {selectedVideoFile ? selectedVideoFile.name : chapterForm.videoFileName ? `Ganti Video (${chapterForm.videoFileName})` : 'Pilih Berkas MP4 (.mp4)'}
                        </span>
                        <input
                          type="file"
                          accept="video/mp4,video/*"
                          onChange={handleVideoChange}
                          className="hidden"
                        />
                      </label>

                      {(selectedVideoFile || chapterForm.videoFileName) && (
                        <button
                          type="button"
                          onClick={handleRemoveVideo}
                          className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          Hapus
                        </button>
                      )}
                    </div>

                    {videoPreviewUrl && (
                      <div className="mt-2 bg-slate-900 rounded-lg overflow-hidden p-2">
                        <video
                          src={videoPreviewUrl}
                          controls
                          className="w-full max-h-36 rounded bg-black"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={chapterForm.youtubeId}
                      onChange={(e) => setChapterForm({ ...chapterForm, youtubeId: e.target.value })}
                      placeholder="ID Video atau Tautan YouTube..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono text-xs focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                )}
              </div>

              {/* Dalil Utama */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <span className="text-xs font-semibold text-slate-800 block">
                  Dalil Al-Qur&apos;an / Hadits
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={chapterForm.surah}
                    onChange={(e) => setChapterForm({ ...chapterForm, surah: e.target.value })}
                    placeholder="Nama Surah / Hadis"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                  />
                  <input
                    type="text"
                    value={chapterForm.transliteration}
                    onChange={(e) => setChapterForm({ ...chapterForm, transliteration: e.target.value })}
                    placeholder="Transliterasi Latin"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                  />
                </div>

                <input
                  type="text"
                  dir="rtl"
                  value={chapterForm.arabic}
                  onChange={(e) => setChapterForm({ ...chapterForm, arabic: e.target.value })}
                  placeholder="Teks Arab..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-arabic text-sm text-right"
                />

                <textarea
                  rows={2}
                  value={chapterForm.translation}
                  onChange={(e) => setChapterForm({ ...chapterForm, translation: e.target.value })}
                  placeholder="Arti terjemahan..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                />
              </div>

              {/* Soal Asesmen */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">
                    Soal Asesmen ({chapterForm.assessmentQuestions.length})
                  </span>

                  <button
                    type="button"
                    onClick={handleOpenAddQuestionInForm}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Soal</span>
                  </button>
                </div>

                {chapterForm.assessmentQuestions.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2 text-center">Belum ada butir soal.</p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {chapterForm.assessmentQuestions.map((q, idx) => (
                      <div
                        key={q.id || idx}
                        className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">
                            Soal {idx + 1} &bull; Kunci: {getOptionLetter(q.correctAnswer)}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditQuestionInForm(idx)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                              title="Edit Soal"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuestionInForm(idx)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                              title="Hapus Soal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2">
                          {q.question}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 sticky bottom-0 bg-white">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsAddChapterOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: QUICK ASESMEN MANAGER PER BAB                                    */}
      {/* ========================================================================= */}
      {managingAssessmentChapter && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-5 shadow-xl border border-slate-200 max-h-[90vh] flex flex-col my-auto overflow-hidden">
            {/* Clean Header */}
            <div className="pb-3 border-b border-slate-200 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Soal Bab {managingAssessmentChapter.number}: {managingAssessmentChapter.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {(managingAssessmentChapter.pretest || []).length} butir soal
                </p>
              </div>

              <button
                type="button"
                onClick={() => setManagingAssessmentChapter(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-bar Actions */}
            <div className="py-2.5 flex items-center justify-end">
              <button
                type="button"
                onClick={handleOpenAddQuestionInManager}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Soal</span>
              </button>
            </div>

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto py-2 space-y-3 pr-1">
              {(!managingAssessmentChapter.pretest || managingAssessmentChapter.pretest.length === 0) ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Belum ada soal pada bab ini.
                </div>
              ) : (
                (managingAssessmentChapter.pretest || []).map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="bg-white rounded-lg border border-slate-200 p-3.5 space-y-2.5 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-800">
                        Soal {idx + 1}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDuplicateQuestionInManager(q)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                          title="Duplikat"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditQuestionInManager(q)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestionInManager(q.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {q.context && (
                      <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded border-l-2 border-slate-300">
                        {q.context}
                      </p>
                    )}

                    <p className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed">
                      {q.question}
                    </p>

                    {/* 4 Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                      {(q.options || []).map((opt, oIdx) => {
                        const isCorrect = q.correctAnswer === oIdx;
                        return (
                          <div
                            key={oIdx}
                            className={`p-2 rounded border flex items-start gap-1.5 ${
                              isCorrect
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            <span className="font-bold text-[11px] shrink-0">
                              {getOptionLetter(oIdx)}.
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isCorrect && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">Pembahasan: </span>
                      {q.explanation}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setManagingAssessmentChapter(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDITOR BUTIR SOAL                                                */}
      {/* ========================================================================= */}
      {isQuestionEditorOpen && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-xl w-full max-h-[88vh] flex flex-col my-auto overflow-hidden shadow-xl border border-slate-200">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {editingQuestionIndexInForm !== null || editingQuestionInManager ? 'Edit Soal' : 'Tambah Soal Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsQuestionEditorOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveQuestion} className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
              {qEditorError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{qEditorError}</span>
                </div>
              )}

              {/* Question Text */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Pertanyaan *
                </label>
                <textarea
                  rows={3}
                  value={qFormText}
                  onChange={(e) => setQFormText(e.target.value)}
                  placeholder="Teks pertanyaan..."
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-slate-900"
                  required
                />
              </div>

              {/* Context */}
              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  Konteks / Studi Kasus (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={qFormContext}
                  onChange={(e) => setQFormContext(e.target.value)}
                  placeholder="Konteks cerita atau kasus..."
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-slate-900"
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="block font-semibold text-slate-800">
                  Pilihan Jawaban (A-D) *
                </label>

                {qFormOptions.map((opt, idx) => {
                  const isChecked = qFormCorrect === idx;
                  const letter = getOptionLetter(idx);
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 p-1.5 rounded-lg border ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50/40'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setQFormCorrect(idx)}
                        className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs cursor-pointer shrink-0 ${
                          isChecked
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title="Klik untuk jadikan kunci jawaban"
                      >
                        {letter}
                      </button>

                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...qFormOptions];
                          updated[idx] = e.target.value;
                          setQFormOptions(updated);
                        }}
                        placeholder={`Pilihan ${letter}...`}
                        className="flex-1 text-xs bg-transparent border-0 focus:outline-none text-slate-900 font-medium"
                        required
                      />

                      {isChecked && (
                        <span className="text-[10px] font-semibold text-emerald-700 px-1.5">
                          Kunci Benar
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Pembahasan Kunci *
                </label>
                <textarea
                  rows={2}
                  value={qFormExplanation}
                  onChange={(e) => setQFormExplanation(e.target.value)}
                  placeholder="Penjelasan jawaban benar..."
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-slate-900"
                  required
                />
              </div>

              {/* Accordion: Dalil Pendukung */}
              <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setQShowDalil(!qShowDalil)}
                  className="w-full flex items-center justify-between text-left font-medium text-slate-700 cursor-pointer"
                >
                  <span>Dalil Pendukung (Opsional)</span>
                  {qShowDalil ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {qShowDalil && (
                  <div className="mt-2.5 space-y-2 pt-2 border-t border-slate-200">
                    <input
                      type="text"
                      value={qDalilSource}
                      onChange={(e) => setQDalilSource(e.target.value)}
                      placeholder="Sumber Dalil (misal: QS. Al-Isra [17]: 32)"
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md text-slate-900"
                    />

                    <input
                      type="text"
                      dir="rtl"
                      value={qDalilArabic}
                      onChange={(e) => setQDalilArabic(e.target.value)}
                      placeholder="Teks Arab..."
                      className="w-full text-xs font-arabic p-2 bg-white border border-slate-300 rounded-md text-slate-900 text-right"
                    />

                    <textarea
                      rows={2}
                      value={qDalilMeaning}
                      onChange={(e) => setQDalilMeaning(e.target.value)}
                      placeholder="Arti dalil..."
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md text-slate-900"
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2.5 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuestionEditorOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                >
                  Simpan Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
