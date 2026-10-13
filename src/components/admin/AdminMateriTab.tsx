import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Clock, 
  Edit, 
  Trash2, 
  Save, 
  X,
  FileText,
  Video,
  Upload,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { Chapter } from '../../types';
import { addChapter, updateChapter, deleteChapter } from '../../services/chapterService';
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

  // Form state for Chapter
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
    // PDF fields
    pdfFileName: '',
    pdfFileUrl: '',
    pdfFileKey: '',
    // Video fields
    videoSourceType: 'upload' as 'upload' | 'youtube',
    videoFileName: '',
    videoUrl: '',
    videoFileKey: '',
    youtubeId: 'qC03y3jV3pE',
    subsectionsContent: '',
  });

  // Selected file objects from input
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  const handleOpenAddChapter = () => {
    setEditingChapter(null);
    setSelectedPdfFile(null);
    setSelectedVideoFile(null);
    setVideoPreviewUrl(null);

    // Compute next suggested BAB number
    const nextNum = chapters.length > 0 
      ? Math.max(...chapters.map((c) => parseInt(c.number, 10) || c.id)) + 1 
      : 1;
    const formattedNext = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;

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
    });
    setIsAddChapterOpen(true);
  };

  const handleOpenEditChapter = (ch: Chapter) => {
    setEditingChapter(ch);
    setSelectedPdfFile(null);
    setSelectedVideoFile(null);
    setVideoPreviewUrl(ch.videoTutorial.videoUrl || null);

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

  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterForm.title.trim()) {
      showToast('Judul materi wajib diisi!');
      return;
    }
    if (!chapterForm.number.trim()) {
      showToast('Nomor BAB wajib diisi!');
      return;
    }

    setIsSaving(true);
    try {
      let finalPdfFileKey = chapterForm.pdfFileKey;
      let finalPdfFileUrl = chapterForm.pdfFileUrl;
      let finalPdfFileName = chapterForm.pdfFileName;

      // Handle PDF upload to IndexedDB
      if (selectedPdfFile) {
        const pdfKey = `pdf_${Date.now()}_${selectedPdfFile.name.replace(/\s+/g, '_')}`;
        finalPdfFileUrl = await saveMediaBlob(pdfKey, selectedPdfFile);
        finalPdfFileKey = pdfKey;
        finalPdfFileName = selectedPdfFile.name;
      }

      let finalVideoFileKey = chapterForm.videoFileKey;
      let finalVideoUrl = chapterForm.videoUrl;
      let finalVideoFileName = chapterForm.videoFileName;

      // Handle Video upload to IndexedDB
      if (selectedVideoFile) {
        const videoKey = `video_${Date.now()}_${selectedVideoFile.name.replace(/\s+/g, '_')}`;
        finalVideoUrl = await saveMediaBlob(videoKey, selectedVideoFile);
        finalVideoFileKey = videoKey;
        finalVideoFileName = selectedVideoFile.name;
      }

      if (editingChapter) {
        // UPDATE BAB & MATERI
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
        });
        showToast(`Bab ${chapterForm.number} "${chapterForm.title}" berhasil diperbarui!`);
      } else {
        // CREATE NEW BAB & MATERI
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
        });
        showToast(`Bab ${chapterForm.number} "${chapterForm.title}" berhasil ditambahkan!`);
      }

      setIsAddChapterOpen(false);
      onRefreshChapters();
    } catch (err) {
      console.error('Error saving chapter:', err);
      showToast('Gagal menyimpan materi. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteChapter = (ch: Chapter) => {
    if (confirm(`Apakah Anda yakin ingin menghapus Bab ${ch.number}: "${ch.title}"?`)) {
      deleteChapter(ch.id);
      showToast(`Bab ${ch.number} "${ch.title}" telah dihapus.`);
      onRefreshChapters();
    }
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
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor bab atau judul materi..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-800"
            />
          </div>

          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value as 'all' | '1' | '2')}
            className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="all">Semua Semester</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleOpenAddChapter}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Bab / Materi Baru</span>
        </button>
      </div>

      {/* Chapter List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChapters.map((ch) => {
          const hasUploadedPdf = Boolean(ch.pdfFileName || ch.pdfFileUrl);
          const hasUploadedVideo = Boolean(ch.videoTutorial.videoFileName || ch.videoTutorial.videoUrl);

          return (
            <div
              key={ch.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    BAB {ch.number} &bull; Semester {ch.semester}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {ch.durationMinutes} Menit
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {ch.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {ch.subtitle || ch.description}
                </p>

                {/* Dalil info */}
                <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600">
                  <span className="font-semibold text-emerald-900 block mb-0.5">
                    {ch.dalilUtama.surah}
                  </span>
                  <p className="font-arabic text-sm text-right text-slate-800 py-1" dir="rtl">
                    {ch.dalilUtama.arabic}
                  </p>
                  <p className="text-[11px] text-slate-500 italic mt-0.5">
                    &quot;{ch.dalilUtama.translation}&quot;
                  </p>
                </div>

                {/* Media Badges */}
                <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px]">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-slate-500" />
                    {ch.ebookPages.length} Halaman E-Book
                  </span>

                  {hasUploadedPdf ? (
                    <span className="bg-rose-50 border border-rose-200 text-rose-700 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                      <FileText className="w-3 h-3 text-rose-600" />
                      PDF: {ch.pdfFileName ? ch.pdfFileName.slice(0, 18) + (ch.pdfFileName.length > 18 ? '...' : '') : 'Tersedia'}
                    </span>
                  ) : (
                    <span className="bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded">
                      PDF Modul Standar
                    </span>
                  )}

                  {hasUploadedVideo ? (
                    <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                      <Video className="w-3 h-3 text-emerald-600" />
                      MP4: {ch.videoTutorial.videoFileName ? ch.videoTutorial.videoFileName.slice(0, 16) + (ch.videoTutorial.videoFileName.length > 16 ? '...' : '') : 'Video MP4'}
                    </span>
                  ) : (
                    <span className="bg-sky-50 border border-sky-200 text-sky-800 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                      <Video className="w-3 h-3 text-sky-600" />
                      YouTube ID: {ch.videoTutorial.youtubeId}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleOpenEditChapter(ch)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5 text-slate-600" />
                  <span>Edit Bab &amp; Materi</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteChapter(ch)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredChapters.length === 0 && (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500">
          <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-2" />
          <p className="font-semibold text-slate-700">Tidak ada materi yang sesuai</p>
          <p className="text-xs text-slate-400 mt-1">Coba ubah kata kunci pencarian atau filter semester.</p>
        </div>
      )}

      {/* ================= MODAL TAMBAH/EDIT BAB MATERI (DILENGKAPI CRUD BAB, UPLOAD PDF & MP4) ================= */}
      {isAddChapterOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-800" />
                <span>{editingChapter ? `Edit Bab ${editingChapter.number}: ${editingChapter.title}` : 'Tambah Bab / Materi Pembelajaran Baru'}</span>
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
              {/* Bagian 1: Identitas BAB & Durasi */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Nomor BAB *
                  </label>
                  <input
                    type="text"
                    value={chapterForm.number}
                    onChange={(e) => setChapterForm({ ...chapterForm, number: e.target.value })}
                    placeholder="Contoh: 01"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold text-center focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5 text-center">Misal: 01, 02</span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Judul Lengkap Materi Bab *
                  </label>
                  <input
                    type="text"
                    value={chapterForm.title}
                    onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                    placeholder="Contoh: Menjaga Kehormatan Diri (Iffah)"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 text-slate-900 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Semester
                  </label>
                  <select
                    value={chapterForm.semester}
                    onChange={(e) => setChapterForm({ ...chapterForm, semester: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Judul Pendek / Topik Singkat
                  </label>
                  <input
                    type="text"
                    value={chapterForm.shortTitle}
                    onChange={(e) => setChapterForm({ ...chapterForm, shortTitle: e.target.value })}
                    placeholder="Contoh: Iffah & Batas Pergaulan"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Durasi Pembelajaran (Menit)
                  </label>
                  <input
                    type="number"
                    value={chapterForm.durationMinutes}
                    onChange={(e) => setChapterForm({ ...chapterForm, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Subjudul & Gambaran Singkat
                </label>
                <input
                  type="text"
                  value={chapterForm.subtitle}
                  onChange={(e) => setChapterForm({ ...chapterForm, subtitle: e.target.value })}
                  placeholder="Contoh: Membentengi Diri dari Perilaku Menyimpang di Era Modern"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Deskripsi / Sinopsis Pembelajaran
                </label>
                <textarea
                  rows={2}
                  value={chapterForm.description}
                  onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
                  placeholder="Uraian ringkas tujuan dan materi bab..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              {/* ================= SECTION UPLOAD DOKUMEN PDF ================= */}
              <div className="p-3.5 bg-rose-50/40 rounded-xl border border-rose-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900 uppercase tracking-wide flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-rose-600" />
                    Berkas Materi Dokumen PDF (Modul Ajar)
                  </span>
                  {(selectedPdfFile || chapterForm.pdfFileName) && (
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Terlampir
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-rose-300 border-dashed rounded-lg cursor-pointer hover:bg-rose-50 transition-colors">
                      <Upload className="w-4 h-4 text-rose-600" />
                      <span className="text-xs text-rose-900 font-medium">
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
                        className="px-3 py-2 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-100 border border-rose-200 rounded-lg cursor-pointer"
                      >
                        Hapus PDF
                      </button>
                    )}
                  </div>

                  {chapterForm.pdfFileName && !selectedPdfFile && (
                    <p className="text-[11px] text-slate-500">
                      File saat ini: <span className="font-semibold text-slate-700">{chapterForm.pdfFileName}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* ================= SECTION VIDEO MATERI (MP4 & YOUTUBE) ================= */}
              <div className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-emerald-700" />
                    Media Video Pembelajaran (MP4 / YouTube)
                  </span>

                  {/* Toggle Source */}
                  <div className="flex items-center bg-white p-0.5 rounded-lg border border-emerald-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setChapterForm({ ...chapterForm, videoSourceType: 'upload' })}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                        chapterForm.videoSourceType === 'upload'
                          ? 'bg-emerald-700 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Upload File MP4
                    </button>
                    <button
                      type="button"
                      onClick={() => setChapterForm({ ...chapterForm, videoSourceType: 'youtube' })}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                        chapterForm.videoSourceType === 'youtube'
                          ? 'bg-emerald-700 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Tautan YouTube
                    </button>
                  </div>
                </div>

                {/* Sub-form based on Video Source */}
                {chapterForm.videoSourceType === 'upload' ? (
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-emerald-300 border-dashed rounded-lg cursor-pointer hover:bg-emerald-50 transition-colors">
                        <Upload className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs text-emerald-900 font-medium">
                          {selectedVideoFile ? selectedVideoFile.name : chapterForm.videoFileName ? `Ganti Video (${chapterForm.videoFileName})` : 'Pilih Berkas Video MP4 (.mp4)'}
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
                          className="px-3 py-2 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg cursor-pointer"
                        >
                          Hapus Video
                        </button>
                      )}
                    </div>

                    {/* Preview Player if available */}
                    {videoPreviewUrl && (
                      <div className="mt-2 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 p-2">
                        <p className="text-[10px] text-emerald-400 font-mono mb-1">Preview Video MP4:</p>
                        <video
                          src={videoPreviewUrl}
                          controls
                          className="w-full max-h-44 rounded bg-black"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      ID Video atau Tautan YouTube
                    </label>
                    <input
                      type="text"
                      value={chapterForm.youtubeId}
                      onChange={(e) => setChapterForm({ ...chapterForm, youtubeId: e.target.value })}
                      placeholder="Contoh: qC03y3jV3pE atau https://www.youtube.com/watch?v=..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono text-xs focus:ring-2 focus:ring-emerald-600"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Masukkan ID YouTube (misal: qC03y3jV3pE) untuk diputar di player siswa.
                    </span>
                  </div>
                )}
              </div>

              {/* Dalil Utama Section */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide block">
                  Dalil Al-Qur&apos;an / Hadits Utama
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Nama Surah / Hadis</label>
                    <input
                      type="text"
                      value={chapterForm.surah}
                      onChange={(e) => setChapterForm({ ...chapterForm, surah: e.target.value })}
                      placeholder="QS. Al-Isra' [17]: 32"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Transliterasi Latin</label>
                    <input
                      type="text"
                      value={chapterForm.transliteration}
                      onChange={(e) => setChapterForm({ ...chapterForm, transliteration: e.target.value })}
                      placeholder="Wa la taqrabuz-zina..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Teks Ayat Arab</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={chapterForm.arabic}
                    onChange={(e) => setChapterForm({ ...chapterForm, arabic: e.target.value })}
                    placeholder="وَلَا تَقْرَبُوا الزِّنٰىٓ..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-arabic text-sm text-right"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Terjemahan Arti (Bahasa Indonesia)</label>
                  <textarea
                    rows={2}
                    value={chapterForm.translation}
                    onChange={(e) => setChapterForm({ ...chapterForm, translation: e.target.value })}
                    placeholder="Dan janganlah kamu mendekati zina..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsAddChapterOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : editingChapter ? 'Simpan Perubahan Bab' : 'Simpan Bab Baru'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
