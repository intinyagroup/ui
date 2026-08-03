// ============================================
// Upload — optimistic blob URL + cloud upload
// ============================================

export type UploadProvider = { name: string; upload: (file: File, onProgress?: (percent: number) => void) => Promise<string> };
export type UploadState = { status: 'idle' | 'uploading' | 'done' | 'error'; progress: number; blobUrl?: string; cloudUrl?: string; error?: string };

export async function validateVideo(file: File): Promise<{ compatible: boolean; reason?: string }> {
  const v = document.createElement('video'); v.preload = 'metadata';
  return new Promise((resolve) => { v.onloadeddata = () => { URL.revokeObjectURL(v.src); resolve({ compatible: true }); }; v.onerror = () => { URL.revokeObjectURL(v.src); resolve({ compatible: false, reason: `Cannot decode ${file.type || 'unknown'}` }); }; v.src = URL.createObjectURL(file); });
}

export async function uploadWithOptimistic(file: File, provider: UploadProvider, onStateChange?: (s: UploadState) => void): Promise<UploadState> {
  const blobUrl = URL.createObjectURL(file);
  onStateChange?.({ status: 'uploading', progress: 0, blobUrl });
  try { const cloudUrl = await provider.upload(file, (p) => onStateChange?.({ status: 'uploading', progress: p, blobUrl })); URL.revokeObjectURL(blobUrl); onStateChange?.({ status: 'done', progress: 100, cloudUrl }); return { status: 'done', progress: 100, cloudUrl }; }
  catch (err) { const msg = err instanceof Error ? err.message : 'Upload failed'; onStateChange?.({ status: 'error', progress: 0, blobUrl, error: msg }); return { status: 'error', progress: 0, blobUrl, error: msg }; }
}

export function createS3Provider(config: { getSignedUrl: (key: string) => Promise<string> }): UploadProvider {
  return { name: 's3', upload: async (file, onProgress) => { const key = `uploads/${Date.now()}-${file.name}`; const signedUrl = await config.getSignedUrl(key); await new Promise<void>((resolve, reject) => { const xhr = new XMLHttpRequest(); xhr.upload.onprogress = (e) => { if (e.lengthComputable) onProgress?.(e.loaded / e.total); }; xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`)); xhr.onerror = () => reject(new Error('Upload failed')); xhr.open('PUT', signedUrl); xhr.setRequestHeader('Content-Type', file.type); xhr.send(file); }); return signedUrl.split('?')[0]; } };
}
