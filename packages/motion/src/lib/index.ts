// ============================================
// @intinyagroup/motion — Video Generation (Remotion-like)
// ============================================

// Core
export {
  createComposition,
  createSequence,
  createTrack,
  createEffect,
  createTransition,
  interpolate,
  interpolateKeyframes,
  easings,
  type Composition,
  type Sequence,
  type Track,
  type Effect,
  type EffectType,
  type Transition,
  type TransitionType,
  type Keyframe,
  type AnimatedProperty,
  type AnimatedProps,
  type AudioTrack,
  type SequenceStyle,
  type EasingFunction,
} from './core.js';

// Effects
export {
  getFilterString,
  getTransformString,
  effectPresets,
} from './effects/effects.js';

// Transitions
export {
  getTransitionStyles,
  transitionPresets,
  getTransitionProgress,
} from './transitions/transitions.js';

// Media
export {
  loadImage,
  loadVideo,
  loadAudio,
  extractVideoFrame,
  drawImageToCanvas,
  getImageDimensions,
  formatTimecode,
  frameToTimecode,
} from './media/media-utils.js';

// Captions
export {
  createCaptionTrack,
  createCaptionStyle,
  createCaptionLine,
  parseSRT,
  exportToSRT,
  type CaptionTrack,
  type CaptionLine,
  type CaptionWord,
  type CaptionStyle,
  type CaptionAnimation,
} from './captions/caption-model.js';

export {
  getCaptionStyles,
  renderCaptionHTML,
} from './captions/caption-animation.js';

// Recorder
export {
  startScreenRecording,
  startCanvasRecording,
  startAudioRecording,
  type RecordingOptions,
  type RecordingState,
  type RecordingResult,
} from './recorder/recorder.js';

// Upload
export {
  validateVideo,
  uploadWithOptimistic,
  createS3Provider,
  type UploadProvider,
  type UploadState,
} from './upload/upload-utils.js';

// Renderer
export {
  renderComposition,
  renderFrame,
  type ExportProgress,
} from './renderer/render-pipeline.js';

// Components
export { default as VideoPlayer } from './components/VideoPlayer.svelte';
export { default as Timeline } from './components/Timeline.svelte';
