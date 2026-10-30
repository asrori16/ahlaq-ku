import React from 'react';
import { Chapter, AssessmentRecord, StudentProgress } from '../types';
import { BookOpen, Video, FileText, CheckCircle, Award } from 'lucide-react';

interface ChapterCardProps {
  chapter: Chapter;
  progress: StudentProgress;
  assessmentRecord?: AssessmentRecord;
  onOpenEbook: (chapter: Chapter) => void;
  onOpenPdf: (chapter: Chapter) => void;
  onOpenVideo: (chapter: Chapter) => void;
  onStartPretest: (chapter: Chapter) => void;
  onStartPosttest: (chapter: Chapter) => void;
  onViewCertificate: (chapter: Chapter, record: AssessmentRecord) => void;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({
  chapter,
  progress,
  assessmentRecord,
  onOpenEbook,
  onOpenPdf,
  onOpenVideo,
  onStartPretest,
  onStartPosttest,
  onViewCertificate,
}) => {
  const isPassed = assessmentRecord?.passed || false;
  const hasPosttest = progress.posttestCompleted || (assessmentRecord && assessmentRecord.posttestScore !== undefined);
  const hasPretest = progress.pretestCompleted || (assessmentRecord && assessmentRecord.pretestScore !== undefined);
  const isVideoWatched = progress.videoWatched || false;
  const isEbookRead = progress.ebookRead || false;

  // 4 Tahapan Belajar:
  // 1. Membaca E-Book (25%)
  // 2. Menonton Video (25%)
  // 3. Mengerjakan Pre-Test (25%)
  // 4. Lulus Post-Test KKM >= 75 (25%)
  const completedSteps =
    (isEbookRead ? 1 : 0) +
    (isVideoWatched ? 1 : 0) +
    (hasPretest ? 1 : 0) +
    (isPassed ? 1 : 0);
  const chapterPercentage = Math.round((completedSteps / 4) * 100);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-emerald-600/40 transition-colors shadow-2xs">
      {/* Top Meta */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span className="font-semibold text-emerald-800">
            Bab {chapter.number} &bull; Semester {chapter.semester}
          </span>
          {isPassed ? (
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 text-[11px] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" />
              Lulus ({assessmentRecord?.posttestScore}/100)
            </span>
          ) : hasPosttest ? (
            <span className="text-amber-700 font-semibold text-[11px] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Remidial ({assessmentRecord?.posttestScore}/100)
            </span>
          ) : chapterPercentage > 0 ? (
            <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {chapterPercentage}% Selesai
            </span>
          ) : null}
        </div>

        {/* Title & Short Summary */}
        <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
          {chapter.title}
        </h3>

        <p className="text-xs text-slate-500 mb-3 line-clamp-2">
          {chapter.subtitle}
        </p>

        {/* Slim Minimalist Progress Bar */}
        <div className="mb-3">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                chapterPercentage === 100 ? 'bg-emerald-600' : 'bg-emerald-500'
              }`}
              style={{ width: `${chapterPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        {/* Material Format Selectors */}
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          <button
            onClick={() => onOpenEbook(chapter)}
            className={`py-1.5 px-2 rounded-lg border text-center font-medium transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              isEbookRead
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border-slate-200'
            }`}
            title={isEbookRead ? 'E-Book sudah dibaca' : 'Buka E-Book'}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isEbookRead ? 'E-Book ✓' : 'E-Book'}</span>
          </button>

          <button
            onClick={() => onOpenPdf(chapter)}
            className="py-1.5 px-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 text-center font-medium transition-colors cursor-pointer flex items-center justify-center gap-1"
            title="Buka Dokumen PDF"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          <button
            onClick={() => onOpenVideo(chapter)}
            className={`py-1.5 px-2 rounded-lg border text-center font-medium transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              isVideoWatched
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border-slate-200'
            }`}
            title={isVideoWatched ? 'Video sudah selesai ditonton' : 'Tonton Video'}
          >
            <Video className="w-3.5 h-3.5" />
            <span>{isVideoWatched ? 'Video ✓' : 'Video'}</span>
          </button>
        </div>

        {/* Assessment Action */}
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <button
            onClick={() => onStartPretest(chapter)}
            className={`py-1.5 px-2 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
              hasPretest
                ? 'bg-slate-100 text-slate-800 border-slate-300 font-semibold'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {hasPretest
              ? `Pre-Test ✓ (${assessmentRecord?.pretestScore ?? progress.pretestScore ?? ''})`
              : 'Pre-Test'}
          </button>

          <button
            onClick={() => onStartPosttest(chapter)}
            className={`py-1.5 px-2 rounded-lg text-center font-medium transition-colors cursor-pointer ${
              isPassed
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                : hasPosttest
                ? 'bg-amber-600 text-white hover:bg-amber-700 font-semibold'
                : 'bg-emerald-800 text-white hover:bg-emerald-900'
            }`}
          >
            {isPassed
              ? `Post-Test ✓ (${assessmentRecord?.posttestScore ?? progress.posttestScore ?? ''})`
              : hasPosttest
              ? `Remedial (${assessmentRecord?.posttestScore ?? progress.posttestScore ?? ''})`
              : 'Post-Test'}
          </button>
        </div>

        {/* Certificate link if completed */}
        {isPassed && assessmentRecord && (
          <button
            onClick={() => onViewCertificate(chapter, assessmentRecord)}
            className="w-full py-1.5 text-[11px] font-semibold text-emerald-800 hover:underline flex items-center justify-center gap-1 transition-colors cursor-pointer pt-1"
          >
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>Sertifikat Kelulusan Bab</span>
          </button>
        )}
      </div>
    </div>
  );
};

