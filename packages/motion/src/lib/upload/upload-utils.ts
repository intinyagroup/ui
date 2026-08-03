// ============================================
// Video uploads — optimistic blob URL + cloud upload
// ============================================

export type UploadProvider = {
  name: string;
  upload: (file: File, onProgress?: (percent: number) => void) => Promise<string>;
};

export type UploadState = {
  status: 'idle' | 'uploading' | 'done' | 'error';
  progress: number;
  blobUrl?: string;
  cloudUrl?: string;
  error?: string;
};

/** Validate video compatibility with the browser */
export async function validateVideo(file: File): Promise<{ compatible: boolean; reason?: string }> {
  const video = document.createElement('video');
  video.preload = 'metadata';

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve({ compatible: true });
    };
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      resolve({ compatible: false, reason: `Cannot decode ${file.type || 'unknown format'}` });
    };
    video.src = URL.createObjectURL(file);
  });
}

/** Upload with optimistic blob URL → cloud URL */
export async function uploadWithOptimistic(
  file: File,
  provider: UploadProvider,
  onStateChange?: (state: UploadState) => void
): Promise<UploadState> {
  // Step 1: Create blob URL for instant preview
  const blobUrl = URL.createObjectURL(file);
  onStateChange?.({ status: 'uploading', progress: 0, blobUrl });

  try {
    // Step 2: Upload to cloud
    const cloudUrl = await provider.upload(file, (progress) => {
      if (!onStateChange) return;
      onStateChange({ status: 'uploading', progress, blobUrl });
    });

    // Step 3: Swap to cloud URL, revoke blob
    URL.revokeObjectURL(blobUrl);
    onStateChange?.({ status: 'done', progress: 100, cloudUrl });

    return { status: 'done', progress: 100, cloudUrl };
  } catch (err) {
    // Keep blob URL on error
    const message = err instanceof Error ? err.message : 'Upload failed';
    onStateChange?.({ status: 'error', progress: 0, blobUrl, error: message });
    return { status: 'error', progress: 0, blobUrl, error: message };
  }
}

/** S3 presigned URL provider */
export function createS3Provider(config: {
  bucket: string;
  region: string;
  getSignedUrl: (key: string) => Promise<string>;
}): UploadProvider {
  return {
    name: 's3',
    upload: async (file, onProgress) => {
      const key = `uploads/${Date.now()}-${file.name}`;
      const signedUrl = await config.getSignedUrl(key);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            onProgress?.(e.loaded / e.total);
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed: ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.open('PUT', signedUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

      return signedUrl.split('?')[0];
    },
  };
}
