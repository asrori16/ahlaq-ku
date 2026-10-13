import React, { useState } from 'react';
import { BookOpen, User, Lock, ShieldCheck, GraduationCap, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { loginUser, addStudentUser } from '../services/authService';
import { UserAccount, UserRole } from '../types';

interface LoginFormProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register fields
  const [regFullName, setRegFullName] = useState('');
  const [regNisn, setRegNisn] = useState('');
  const [regClassGrade, setRegClassGrade] = useState('XI MIPA 2');
  const [regSchool, setRegSchool] = useState('SMA Negeri 1 Jakarta');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!username.trim() || !password) {
      setErrorMessage('Silakan lengkapi nama pengguna/NISN dan kata sandi.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await loginUser(username, password, selectedRole);
      if (!result.success || !result.user) {
        setErrorMessage(result.error || 'Autentikasi gagal.');
        return;
      }

      setSuccessMessage(`Berhasil masuk sebagai ${result.user.fullName}!`);
      setTimeout(() => {
        onLoginSuccess(result.user!);
      }, 400);
    } catch {
      setErrorMessage('Terjadi kendala saat memverifikasi login. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regFullName.trim() || !regNisn.trim() || !regUsername.trim() || !regPassword) {
      setErrorMessage('Mohon lengkapi seluruh formulir pendaftaran.');
      return;
    }

    const res = addStudentUser({
      fullName: regFullName,
      username: regUsername,
      password: regPassword,
      nisn: regNisn,
      classGrade: regClassGrade,
      school: regSchool,
    });

    if (!res.success || !res.user) {
      setErrorMessage(res.error || 'Pendaftaran gagal.');
      return;
    }

    setSuccessMessage('Pendaftaran berhasil! Mengalihkan ke akun Anda...');
    setTimeout(() => {
      onLoginSuccess(res.user!);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Container Card */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header Branding */}
        <div className="bg-emerald-800 text-white p-6 sm:p-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 text-white mb-3 backdrop-blur-xs border border-white/20">
            <BookOpen className="w-7 h-7 text-emerald-200" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">AKHLAQ KU</h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xs mx-auto">
            Pembelajaran PAI & Budi Pekerti Berbasis Modul Interaktif
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {/* Role Switcher Tab (Siswa vs Guru/Admin) */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('student');
                setIsRegisterMode(false);
                setErrorMessage('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedRole === 'student' && !isRegisterMode
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              <span>Siswa</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('admin');
                setIsRegisterMode(false);
                setErrorMessage('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Guru / Admin</span>
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form Login Mode */}
          {!isRegisterMode ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  {selectedRole === 'student' ? 'Nama Pengguna / NISN' : 'Nama Pengguna (Username)'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={selectedRole === 'student' ? 'Contoh: siswa atau 0078129341' : 'Contoh: admin'}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>
                  {isSubmitting
                    ? 'Memverifikasi Sandi...'
                    : `Masuk sebagai ${selectedRole === 'admin' ? 'Guru / Admin' : 'Siswa'}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Register Mode (Khusus Siswa Baru) */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Contoh: Muhammad Haidar"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    NISN
                  </label>
                  <input
                    type="text"
                    value={regNisn}
                    onChange={(e) => setRegNisn(e.target.value)}
                    placeholder="0081234567"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Kelas
                  </label>
                  <input
                    type="text"
                    value={regClassGrade}
                    onChange={(e) => setRegClassGrade(e.target.value)}
                    placeholder="XI MIPA 1"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Sekolah
                </label>
                <input
                  type="text"
                  value={regSchool}
                  onChange={(e) => setRegSchool(e.target.value)}
                  placeholder="SMA Negeri 1 Jakarta"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="haidar11"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="******"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Daftar & Langsung Masuk
              </button>
            </form>
          )}

          {/* Toggle Register / Login */}
          {selectedRole === 'student' && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setErrorMessage('');
                }}
                className="text-xs text-emerald-800 hover:text-emerald-900 font-semibold underline cursor-pointer"
              >
                {isRegisterMode ? 'Sudah punya akun? Masuk di sini' : 'Belum terdaftar? Daftar Siswa Baru di sini'}
              </button>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 text-center text-[11px] text-slate-500">
          Kurikulum Merdeka &bull; Pendidikan Agama Islam & Budi Pekerti
        </div>
      </div>
    </div>
  );
};
