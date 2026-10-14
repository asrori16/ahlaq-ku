import React from 'react';
import { Chapter, UserAccount, AssessmentRecord } from '../../types';
import { AdminTab } from './types';

interface AdminOverviewTabProps {
  chapters: Chapter[];
  userList: UserAccount[];
  assessments: AssessmentRecord[];
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  chapters,
  userList,
  assessments,
  onNavigateTab,
}) => {
  const studentUsers = userList.filter((u) => u.role === 'student');
  const adminUsers = userList.filter((u) => u.role === 'admin');

  const passedStudentsCount = assessments.filter((a) => a.passed).length;
  const avgPretest = assessments.length > 0
    ? Math.round(assessments.reduce((acc, a) => acc + (a.pretestScore || 0), 0) / assessments.length)
    : 0;

  const avgPosttest = assessments.length > 0
    ? Math.round(assessments.reduce((acc, a) => acc + (a.posttestScore || 0), 0) / assessments.length)
    : 0;

  const avgNGain = assessments.length > 0
    ? (assessments.reduce((acc, a) => acc + (Number(a.nGainScore) || 0), 0) / assessments.length).toFixed(2)
    : '0.00';

  const passRate = assessments.length > 0
    ? Math.round((passedStudentsCount / assessments.length) * 100)
    : 0;

  const sem1Count = chapters.filter((c) => c.semester === 1).length;
  const sem2Count = chapters.filter((c) => c.semester === 2).length;
  const totalPretest = chapters.reduce((sum, c) => sum + (c.pretest?.length || 0), 0);

  const recentAssessments = [...assessments]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-5">
      {/* 5 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div 
          onClick={() => onNavigateTab('materi')} 
          className="bg-white p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-emerald-400 hover:shadow-2xs transition-all"
        >
          <div className="text-xs text-slate-500">Total Bab Materi</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{chapters.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Sem 1: {sem1Count} &bull; Sem 2: {sem2Count}</div>
        </div>

        <div 
          onClick={() => onNavigateTab('materi')} 
          className="bg-white p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-amber-400 hover:shadow-2xs transition-all"
        >
          <div className="text-xs text-slate-500">Soal Asesmen</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalPretest}</div>
          <div className="text-[11px] text-amber-700 mt-0.5">Pre &amp; Post-Test Tersinkron</div>
        </div>

        <div 
          onClick={() => onNavigateTab('users')} 
          className="bg-white p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="text-xs text-slate-500">Siswa Terdaftar</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{studentUsers.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Akun siswa aktif</div>
        </div>

        <div 
          onClick={() => onNavigateTab('users')} 
          className="bg-white p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="text-xs text-slate-500">Guru & Admin</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{adminUsers.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Pengelola sistem</div>
        </div>

        <div 
          onClick={() => onNavigateTab('nilai')} 
          className="bg-white p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="text-xs text-slate-500">Asesmen Selesai</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{assessments.length}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">{passedStudentsCount} Lulus ({passRate}%)</div>
        </div>
      </div>

      {/* Rata-rata Nilai Asesmen */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Rata-rata Nilai Asesmen</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="text-[11px] text-slate-500">Pretest</div>
            <div className="text-xl font-bold text-slate-800 font-mono mt-0.5">{avgPretest}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="text-[11px] text-slate-500">Posttest</div>
            <div className="text-xl font-bold text-emerald-800 font-mono mt-0.5">{avgPosttest}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="text-[11px] text-slate-500">N-Gain</div>
            <div className="text-xl font-bold text-slate-800 font-mono mt-0.5">{avgNGain}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="text-[11px] text-slate-500">Kelulusan KKM (&ge; 75)</div>
            <div className="text-xl font-bold text-emerald-800 font-mono mt-0.5">{passRate}%</div>
          </div>
        </div>
      </div>

      {/* Tabel Asesmen Terbaru */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">Aktivitas Asesmen Terbaru</div>
          <button
            type="button"
            onClick={() => onNavigateTab('nilai')}
            className="text-xs font-medium text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            Lihat Semua &rarr;
          </button>
        </div>

        {recentAssessments.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">Belum ada riwayat asesmen siswa.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px]">
                  <th className="pb-2">Siswa</th>
                  <th className="pb-2">Bab</th>
                  <th className="pb-2 text-center">Pretest</th>
                  <th className="pb-2 text-center">Posttest</th>
                  <th className="pb-2 text-center">N-Gain</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAssessments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="py-2.5 font-semibold text-slate-900">{a.studentName}</td>
                    <td className="py-2.5 text-slate-600 truncate max-w-[200px]">{a.chapterTitle}</td>
                    <td className="py-2.5 text-center font-mono">{a.pretestScore}</td>
                    <td className="py-2.5 text-center font-mono font-bold text-emerald-800">{a.posttestScore}</td>
                    <td className="py-2.5 text-center font-mono">{a.nGainScore}</td>
                    <td className="py-2.5 text-right">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        a.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {a.passed ? 'Lulus' : 'Remedial'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
