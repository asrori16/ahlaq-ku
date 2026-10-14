import React, { useRef, useState, useEffect } from 'react';
import { Chapter } from '../types';
import { Printer, Download, ArrowLeft, BookOpen, Video, FileText, Eye, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { getMediaBlob } from '../services/mediaStorage';

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
  const [actualPdfUrl, setActualPdfUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'uploaded' | 'template'>(
    chapter.pdfFileKey || (chapter.pdfFileUrl && !chapter.pdfFileUrl.startsWith('blob:')) ? 'uploaded' : 'template'
  );
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // If there is an IndexedDB key, ALWAYS fetch a fresh valid object URL
    if (chapter.pdfFileKey) {
      setIsLoadingPdf(true);
      setLoadError(null);
      getMediaBlob(chapter.pdfFileKey)
        .then((url) => {
          if (!isMounted) return;
          if (url) {
            setActualPdfUrl(url);
            setViewMode('uploaded');
          } else if (chapter.pdfFileUrl && !chapter.pdfFileUrl.startsWith('blob:')) {
            // Fallback to valid external/direct URL if not a stale blob: URL
            setActualPdfUrl(chapter.pdfFileUrl);
            setViewMode('uploaded');
          } else {
            // Blob URL expired or was not stored in this browser session
            setActualPdfUrl(null);
            setViewMode('template');
            setLoadError('Berkas PDF unggahan tidak ditemukan di penyimpanan peramban ini. Menampilkan format Modul Resmi standar.');
          }
        })
        .catch((err) => {
          console.warn('Gagal memuat media blob PDF:', err);
          if (!isMounted) return;
          if (chapter.pdfFileUrl && !chapter.pdfFileUrl.startsWith('blob:')) {
            setActualPdfUrl(chapter.pdfFileUrl);
            setViewMode('uploaded');
          } else {
            setActualPdfUrl(null);
            setViewMode('template');
          }
        })
        .finally(() => {
          if (isMounted) setIsLoadingPdf(false);
        });
    } else if (chapter.pdfFileUrl && !chapter.pdfFileUrl.startsWith('blob:')) {
      // Valid persistent URL (e.g. https://... or public asset)
      setActualPdfUrl(chapter.pdfFileUrl);
      setViewMode('uploaded');
    } else {
      // No uploaded PDF or only stale blob URL without key
      setActualPdfUrl(null);
      setViewMode('template');
    }

    return () => {
      isMounted = false;
    };
  }, [chapter.pdfFileKey, chapter.pdfFileUrl]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6">
      {/* Top Document Action Bar (hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-4 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 no-print">
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
              {chapter.pdfFileName ? `File: ${chapter.pdfFileName}` : 'Format Standar Modul Ajar Kurikulum Merdeka'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {actualPdfUrl && (
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs mr-1">
              <button
                type="button"
                onClick={() => setViewMode('uploaded')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  viewMode === 'uploaded' ? 'bg-rose-700 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Berkas PDF Asli
              </button>
              <button
                type="button"
                onClick={() => setViewMode('template')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  viewMode === 'template' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Modul Resmi (Cetak)
              </button>
            </div>
          )}

          {actualPdfUrl && (
            <a
              href={actualPdfUrl}
              download={chapter.pdfFileName || `Bab_${chapter.number}_Materi.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-rose-700" />
              <span>Unduh PDF</span>
            </a>
          )}

          <button
            onClick={() => onOpenEbook(chapter)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Format E-Book</span>
          </button>

          <button
            onClick={() => onOpenVideo(chapter)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-slate-600" />
            <span>Video</span>
          </button>
        </div>
      </div>

      {/* Info Notice when uploaded file cannot be found in browser storage */}
      {loadError && (
        <div className="max-w-4xl mx-auto mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{loadError}</span>
          </div>
          <button
            type="button"
            onClick={() => setLoadError(null)}
            className="text-amber-900 font-bold hover:underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* View Mode: Uploaded PDF iframe */}
      {viewMode === 'uploaded' && actualPdfUrl ? (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-rose-600" />
              {chapter.pdfFileName || 'Dokumen PDF Materi Pembelajaran'}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Jika pratinjau browser tidak muncul:
              </span>
              <a
                href={actualPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Buka di Tab Baru</span>
              </a>
              <button
                type="button"
                onClick={() => setViewMode('template')}
                className="text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
              >
                Lihat Modul Cetak &rarr;
              </button>
            </div>
          </div>
          {isLoadingPdf ? (
            <div className="h-[75vh] flex items-center justify-center text-slate-400 gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Memuat berkas PDF...</span>
            </div>
          ) : (
            <iframe
              src={actualPdfUrl}
              title={`PDF Bab ${chapter.number}`}
              className="w-full h-[85vh] border-0"
            />
          )}
        </div>
      ) : (
      /* Realistic Multi-page A4 PDF Paper Sheet */
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
            KELAS XI (SEBELAS) SMA/SMK · KURIKULUM MERDEKA
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
            <span className="font-semibold text-slate-900">
              {chapter.pdfContent?.totalStudyHours || `${chapter.durationMinutes || 45} Menit (2 JP)`}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Penyusun: </span>
            <span className="font-semibold text-slate-900">
              {chapter.pdfContent?.author || 'Tim Guru PAI & Budi Pekerti'}
            </span>
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
            {(chapter.learningObjectives || []).map((obj, oIdx) => (
              <li key={oIdx} className="leading-relaxed">
                {obj}
              </li>
            ))}
          </ul>
        </section>

        {/* Bagian II: Landasan Dalil Naqli */}
        {chapter.dalilUtama && (
          <section className="mb-8 p-5 rounded-xl bg-emerald-50/50 border border-emerald-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 mb-3">
              II. Landasan Dalil Naqli ({chapter.dalilUtama.surah || 'Dalil Syariat'})
            </h3>
            {chapter.dalilUtama.arabic && (
              <p className="font-arabic text-xl sm:text-2xl text-right leading-loose font-bold text-emerald-950 mb-3">
                {chapter.dalilUtama.arabic}
              </p>
            )}
            {chapter.dalilUtama.transliteration && (
              <p className="text-xs text-slate-700 font-medium italic mb-2">
                Transliterasi: {chapter.dalilUtama.transliteration}
              </p>
            )}
            {chapter.dalilUtama.translation && (
              <p className="text-xs text-slate-800 leading-relaxed font-serif">
                Artinya: "{chapter.dalilUtama.translation}"
              </p>
            )}
          </section>
        )}

        {/* Bagian III: Ringkasan Materi Inti */}
        <section className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
            III. Rangkuman Materi Pokok
          </h3>
          <div className="space-y-2.5">
            {(chapter.pdfContent?.summaryPoints || chapter.learningObjectives || []).map((point, pIdx) => (
              <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bagian IV: Studi Kasus Kontekstual Remaja */}
        {(chapter.pdfContent?.caseStudies || []).length > 0 && (
          <section className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
              IV. Studi Kasus Remaja SMA
            </h3>
            {chapter.pdfContent!.caseStudies.map((cs, cIdx) => (
              <div key={cIdx} className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900">{cs.caseTitle}</h4>
                <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3 rounded border border-slate-100">
                  "{cs.story}"
                </p>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-800">Pertanyaan Pemantik Diskusi:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-slate-600">
                    {(cs.discussionQuestions || []).map((q, qIdx) => (
                      <li key={qIdx} className="leading-relaxed">{q}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </section>
        )}

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
      </div>
      )}
    </div>
  );
};
