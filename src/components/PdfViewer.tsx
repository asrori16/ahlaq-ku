import React, { useRef } from 'react';
import { Chapter } from '../types';
import { Printer, Download, ArrowLeft, BookOpen, Video, CheckCircle2 } from 'lucide-react';

interface PdfViewerProps {
  chapter: Chapter;
  onBack: () => void;
  onOpenEbook: (chapter: Chapter) => void;
  onOpenVideo: (chapter: Chapter) => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  chapter,
  onBack,
  onOpenEbook,
  onOpenVideo,
}) => {
  const documentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6">
      {/* Top Document Action Bar (hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-6 bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
          <div>
            <span className="text-xs font-bold text-slate-900">
              Modul Dokumen PDF · Bab {chapter.number}
            </span>
            <p className="text-[11px] text-slate-500">
              Format Standar Modul Ajar Kurikulum Merdeka Fase F
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenEbook(chapter)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Buka Format E-Book</span>
          </button>

          <button
            onClick={() => onOpenVideo(chapter)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-slate-600" />
            <span>Video Pembelajaran</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* Realistic Multi-page A4 PDF Paper Sheet */}
      <div
        ref={documentRef}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 p-8 sm:p-14 text-slate-900 print:shadow-none print:border-none print:p-0 print:m-0"
      >
        {/* Kop Modul Ajar Resmi */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
          <h4 className="text-xs font-bold tracking-widest uppercase text-slate-600">
            KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
          </h4>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 uppercase mt-1">
            MODUL AJAR PENDIDIKAN AGAMA ISLAM & BUDI PEKERTI
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            FASE F · KELAS XI (SEBELAS) SMA/SMK · KURIKULUM MERDEKA
          </p>
        </div>

        {/* Identitas Modul Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-8 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <span className="text-slate-500 font-medium">Mata Pelajaran: </span>
            <span className="font-semibold text-slate-900">PAI & Budi Pekerti (Akhlak)</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Satuan Pendidikan: </span>
            <span className="font-semibold text-slate-900">SMA / MA Kelas XI</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Alokasi Waktu: </span>
            <span className="font-semibold text-slate-900">{chapter.pdfContent.totalStudyHours}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Penyusun: </span>
            <span className="font-semibold text-slate-900">{chapter.pdfContent.author}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-slate-500 font-medium">Topik / Bab: </span>
            <span className="font-bold text-emerald-800">
              Bab {chapter.number}: {chapter.title}
            </span>
          </div>
        </div>

        {/* Bagian I: Capaian & Tujuan Pembelajaran */}
        <section className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
            I. Capaian & Tujuan Pembelajaran
          </h3>
          <p className="text-xs text-slate-600 mb-2 leading-relaxed">
            Peserta didik mampu menganalisis dalil naqli, mengontekstualisasikan nilai-nilai akhlakul karimah dalam problematika remaja modern, serta membiasakan sikap terpuji dalam kehidupan sosial.
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700">
            {chapter.learningObjectives.map((obj, oIdx) => (
              <li key={oIdx} className="leading-relaxed">
                {obj}
              </li>
            ))}
          </ul>
        </section>

        {/* Bagian II: Landasan Dalil Naqli */}
        <section className="mb-8 p-5 rounded-xl bg-emerald-50/50 border border-emerald-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 mb-3">
            II. Landasan Dalil Naqli ({chapter.dalilUtama.surah})
          </h3>
          <p className="font-arabic text-xl sm:text-2xl text-right leading-loose font-bold text-emerald-950 mb-3">
            {chapter.dalilUtama.arabic}
          </p>
          <p className="text-xs text-slate-700 font-medium italic mb-2">
            Transliterasi: {chapter.dalilUtama.transliteration}
          </p>
          <p className="text-xs text-slate-800 leading-relaxed font-serif">
            Artinya: "{chapter.dalilUtama.translation}"
          </p>
        </section>

        {/* Bagian III: Ringkasan Materi Inti */}
        <section className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
            III. Rangkuman Materi Pokok
          </h3>
          <div className="space-y-2.5">
            {chapter.pdfContent.summaryPoints.map((point, pIdx) => (
              <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bagian IV: Studi Kasus Kontekstual Remaja */}
        <section className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
            IV. Studi Kasus Remaja SMA
          </h3>
          {chapter.pdfContent.caseStudies.map((cs, cIdx) => (
            <div key={cIdx} className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900">{cs.caseTitle}</h4>
              <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3 rounded border border-slate-100">
                "{cs.story}"
              </p>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-800">Pertanyaan Pemantik Diskusi:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs text-slate-600">
                  {cs.discussionQuestions.map((q, qIdx) => (
                    <li key={qIdx} className="leading-relaxed">{q}</li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </section>

        {/* Bagian V: Lembar Kerja Siswa (LKS) */}
        <section className="border-t border-slate-200 pt-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
            V. Lembar Kerja Siswa (LKS Refleksi Diri)
          </h3>
          <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
            <div className="grid grid-cols-12 bg-slate-100 font-bold p-2.5 border-b border-slate-300">
              <div className="col-span-1 text-center">No</div>
              <div className="col-span-7">Pernyataan Sikap & Pembiasaan Akhlak</div>
              <div className="col-span-2 text-center">Selalu</div>
              <div className="col-span-2 text-center">Kadang-kadang</div>
            </div>
            <div className="grid grid-cols-12 p-2.5 border-b border-slate-200">
              <div className="col-span-1 text-center font-medium">1</div>
              <div className="col-span-7">Saya berusaha menjaga pandangan dan kehormatan diri baik di sekolah maupun media sosial.</div>
              <div className="col-span-2 text-center">[ &nbsp; ]</div>
              <div className="col-span-2 text-center">[ &nbsp; ]</div>
            </div>
            <div className="grid grid-cols-12 p-2.5 border-b border-slate-200">
              <div className="col-span-1 text-center font-medium">2</div>
              <div className="col-span-7">Saya berani menolak ajakan berbuat curang saat ulangan harian.</div>
              <div className="col-span-2 text-center">[ &nbsp; ]</div>
              <div className="col-span-2 text-center">[ &nbsp; ]</div>
            </div>
            <div className="grid grid-cols-12 p-2.5">
              <div className="col-span-1 text-center font-medium">3</div>
              <div className="col-span-7">Saya senantiasa mendoakan kebaikan orang tua dan bapak/ibu guru setelah shalat.</div>
              <div className="col-span-2 text-center">[ &nbsp; ]</div>
              <div className="col-span-2 text-center">[ &nbsp; ]</div>
            </div>
          </div>
        </section>

        {/* Tanda Tangan Pengesahan Guru & Wali */}
        <div className="mt-12 pt-6 grid grid-cols-2 gap-8 text-center text-xs text-slate-700">
          <div>
            <p>Mengetahui,</p>
            <p className="font-semibold text-slate-900">Guru Pamong PAI & Budi Pekerti</p>
            <div className="h-16" />
            <p className="font-bold underline text-slate-900">Drs. H. M. Asrori, M.Pd.I</p>
            <p className="text-[10px] text-slate-500">NIP. 19780512 200312 1 002</p>
          </div>
          <div>
            <p>Jakarta, 2026</p>
            <p className="font-semibold text-slate-900">Siswa / Peserta Didik</p>
            <div className="h-16" />
            <p className="font-bold underline text-slate-900">................................................</p>
            <p className="text-[10px] text-slate-500">NISN / Kelas XI SMA</p>
          </div>
        </div>
      </div>
    </div>
  );
};
