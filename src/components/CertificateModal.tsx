import React from 'react';
import { Chapter, AssessmentRecord } from '../types';
import { Award, Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface CertificateModalProps {
  chapter: Chapter;
  record: AssessmentRecord;
  schoolName: string;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  chapter,
  record,
  schoolName,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const certificateNumber = `AKHLAQ-XI/2026/${String(chapter.id).padStart(2, '0')}/${record.id.slice(-6).toUpperCase()}`;
  const completionDate = new Date(record.timestamp).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Top Modal Bar (no-print) */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span className="text-xs sm:text-sm font-bold text-slate-900">
              Sertifikat Kelulusan Modul Pembelajaran
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sertifikat</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas (Printable Area) */}
        <div className="p-8 sm:p-14 bg-[#FCFBF8] text-slate-900 relative border-8 border-double border-emerald-900/40 m-4 rounded-xl shadow-inner">
          {/* Corner Islamic Ornaments */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-emerald-700 pointer-events-none" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-emerald-700 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-emerald-700 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-emerald-700 pointer-events-none" />

          {/* Certificate Header */}
          <div className="text-center space-y-2 mb-8">
            <p className="font-arabic text-xl sm:text-2xl text-emerald-900 font-semibold">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-emerald-950 uppercase font-serif">
              SERTIFIKAT KOMPETENSI AKHLAK
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">
              No. Registrasi: {certificateNumber}
            </p>
          </div>

          {/* Certificate Body */}
          <div className="text-center space-y-4 max-w-2xl mx-auto my-8">
            <p className="text-xs sm:text-sm text-slate-600">
              Diberikan dengan penuh apresiasi dan kehormatan kepada:
            </p>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight border-b-2 border-emerald-800/20 pb-2 inline-block px-8">
              {record.studentName}
            </h2>

            <p className="text-xs text-slate-500 font-medium">
              Siswa Kelas XI SMA · {schoolName}
            </p>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-2">
              Telah menyelesaikan seluruh rangkaian pembelajaran e-learning, meliputi penelaahan modul ajar PDF & E-Book, tuntas menonton video tutorial interaktif, serta <strong>LULUS DENGAN PRESTASI</strong> pada asesmen kompetensi:
            </p>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 inline-block text-xs sm:text-sm font-bold text-emerald-900">
              Bab {chapter.number}: {chapter.title}
            </div>

            {/* Assessment Score Metrics */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-4 text-center">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Pre-Test</span>
                <p className="text-base font-bold text-slate-700 font-mono">{record.pretestScore}/100</p>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-100/60 border border-emerald-300">
                <span className="text-[10px] text-emerald-800 uppercase font-bold">Post-Test</span>
                <p className="text-base font-bold text-emerald-800 font-mono">{record.posttestScore}/100</p>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">N-Gain</span>
                <p className="text-base font-bold text-slate-700 font-mono">+{record.nGainScore}</p>
              </div>
            </div>
          </div>

          {/* Footer Signatures & QR Code */}
          <div className="mt-12 pt-6 grid grid-cols-3 gap-4 items-end text-center text-xs text-slate-700">
            {/* Verification Seal */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-16 h-16 rounded-full border-2 border-emerald-700 flex items-center justify-center bg-emerald-50 text-emerald-800 shadow-xs">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">
                Terverifikasi Resmi
              </span>
            </div>

            {/* Date */}
            <div>
              <p className="text-[11px] text-slate-500">Diterbitkan pada:</p>
              <p className="font-semibold text-slate-800">{completionDate}</p>
            </div>

            {/* Signature */}
            <div>
              <p className="text-[11px] text-slate-500">Guru Pembimbing PAI,</p>
              <div className="h-12" />
              <p className="font-bold underline text-slate-900">Drs. H. M. Asrori, M.Pd.I</p>
              <p className="text-[10px] text-slate-500">NIP. 19780512 200312 1 002</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
