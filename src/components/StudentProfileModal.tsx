import React, { useState } from 'react';
import { User, Save, X } from 'lucide-react';
import { saveStudentProfile } from '../services/supabaseService';
import { AssessmentRecord } from '../types';

interface StudentProfileModalProps {
  currentName: string;
  currentSchool: string;
  assessments: AssessmentRecord[];
  onSave: (name: string, school: string) => void;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  currentName,
  currentSchool,
  assessments,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(currentName);
  const [school, setSchool] = useState(currentSchool);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    saveStudentProfile(name.trim(), school.trim());
    onSave(name.trim(), school.trim());
    onClose();
  };

  const totalPassed = assessments.filter(a => a.passed).length;
  const avgPosttest = assessments.length > 0
    ? Math.round(assessments.reduce((acc, curr) => acc + curr.posttestScore, 0) / assessments.length)
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Profil Peserta Didik</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap Siswa
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Ahmad Fauzi"
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Nama ini akan tertera pada Sertifikat Kelulusan dan Rapor Pembelajaran.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Satuan Pendidikan / Asal Sekolah
            </label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="Contoh: SMAN 1 Jakarta"
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tingkat Kelas
            </label>
            <input
              type="text"
              value="Kelas XI (Sebelas) SMA"
              disabled
              className="w-full text-xs sm:text-sm bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* Quick Learning Stats */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 grid grid-cols-2 gap-3 text-center">
            <div>
              <span className="text-[10px] font-semibold text-emerald-800 uppercase">Bab Tuntas (Lulus)</span>
              <p className="text-xl font-bold text-emerald-900 font-mono">{totalPassed} Bab</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-emerald-800 uppercase">Rerata Post-Test</span>
              <p className="text-xl font-bold text-emerald-900 font-mono">{avgPosttest} / 100</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
