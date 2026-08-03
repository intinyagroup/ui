// ============================================
// @intinyagroup/motion — Video Generation & Motion Graphics
// ============================================

// Components
export { default as Timeline } from './components/Timeline.svelte';

// Data model & utilities
export {
  createMotionProject,
  createMotionLayer,
  addKeyframe,
  createPresetAnimation,
  interpolateKeyframes,
  getLayerPropertiesAtTime,
  easings,
  exportPresets,
  type MotionProject,
  type MotionLayer,
  type Keyframe,
  type AnimationProperty,
  type AnimatableProperties,
  type VideoExportOptions,
} from './motion-model.js';

// Video export
export {
  exportToVideo,
  renderProjectToCanvas,
  exportToGif,
} from './video-export.js';
