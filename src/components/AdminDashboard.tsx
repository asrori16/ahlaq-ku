import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  UserPlus, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  CheckCircle, 
  LogOut, 
  GraduationCap, 
  Award, 
  Search, 
  Eye, 
  X, 
  ShieldCheck, 
  BarChart3, 
  Video, 
  FileText,
  Clock,
  Printer
} from 'lucide-react';
import { Chapter, UserAccount, AssessmentRecord, UserRole } from '../types';
import { addChapter, updateChapter, deleteChapter } from '../services/chapterService';
import { getStoredUsers, addUser, updateUser, deleteUser } from '../services/authService';

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
  const [activeAdminTab, setActiveAdminTab] = useState<'materi' | 'users' | 'nilai'>('materi');

  // Users state
  const [userList, setUserList] = useState<UserAccount[]>(getStoredUsers());

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [semesterFilter, setSemesterFilter] = useState<'all' | '1' | '2'>('all');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'student' | 'admin'>('all');

  // Modals for Materi
  const [isAddChapterOpen, setIsAddChapterOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

  // Form state for Chapter
  const [chapterForm, setChapterForm] = useState({
    title: '',
    shortTitle: '',
    subtitle: '',
    semester: 1,
    durationMinutes: 45,
    description: '',
    surah: "QS. Al-Hujurat [49]: 13",
    arabic: "يٰٓاَيُّهَا النَّاسُ اِنَّا خَلَقْنٰكُمْ مِّنْ ذَكَرٍ وَّاُنْثٰى",
    transliteration: "Yā ayyuhan-nāsu innā khalaqnākum min dzakariw wa unṡā",
    translation: "Wahai manusia! Sungguh, Kami telah menciptakan kamu dari seorang laki-laki dan seorang perempuan.",
    objectivesText: '',
    youtubeId: 'qC03y3jV3pE',
    subsectionsContent: '',
  });

  // Modals for User (Admin & Siswa)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [userForm, setUserForm] = useState<{
    fullName: string;
    username: string;
    password: string;
    role: UserRole;
    nisn: string;
    classGrade: string;
    school: string;
    email: string;
  }>({
    fullName: '',
    username: '',
    password: '',
    role: 'student',
    nisn: '',
    classGrade: 'XI MIPA 2',
    school: 'SMA Negeri 1 Jakarta',
    email: '',
  });

  // Modal Student Report Card View
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<UserAccount | null>(null);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const refreshUserList = () => {
    setUserList(getStoredUsers());
  };

  // ================= Chapter Handlers =================
  const handleOpenAddChapter = () => {
    setEditingChapter(null);
    setChapterForm({
      title: '',
      shortTitle: '',
      subtitle: '',
      semester: 1,
      durationMinutes: 45,
      description: '',
      surah: "QS. Al-Isra' [17]: 32",
      arabic: "وَلَا تَقْرَبُوا الزِّنٰىٓ اِنَّهٗ كَانَ فَاحِشَةً ۗوَسَاۤءَ سَبِيْلًا",
      transliteration: "Wa lā taqrabuz-zinā innahū kāna fāḥisyah",
      translation: "Dan janganlah kamu mendekati zina; (zina) itu sungguh suatu perbuatan keji.",
      objectivesText: "Menganalisis dalil syariat terkait materi.\nMemahami hikmah dan implementasi bagi remaja SMA.\nMenjaga adab islami dalam kehidupan sehari-hari.",
      youtubeId: 'qC03y3jV3pE',
      subsectionsContent: '',
    });
    setIsAddChapterOpen(true);
  };

  const handleOpenEditChapter = (ch: Chapter) => {
    setEditingChapter(ch);
    setChapterForm({
      title: ch.title,
      shortTitle: ch.shortTitle,
      subtitle: ch.subtitle,
      semester: ch.semester,
      durationMinutes: ch.durationMinutes,
      description: ch.description,
      surah: ch.dalilUtama.surah,
      arabic: ch.dalilUtama.arabic,
      transliteration: ch.dalilUtama.transliteration,
      translation: ch.dalilUtama.translation,
      objectivesText: ch.learningObjectives.join('\n'),
      youtubeId: ch.videoTutorial.youtubeId,
      subsectionsContent: ch.ebookPages[0]?.subsections[0]?.content.join('\n\n') || '',
    });
    setIsAddChapterOpen(true);
  };

  const handleSaveChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterForm.title.trim()) {
      showToast('Judul materi wajib diisi!');
      return;
    }

    if (editingChapter) {
      // Update
      updateChapter(editingChapter.id, {
        title: chapterForm.title,
        shortTitle: chapterForm.shortTitle || chapterForm.title.slice(0, 30),
        subtitle: chapterForm.subtitle,
        semester: Number(chapterForm.semester),
        durationMinutes: Number(chapterForm.durationMinutes) || 45,
        description: chapterForm.description,
        dalilUtama: {
          surah: chapterForm.surah,
          arabic: chapterForm.arabic,
          transliteration: chapterForm.transliteration,
          translation: chapterForm.translation,
        },
      });
      showToast(`Materi "${chapterForm.title}" berhasil diperbarui!`);
    } else {
      // Create new
      addChapter({
        title: chapterForm.title,
        shortTitle: chapterForm.shortTitle,
        subtitle: chapterForm.subtitle,
        semester: Number(chapterForm.semester),
        durationMinutes: Number(chapterForm.durationMinutes) || 45,
        description: chapterForm.description,
        surah: chapterForm.surah,
        arabic: chapterForm.arabic,
        transliteration: chapterForm.transliteration,
        translation: chapterForm.translation,
        objectivesText: chapterForm.objectivesText,
        youtubeId: chapterForm.youtubeId,
        subsectionsContent: chapterForm.subsectionsContent,
      });
      showToast(`Materi baru "${chapterForm.title}" berhasil ditambahkan!`);
    }

    setIsAddChapterOpen(false);
    onRefreshChapters();
  };

  const handleDeleteChapter = (ch: Chapter) => {
    if (confirm(`Apakah Anda yakin ingin menghapus Bab "${ch.title}"?`)) {
      deleteChapter(ch.id);
      showToast(`Bab "${ch.title}" telah dihapus.`);
      onRefreshChapters();
    }
  };

  // ================= User Handlers (Admin & Siswa) =================
  const handleOpenAddUser = (initialRole: UserRole = 'student') => {
    setEditingUser(null);
    setUserForm({
      fullName: '',
      username: '',
      password: '',
      role: initialRole,
      nisn: '',
      classGrade: 'XI MIPA 2',
      school: 'SMA Negeri 1 Jakarta',
      email: '',
    });
    setIsAddUserOpen(true);
  };

  const handleOpenEditUser = (user: UserAccount) => {
    setEditingUser(user);
    setUserForm({
      fullName: user.fullName,
      username: user.username,
      password: user.password || '',
      role: user.role,
      nisn: user.nisn || '',
      classGrade: user.classGrade || 'XI MIPA 2',
      school: user.school || 'SMA Negeri 1 Jakarta',
      email: user.email || '',
    });
    setIsAddUserOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.fullName.trim() || !userForm.username.trim()) {
      showToast('Nama lengkap dan nama pengguna wajib diisi!');
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, {
        fullName: userForm.fullName,
        username: userForm.username,
        password: userForm.password || editingUser.password,
        role: userForm.role,
        nisn: userForm.role === 'student' ? userForm.nisn : undefined,
        classGrade: userForm.role === 'student' ? userForm.classGrade : undefined,
        school: userForm.school,
        email: userForm.email,
      });
      showToast(`Data ${userForm.role === 'admin' ? 'admin' : 'siswa'} "${userForm.fullName}" berhasil diperbarui.`);
    } else {
      const res = addUser({
        fullName: userForm.fullName,
        username: userForm.username,
        password: userForm.password || (userForm.role === 'admin' ? 'admin123' : 'siswa123'),
        role: userForm.role,
        nisn: userForm.role === 'student' ? userForm.nisn : undefined,
        classGrade: userForm.role === 'student' ? userForm.classGrade : undefined,
        school: userForm.school,
        email: userForm.email,
      });
      if (!res.success) {
        showToast(res.error || 'Gagal menambahkan pengguna.');
        return;
      }
      showToast(`Akun ${userForm.role === 'admin' ? 'Admin' : 'Siswa'} "${userForm.fullName}" berhasil ditambahkan!`);
    }

    setIsAddUserOpen(false);
    refreshUserList();
  };

  const handleDeleteUser = (u: UserAccount) => {
    if (u.id === currentUser.id) {
      alert('Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan.');
      return;
    }
    const roleLabel = u.role === 'admin' ? 'Admin' : 'Siswa';
    if (confirm(`Hapus akun ${roleLabel} "${u.fullName}" (@${u.username})?`)) {
      deleteUser(u.id);
      showToast(`Akun ${roleLabel} "${u.fullName}" telah dihapus.`);
      refreshUserList();
    }
  };

  // Filtered chapters
  const filteredChapters = chapters.filter((c) => {
    const matchSem = semesterFilter === 'all' || c.semester === Number(semesterFilter);
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.number.includes(searchQuery) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSem && matchSearch;
  });

  // Filtered users
  const studentUsers = userList.filter((u) => u.role === 'student');
  const adminUsers = userList.filter((u) => u.role === 'admin');

  const filteredUsers = userList.filter((u) => {
    const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      u.fullName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      (u.nisn && u.nisn.includes(q)) ||
      (u.classGrade && u.classGrade.toLowerCase().includes(q)) ||
      (u.school && u.school.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q));
    return matchRole && matchSearch;
  });

  // Compute stats
  const passedStudentsCount = assessments.filter((a) => a.passed).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar Admin */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand & Admin Badge */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                    AKHLAQ KU
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Panel Guru & Admin
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Kelola Modul Pembelajaran PAI & Evaluasi Siswa
                </p>
              </div>
            </div>

            {/* Right: User identity, Preview & Logout */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onPreviewAsStudent}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                title="Lihat tampilan materi dari sisi siswa"
              >
                <Eye className="w-4 h-4 text-emerald-700" />
                <span className="hidden sm:inline">Pratinjau Portal Siswa</span>
                <span className="sm:hidden">Siswa</span>
              </button>

              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span className="font-semibold">{currentUser.fullName}</span>
              </div>

              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                title="Keluar dari akun"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Total Bab Materi</span>
              <BookOpen className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{chapters.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Semester 1 & 2</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Siswa Terdaftar</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{studentUsers.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Akun siswa aktif</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Admin / Guru</span>
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{adminUsers.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Hak akses kelola</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Selesai Asesmen</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{assessments.length}</div>
            <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">{passedStudentsCount} Lulus KKM (&ge; 75)</div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="bg-white rounded-xl border border-slate-200 p-1 flex gap-1">
          <button
            onClick={() => {
              setActiveAdminTab('materi');
              setSearchQuery('');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeAdminTab === 'materi'
                ? 'bg-emerald-800 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Kelola Materi Pembelajaran ({chapters.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveAdminTab('users');
              setSearchQuery('');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeAdminTab === 'users'
                ? 'bg-emerald-800 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manajemen Pengguna ({userList.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveAdminTab('nilai');
              setSearchQuery('');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeAdminTab === 'nilai'
                ? 'bg-emerald-800 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Rekap Nilai ({assessments.length})</span>
          </button>
        </div>

        {/* ================= TAB 1: KELOLA MATERI ================= */}
        {activeAdminTab === 'materi' && (
          <div className="space-y-4">
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari materi atau nomor bab..."
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-800"
                  />
                </div>

                <select
                  value={semesterFilter}
                  onChange={(e) => setSemesterFilter(e.target.value as any)}
                  className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                >
                  <option value="all">Semua Semester</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
              </div>

              <button
                onClick={handleOpenAddChapter}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Bab / Materi Baru</span>
              </button>
            </div>

            {/* Chapter List Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredChapters.map((ch) => (
                <div
                  key={ch.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        BAB {ch.number} &bull; Semester {ch.semester}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {ch.durationMinutes} Menit
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {ch.subtitle || ch.description}
                    </p>

                    {/* Dalil info */}
                    <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600">
                      <span className="font-semibold text-emerald-900 block mb-0.5">
                        {ch.dalilUtama.surah}
                      </span>
                      <p className="font-arabic text-sm text-right text-slate-800 py-1" dir="rtl">
                        {ch.dalilUtama.arabic}
                      </p>
                      <p className="text-[11px] text-slate-500 italic mt-0.5">
                        &quot;{ch.dalilUtama.translation}&quot;
                      </p>
                    </div>

                    {/* Features indicator */}
                    <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                        <FileText className="w-3 h-3 text-slate-600" /> {ch.ebookPages.length} Halaman E-Book
                      </span>
                      <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                        <Video className="w-3 h-3 text-slate-600" /> Video Interaktif
                      </span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenEditChapter(ch)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 text-slate-600" />
                      <span>Edit Materi</span>
                    </button>

                    <button
                      onClick={() => handleDeleteChapter(ch)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredChapters.length === 0 && (
              <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500">
                <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-700">Tidak ada materi yang sesuai</p>
                <p className="text-xs text-slate-400 mt-1">Coba ubah kata kunci pencarian atau filter semester.</p>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: MANAJEMEN PENGGUNA ================= */}
        {activeAdminTab === 'users' && (
          <div className="space-y-4">
            {/* Actions Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama, username, NISN, atau kelas..."
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-800"
                  />
                </div>

                {/* Filter Role Buttons */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setUserRoleFilter('all')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      userRoleFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Semua ({userList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRoleFilter('student')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      userRoleFilter === 'student'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Siswa ({studentUsers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRoleFilter('admin')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      userRoleFilter === 'admin'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Admin / Guru ({adminUsers.length})
                  </button>
                </div>
              </div>

              {/* Action Buttons to Add Admin & Student */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleOpenAddUser('admin')}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-300 text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>+ Tambah Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenAddUser('student')}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Tambah Siswa</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-4">Pengguna & Akun</th>
                      <th className="py-3 px-4">Peran (Role)</th>
                      <th className="py-3 px-4">Kelas / Instansi</th>
                      <th className="py-3 px-4">Status & Progres</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => {
                      const stAssessments = assessments.filter(
                        (a) => a.studentName.toLowerCase() === u.fullName.toLowerCase()
                      );
                      const avgPost =
                        stAssessments.length > 0
                          ? Math.round(
                              stAssessments.reduce((acc, c) => acc + c.posttestScore, 0) /
                                stAssessments.length
                            )
                          : 0;
                      const isSelf = u.id === currentUser.id;

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{u.fullName}</span>
                              {isSelf && (
                                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">
                                  Anda
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">@{u.username}</div>
                            {u.email && (
                              <div className="text-[10px] text-slate-400 truncate max-w-xs">{u.email}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {u.role === 'admin' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Admin / Guru
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                                <GraduationCap className="w-3.5 h-3.5" />
                                Siswa
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {u.role === 'student' ? (
                              <div>
                                <div className="font-semibold text-slate-800">{u.classGrade || 'XI MIPA 2'}</div>
                                <div className="text-[11px] text-slate-500">NISN: {u.nisn || '-'}</div>
                              </div>
                            ) : (
                              <div>
                                <div className="font-semibold text-slate-800">{u.school || 'SMA Negeri 1 Jakarta'}</div>
                                <div className="text-[11px] text-slate-500">Hak Akses Manajemen</div>
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {u.role === 'student' ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-800">
                                  {stAssessments.length} Bab Selesai
                                </span>
                                {stAssessments.length > 0 && (
                                  <span
                                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                      avgPost >= 75
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}
                                  >
                                    Rata-rata: {avgPost}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-500">
                                Pengelola Materi &amp; Evaluasi
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                            {u.role === 'student' && (
                              <button
                                type="button"
                                onClick={() => setSelectedStudentForReport(u)}
                                className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors cursor-pointer"
                                title="Lihat detail nilai siswa"
                              >
                                Nilai
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleOpenEditUser(u)}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                              title="Edit data pengguna"
                            >
                              Edit
                            </button>
                            {isSelf ? (
                              <span
                                className="px-2.5 py-1 text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-200 rounded-md cursor-not-allowed inline-block"
                                title="Akun Anda yang sedang aktif tidak dapat dihapus"
                              >
                                Aktif
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u)}
                                className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors cursor-pointer"
                                title="Hapus pengguna"
                              >
                                Hapus
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-700">Tidak ada pengguna yang sesuai</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Coba sesuaikan kata kunci pencarian atau ganti filter peran.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3: REKAP NILAI ================= */}
        {activeAdminTab === 'nilai' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Rekapitulasi Penilaian Siswa</h3>
                <p className="text-xs text-slate-500">Hasil pengerjaan Pretest, Post-test, dan N-Gain seluruh siswa</p>
              </div>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Cetak Rekap Nilai</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Nama Siswa</th>
                    <th className="py-3 px-4">Bab Pembelajaran</th>
                    <th className="py-3 px-4 text-center">Pretest</th>
                    <th className="py-3 px-4 text-center">Posttest</th>
                    <th className="py-3 px-4 text-center">N-Gain</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assessments.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{a.studentName}</td>
                      <td className="py-3 px-4">{a.chapterTitle}</td>
                      <td className="py-3 px-4 text-center font-mono font-semibold">{a.pretestScore}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-emerald-800">{a.posttestScore}</td>
                      <td className="py-3 px-4 text-center font-mono">{a.nGainScore}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.passed ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'}`}>
                          {a.passed ? 'Lulus KKM' : 'Remedial'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-xs text-slate-500">
                        {new Date(a.timestamp).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {assessments.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  <BarChart3 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-700">Belum ada riwayat asesmen siswa</p>
                  <p className="text-xs text-slate-400 mt-1">Hasil kuis siswa akan otomatis tercatat di sini.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL TAMBAH/EDIT BAB MATERI ================= */}
      {isAddChapterOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-800" />
                <span>{editingChapter ? 'Edit Modul Materi' : 'Tambah Bab Materi Pembelajaran Baru'}</span>
              </h2>
              <button
                onClick={() => setIsAddChapterOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChapter} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Judul Lengkap Materi Bab *
                  </label>
                  <input
                    type="text"
                    value={chapterForm.title}
                    onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                    placeholder="Contoh: Menjaga Kehormatan Diri (Iffah)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Semester
                  </label>
                  <select
                    value={chapterForm.semester}
                    onChange={(e) => setChapterForm({ ...chapterForm, semester: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Judul Pendek / Topik Singkat
                  </label>
                  <input
                    type="text"
                    value={chapterForm.shortTitle}
                    onChange={(e) => setChapterForm({ ...chapterForm, shortTitle: e.target.value })}
                    placeholder="Contoh: Iffah & Batas Pergaulan"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Durasi Pembelajaran (Menit)
                  </label>
                  <input
                    type="number"
                    value={chapterForm.durationMinutes}
                    onChange={(e) => setChapterForm({ ...chapterForm, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Subjudul & Gambaran Singkat
                </label>
                <input
                  type="text"
                  value={chapterForm.subtitle}
                  onChange={(e) => setChapterForm({ ...chapterForm, subtitle: e.target.value })}
                  placeholder="Contoh: Membentengi Diri dari Zina dan Perilaku Menyimpang di Era Modern"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Deskripsi / Sinopsis Pembelajaran
                </label>
                <textarea
                  rows={2}
                  value={chapterForm.description}
                  onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
                  placeholder="Uraian ringkas tujuan dan materi bab..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              {/* Dalil Utama Section */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide block">
                  Dalil Al-Qur&apos;an / Hadits Utama
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Nama Surah / Hadis</label>
                    <input
                      type="text"
                      value={chapterForm.surah}
                      onChange={(e) => setChapterForm({ ...chapterForm, surah: e.target.value })}
                      placeholder="QS. Al-Isra' [17]: 32"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Transliterasi Latin</label>
                    <input
                      type="text"
                      value={chapterForm.transliteration}
                      onChange={(e) => setChapterForm({ ...chapterForm, transliteration: e.target.value })}
                      placeholder="Wa la taqrabuz-zina..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Teks Ayat Arab</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={chapterForm.arabic}
                    onChange={(e) => setChapterForm({ ...chapterForm, arabic: e.target.value })}
                    placeholder="وَلَا تَقْرَبُوا الزِّنٰىٓ..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-arabic text-sm text-right"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Terjemahan Arti (Bahasa Indonesia)</label>
                  <textarea
                    rows={2}
                    value={chapterForm.translation}
                    onChange={(e) => setChapterForm({ ...chapterForm, translation: e.target.value })}
                    placeholder="Dan janganlah kamu mendekati zina..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                  />
                </div>
              </div>

              {/* YouTube Video ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  ID Video YouTube (opsional)
                </label>
                <input
                  type="text"
                  value={chapterForm.youtubeId}
                  onChange={(e) => setChapterForm({ ...chapterForm, youtubeId: e.target.value })}
                  placeholder="Contoh: qC03y3jV3pE"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddChapterOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Materi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH/EDIT PENGGUNA ================= */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                {userForm.role === 'admin' ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-800" />
                ) : (
                  <Users className="w-5 h-5 text-emerald-800" />
                )}
                <span>
                  {editingUser
                    ? `Edit Pengguna (${editingUser.role === 'admin' ? 'Admin' : 'Siswa'})`
                    : userForm.role === 'admin'
                    ? 'Tambah Admin / Guru Baru'
                    : 'Tambah Siswa Baru'}
                </span>
              </h2>
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs sm:text-sm">
              {/* Role Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                  Peran Akun (Role) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUserForm({ ...userForm, role: 'student' })}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      userForm.role === 'student'
                        ? 'bg-sky-50 border-sky-500 text-sky-800 ring-1 ring-sky-500'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-sky-600" />
                    <span>Siswa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserForm({ ...userForm, role: 'admin' })}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      userForm.role === 'admin'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-600'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Admin / Guru</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={userForm.fullName}
                  onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                  placeholder={userForm.role === 'admin' ? 'Contoh: Ustadzah Nurul Hidayah, S.Pd.I' : 'Contoh: Ahmad Fauzi'}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  required
                />
              </div>

              {/* Username & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={userForm.username}
                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                    placeholder={userForm.role === 'admin' ? 'admin_nurul' : 'fauzi11'}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Kata Sandi {editingUser ? '(Opsional)' : '*'}
                  </label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    placeholder={userForm.role === 'admin' ? 'admin123' : 'siswa123'}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    required={!editingUser}
                  />
                </div>
              </div>

              {/* Siswa only fields: NISN & Kelas */}
              {userForm.role === 'student' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-sky-50/60 p-3 rounded-xl border border-sky-100">
                  <div>
                    <label className="block text-[11px] font-semibold text-sky-900 uppercase mb-1">
                      NISN (Nomor Induk)
                    </label>
                    <input
                      type="text"
                      value={userForm.nisn}
                      onChange={(e) => setUserForm({ ...userForm, nisn: e.target.value })}
                      placeholder="0078129341"
                      className="w-full px-3 py-2 bg-white border border-sky-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-sky-900 uppercase mb-1">
                      Kelas
                    </label>
                    <input
                      type="text"
                      value={userForm.classGrade}
                      onChange={(e) => setUserForm({ ...userForm, classGrade: e.target.value })}
                      placeholder="XI MIPA 2"
                      className="w-full px-3 py-2 bg-white border border-sky-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              )}

              {/* Sekolah */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Sekolah / Lembaga
                </label>
                <input
                  type="text"
                  value={userForm.school}
                  onChange={(e) => setUserForm({ ...userForm, school: e.target.value })}
                  placeholder="SMA Negeri 1 Jakarta"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Email (Opsional)
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder={
                    userForm.role === 'admin'
                      ? 'nama@sekolah.sch.id'
                      : 'nama@siswa.belajar.id'
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {editingUser
                      ? 'Simpan Perubahan'
                      : userForm.role === 'admin'
                      ? 'Buat Akun Admin'
                      : 'Simpan Data Siswa'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL DETAIL RAPOR SISWA ================= */}
      {selectedStudentForReport && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedStudentForReport.fullName}</h3>
                <p className="text-xs text-slate-500">
                  Kelas {selectedStudentForReport.classGrade} &bull; NISN: {selectedStudentForReport.nisn}
                </p>
              </div>
              <button
                onClick={() => setSelectedStudentForReport(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-600 uppercase">Riwayat Nilai Per Bab</span>
              {assessments.filter((a) => a.studentName.toLowerCase() === selectedStudentForReport.fullName.toLowerCase()).length === 0 ? (
                <div className="p-4 bg-slate-50 text-slate-500 text-center rounded-xl text-xs">
                  Siswa ini belum mengerjakan asesmen apapun.
                </div>
              ) : (
                assessments
                  .filter((a) => a.studentName.toLowerCase() === selectedStudentForReport.fullName.toLowerCase())
                  .map((a) => (
                    <div key={a.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                      <div className="font-bold text-slate-900">{a.chapterTitle}</div>
                      <div className="flex items-center justify-between text-slate-600 text-[11px]">
                        <span>Pretest: <b>{a.pretestScore}</b></span>
                        <span>Post-test: <b className="text-emerald-800">{a.posttestScore}</b></span>
                        <span>N-Gain: <b>{a.nGainScore}</b></span>
                        <span className={`px-1.5 py-0.5 rounded font-bold ${a.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {a.passed ? 'LULUS KKM' : 'REMEDIAL'}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200 text-right">
              <button
                onClick={() => setSelectedStudentForReport(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
