import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export type PhotoSource = 'camera' | 'gallery';

export interface Photo {
  /** original file path (native) or Data URL (web) */
  path: string;
  /** web-readable data URL when available */
  dataUrl?: string;
  /** 'jpeg' | 'png' | ... */
  format: string;
}

function sourceToCapacitor(source: PhotoSource): CameraSource {
  return source === 'camera' ? CameraSource.Camera : CameraSource.Photos;
}

/**
 * Drive the native camera / photo picker on Capacitor platforms. On the web
 * (or if the native plugin rejects), fall back to an `<input type="file">`
 * picker. `source` is ignored for the web fallback (a file input always opens
 * the gallery).
 */
export async function takePhoto(source: PhotoSource = 'camera'): Promise<Photo> {
  try {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: sourceToCapacitor(source),
      quality: 90,
      correctOrientation: true
    });
    const dataUrl = photo.dataUrl ?? '';
    return {
      path: photo.path ?? dataUrl,
      dataUrl,
      format: dataUrl.startsWith('data:image/png') ? 'png' : 'jpeg'
    };
  } catch {
    return pickFromFileInput();
  }
}

function pickFromFileInput(): Promise<Photo> {
  return new Promise((resolve, reject) => {
    const input =
      typeof document.createElement === 'function' ? document.createElement('input') : null;
    if (!input) {
      reject(new Error('No file input available in this environment'));
      return;
    }
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = typeof reader.result === 'string' ? reader.result : '';
        const format = file.type.split('/')[1] ?? 'jpeg';
        resolve({ path: dataUrl, dataUrl, format });
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    };
    input.click();
  });
}

// Re-exported for callers that want to construct a service around it.
export { CameraResultType, CameraSource } from '@capacitor/camera';