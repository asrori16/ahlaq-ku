import React, { useState, useEffect } from 'react';
import { Chapter, Question } from '../types';
import { CheckCircle2, AlertCircle, Clock, ArrowRight, ArrowLeft, Send } from 'lucide-react';

interface AssessmentQuizProps {
  chapter: Chapter;
  type: 'pretest' | 'posttest';
  onSubmit: (answers: Record<number, number>, questions: Question[]) => void;
  onCancel: () => void;
}

export const AssessmentQuiz: React.FC<AssessmentQuizProps> = ({
  chapter,
  type,
  onSubmit,
  onCancel,
}) => {
  const questions = type === 'pretest' ? chapter.pretest : chapter.posttest;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(900); // 15 mins
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const currentQ = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const answeredCount = Object.keys(selectedAnswers).length;
  const totalCount = questions.length;

  const handleFinish = () => {
    onSubmit(selectedAnswers, questions);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
              <span className={type === 'pretest' ? 'text-amber-700' : 'text-emerald-700'}>
                {type === 'pretest' ? 'Asesmen Awal (Pre-Test)' : 'Asesmen Akhir (Post-Test)'}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600">Bab {chapter.number}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              {chapter.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold text-slate-700 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatTimer(timeLeftSeconds)}</span>
            </div>

            <button
              onClick={onCancel}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1"
            >
              Batal
            </button>
          </div>
        </div>

        {/* Question Numbers Quick Navigator */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  currentQuestionIndex === idx
                    ? 'bg-emerald-800 text-white'
                    : selectedAnswers[idx] !== undefined
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Terjawab {answeredCount} dari {totalCount} Soal
          </span>
        </div>

        {/* Question Stage */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pertanyaan Nomor {currentQuestionIndex + 1}
            </span>
            <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Multiple choice options */}
          <div className="space-y-2.5">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 font-medium shadow-xs ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="leading-relaxed">{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          {!isLastQuestion ? (
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <span>Selanjutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Kumpulkan Jawaban</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h4 className="text-base font-bold text-slate-900">
              Konfirmasi Pengumpulan Asesmen
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Anda telah menjawab <span className="font-bold text-emerald-700">{answeredCount}</span> dari{' '}
              <span className="font-bold">{totalCount}</span> soal. Apakah Anda yakin ingin menyelesaikan {type === 'pretest' ? 'Pre-Test' : 'Post-Test'} sekarang?
            </p>
            {answeredCount < totalCount && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Masih ada {totalCount - answeredCount} soal yang belum dijawab!</span>
              </div>
            )}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Kembali Periksa
              </button>
              <button
                onClick={handleFinish}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
              >
                Kumpulkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
