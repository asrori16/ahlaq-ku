import React, { useState, useEffect } from 'react';
import { Chapter } from '../types';
import { Download, ArrowLeft, BookOpen, Video, FileText, Eye, AlertTriangle, RefreshCw } from 'lucide-react';
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
  const [actualPdfUrl, setActualPdfUrl] = useState<string | null>(null);
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
          } else if (chapter.pdfFileUrl && !chapter.pdfFileUrl.startsWith('blob:')) {
            // Fallback to valid external/direct URL if not a stale blob: URL
            setActualPdfUrl(chapter.pdfFileUrl);
          } else {
            setActualPdfUrl(null);
            setLoadError('Berkas PDF unggahan tidak ditemukan di penyimpanan peramban ini.');
          }
        })
        .catch((err) => {
          console.warn('Gagal memuat media blob PDF:', err);
          if (!isMounted) return;
          if (chapter.pdfFileUrl && !chapter.pdfFileUrl.startsWith('blob:')) {
            setActualPdfUrl(chapter.pdfFileUrl);
          } else {
            setActualPdfUrl(null);
          }
        })
        .finally(() => {
          if (isMounted) setIsLoadingPdf(false);
        });
    } else if (chapter.pdfFileUrl) {
      setActualPdfUrl(chapter.pdfFileUrl);
    } else {
      setActualPdfUrl(null);
    }

    return () => {
      isMounted = false;
    };
  }, [chapter.pdfFileKey, chapter.pdfFileUrl]);

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6">
      {/* Top Document Action Bar */}
      <div className="max-w-5xl mx-auto mb-4 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 no-print">
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
              Dokumen PDF · Bab {chapter.number}: {chapter.title}
            </span>
            <p className="text-[11px] text-slate-500">
              {chapter.pdfFileName ? `File: ${chapter.pdfFileName}` : 'Materi Pembelajaran PAI & Budi Pekerti'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
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
        <div className="max-w-5xl mx-auto mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-center justify-between no-print">
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

      {/* Content: Uploaded PDF iframe or Empty State */}
      {isLoadingPdf ? (
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 h-[75vh] flex items-center justify-center text-slate-500 gap-2 text-xs">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
          <span>Memuat berkas dokumen PDF...</span>
        </div>
      ) : actualPdfUrl ? (
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5 truncate max-w-md">
              <FileText className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="truncate">{chapter.pdfFileName || `Bab ${chapter.number} - ${chapter.title}.pdf`}</span>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Jika pratinjau browser tidak muncul:
              </span>
              <a
                href={actualPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Buka di Tab Baru</span>
              </a>
            </div>
          </div>
          <iframe
            src={actualPdfUrl}
            title={`PDF Bab ${chapter.number}`}
            className="w-full h-[85vh] border-0"
          />
        </div>
      ) : (
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-xs mt-8 space-y-4">
          <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600">
            <FileText className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Dokumen PDF Belum Tersedia
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              Admin Guru belum mengunggah dokumen PDF untuk Bab {chapter.number}. Anda dapat mempelajari materi ini melalui E-Book atau Video Pembelajaran.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => onOpenEbook(chapter)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>Buka E-Book</span>
            </button>
            <button
              onClick={() => onOpenVideo(chapter)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-slate-600" />
              <span>Tonton Video</span>
            </button>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              <span>Kembali</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
