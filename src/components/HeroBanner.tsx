import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

interface HeroBannerProps {
  onStartLearning: () => void;
  onExploreEbook: () => void;
  completedChaptersCount: number;
  totalChaptersCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartLearning,
  onExploreEbook,
  completedChaptersCount,
  totalChaptersCount,
}) => {
  return (
    <div className="bg-emerald-800 text-white rounded-xl p-6 sm:p-8 mb-8 border border-emerald-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Concise info */}
        <div className="space-y-3 max-w-xl">
          <div className="text-xs font-medium text-emerald-200 tracking-wide">
            Kelas 11 SMA · Kurikulum Merdeka
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            AKHLAQ KU
          </h1>

          <p className="text-sm text-emerald-100/90 leading-relaxed">
            Pembelajaran mandiri akhlak dan budi pekerti melalui modul terstruktur, video materi, dan uji pemahaman.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={onStartLearning}
              className="px-4 py-2 rounded-lg bg-white text-emerald-900 font-semibold text-xs sm:text-sm hover:bg-emerald-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Mulai Belajar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreEbook}
              className="px-4 py-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-900 text-white font-medium text-xs sm:text-sm border border-emerald-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>E-Book</span>
            </button>
          </div>
        </div>

        {/* Right: Minimalist Progress */}
        <div className="w-full md:w-64 bg-emerald-900/60 rounded-lg p-4 border border-emerald-700/60 text-xs space-y-2.5">
          <div className="flex items-center justify-between font-medium">
            <span className="text-emerald-200">Progres Belajar</span>
            <span className="font-bold text-white">
              {completedChaptersCount} / {totalChaptersCount} Bab
            </span>
          </div>

          <div className="h-2 w-full bg-emerald-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${(completedChaptersCount / totalChaptersCount) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-emerald-200/80 pt-0.5">
            <span>Standar KKM: 75</span>
            <span>{Math.round((completedChaptersCount / totalChaptersCount) * 100)}% Selesai</span>
          </div>
        </div>
      </div>
    </div>
  );
};
