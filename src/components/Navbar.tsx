import React, { useState, useEffect } from 'react';
import { BookOpen, Menu, X, LogOut, ArrowLeft } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: 'chapters' | 'ebook' | 'video' | 'assessment' | 'rapor';
  setActiveTab: (tab: 'chapters' | 'ebook' | 'video' | 'assessment' | 'rapor') => void;
  studentName: string;
  onOpenProfile: () => void;
  userRole?: UserRole;
  onLogout?: () => void;
  onBackToAdmin?: () => void;
}

const NAV_ITEMS = [
  { key: 'chapters', label: 'Daftar Bab' },
  { key: 'ebook', label: 'Materi & E-Book' },
  { key: 'video', label: 'Video' },
  { key: 'rapor', label: 'Rapor' },
] as const;

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  studentName,
  onOpenProfile,
  userRole,
  onLogout,
  onBackToAdmin,
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

  const currentTabItem = NAV_ITEMS.find((item) => item.key === activeTab);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
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
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
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

              {/* Mobile Active Tab Text (Plain text indicator) */}
              {currentTabItem && (
                <span className="md:hidden text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 max-w-[110px] truncate">
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

            {/* Zone 3: Actions & Mobile Hamburger/Silang Toggle Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Button Kembali ke Admin (jika role admin sedang preview siswa) */}
              {userRole === 'admin' && onBackToAdmin && (
                <button
                  onClick={onBackToAdmin}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer"
                  title="Kembali ke Panel Guru / Admin"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Panel Admin</span>
                </button>
              )}

              {/* Student/User profile button */}
              <button
                onClick={onOpenProfile}
                className="inline-flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                title={`Profil Pengguna: ${studentName}`}
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-semibold text-xs">
                  {studentName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[120px] sm:max-w-[140px] truncate">{studentName}</span>
              </button>

              {/* Logout Button (Desktop) */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                  title="Keluar / Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              )}

              {/* Mobile Minimize/Expand Toggle Button (Icon Hamburger & Silang) */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className={`md:hidden inline-flex items-center justify-center p-2 rounded-lg border transition-colors cursor-pointer ${
                  isMobileMenuOpen
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                }`}
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-emerald-800" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-700" />
                )}
              </button>
            </div>
          </div>

          {/* Zone 4: Mobile Minimized Plain Text Drawer (No icons, no gradients) */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-200 ease-in-out ${
              isMobileMenuOpen
                ? 'max-h-96 opacity-100 border-t border-slate-200 py-2'
                : 'max-h-0 opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex flex-col space-y-1">
              {/* Back to admin button on mobile if admin */}
              {userRole === 'admin' && onBackToAdmin && (
                <button
                  onClick={() => {
                    onBackToAdmin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm bg-emerald-100 text-emerald-900 font-bold transition-colors cursor-pointer mb-1"
                >
                  Kembali ke Panel Admin
                </button>
              )}

              {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveTab(item.key);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 font-semibold'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-normal'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              {/* Plain text profile button */}
              <div className="pt-2 mt-1 border-t border-slate-200">
                <button
                  onClick={() => {
                    onOpenProfile();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-normal transition-colors cursor-pointer"
                >
                  Profil Siswa ({studentName})
                </button>
              </div>

              {/* Logout button in mobile drawer (Plain text, no icons, solid color) */}
              {onLogout && (
                <div className="pt-1">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-rose-700 hover:bg-rose-50 font-semibold transition-colors cursor-pointer"
                  >
                    Keluar dari Akun (Logout)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/20 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};



