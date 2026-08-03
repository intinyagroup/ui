// ============================================
// Recorder — screen, canvas, audio capture
// ============================================

export type RecordingOptions = { mimeType?: string; videoBitsPerSecond?: number; audio?: boolean };
export type RecordingState = 'idle' | 'preparing' | 'recording' | 'paused' | 'stopping';
export type RecordingResult = { blob: Blob; url: string; duration: number; mimeType: string };

async function startRecording(stream: MediaStream, options: RecordingOptions): Promise<{ stop: () => Promise<RecordingResult>; state: RecordingState }> {
  let state: RecordingState = 'recording';
  const mimeType = options.mimeType ?? 'video/webm;codecs=vp9';
  const chunks: Blob[] = []; const startTime = Date.now();
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: options.videoBitsPerSecond ?? 5000000 });
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
  recorder.start(100);
  return {
    get state() { return state; },
    stop: () => new Promise((resolve) => { state = 'stopping'; recorder.onstop = () => { stream.getTracks().forEach((t) => t.stop()); const blob = new Blob(chunks, { type: mimeType }); resolve({ blob, url: URL.createObjectURL(blob), duration: Date.now() - startTime, mimeType }); }; recorder.stop(); }),
  };
}

export async function startScreenRecording(options: RecordingOptions = {}) { const stream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'monitor' } as any, audio: options.audio }); return startRecording(stream, options); }
export async function startCanvasRecording(canvas: HTMLCanvasElement, fps: number = 30, options: RecordingOptions = {}) { const stream = canvas.captureStream(fps); if (options.audio) { try { const a = await navigator.mediaDevices.getUserMedia({ audio: true }); a.getAudioTracks().forEach((t) => stream.addTrack(t)); } catch {} } return startRecording(stream, options); }
export async function startAudioRecording(options: RecordingOptions = {}) { const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); return startRecording(stream, { ...options, audio: true }); }
