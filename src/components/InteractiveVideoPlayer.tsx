import React, { useState, useEffect, useRef } from 'react';
import { Chapter, StudentNote } from '../types';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, 
  HelpCircle, CheckCircle, Clock, Send, Trash2, 
  BookOpen, ArrowRight, ArrowLeft, MessageSquare, AlertCircle
} from 'lucide-react';
import { saveStudentNote, fetchStudentNotes, deleteStudentNote } from '../services/supabaseService';

interface InteractiveVideoPlayerProps {
  chapter: Chapter;
  studentName: string;
  onVideoCompleted: (chapterId: number) => void;
  onStartPosttest: (chapter: Chapter) => void;
  onBack: () => void;
}

export const InteractiveVideoPlayer: React.FC<InteractiveVideoPlayerProps> = ({
  chapter,
  studentName,
  onVideoCompleted,
  onStartPosttest,
  onBack,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [activeCheckpoint, setActiveCheckpoint] = useState<number | null>(null);
  const [answeredCheckpoints, setAnsweredCheckpoints] = useState<Record<number, number>>({});
  const [checkpointFeedback, setCheckpointFeedback] = useState<{ show: boolean; correct: boolean; explanation: string } | null>(null);
  
  // Notes state
  const [notes, setNotes] = useState<StudentNote[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const videoTutorial = chapter.videoTutorial;
  const duration = videoTutorial.durationSeconds;

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Load student notes for this chapter
  useEffect(() => {
    fetchStudentNotes(chapter.id, studentName).then((data) => {
      setNotes(data);
    });
  }, [chapter.id, studentName]);

  // Video playback simulation ticker
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && activeCheckpoint === null) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1 * playbackRate;
          
          // Check if there is a checkpoint at this time that hasn't been answered yet
          const checkpointIndex = videoTutorial.checkpoints.findIndex(
            (cp, idx) => Math.abs(cp.timestampSeconds - Math.floor(next)) < 2 && answeredCheckpoints[idx] === undefined
          );

          if (checkpointIndex !== -1) {
            setIsPlaying(false);
            setActiveCheckpoint(checkpointIndex);
          }

          if (next >= duration) {
            setIsPlaying(false);
            onVideoCompleted(chapter.id);
            return duration;
          }
          return next;
        });
      }, 1000 / playbackRate);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activeCheckpoint, playbackRate, answeredCheckpoints, duration, chapter.id, onVideoCompleted, videoTutorial.checkpoints]);

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    setActiveCheckpoint(null);
  };

  const handleAnswerCheckpoint = (optionIndex: number) => {
    if (activeCheckpoint === null) return;
    const cp = videoTutorial.checkpoints[activeCheckpoint];
    const isCorrect = optionIndex === cp.correctOption;

    setAnsweredCheckpoints(prev => ({ ...prev, [activeCheckpoint]: optionIndex }));
    setCheckpointFeedback({
      show: true,
      correct: isCorrect,
      explanation: cp.explanation,
    });
  };

  const handleContinueAfterCheckpoint = () => {
    setActiveCheckpoint(null);
    setCheckpointFeedback(null);
    setIsPlaying(true);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setSavingNote(true);
    const newNote = {
      studentName,
      chapterId: chapter.id,
      timestampSeconds: Math.floor(currentTime),
      timestampFormatted: formatTime(currentTime),
      noteText: newNoteText.trim(),
      createdAt: new Date().toISOString(),
    };

    const res = await saveStudentNote(newNote);
    if (res.success) {
      setNotes(prev => [...prev, { ...newNote, id: res.id }]);
      setNewNoteText('');
    }
    setSavingNote(false);
  };

  const handleDeleteNote = async (id: string) => {
    await deleteStudentNote(id);
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const progressPercent = Math.min(100, (currentTime / duration) * 100);

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-16">
      {/* Top Header */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-4 sm:px-8 py-3 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
            <div>
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                Video Interaktif · Bab {chapter.number}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-sm sm:max-w-xl">
                {videoTutorial.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => onStartPosttest(chapter)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors cursor-pointer"
          >
            <span>Uji Pemahaman (Post-Test)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Main Video Stage & Checkpoints (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* The Video Canvas / Player Container */}
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between group">
              {/* YouTube Iframe or Rich Animated Fallback */}
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                {/* Fallback lecture presentation visual backdrop */}
                <div className="text-center p-6 space-y-3 max-w-lg">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-emerald-900/60 border border-emerald-700/60 flex items-center justify-center text-emerald-300">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {chapter.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Video Materi Pembelajaran PAI & Budi Pekerti
                    </p>
                  </div>
                  
                  {/* Current timestamp caption snippet */}
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
                    <span className="text-emerald-400 font-semibold">[{formatTime(currentTime)}]</span>{' '}
                    {videoTutorial.chaptersList.slice().reverse().find(c => currentTime >= c.seconds)?.title || 'Pengantar Bab'}
                  </div>
                </div>
              </div>

              {/* Interactive Checkpoint Modal Overlay (Pauses video and asks questions!) */}
              {activeCheckpoint !== null && (
                <div className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-md p-6 sm:p-8 flex items-center justify-center">
                  <div className="max-w-lg w-full bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                      <HelpCircle className="w-4 h-4" />
                      <span>{videoTutorial.checkpoints[activeCheckpoint].label}</span>
                    </div>

                    <h4 className="text-base sm:text-lg font-semibold text-white leading-snug">
                      {videoTutorial.checkpoints[activeCheckpoint].questionPrompt}
                    </h4>

                    {/* Answer choices */}
                    {!checkpointFeedback?.show ? (
                      <div className="space-y-2">
                        {videoTutorial.checkpoints[activeCheckpoint].options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => handleAnswerCheckpoint(oIdx)}
                            className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-emerald-900/50 border border-slate-700 hover:border-emerald-500 text-xs sm:text-sm text-slate-200 transition-colors cursor-pointer"
                          >
                            <span className="font-bold text-emerald-400 mr-2">
                              {String.fromCharCode(65 + oIdx)}.
                            </span>
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      /* Feedback display */
                      <div className="space-y-4">
                        <div
                          className={`p-3.5 rounded-xl border text-xs sm:text-sm ${
                            checkpointFeedback.correct
                              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                              : 'bg-amber-950/60 border-amber-500 text-amber-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 font-bold mb-1">
                            {checkpointFeedback.correct ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                <span>Jawaban Kamu Tepat Sekali!</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4 text-amber-400" />
                                <span>Perhatikan Penjelasannya:</span>
                              </>
                            )}
                          </div>
                          <p className="text-xs leading-relaxed opacity-90">
                            {checkpointFeedback.explanation}
                          </p>
                        </div>

                        <button
                          onClick={handleContinueAfterCheckpoint}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs sm:text-sm text-white transition-colors cursor-pointer"
                        >
                          Lanjutkan Menonton Video
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Custom Control Overlay */}
              <div className="relative z-10 p-3 bg-black/85 space-y-2">
                {/* Timeline bar with checkpoint markers */}
                <div className="relative w-full h-2 bg-slate-700 rounded-full cursor-pointer group/bar"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = clickX / rect.width;
                    handleSeek(pct * duration);
                  }}
                >
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />

                  {/* Checkpoint pin markers on timeline */}
                  {videoTutorial.checkpoints.map((cp, idx) => {
                    const pinPct = (cp.timestampSeconds / duration) * 100;
                    return (
                      <div
                        key={idx}
                        title={`Checkpoint: ${cp.label}`}
                        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-amber-400 border border-black rounded-full"
                        style={{ left: `${pinPct}%` }}
                      />
                    );
                  })}
                </div>

                {/* Bottom Control buttons */}
                <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleSeek(0)}
                      title="Ulangi dari Awal"
                      className="hover:text-white transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    <span className="font-mono text-xs tabular-nums">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Playback speed selector */}
                    <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
                      {[0.75, 1, 1.25, 1.5].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => setPlaybackRate(rate)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                            playbackRate === rate ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Topics Chapter Navigation */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Lompat ke Topik Bahasan:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {videoTutorial.chaptersList.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSeek(ch.seconds)}
                    className={`text-left p-2.5 rounded-lg text-xs flex items-center justify-between transition-colors border ${
                      currentTime >= ch.seconds && (idx === videoTutorial.chaptersList.length - 1 || currentTime < videoTutorial.chaptersList[idx + 1].seconds)
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate pr-2">{ch.title}</span>
                    <span className="font-mono text-slate-400 shrink-0 text-[11px]">{ch.time}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Key Takeaways Card */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Poin Kunci (Key Takeaways):
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {videoTutorial.keyTakeaways.map((takeaway, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Timestamped Student Notes (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Catatan Siswa</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {notes.length} Catatan
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2 mb-4">
                  Tulis intisari materi saat video berjalan. Catatan tersimpan dengan timestamp ke database Supabase.
                </p>

                {/* Form to add note */}
                <form onSubmit={handleAddNote} className="space-y-2.5 mb-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Posisi Menit:</span>
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      {formatTime(currentTime)}
                    </span>
                  </div>

                  <textarea
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Ketik catatan atau pertanyaan penting..."
                    rows={3}
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />

                  <button
                    type="submit"
                    disabled={savingNote || !newNoteText.trim()}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{savingNote ? 'Menyimpan...' : 'Simpan Catatan di Timestamp Ini'}</span>
                  </button>
                </form>

                {/* Existing notes list */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notes.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                      Belum ada catatan. Tambahkan intisari pertama Anda di atas.
                    </div>
                  ) : (
                    notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => handleSeek(note.timestampSeconds)}
                            className="font-mono text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            <Clock className="w-3 h-3" />
                            <span>{note.timestampFormatted}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-slate-500 hover:text-red-400 transition-colors"
                            title="Hapus Catatan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-slate-200 leading-relaxed">
                          {note.noteText}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Bottom Post-Test Callout */}
              <div className="pt-4 border-t border-slate-800 mt-4">
                <button
                  onClick={() => onStartPosttest(chapter)}
                  className="w-full py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Lanjut ke Post-Test</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
