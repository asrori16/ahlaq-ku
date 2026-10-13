import React, { useState } from 'react';
import { 
  Menu, 
  CheckCircle, 
  Eye, 
  LogOut 
} from 'lucide-react';
import { Chapter, UserAccount, AssessmentRecord } from '../types';
import { getStoredUsers } from '../services/authService';
import { AdminTab } from './admin/types';
import { AdminSidebar } from './admin/AdminSidebar';
import { AdminOverviewTab } from './admin/AdminOverviewTab';
import { AdminMateriTab } from './admin/AdminMateriTab';
import { AdminUsersTab } from './admin/AdminUsersTab';
import { AdminNilaiTab } from './admin/AdminNilaiTab';

interface AdminDashboardProps {
  currentUser: UserAccount;
  chapters: Chapter[];
  onRefreshChapters: () => void;
  assessments: AssessmentRecord[];
  onLogout: () => void;
  onPreviewAsStudent: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  chapters,
  onRefreshChapters,
  assessments,
  onLogout,
  onPreviewAsStudent,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  // Users state
  const [userList, setUserList] = useState<UserAccount[]>(getStoredUsers());

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const refreshUserList = () => {
    setUserList(getStoredUsers());
  };

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-3.5 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= MODULAR SIDEBAR ================= */}
      <AdminSidebar
        activeTab={activeAdminTab}
        onSelectTab={setActiveAdminTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentUser={currentUser}
        chapterCount={chapters.length}
        userCount={userList.length}
        assessmentCount={assessments.length}
        onPreviewAsStudent={onPreviewAsStudent}
        onLogout={onLogout}
      />

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ease-in-out ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}`}>
        {/* Top Header Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title={isSidebarOpen ? 'Sembunyikan Sidebar' : 'Tampilkan Sidebar'}
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-sm sm:text-base font-bold text-slate-900">
              {activeAdminTab === 'overview' && 'Dashboard'}
              {activeAdminTab === 'materi' && 'Kelola Materi'}
              {activeAdminTab === 'nilai' && 'Rekap Nilai'}
              {activeAdminTab === 'users' && 'Manajemen Pengguna'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPreviewAsStudent}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portal Siswa</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </header>

        {/* Main Content Pages */}
        <main className="p-4 sm:p-6 flex-1 space-y-5 max-w-7xl w-full mx-auto">
          {activeAdminTab === 'overview' && (
            <AdminOverviewTab
              chapters={chapters}
              userList={userList}
              assessments={assessments}
              onNavigateTab={setActiveAdminTab}
            />
          )}

          {activeAdminTab === 'materi' && (
            <AdminMateriTab
              chapters={chapters}
              onRefreshChapters={onRefreshChapters}
              showToast={showToast}
            />
          )}

          {activeAdminTab === 'users' && (
            <AdminUsersTab
              currentUser={currentUser}
              userList={userList}
              assessments={assessments}
              onRefreshUsers={refreshUserList}
              showToast={showToast}
            />
          )}

          {activeAdminTab === 'nilai' && (
            <AdminNilaiTab
              assessments={assessments}
            />
          )}
        </main>
      </div>
    </div>
  );
};
