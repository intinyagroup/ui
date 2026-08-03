// ============================================
// Recorder — screen, canvas, audio capture
// ============================================

export type RecordingOptions = {
  mimeType?: string;
  videoBitsPerSecond?: number;
  audioBitsPerSecond?: number;
  audio?: boolean;
};

export type RecordingState = 'idle' | 'preparing' | 'recording' | 'paused' | 'stopping';

export type RecordingResult = {
  blob: Blob;
  url: string;
  duration: number;
  mimeType: string;
};

/** Record screen via getDisplayMedia */
export async function startScreenRecording(
  options: RecordingOptions = {}
): Promise<{ stop: () => Promise<RecordingResult>; state: RecordingState }> {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: { displaySurface: 'monitor' } as any,
    audio: options.audio,
  });

  return startRecording(stream, options);
}

/** Record canvas via captureStream */
export async function startCanvasRecording(
  canvas: HTMLCanvasElement,
  fps: number = 30,
  options: RecordingOptions = {}
): Promise<{ stop: () => Promise<RecordingResult>; state: RecordingState }> {
  const stream = canvas.captureStream(fps);

  // Add audio track if requested
  if (options.audio) {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStream.getAudioTracks().forEach((track) => stream.addTrack(track));
    } catch {
      // Audio not available
    }
  }

  return startRecording(stream, options);
}

/** Record audio only */
export async function startAudioRecording(
  options: RecordingOptions = {}
): Promise<{ stop: () => Promise<RecordingResult>; state: RecordingState }> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  return startRecording(stream, { ...options, audio: true });
}

function startRecording(
  stream: MediaStream,
  options: RecordingOptions
): { stop: () => Promise<RecordingResult>; state: RecordingState } {
  let state: RecordingState = 'recording';
  const mimeType = options.mimeType ?? 'video/webm;codecs=vp9';
  const chunks: Blob[] = [];
  const startTime = Date.now();

  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: options.videoBitsPerSecond ?? 5000000,
  });

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  recorder.start(100); // collect in 100ms chunks

  return {
    get state() { return state; },
    stop: () =>
      new Promise((resolve) => {
        state = 'stopping';
        recorder.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(chunks, { type: mimeType });
          const url = URL.createObjectURL(blob);
          resolve({
            blob,
            url,
            duration: Date.now() - startTime,
            mimeType,
          });
        };
        recorder.stop();
      }),
  };
}
