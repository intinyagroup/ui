// ============================================
// Media utilities — audio, video, image handling
// ============================================

/** Load an image and return it as an HTMLImageElement */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/** Load video and return video element */
export function loadVideo(src: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = 'auto';
    video.onloadeddata = () => resolve(video);
    video.onerror = () => reject(new Error(`Failed to load video: ${src}`));
    video.src = src;
  });
}

/** Load audio and return audio element */
export function loadAudio(src: string): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    audio.onloadeddata = () => resolve(audio);
    audio.onerror = () => reject(new Error(`Failed to load audio: ${src}`));
    audio.src = src;
  });
}

/** Extract frame from video at specific time */
export async function extractVideoFrame(
  videoSrc: string,
  timeInSeconds: number
): Promise<ImageData | null> {
  try {
    const video = await loadVideo(videoSrc);
    video.currentTime = timeInSeconds;

    await new Promise<void>((resolve) => {
      video.onseeked = () => resolve();
    });

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  } catch {
    return null;
  }
}

/** Draw image to canvas */
export function drawImageToCanvas(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  options?: {
    objectFit?: 'contain' | 'cover' | 'fill';
    rotation?: number;
    opacity?: number;
  }
) {
  ctx.save();

  if (options?.opacity !== undefined) {
    ctx.globalAlpha = options.opacity;
  }

  if (options?.rotation) {
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate((options.rotation * Math.PI) / 180);
    ctx.translate(-(x + width / 2), -(y + height / 2));
  }

  const fit = options?.objectFit ?? 'contain';

  if (fit === 'fill') {
    ctx.drawImage(img, x, y, width, height);
  } else if (fit === 'cover') {
    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;
    let sx = 0, sy = 0, sw = img.width, sh = img.height;

    if (imgRatio > canvasRatio) {
      sw = img.height * canvasRatio;
      sx = (img.width - sw) / 2;
    } else {
      sh = img.width / canvasRatio;
      sy = (img.height - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, x, y, width, height);
  } else {
    // contain
    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;
    let drawWidth = width;
    let drawHeight = height;

    if (imgRatio > canvasRatio) {
      drawHeight = width / imgRatio;
    } else {
      drawWidth = height * imgRatio;
    }

    const drawX = x + (width - drawWidth) / 2;
    const drawY = y + (height - drawHeight) / 2;

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }

  ctx.restore();
}

/** Get image dimensions */
export function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/** Format duration (ms) to timecode */
export function formatTimecode(ms: number, fps: number = 30): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const frames = Math.round((ms % 1000) / (1000 / fps));

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
}

/** Format frame to timecode */
export function frameToTimecode(frame: number, fps: number): string {
  const ms = (frame / fps) * 1000;
  return formatTimecode(ms, fps);
}
