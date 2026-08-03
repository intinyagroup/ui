// ============================================
// Video export pipeline — render frames, encode video
// ============================================

import type { Composition, Sequence, VideoExportOptions } from '../core.js';
import { getFilterString, getTransformString } from '../effects/effects.js';
import { interpolateKeyframes } from '../core.js';

export type ExportProgress = {
  frame: number;
  totalFrames: number;
  percent: number;
  phase: 'rendering' | 'encoding' | 'done';
};

/** Render composition to video using canvas + MediaRecorder */
export async function renderComposition(
  composition: Composition,
  options: VideoExportOptions,
  onProgress?: (progress: ExportProgress) => void
): Promise<Blob> {
  const { width, height, fps, format, quality } = options;
  const totalFrames = composition.durationInFrames;
  const frameDuration = 1000 / fps;

  // Create offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const mimeType = format === 'mp4'
    ? 'video/webm;codecs=vp9'
    : format === 'webm'
      ? 'video/webm'
      : 'video/webm';

  // Check MediaRecorder support
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported(mimeType)) {
    // Fallback: render single frame
    onProgress?.({ frame: 0, totalFrames: 1, percent: 100, phase: 'rendering' });
    renderFrame(ctx, composition, 0, width, height);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob || new Blob()), 'image/png');
    });
  }

  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: quality * 8000000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      onProgress?.({ frame: totalFrames, totalFrames, percent: 100, phase: 'done' });
      resolve(new Blob(chunks, { type: mimeType }));
    };
    recorder.onerror = () => reject(new Error('MediaRecorder error'));

    recorder.start();

    let currentFrame = 0;

    function renderNextFrame() {
      if (currentFrame >= totalFrames) {
        recorder.stop();
        return;
      }

      renderFrame(ctx, composition, currentFrame, width, height);
      onProgress?.({
        frame: currentFrame,
        totalFrames,
        percent: (currentFrame / totalFrames) * 100,
        phase: 'rendering',
      });

      currentFrame++;
      requestAnimationFrame(renderNextFrame);
    }

    renderNextFrame();
  });
}

/** Render a single frame to canvas */
export function renderFrame(
  ctx: CanvasRenderingContext2D,
  composition: Composition,
  frame: number,
  width: number,
  height: number
) {
  // Background
  ctx.fillStyle = composition.background;
  ctx.fillRect(0, 0, width, height);

  // Render sequences
  for (const seq of composition.sequences) {
    if (frame < seq.from || frame >= seq.from + seq.durationInFrames) continue;
    renderSequence(ctx, seq, frame - seq.from, width, height);
  }
}

function renderSequence(
  ctx: CanvasRenderingContext2D,
  seq: Sequence,
  relativeFrame: number,
  canvasWidth: number,
  canvasHeight: number
) {
  ctx.save();

  const x = (seq.style.x ?? 0) * (canvasWidth / 100);
  const y = (seq.style.y ?? 0) * (canvasHeight / 100);
  const w = (seq.style.width ?? 100) * (canvasWidth / 100);
  const h = (seq.style.height ?? 100) * (canvasHeight / 100);
  const rotation = seq.style.rotation ?? 0;
  const scale = seq.style.scale ?? 1;
  const opacity = seq.style.opacity ?? 1;

  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(scale, scale);
  ctx.globalAlpha = opacity;

  // Effects
  const filterStr = getFilterString(seq.effects, relativeFrame);
  if (filterStr !== 'none') ctx.filter = filterStr;

  const transformStr = getTransformString(seq.effects, relativeFrame);
  if (transformStr !== 'none') {
    const domMatrix = new DOMMatrix(transformStr);
    ctx.setTransform(domMatrix.multiply(ctx.getTransform()));
  }

  // Render
  if (seq.type === 'text') {
    const content = seq.props.content ?? 'Text';
    const fontSize = seq.props.fontSize ?? 48;
    const fontFamily = seq.props.fontFamily ?? 'sans-serif';
    const fontWeight = seq.props.fontWeight ?? 'normal';
    const color = seq.props.color ?? '#ffffff';

    ctx.fillStyle = color;
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textAlign = (seq.props.textAlign as CanvasTextAlign) ?? 'center';
    ctx.textBaseline = 'middle';

    const lines = content.split('\n');
    const lineHeight = fontSize * 1.2;
    const startY = -((lines.length - 1) * lineHeight) / 2;

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], 0, startY + i * lineHeight);
    }
  } else if (seq.type === 'shape') {
    const fillColor = seq.props.fill ?? '#3b82f6';
    ctx.fillStyle = fillColor;

    const shapeType = seq.props.shape ?? 'rectangle';
    if (shapeType === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(w, h) / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (shapeType === 'ellipse') {
      ctx.beginPath();
      ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-w / 2, -h / 2, w, h);
    }
  }

  ctx.restore();
}
