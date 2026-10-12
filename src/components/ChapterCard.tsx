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

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-emerald-600/40 transition-colors">
      {/* Top Meta */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span className="font-semibold text-emerald-800">
            Bab {chapter.number}
          </span>
          {isPassed ? (
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 text-[11px]">
              <CheckCircle className="w-3.5 h-3.5" />
              Lulus ({assessmentRecord?.posttestScore}/100)
            </span>
          ) : hasPosttest ? (
            <span className="text-amber-700 font-medium text-[11px]">
              Remidial ({assessmentRecord?.posttestScore}/100)
            </span>
          ) : (
            <span className="text-slate-400 text-[11px]">
              Semester {chapter.semester}
            </span>
          )}
        </div>

        {/* Title & Short Summary */}
        <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
          {chapter.title}
        </h3>
        
        <p className="text-xs text-slate-500 mb-3 line-clamp-2">
          {chapter.subtitle}
        </p>

        {/* Subtle Dalil Tag */}
        <div className="text-[11px] text-slate-600 bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-100 mb-4 truncate">
          <span className="font-medium text-emerald-900">Rujukan:</span> {chapter.dalilUtama.surah}
        </div>
      </div>

      {/* Action Area */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        {/* Material Format Selectors */}
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          <button
            onClick={() => onOpenEbook(chapter)}
            className="py-1.5 px-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 text-center font-medium transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>E-Book</span>
          </button>

          <button
            onClick={() => onOpenPdf(chapter)}
            className="py-1.5 px-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 text-center font-medium transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          <button
            onClick={() => onOpenVideo(chapter)}
            className="py-1.5 px-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 text-center font-medium transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video</span>
          </button>
        </div>

        {/* Assessment Action */}
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <button
            onClick={() => onStartPretest(chapter)}
            className="py-1.5 px-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-center font-medium transition-colors cursor-pointer"
          >
            {hasPretest ? 'Pre-Test ✓' : 'Pre-Test'}
          </button>

          <button
            onClick={() => onStartPosttest(chapter)}
            className={`py-1.5 px-2 rounded-lg text-center font-medium transition-colors cursor-pointer ${
              isPassed
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-emerald-800 text-white hover:bg-emerald-900'
            }`}
          >
            {hasPosttest ? 'Post-Test' : 'Post-Test'}
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
