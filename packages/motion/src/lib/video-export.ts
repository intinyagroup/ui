// ============================================
// Video export — canvas recording for video generation
// ============================================

import type { MotionProject, MotionLayer, VideoExportOptions } from './motion-model.js';
import { getLayerPropertiesAtTime } from './motion-model.js';

/** Export motion project as video using canvas recording */
export async function exportToVideo(
  project: MotionProject,
  options: VideoExportOptions,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const { width, height, fps, format, quality } = options;
  const durationMs = project.duration;
  const totalFrames = Math.ceil((durationMs / 1000) * fps);
  const frameDuration = 1000 / fps;

  // Create offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Try to use MediaRecorder for video
  if (format === 'mp4' || format === 'webm') {
    return exportWithMediaRecorder(canvas, ctx, project, options, onProgress);
  }

  // Fallback: frame-by-frame as GIF-like sequence
  return exportFrameSequence(canvas, ctx, project, options, onProgress);
}

async function exportWithMediaRecorder(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  project: MotionProject,
  options: VideoExportOptions,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const { width, height, fps, format, quality } = options;
  const durationMs = project.duration;
  const totalFrames = Math.ceil((durationMs / 1000) * fps);
  const frameDuration = 1000 / fps;

  // Determine MIME type
  const mimeType = format === 'mp4' ? 'video/webm;codecs=vp9' : 'video/webm';

  // Check if MediaRecorder supports this format
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    // Fallback to basic webm
    return exportFrameSequence(canvas, ctx, project, options, onProgress);
  }

  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: quality * 8000000, // Quality factor * 8Mbps
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      resolve(blob);
    };

    recorder.onerror = () => reject(new Error('MediaRecorder error'));

    recorder.start();

    // Render frames
    let currentFrame = 0;

    function renderFrame() {
      if (currentFrame >= totalFrames) {
        recorder.stop();
        return;
      }

      const time = currentFrame * frameDuration;
      renderProjectToCanvas(ctx, project, time, width, height);
      onProgress?.((currentFrame / totalFrames) * 100);

      currentFrame++;
      requestAnimationFrame(renderFrame);
    }

    renderFrame();
  });
}

async function exportFrameSequence(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  project: MotionProject,
  options: VideoExportOptions,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const { width, height, fps } = options;
  const durationMs = project.duration;
  const totalFrames = Math.ceil((durationMs / 1000) * fps);
  const frameDuration = 1000 / fps;

  // Render all frames to a single image sequence (simplified)
  // For a real implementation, you'd use ffmpeg.wasm or similar
  const frames: ImageData[] = [];

  for (let i = 0; i < totalFrames; i++) {
    const time = i * frameDuration;
    renderProjectToCanvas(ctx, project, time, width, height);
    frames.push(ctx.getImageData(0, 0, width, height));
    onProgress?.((i / totalFrames) * 100);
  }

  // Create a single frame image for preview
  renderProjectToCanvas(ctx, project, 0, width, height);

  // Return canvas as blob (single frame for now)
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob || new Blob([], { type: 'image/png' }));
    }, 'image/png');
  });
}

/** Render project to canvas at a specific time */
export function renderProjectToCanvas(
  ctx: CanvasRenderingContext2D,
  project: MotionProject,
  time: number,
  width: number,
  height: number
) {
  // Clear canvas
  ctx.fillStyle = project.background;
  ctx.fillRect(0, 0, width, height);

  // Render each visible layer
  for (const layer of project.layers) {
    if (!layer.visible) continue;
    if (time < layer.startTime || time > layer.startTime + layer.duration) continue;

    const props = getLayerPropertiesAtTime(layer, time);

    ctx.save();
    ctx.globalAlpha = props.opacity;

    // Apply transforms
    const centerX = width / 2 + (props.x / 100) * width;
    const centerY = height / 2 + (props.y / 100) * height;

    ctx.translate(centerX, centerY);
    ctx.rotate((props.rotation * Math.PI) / 180);
    ctx.scale(props.scale, props.scale);

    // Render based on layer type
    switch (layer.type) {
      case 'text':
        ctx.fillStyle = layer.style?.color ?? '#ffffff';
        ctx.font = `${layer.style?.fontWeight ?? 'normal'} ${layer.style?.fontSize ?? 24}px ${layer.style?.fontFamily ?? 'sans-serif'}`;
        ctx.textAlign = (layer.style?.textAlign as CanvasTextAlign) ?? 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(layer.content, 0, 0);
        break;

      case 'shape':
        ctx.fillStyle = layer.style?.backgroundColor ?? '#3b82f6';
        const w = (props.width ?? 100) * (width / 100);
        const h = (props.height ?? 100) * (height / 100);
        ctx.fillRect(-w / 2, -h / 2, w, h);
        break;

      case 'image':
        // Image rendering would need pre-loaded Image objects
        // For now, render a placeholder
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        const imgW = (props.width ?? 200) * (width / 100);
        const imgH = (props.height ?? 200) * (height / 100);
        ctx.fillRect(-imgW / 2, -imgH / 2, imgW, imgH);
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Image', 0, 0);
        break;
    }

    ctx.restore();
  }
}

/** Export project as animated GIF (simplified) */
export async function exportToGif(
  project: MotionProject,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  // For a real GIF export, you'd use gif.js or similar library
  // This is a placeholder that returns a single frame
  const canvas = document.createElement('canvas');
  canvas.width = project.width;
  canvas.height = project.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  renderProjectToCanvas(ctx, project, 0, project.width, project.height);
  onProgress?.(100);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob || new Blob([], { type: 'image/gif' }));
    }, 'image/gif');
  });
}
