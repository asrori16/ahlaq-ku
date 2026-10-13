import React from 'react';
import { Printer, Award } from 'lucide-react';
import { AssessmentRecord } from '../../types';

interface AdminNilaiTabProps {
  assessments: AssessmentRecord[];
}

export const AdminNilaiTab: React.FC<AdminNilaiTabProps> = ({
  assessments,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Rekapitulasi Penilaian Siswa</h3>
          <p className="text-xs text-slate-500">Hasil pengerjaan Pretest, Post-test, dan N-Gain seluruh siswa</p>
        </div>

        <button
          type="button"
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
            <Award className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">Belum ada riwayat asesmen siswa</p>
            <p className="text-xs text-slate-400 mt-1">Hasil kuis siswa akan otomatis tercatat di sini.</p>
          </div>
        )}
      </div>
    </div>
  );
};
