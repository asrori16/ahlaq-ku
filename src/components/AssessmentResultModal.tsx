import React, { useEffect } from 'react';
import { Chapter, AssessmentRecord, Question } from '../types';
import { 
  Award, CheckCircle2, XCircle, TrendingUp, HelpCircle, 
  BookOpen, ArrowRight, X, Sparkles, AlertCircle, Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AssessmentResultModalProps {
  chapter: Chapter;
  record: AssessmentRecord;
  questions: Question[];
  studentAnswers: Record<number, number>;
  onClose: () => void;
  onViewCertificate: () => void;
  onNextChapter?: () => void;
}

export const AssessmentResultModal: React.FC<AssessmentResultModalProps> = ({
  chapter,
  record,
  questions,
  studentAnswers,
  onClose,
  onViewCertificate,
  onNextChapter,
}) => {
  const isPassed = record.passed;

  useEffect(() => {
    if (isPassed) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#fbbf24', '#34d399'],
      });
    }
  }, [isPassed]);

  // Determine N-Gain Category
  const getGainCategory = (gain: number) => {
    if (gain >= 0.7) return { label: 'Tinggi (Sangat Signifikan)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (gain >= 0.3) return { label: 'Sedang (Meningkat Baik)', color: 'text-teal-700 bg-teal-50 border-teal-200' };
    return { label: 'Rendah (Perlu Penguatan)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  };

  const gainInfo = getGainCategory(record.nGainScore);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Header Banner */}
        <div className={`p-6 text-white relative ${
          isPassed ? 'bg-emerald-800' : 'bg-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-200">
              Hasil Asesmen · Bab {chapter.number}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-xl font-bold mt-1 text-white">
            {chapter.title}
          </h2>

          {/* Pass / Remedial Badge */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className={`px-2.5 py-1 rounded text-xs font-semibold inline-flex items-center gap-1.5 ${
              isPassed 
                ? 'bg-emerald-900 text-emerald-100 border border-emerald-700' 
                : 'bg-amber-900 text-amber-100 border border-amber-700'
            }`}>
              {isPassed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isPassed ? 'Lulus (KKM ≥ 75)' : 'Remidial (< 75)'}</span>
            </div>

            <span className="text-xs text-emerald-100/90">
              Siswa: <strong className="text-white">{record.studentName}</strong>
            </span>
          </div>
        </div>

        {/* Score Comparison Dashboard (Pre-test vs Post-test & N-Gain) */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Pre-test score */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-1 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Skor Pre-Test
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-700 font-mono">
              {record.pretestScore}
              <span className="text-xs font-normal text-slate-400">/100</span>
            </p>
            <p className="text-[11px] text-slate-500">Kemampuan Awal</p>
          </div>

          {/* Post-test score */}
          <div className="bg-white p-4 rounded-xl border border-emerald-300 text-center space-y-1 shadow-xs ring-1 ring-emerald-500/20">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Skor Post-Test
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono">
              {record.posttestScore}
              <span className="text-xs font-normal text-slate-400">/100</span>
            </p>
            <p className="text-[11px] text-emerald-600 font-medium">Hasil Pasca Menonton Video</p>
          </div>

          {/* Gain score */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-1 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              N-Gain Score
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {record.nGainScore}
            </p>
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${gainInfo.color}`}>
              {gainInfo.label}
            </span>
          </div>
        </div>

        {/* Question-by-Question Review with Dalil & Explanation */}
        <div className="p-6 max-h-96 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Pembahasan Soal & Kunci Jawaban</span>
            </h4>
            <span className="text-xs text-slate-500">
              {questions.length} Butir Soal Teruji
            </span>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const studentAnswer = studentAnswers[idx];
              const isCorrect = studentAnswer === q.correctAnswer;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border text-xs sm:text-sm space-y-3 ${
                    isCorrect
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-500 text-xs">
                        Soal Nomor {idx + 1}
                      </span>
                      <p className="font-semibold text-slate-900 leading-snug">
                        {q.question}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Benar (+20)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                          <XCircle className="w-3.5 h-3.5" />
                          Salah (0)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Answers summary */}
                  <div className="space-y-1 text-xs">
                    <p className="text-slate-600">
                      <strong className="text-slate-800">Jawaban Kamu: </strong>
                      {studentAnswer !== undefined
                        ? `${String.fromCharCode(65 + studentAnswer)}. ${q.options[studentAnswer]}`
                        : 'Tidak dijawab'}
                    </p>
                    <p className="text-emerald-800 font-semibold">
                      <strong>Kunci Jawaban Benar: </strong>
                      {String.fromCharCode(65 + q.correctAnswer)}. {q.options[q.correctAnswer]}
                    </p>
                  </div>

                  {/* Explanation & Dalil Box */}
                  <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs space-y-1.5">
                    <p className="text-slate-700 leading-relaxed">
                      <strong>Pembahasan: </strong>
                      {q.explanation}
                    </p>

                    {q.dalil && (
                      <div className="pt-1.5 border-t border-slate-100 text-emerald-800 text-[11px]">
                        <strong>Rujukan Dalil: </strong>
                        <span>{q.dalil.source}</span>
                        {q.dalil.meaning && (
                          <p className="italic text-slate-600 mt-0.5">"{q.dalil.meaning}"</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Tutup Pembahasan
          </button>

          <div className="flex items-center gap-2">
            {isPassed && (
              <button
                onClick={onViewCertificate}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition-colors cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Lihat Sertifikat Kelulusan</span>
              </button>
            )}

            {onNextChapter && (
              <button
                onClick={onNextChapter}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
              >
                <span>Lanjut Bab Berikutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
