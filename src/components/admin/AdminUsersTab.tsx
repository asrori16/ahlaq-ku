import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Save, 
  X 
} from 'lucide-react';
import { UserAccount, AssessmentRecord, UserRole } from '../../types';
import { addUser, updateUser, deleteUser } from '../../services/authService';

interface AdminUsersTabProps {
  currentUser: UserAccount;
  userList: UserAccount[];
  assessments: AssessmentRecord[];
  onRefreshUsers: () => void;
  showToast: (msg: string) => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  currentUser,
  userList,
  assessments,
  onRefreshUsers,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'student' | 'admin'>('all');

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
    onRefreshUsers();
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
      onRefreshUsers();
    }
  };

  return (
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
            className="inline-flex items-center justify-center px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            + Tambah Admin
          </button>

          <button
            type="button"
            onClick={() => handleOpenAddUser('student')}
            className="inline-flex items-center justify-center px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            + Tambah Siswa
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
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Admin / Guru
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
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

      {/* ================= MODAL TAMBAH/EDIT PENGGUNA ================= */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-800" />
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
                    className={`flex items-center justify-center py-2 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      userForm.role === 'student'
                        ? 'bg-sky-50 border-sky-500 text-sky-800 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>Siswa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserForm({ ...userForm, role: 'admin' })}
                    className={`flex items-center justify-center py-2 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      userForm.role === 'admin'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
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
                type="button"
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
                type="button"
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
