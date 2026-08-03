// ============================================
// Media utilities — load, draw, format
// ============================================

export function loadImage(src: string): Promise<HTMLImageElement> { return new Promise((resolve, reject) => { const img = new Image(); img.crossOrigin = 'anonymous'; img.onload = () => resolve(img); img.onerror = () => reject(new Error(`Failed to load image: ${src}`)); img.src = src; }); }
export function loadVideo(src: string): Promise<HTMLVideoElement> { return new Promise((resolve, reject) => { const v = document.createElement('video'); v.crossOrigin = 'anonymous'; v.preload = 'auto'; v.onloadeddata = () => resolve(v); v.onerror = () => reject(new Error(`Failed to load video: ${src}`)); v.src = src; }); }
export function loadAudio(src: string): Promise<HTMLAudioElement> { return new Promise((resolve, reject) => { const a = new Audio(); a.crossOrigin = 'anonymous'; a.preload = 'auto'; a.onloadeddata = () => resolve(a); a.onerror = () => reject(new Error(`Failed to load audio: ${src}`)); a.src = src; }); }

export async function extractVideoFrame(videoSrc: string, timeInSeconds: number): Promise<ImageData | null> {
  try { const v = await loadVideo(videoSrc); v.currentTime = timeInSeconds; await new Promise<void>((r) => { v.onseeked = () => r(); }); const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight; const ctx = c.getContext('2d'); if (!ctx) return null; ctx.drawImage(v, 0, 0); return ctx.getImageData(0, 0, c.width, c.height); } catch { return null; }
}

export function drawImageToCanvas(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, width: number, height: number, options?: { objectFit?: 'contain' | 'cover' | 'fill'; rotation?: number; opacity?: number }) {
  ctx.save();
  if (options?.opacity !== undefined) ctx.globalAlpha = options.opacity;
  if (options?.rotation) { ctx.translate(x + width / 2, y + height / 2); ctx.rotate((options.rotation * Math.PI) / 180); ctx.translate(-(x + width / 2), -(y + height / 2)); }
  const fit = options?.objectFit ?? 'contain';
  if (fit === 'fill') { ctx.drawImage(img, x, y, width, height); }
  else if (fit === 'cover') { const ir = img.width / img.height, cr = width / height; let sx = 0, sy = 0, sw = img.width, sh = img.height; if (ir > cr) { sw = img.height * cr; sx = (img.width - sw) / 2; } else { sh = img.width / cr; sy = (img.height - sh) / 2; } ctx.drawImage(img, sx, sy, sw, sh, x, y, width, height); }
  else { const ir = img.width / img.height, cr = width / height; let dw = width, dh = height; if (ir > cr) dh = width / ir; else dw = height * ir; ctx.drawImage(img, x + (width - dw) / 2, y + (height - dh) / 2, dw, dh); }
  ctx.restore();
}

export function formatTimecode(ms: number, fps: number = 30): string { const ts = Math.floor(ms / 1000); const h = Math.floor(ts / 3600), m = Math.floor((ts % 3600) / 60), s = ts % 60, f = Math.round((ms % 1000) / (1000 / fps)); return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`; }
export function frameToTimecode(frame: number, fps: number): string { return formatTimecode((frame / fps) * 1000, fps); }
