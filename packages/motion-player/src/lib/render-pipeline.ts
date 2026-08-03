// ============================================
// Render pipeline — canvas-based frame rendering + export
// ============================================

import type { Composition, Sequence, VideoExportOptions } from '@intinyagroup/motion';
import { getFilterString } from '@intinyagroup/motion-effects';

export type ExportProgress = { frame: number; totalFrames: number; percent: number; phase: 'rendering' | 'encoding' | 'done' };

export function renderFrame(ctx: CanvasRenderingContext2D, composition: Composition, frame: number, width: number, height: number) {
  ctx.fillStyle = composition.background;
  ctx.fillRect(0, 0, width, height);
  for (const seq of composition.sequences) {
    if (frame < seq.from || frame >= seq.from + seq.durationInFrames) continue;
    const relFrame = frame - seq.from;
    ctx.save();
    const x = (seq.style.x ?? 0) * (width / 100), y = (seq.style.y ?? 0) * (height / 100);
    const w = (seq.style.width ?? 100) * (width / 100), h = (seq.style.height ?? 100) * (height / 100);
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(((seq.style.rotation ?? 0) * Math.PI) / 180);
    ctx.scale(seq.style.scale ?? 1, seq.style.scale ?? 1);
    ctx.globalAlpha = seq.style.opacity ?? 1;
    const filterStr = getFilterString(seq.effects, relFrame);
    if (filterStr !== 'none') ctx.filter = filterStr;
    if (seq.type === 'text') {
      ctx.fillStyle = seq.props.color ?? '#ffffff';
      ctx.font = `${seq.props.fontWeight ?? 'normal'} ${seq.props.fontSize ?? 48}px ${seq.props.fontFamily ?? 'sans-serif'}`;
      ctx.textAlign = (seq.props.textAlign as CanvasTextAlign) ?? 'center'; ctx.textBaseline = 'middle';
      const lines = (seq.props.content ?? 'Text').split('\n'); const lh = (seq.props.fontSize ?? 48) * 1.2; const startY = -((lines.length - 1) * lh) / 2;
      for (let i = 0; i < lines.length; i++) ctx.fillText(lines[i], 0, startY + i * lh);
    } else if (seq.type === 'shape') {
      ctx.fillStyle = seq.props.fill ?? '#3b82f6';
      ctx.fillRect(-w / 2, -h / 2, w, h);
    }
    ctx.restore();
  }
}

export async function renderComposition(composition: Composition, options: VideoExportOptions, onProgress?: (p: ExportProgress) => void): Promise<Blob> {
  const { width, height, fps, format, quality } = options;
  const totalFrames = composition.durationInFrames;
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const mimeType = format === 'mp4' ? 'video/webm;codecs=vp9' : 'video/webm';
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported(mimeType)) {
    onProgress?.({ frame: 0, totalFrames: 1, percent: 100, phase: 'rendering' });
    renderFrame(ctx, composition, 0, width, height);
    return new Promise((resolve) => { canvas.toBlob((b) => resolve(b || new Blob()), 'image/png'); });
  }

  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: quality * 8000000 });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

  return new Promise((resolve, reject) => {
    recorder.onstop = () => { onProgress?.({ frame: totalFrames, totalFrames, percent: 100, phase: 'done' }); resolve(new Blob(chunks, { type: mimeType })); };
    recorder.onerror = () => reject(new Error('MediaRecorder error'));
    recorder.start();
    let currentFrame = 0;
    function renderNext() {
      if (currentFrame >= totalFrames) { recorder.stop(); return; }
      renderFrame(ctx, composition, currentFrame, width, height);
      onProgress?.({ frame: currentFrame, totalFrames, percent: (currentFrame / totalFrames) * 100, phase: 'rendering' });
      currentFrame++; requestAnimationFrame(renderNext);
    }
    renderNext();
  });
}
