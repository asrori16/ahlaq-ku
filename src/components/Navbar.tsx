import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Video, Award, Menu, X, ChevronRight, User } from 'lucide-react';

interface NavbarProps {
  activeTab: 'chapters' | 'ebook' | 'video' | 'assessment' | 'rapor';
  setActiveTab: (tab: 'chapters' | 'ebook' | 'video' | 'assessment' | 'rapor') => void;
  studentName: string;
  onOpenProfile: () => void;
}

const NAV_ITEMS: {
  key: 'chapters' | 'ebook' | 'video' | 'rapor';
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: 'chapters', label: 'Daftar Bab', sublabel: 'Modul & Pembahasan', icon: BookOpen },
  { key: 'ebook', label: 'Materi & E-Book', sublabel: 'Buku Digital Interaktif', icon: FileText },
  { key: 'video', label: 'Video', sublabel: 'Video Pembelajaran Interaktif', icon: Video },
  { key: 'rapor', label: 'Rapor', sublabel: 'Hasil Belajar & Sertifikat', icon: Award },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  studentName,
  onOpenProfile,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on desktop resize or Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const currentTabItem = NAV_ITEMS.find(item => item.key === activeTab);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Zone 1: Brand wordmark & Current page pill */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setActiveTab('chapters');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2.5 text-left group cursor-pointer"
                title="Beranda AKHLAQ KU"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-xs transition-transform group-hover:scale-105">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-900 transition-colors">
                    AKHLAQ KU
                  </span>
                  <p className="text-[11px] text-slate-500 hidden sm:block">
                    Kelas 11 SMA
                  </p>
                </div>
              </button>

              {/* Mobile Active Tab Chip (shows when navbar is minimized) */}
              {currentTabItem && (
                <span className="md:hidden inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 max-w-[110px] truncate">
                  {currentTabItem.label}
                </span>
              )}
            </div>

            {/* Zone 2: Desktop clean text navigation links */}
            <nav className="hidden md:flex items-center gap-1 sm:gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? 'text-emerald-900 bg-emerald-50 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Actions & Mobile Hamburger Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Student profile button */}
              <button
                onClick={onOpenProfile}
                className="inline-flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
                title={`Profil Siswa: ${studentName}`}
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-semibold text-xs">
                  {studentName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[120px] sm:max-w-[140px] truncate">{studentName}</span>
              </button>

              {/* Mobile Minimize/Expand Hamburger Toggle Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className={`md:hidden inline-flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                  isMobileMenuOpen
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs ring-2 ring-emerald-500/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? 'Tutup menu navigasi (minimize)' : 'Buka menu navigasi'}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-emerald-800" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Zone 4: Mobile Minimized/Expandable Drawer */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen
                ? 'max-h-96 opacity-100 border-t border-slate-100 py-3'
                : 'max-h-0 opacity-0 pointer-events-none'
            }`}
          >
            <div className="space-y-1">
              <div className="px-1 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <span>Menu Navigasi</span>
                <span className="text-[10px] text-emerald-700 font-normal">Pilih modul</span>
              </div>

              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveTab(item.key);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200/70 shadow-xs'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          isActive
                            ? 'bg-emerald-800 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 leading-tight">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-slate-500 font-normal">
                          {item.sublabel}
                        </div>
                      </div>
                    </div>
                    {isActive ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    )}
                  </button>
                );
              })}

              {/* Student Profile Quick Access within mobile drawer */}
              <div className="pt-2 mt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    onOpenProfile();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-emerald-900 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px]">
                      {studentName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-800">{studentName} (Profil)</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Buka
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 bg-slate-900/20 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

