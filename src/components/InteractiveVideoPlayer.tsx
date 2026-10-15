import React, { useState, useEffect } from 'react';
import { Chapter, StudentNote } from '../types';
import { 
  ArrowLeft, 
  ArrowRight, 
  Video, 
  ExternalLink, 
  Download, 
  Send, 
  Trash2, 
  Clock, 
  BookOpen,
  Cloud
} from 'lucide-react';
import { saveStudentNote, fetchStudentNotes, deleteStudentNote } from '../services/supabaseService';
import { getMediaBlob } from '../services/mediaStorage';

interface InteractiveVideoPlayerProps {
  chapter: Chapter;
  studentName: string;
  onVideoCompleted: (chapterId: number) => void;
  onStartPosttest: (chapter: Chapter) => void;
  onBack: () => void;
}

// Helper to extract clean YouTube embed URL
function extractYouTubeEmbedUrl(input?: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (trimmed.includes('youtube.com/embed/')) {
    return trimmed;
  }

  // Match youtube.com/watch?v=ID or youtu.be/ID
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = trimmed.match(regExp);
  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0&modestbranding=1`;
  }

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube-nocookie.com/embed/${trimmed}?rel=0&modestbranding=1`;
  }

  return `https://www.youtube-nocookie.com/embed/${trimmed}?rel=0&modestbranding=1`;
}

// Helper to get direct watch URL on YouTube
function getYouTubeWatchUrl(input?: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (trimmed.startsWith('http')) return trimmed;
  return `https://www.youtube.com/watch?v=${trimmed}`;
}

export const InteractiveVideoPlayer: React.FC<InteractiveVideoPlayerProps> = ({
  chapter,
  studentName,
  onVideoCompleted,
  onStartPosttest,
  onBack,
}) => {
  const videoTutorial = chapter.videoTutorial;
  const [actualVideoSrc, setActualVideoSrc] = useState<string | null>(videoTutorial.videoUrl || null);

  // Notes state
  const [notes, setNotes] = useState<StudentNote[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Resolve MP4 file (Supabase Cloud URL or IndexedDB fallback)
  useEffect(() => {
    if (videoTutorial.videoUrl && videoTutorial.videoUrl.startsWith('http')) {
      setActualVideoSrc(videoTutorial.videoUrl);
    } else if (videoTutorial.videoFileKey) {
      getMediaBlob(videoTutorial.videoFileKey).then((url) => {
        if (url) {
          setActualVideoSrc(url);
        } else if (videoTutorial.videoUrl) {
          setActualVideoSrc(videoTutorial.videoUrl);
        }
      });
    } else if (videoTutorial.videoUrl) {
      setActualVideoSrc(videoTutorial.videoUrl);
    }
  }, [videoTutorial.videoFileKey, videoTutorial.videoUrl]);

  // Load student notes for this chapter
  useEffect(() => {
    fetchStudentNotes(chapter.id, studentName).then((data) => {
      setNotes(data);
    });
  }, [chapter.id, studentName]);

  const youtubeEmbedUrl = extractYouTubeEmbedUrl(videoTutorial.youtubeId);
  const isUploadedMp4 = Boolean(actualVideoSrc);
  const isCloudVideo = Boolean(
    actualVideoSrc &&
      actualVideoSrc.startsWith('http') &&
      actualVideoSrc.includes('/storage/v1/object/public/')
  );

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setSavingNote(true);
    const newNote = {
      studentName,
      chapterId: chapter.id,
      timestampSeconds: 0,
      timestampFormatted: 'Catatan Belajar',
      noteText: newNoteText.trim(),
      createdAt: new Date().toISOString(),
    };

    const res = await saveStudentNote(newNote);
    if (res.success) {
      setNotes((prev) => [...prev, { ...newNote, id: res.id }]);
      setNewNoteText('');
    }
    setSavingNote(false);
  };

  const handleDeleteNote = async (id: string) => {
    await deleteStudentNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Top Navigation Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
            <div>
              <span className="text-xs font-bold text-emerald-800">
                Bab {chapter.number} &bull; Semester {chapter.semester}
              </span>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-sm sm:max-w-md">
                {chapter.title}
              </h1>
            </div>
          </div>

          <button
            onClick={() => onStartPosttest(chapter)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <span>Uji Pemahaman (Post-Test)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* ================= MAIN VIDEO PLAYER SCREEN ================= */}
        <div className="bg-black rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-video relative flex items-center justify-center">
          {isUploadedMp4 ? (
            /* Uploaded MP4 Video Element */
            <video
              src={actualVideoSrc!}
              controls
              className="w-full h-full object-contain bg-black"
              onEnded={() => onVideoCompleted(chapter.id)}
              playsInline
            />
          ) : youtubeEmbedUrl ? (
            /* YouTube Video Embed */
            <iframe
              src={youtubeEmbedUrl}
              title={videoTutorial.title || chapter.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            /* Fallback if no video is set */
            <div className="p-8 text-center text-slate-400 space-y-2">
              <Video className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="font-semibold text-white text-sm">Video Belum Tersedia</p>
              <p className="text-xs text-slate-400 max-w-md">
                Admin atau guru dapat mengunggah berkas video MP4 atau memasukkan tautan YouTube pada menu Kelola Materi.
              </p>
            </div>
          )}
        </div>

        {/* ================= VIDEO INFO & DIRECT ACCESS CARD ================= */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {isCloudVideo ? (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <Cloud className="w-3 h-3 text-emerald-700" />
                    <span>Cloud Supabase (Streaming Daring)</span>
                  </span>
                ) : isUploadedMp4 ? (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    Video MP4 (Lokal Browser)
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Video YouTube
                  </span>
                )}
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {Math.round(videoTutorial.durationSeconds / 60) || chapter.durationMinutes || 45} Menit
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 leading-snug">
                {videoTutorial.title || `Video Pembelajaran: ${chapter.title}`}
              </h2>
            </div>

            {/* Direct Access Buttons */}
            <div className="flex items-center gap-2">
              {isUploadedMp4 && actualVideoSrc ? (
                <a
                  href={actualVideoSrc}
                  download={videoTutorial.videoFileName || `Video_Bab_${chapter.number}.mp4`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Unduh Video MP4</span>
                </a>
              ) : videoTutorial.youtubeId ? (
                <a
                  href={getYouTubeWatchUrl(videoTutorial.youtubeId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                  <span>Buka di YouTube</span>
                </a>
              ) : null}
            </div>
          </div>

          {/* Video Description */}
          {videoTutorial.description && (
            <p className="text-xs text-slate-600 leading-relaxed">
              {videoTutorial.description}
            </p>
          )}

          {/* Dalil Rujukan */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700 space-y-1">
            <span className="font-semibold text-emerald-900 block">
              Rujukan Dalil: {chapter.dalilUtama.surah}
            </span>
            <p className="font-arabic text-sm text-right text-slate-800 py-0.5" dir="rtl">
              {chapter.dalilUtama.arabic}
            </p>
            <p className="text-[11px] text-slate-500 italic">
              &quot;{chapter.dalilUtama.translation}&quot;
            </p>
          </div>
        </div>



        {/* ================= CATATAN BELAJAR SISWA ================= */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Catatan Belajar Siswa</span>
            </h3>
            <span className="text-xs text-slate-400">{notes.length} catatan tersimpan</span>
          </div>

          <form onSubmit={handleAddNote} className="space-y-2">
            <textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Tulis ringkasan atau poin penting dari video ini..."
              rows={2}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-800"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingNote || !newNoteText.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{savingNote ? 'Menyimpan...' : 'Simpan Catatan'}</span>
              </button>
            </div>
          </form>

          {notes.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs flex items-start justify-between gap-2"
                >
                  <p className="text-slate-700 leading-relaxed flex-1">{note.noteText}</p>
                  <button
                    type="button"
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors shrink-0"
                    title="Hapus catatan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            &larr; Kembali ke Daftar Bab
          </button>

          <button
            onClick={() => onStartPosttest(chapter)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <span>Lanjut ke Post-Test (Uji Pemahaman)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
