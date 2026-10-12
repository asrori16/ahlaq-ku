import React from 'react';
import { Chapter, AssessmentRecord } from '../types';
import { Award, Printer, CheckCircle, AlertCircle, ArrowRight, BookOpen } from 'lucide-react';

interface ReportCardViewProps {
  chapters: Chapter[];
  assessments: AssessmentRecord[];
  studentName: string;
  schoolName: string;
  onOpenCertificate: (chapter: Chapter, record: AssessmentRecord) => void;
  onSelectChapter: (chapter: Chapter) => void;
}

export const ReportCardView: React.FC<ReportCardViewProps> = ({
  chapters,
  assessments,
  studentName,
  schoolName,
  onOpenCertificate,
  onSelectChapter,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const completedCount = assessments.filter(a => a.passed).length;
  const avgPosttest = assessments.length > 0
    ? Math.round(assessments.reduce((acc, curr) => acc + curr.posttestScore, 0) / assessments.length)
    : 0;
  const avgPretest = assessments.length > 0
    ? Math.round(assessments.reduce((acc, curr) => acc + curr.pretestScore, 0) / assessments.length)
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner and Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Rapor Asesmen Akhlak
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {studentName} · {schoolName} · KKM: 75
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Rapor</span>
        </button>
      </div>

      {/* Rapor Sheet (Printable) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Kop Rapor */}
        <div className="border-b-2 border-slate-900 pb-4 text-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600">
            LAPORAN HASIL PENILAIAN KOMPETENSI SISWA
          </h3>
          <h2 className="text-lg sm:text-xl font-extrabold uppercase text-slate-900 mt-0.5">
            MATA PELAJARAN PENDIDIKAN AGAMA ISLAM & BUDI PEKERTI
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            FASE F · KELAS XI (SEBELAS) SMA / MA · TAHUN AJARAN 2026/2027
          </p>
        </div>

        {/* Identitas Siswa */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500">Nama Siswa:</span>
            <p className="font-bold text-slate-900">{studentName}</p>
          </div>
          <div>
            <span className="text-slate-500">Asal Sekolah:</span>
            <p className="font-bold text-slate-900">{schoolName}</p>
          </div>
          <div>
            <span className="text-slate-500">Tingkat / Fase:</span>
            <p className="font-bold text-slate-900">Kelas XI / Fase F</p>
          </div>
          <div>
            <span className="text-slate-500">Status Kelulusan:</span>
            <p className={`font-bold ${completedCount >= chapters.length ? 'text-emerald-700' : 'text-amber-700'}`}>
              {completedCount} dari {chapters.length} Bab Tuntas
            </p>
          </div>
        </div>

        {/* Tabel Rekap Nilai Pre-Test & Post-Test */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-y border-slate-200">
                <th className="py-3 px-3 w-12 text-center">Bab</th>
                <th className="py-3 px-4">Judul Materi Pembelajaran</th>
                <th className="py-3 px-3 text-center">Pre-Test</th>
                <th className="py-3 px-3 text-center">Post-Test</th>
                <th className="py-3 px-3 text-center">N-Gain</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chapters.map((chapter) => {
                const record = assessments.find(a => a.chapterId === chapter.id);
                const isPassed = record?.passed || false;

                return (
                  <tr key={chapter.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-center font-bold text-emerald-800">
                      {chapter.number}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">{chapter.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{chapter.subtitle}</p>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-medium">
                      {record ? `${record.pretestScore}` : '-'}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-700">
                      {record ? `${record.posttestScore}` : '-'}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-600">
                      {record ? `+${record.nGainScore}` : '-'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {record ? (
                        isPassed ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle className="w-3 h-3" />
                            TUNTAS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            REMIDIAL
                          </span>
                        )
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          Belum Tes
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center no-print">
                      {isPassed && record ? (
                        <button
                          onClick={() => onOpenCertificate(chapter, record)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Sertifikat</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectChapter(chapter)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:underline cursor-pointer"
                        >
                          <span>Pelajari</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-200 text-xs sm:text-sm">
                <td colSpan={2} className="py-3 px-4 text-slate-800">
                  Rata-rata Kelas XI ({studentName})
                </td>
                <td className="py-3 px-3 text-center font-mono">{avgPretest || '-'}</td>
                <td className="py-3 px-3 text-center font-mono text-emerald-700">{avgPosttest || '-'}</td>
                <td colSpan={4} className="py-3 px-4 text-slate-500 text-xs text-right">
                  Standar Kelulusan Minimum (KKM) = 75
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Tanda Tangan Resmi Pengesahan Rapor */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs text-slate-700">
          <div>
            <p>Mengetahui,</p>
            <p className="font-semibold text-slate-900">Orang Tua / Wali Murid</p>
            <div className="h-16" />
            <p className="font-bold underline text-slate-900">................................................</p>
          </div>
          <div>
            <p>Jakarta, 2026</p>
            <p className="font-semibold text-slate-900">Guru Pamong PAI & Budi Pekerti</p>
            <div className="h-16" />
            <p className="font-bold underline text-slate-900">Drs. H. M. Asrori, M.Pd.I</p>
            <p className="text-[10px] text-slate-500">NIP. 19780512 200312 1 002</p>
          </div>
        </div>
      </div>
    </div>
  );
};
