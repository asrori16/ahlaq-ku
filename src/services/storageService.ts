import { supabase, STORAGE_BUCKET_NAME } from '../lib/supabase';
import { saveMediaBlob, deleteMediaBlob } from './mediaStorage';

export interface UploadResult {
  success: boolean;
  url: string;
  key: string;
  fileName: string;
  isCloud: boolean;
  bucketName?: string;
  error?: string;
}

export interface StorageStatus {
  available: boolean;
  bucketName: string;
  isPublic: boolean;
  message: string;
}

const PRIMARY_BUCKET = STORAGE_BUCKET_NAME || 'akhlaqku-media';
const FALLBACK_BUCKET = 'media';

/**
 * Checks whether the Supabase Storage bucket is available and public
 */
export async function checkStorageStatus(): Promise<StorageStatus> {
  try {
    // 1. Try listing files in primary bucket to see if it exists and has read access
    const { error: primaryError } = await supabase.storage
      .from(PRIMARY_BUCKET)
      .list('', { limit: 1 });

    if (!primaryError) {
      return {
        available: true,
        bucketName: PRIMARY_BUCKET,
        isPublic: true,
        message: `Bucket '${PRIMARY_BUCKET}' aktif di Supabase Storage`,
      };
    }

    // 2. Try fallback bucket if primary failed
    const { error: fallbackError } = await supabase.storage
      .from(FALLBACK_BUCKET)
      .list('', { limit: 1 });

    if (!fallbackError) {
      return {
        available: true,
        bucketName: FALLBACK_BUCKET,
        isPublic: true,
        message: `Bucket '${FALLBACK_BUCKET}' aktif di Supabase Storage`,
      };
    }

    const errMsg = primaryError?.message || fallbackError?.message || 'Bucket belum dibuat di Supabase';
    return {
      available: false,
      bucketName: PRIMARY_BUCKET,
      isPublic: false,
      message: errMsg,
    };
  } catch (err: unknown) {
    return {
      available: false,
      bucketName: PRIMARY_BUCKET,
      isPublic: false,
      message: err instanceof Error ? err.message : 'Gagal terhubung ke Supabase Storage',
    };
  }
}

/**
 * Uploads a video file (.mp4, etc.) to Supabase Storage bucket.
 * If Supabase bucket is not configured, gracefully falls back to IndexedDB local storage.
 */
export async function uploadVideoToStorage(
  file: File,
  onProgressNote?: (note: string) => void
): Promise<UploadResult> {
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const timestamp = Date.now();
  const filePath = `videos/${timestamp}_${cleanFileName}`;
  const localKey = `video_${timestamp}_${cleanFileName}`;

  onProgressNote?.('Menghubungkan ke Supabase Storage...');

  // Always save locally in IndexedDB as reliable offline cache / fallback
  let localBlobUrl = '';
  try {
    localBlobUrl = await saveMediaBlob(localKey, file);
  } catch (e) {
    console.warn('Gagal menyimpan cache lokal IndexedDB:', e);
  }

  // Attempt upload to Supabase Storage
  try {
    onProgressNote?.('Mengunggah video ke Supabase Cloud Storage...');

    // Try primary bucket first
    let bucketToUse = PRIMARY_BUCKET;
    let uploadRes = await supabase.storage
      .from(bucketToUse)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'video/mp4',
      });

    // If bucket not found, test fallback bucket
    if (uploadRes.error && uploadRes.error.message?.toLowerCase().includes('bucket not found')) {
      bucketToUse = FALLBACK_BUCKET;
      uploadRes = await supabase.storage
        .from(bucketToUse)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || 'video/mp4',
        });
    }

    if (uploadRes.error) {
      console.warn('Supabase storage upload error:', uploadRes.error);
      return {
        success: true, // Still success via local fallback so user flow continues
        url: localBlobUrl || URL.createObjectURL(file),
        key: localKey,
        fileName: file.name,
        isCloud: false,
        error: uploadRes.error.message,
      };
    }

    // Retrieve public CDN URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketToUse)
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData?.publicUrl || '';

    onProgressNote?.('Video berhasil diunggah ke Supabase Cloud!');

    return {
      success: true,
      url: publicUrl,
      key: filePath,
      fileName: file.name,
      isCloud: true,
      bucketName: bucketToUse,
    };
  } catch (err: unknown) {
    console.warn('Upload to Supabase Storage failed, using local storage:', err);
    return {
      success: true,
      url: localBlobUrl || URL.createObjectURL(file),
      key: localKey,
      fileName: file.name,
      isCloud: false,
      error: err instanceof Error ? err.message : 'Gagal mengunggah ke cloud',
    };
  }
}

/**
 * Uploads a PDF document to Supabase Storage bucket.
 * Gracefully falls back to IndexedDB local storage if Supabase bucket is missing.
 */
export async function uploadPdfToStorage(
  file: File,
  onProgressNote?: (note: string) => void
): Promise<UploadResult> {
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const timestamp = Date.now();
  const filePath = `pdfs/${timestamp}_${cleanFileName}`;
  const localKey = `pdf_${timestamp}_${cleanFileName}`;

  onProgressNote?.('Menyimpan dokumen PDF...');

  let localBlobUrl = '';
  try {
    localBlobUrl = await saveMediaBlob(localKey, file);
  } catch (e) {
    console.warn('Gagal menyimpan cache lokal IndexedDB:', e);
  }

  try {
    let bucketToUse = PRIMARY_BUCKET;
    let uploadRes = await supabase.storage
      .from(bucketToUse)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'application/pdf',
      });

    if (uploadRes.error && uploadRes.error.message?.toLowerCase().includes('bucket not found')) {
      bucketToUse = FALLBACK_BUCKET;
      uploadRes = await supabase.storage
        .from(bucketToUse)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || 'application/pdf',
        });
    }

    if (uploadRes.error) {
      return {
        success: true,
        url: localBlobUrl || URL.createObjectURL(file),
        key: localKey,
        fileName: file.name,
        isCloud: false,
        error: uploadRes.error.message,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketToUse)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrlData?.publicUrl || '',
      key: filePath,
      fileName: file.name,
      isCloud: true,
      bucketName: bucketToUse,
    };
  } catch (err: unknown) {
    return {
      success: true,
      url: localBlobUrl || URL.createObjectURL(file),
      key: localKey,
      fileName: file.name,
      isCloud: false,
      error: err instanceof Error ? err.message : 'Gagal mengunggah PDF ke cloud',
    };
  }
}

/**
 * Removes media from Supabase Storage and IndexedDB
 */
export async function deleteMediaFromStorage(keyOrUrl: string): Promise<void> {
  if (!keyOrUrl) return;

  // Clean local IndexedDB if key corresponds
  try {
    await deleteMediaBlob(keyOrUrl);
  } catch (e) {
    console.warn('Error deleting local blob:', e);
  }

  // If it's a Supabase path or public URL
  try {
    let filePath = keyOrUrl;
    if (keyOrUrl.includes('/storage/v1/object/public/')) {
      const parts = keyOrUrl.split('/storage/v1/object/public/');
      if (parts[1]) {
        // parts[1] is like "akhlaqku-media/videos/..."
        const subParts = parts[1].split('/');
        subParts.shift(); // remove bucket
        filePath = subParts.join('/');
      }
    }

    if (filePath.startsWith('videos/') || filePath.startsWith('pdfs/')) {
      await supabase.storage.from(PRIMARY_BUCKET).remove([filePath]);
      await supabase.storage.from(FALLBACK_BUCKET).remove([filePath]);
    }
  } catch (e) {
    console.warn('Error deleting from Supabase storage:', e);
  }
}

/**
 * Check if a URL is hosted publicly on Supabase Cloud Storage
 */
export function isCloudStorageUrl(url?: string | null): boolean {
  if (!url) return false;
  return url.startsWith('http') && url.includes('/storage/v1/object/public/');
}
