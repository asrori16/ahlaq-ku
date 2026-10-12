import React, { useState } from 'react';
import { Chapter } from '../types';
import { 
  ChevronLeft, ChevronRight, BookOpen, Bookmark, 
  Search, ZoomIn, ZoomOut, Sun, Moon, Coffee, 
  CheckCircle, FileText, ArrowLeft, List
} from 'lucide-react';

interface EbookViewerProps {
  chapters: Chapter[];
  currentChapter: Chapter;
  onSelectChapter: (chapter: Chapter) => void;
  onOpenPdf: (chapter: Chapter) => void;
  onBack: () => void;
  onMarkAsRead: (chapterId: number) => void;
  isRead: boolean;
}

type ReaderTheme = 'light' | 'sepia' | 'dark';

export const EbookViewer: React.FC<EbookViewerProps> = ({
  chapters,
  currentChapter,
  onSelectChapter,
  onOpenPdf,
  onBack,
  onMarkAsRead,
  isRead,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [theme, setTheme] = useState<ReaderTheme>('light');
  const [fontSize, setFontSize] = useState<number>(16); // px
  const [searchQuery, setSearchQuery] = useState('');
  const [showToc, setShowToc] = useState(false);
  const [bookmarkedPages, setBookmarkedPages] = useState<number[]>([]);

  const totalPages = currentChapter.ebookPages.length;
  const currentPage = currentChapter.ebookPages[currentPageIndex] || currentChapter.ebookPages[0];

  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  const toggleBookmark = () => {
    if (bookmarkedPages.includes(currentPageIndex)) {
      setBookmarkedPages(prev => prev.filter(p => p !== currentPageIndex));
    } else {
      setBookmarkedPages(prev => [...prev, currentPageIndex]);
    }
  };

  const themeStyles = {
    light: 'bg-white text-slate-800 border-slate-200',
    sepia: 'bg-[#FAF6EE] text-[#433422] border-[#E8DEC8]',
    dark: 'bg-[#181E24] text-slate-200 border-slate-800',
  };

  const themeBackground = {
    light: 'bg-slate-100',
    sepia: 'bg-[#F2ECE0]',
    dark: 'bg-[#0F1317]',
  };

  return (
    <div className={`min-h-screen ${themeBackground[theme]} pb-12 transition-colors duration-200`}>
      {/* Top Reader Controls Bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Back & Chapter title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            <div className="h-4 w-px bg-slate-200" />

            {/* Bab Dropdown Selector */}
            <select
              value={currentChapter.id}
              onChange={(e) => {
                const target = chapters.find(c => c.id === Number(e.target.value));
                if (target) {
                  onSelectChapter(target);
                  setCurrentPageIndex(0);
                }
              }}
              className="text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-[200px] sm:max-w-xs truncate"
            >
              {chapters.map(c => (
                <option key={c.id} value={c.id}>
                  Bab {c.number}: {c.shortTitle}
                </option>
              ))}
            </select>
          </div>

          {/* Reading Customization Controls */}
          <div className="flex items-center gap-2">
            {/* Table of contents toggle */}
            <button
              onClick={() => setShowToc(!showToc)}
              title="Daftar Isi Halaman"
              className={`p-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                showToc ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <List className="w-4 h-4" />
            </button>

            {/* Font size adjustments */}
            <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
              <button
                onClick={() => setFontSize(prev => Math.max(13, prev - 1))}
                title="Kecilkan Font"
                disabled={fontSize <= 13}
                className="px-2 py-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40 text-xs font-bold"
              >
                A-
              </button>
              <span className="px-2 text-[11px] font-mono text-slate-400 select-none">
                {fontSize}px
              </span>
              <button
                onClick={() => setFontSize(prev => Math.min(22, prev + 1))}
                title="Besarkan Font"
                disabled={fontSize >= 22}
                className="px-2 py-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40 text-xs font-bold"
              >
                A+
              </button>
            </div>

            {/* Theme modes */}
            <div className="hidden sm:flex items-center border border-slate-200 rounded-lg bg-white p-0.5">
              <button
                onClick={() => setTheme('light')}
                title="Mode Terang"
                className={`p-1.5 rounded-md ${theme === 'light' ? 'bg-slate-100 text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('sepia')}
                title="Mode Kertas Sepia"
                className={`p-1.5 rounded-md ${theme === 'sepia' ? 'bg-[#FAF6EE] text-[#7A5B32] shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                title="Mode Gelap"
                className={`p-1.5 rounded-md ${theme === 'dark' ? 'bg-slate-800 text-slate-100 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={toggleBookmark}
              title={bookmarkedPages.includes(currentPageIndex) ? 'Hapus Bookmark' : 'Tandai Halaman Ini'}
              className={`p-2 rounded-lg text-xs border transition-colors cursor-pointer ${
                bookmarkedPages.includes(currentPageIndex)
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarkedPages.includes(currentPageIndex) ? 'fill-amber-500' : ''}`} />
            </button>

            {/* Switch to PDF View */}
            <button
              onClick={() => onOpenPdf(currentChapter)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Versi PDF Modul</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main E-Book Frame */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {/* Table of contents drawer / preview */}
        {showToc && (
          <div className="mb-6 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Daftar Halaman Bab {currentChapter.number}
              </span>
              <button
                onClick={() => setShowToc(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Tutup
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentChapter.ebookPages.map((pg, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentPageIndex(idx);
                    setShowToc(false);
                  }}
                  className={`text-left p-2.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    currentPageIndex === idx
                      ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate pr-2">
                    Hal {pg.pageNumber}: {pg.title}
                  </span>
                  {bookmarkedPages.includes(idx) && (
                    <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* The E-Book Paper Page Canvas */}
        <div
          className={`rounded-2xl border p-6 sm:p-12 shadow-md transition-all duration-200 ${themeStyles[theme]}`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {/* Header of the page */}
          <div className="flex items-center justify-between border-b border-current/10 pb-4 mb-8 text-xs opacity-75">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold uppercase tracking-wider">
                AKHLAQ KU · Bab {currentChapter.number}
              </span>
            </div>
            <div>
              <span>Halaman {currentPage.pageNumber} dari {totalPages}</span>
            </div>
          </div>

          {/* Page Heading */}
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6 leading-tight">
            {currentPage.title}
          </h2>

          {/* Subsections Content */}
          <div className="space-y-8 leading-relaxed">
            {currentPage.subsections.map((sub, sIdx) => (
              <div key={sIdx} className="space-y-4">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight opacity-95">
                  {sub.heading}
                </h3>

                {/* Paragraphs */}
                <div className="space-y-3">
                  {sub.content.map((p, pIdx) => (
                    <p key={pIdx} className="text-justify leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Highlight Quote Box */}
                {sub.highlightQuote && (
                  <div className="p-4 my-4 rounded-xl border-l-4 border-emerald-600 bg-emerald-500/10 italic text-sm sm:text-base leading-relaxed">
                    "{sub.highlightQuote}"
                  </div>
                )}

                {/* Arabic Dalil Callout */}
                {sub.arabicQuote && (
                  <div className="p-5 my-4 rounded-xl bg-current/5 border border-current/10 space-y-2">
                    <p className="font-arabic text-xl sm:text-2xl text-right leading-loose font-semibold">
                      {sub.arabicQuote.text}
                    </p>
                    <p className="text-xs sm:text-sm italic opacity-90">
                      "{sub.arabicQuote.meaning}"
                    </p>
                    <p className="text-[11px] font-medium opacity-60">
                      — {sub.arabicQuote.source}
                    </p>
                  </div>
                )}

                {/* Practical Tips */}
                {sub.practicalTips && (
                  <div className="p-4 rounded-xl bg-current/5 border border-current/10 space-y-2">
                    <p className="font-bold text-xs sm:text-sm uppercase tracking-wider text-emerald-600">
                      Amalan Praktis Siswa SMA:
                    </p>
                    <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm">
                      {sub.practicalTips.map((tip, tIdx) => (
                        <li key={tIdx} className="leading-relaxed">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Page Footer Navigation */}
          <div className="mt-12 pt-6 border-t border-current/10 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPageIndex === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-current/20 disabled:opacity-30 hover:bg-current/5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Halaman Sebelumnya</span>
            </button>

            {/* Reading completion toggle */}
            <button
              onClick={() => onMarkAsRead(currentChapter.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                isRead
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isRead ? 'Telah Selesai Dibaca' : 'Tandai Selesai Dibaca'}</span>
            </button>

            <button
              onClick={handleNextPage}
              disabled={currentPageIndex === totalPages - 1}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-current/20 disabled:opacity-30 hover:bg-current/5 transition-colors cursor-pointer"
            >
              <span>Halaman Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Page indicator */}
        <div className="text-center text-xs text-slate-500 mt-4">
          Halaman {currentPageIndex + 1} dari {totalPages} · Gunakan tombol panah untuk membalik halaman
        </div>
      </div>
    </div>
  );
};
