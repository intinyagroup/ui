// ============================================
// Image utilities — fetch, resize, embed for export
// ============================================

/** Fetch image as Uint8Array for pdf-lib embedding */
export async function fetchImageAsBytes(url: string): Promise<Uint8Array | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    return new Uint8Array(await blob.arrayBuffer());
  } catch {
    return null;
  }
}

/** Get image type from URL or data URL */
export function getImageType(url: string): 'png' | 'jpg' | 'svg' | 'gif' {
  if (url.startsWith('data:image/png')) return 'png';
  if (url.startsWith('data:image/jpeg') || url.startsWith('data:image/jpg')) return 'jpg';
  if (url.startsWith('data:image/svg')) return 'svg';
  if (url.startsWith('data:image/gif')) return 'gif';
  if (url.endsWith('.png')) return 'png';
  if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'jpg';
  if (url.endsWith('.svg')) return 'svg';
  if (url.endsWith('.gif')) return 'gif';
  return 'png';
}

/** Resize image to fit within bounds (for PDF embedding) */
export function resizeImage(
  imageData: Uint8Array,
  maxWidth: number,
  maxHeight: number,
  format: 'png' | 'jpg' = 'png'
): Promise<Uint8Array> {
  return new Promise((resolve) => {
    const blob = new Blob([imageData]);
    const url = URL.createObjectURL(blob);
    const img = new window.Image();

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Scale to fit
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              blob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf)));
            } else {
              resolve(imageData);
            }
          },
          format === 'jpg' ? 'image/jpeg' : 'image/png',
          0.92
        );
      } else {
        resolve(imageData);
      }

      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(imageData);
    };

    img.src = url;
  });
}

/** Convert data URL to Uint8Array */
export function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** Extract all image URLs from HTML */
export function extractImageUrls(html: string): string[] {
  const urls: string[] = [];
  const regex = /<img[^>]*src="([^"]*)"[^>]*>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}
