// ============================================
// Motion data model — keyframes, timeline, video export
// ============================================

export type Keyframe = {
  time: number; // in milliseconds
  value: number | string;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce';
};

export type AnimationProperty = {
  keyframes: Keyframe[];
};

export type AnimatableProperties = {
  x?: AnimationProperty;
  y?: AnimationProperty;
  scale?: AnimationProperty;
  rotation?: AnimationProperty;
  opacity?: AnimationProperty;
  width?: AnimationProperty;
  height?: AnimationProperty;
};

export type MotionLayer = {
  id: string;
  name: string;
  type: 'text' | 'image' | 'shape' | 'video';
  startTime: number;
  duration: number;
  content: string;
  style: Record<string, any>;
  animations: AnimatableProperties;
  visible: boolean;
  locked: boolean;
};

export type MotionProject = {
  id: string;
  name: string;
  duration: number; // total duration in ms
  fps: number;
  width: number;
  height: number;
  background: string;
  layers: MotionLayer[];
};

export type VideoExportOptions = {
  format: 'mp4' | 'webm' | 'gif';
  quality: number; // 0-1
  fps: number;
  width: number;
  height: number;
};

// Easing functions
export const easings = {
  linear: (t: number) => t,
  'ease-in': (t: number) => t * t,
  'ease-out': (t: number) => t * (2 - t),
  'ease-in-out': (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  bounce: (t: number) => {
    if (t < 1 / 2.75) return 7.5625 * t * t;
    if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  },
};

/** Interpolate between keyframes */
export function interpolateKeyframes(keyframes: Keyframe[], time: number): number {
  if (keyframes.length === 0) return 0;
  if (keyframes.length === 1) return keyframes[0].value as number;

  // Find surrounding keyframes
  let prev = keyframes[0];
  let next = keyframes[keyframes.length - 1];

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (time >= keyframes[i].time && time <= keyframes[i + 1].time) {
      prev = keyframes[i];
      next = keyframes[i + 1];
      break;
    }
  }

  if (time <= prev.time) return prev.value as number;
  if (time >= next.time) return next.value as number;

  // Interpolate
  const progress = (time - prev.time) / (next.time - prev.time);
  const easingFn = easings[next.easing ?? 'linear'];
  const easedProgress = easingFn(progress);

  const startValue = prev.value as number;
  const endValue = next.value as number;

  return startValue + (endValue - startValue) * easedProgress;
}

/** Get layer properties at a specific time */
export function getLayerPropertiesAtTime(layer: MotionLayer, time: number) {
  const relativeTime = time - layer.startTime;
  const clampedTime = Math.max(0, Math.min(relativeTime, layer.duration));

  return {
    x: layer.animations.x ? interpolateKeyframes(layer.animations.x.keyframes, clampedTime) : 0,
    y: layer.animations.y ? interpolateKeyframes(layer.animations.y.keyframes, clampedTime) : 0,
    scale: layer.animations.scale ? interpolateKeyframes(layer.animations.scale.keyframes, clampedTime) : 1,
    rotation: layer.animations.rotation ? interpolateKeyframes(layer.animations.rotation.keyframes, clampedTime) : 0,
    opacity: layer.animations.opacity ? interpolateKeyframes(layer.animations.opacity.keyframes, clampedTime) : 1,
    width: layer.animations.width ? interpolateKeyframes(layer.animations.width.keyframes, clampedTime) : undefined,
    height: layer.animations.height ? interpolateKeyframes(layer.animations.height.keyframes, clampedTime) : undefined,
  };
}

/** Create a new motion project */
export function createMotionProject(name: string = 'Untitled'): MotionProject {
  return {
    id: `motion-${Date.now()}`,
    name,
    duration: 5000, // 5 seconds
    fps: 30,
    width: 1920,
    height: 1080,
    background: '#000000',
    layers: [],
  };
}

/** Create a new motion layer */
export function createMotionLayer(type: MotionLayer['type'] = 'text'): MotionLayer {
  return {
    id: `layer-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: `${type} layer`,
    type,
    startTime: 0,
    duration: 3000,
    content: type === 'text' ? 'Text' : '',
    style: {},
    animations: {},
    visible: true,
    locked: false,
  };
}

/** Add keyframe to a layer's animation property */
export function addKeyframe(
  layer: MotionLayer,
  property: keyof AnimatableProperties,
  keyframe: Keyframe
): MotionLayer {
  const existing = layer.animations[property]?.keyframes ?? [];
  const newKeyframes = [...existing, keyframe].sort((a, b) => a.time - b.time);

  return {
    ...layer,
    animations: {
      ...layer.animations,
      [property]: { keyframes: newKeyframes },
    },
  };
}

/** Create a preset animation */
export function createPresetAnimation(
  type: 'fadeIn' | 'fadeOut' | 'slideInLeft' | 'slideInRight' | 'scaleUp' | 'bounce'
): AnimatableProperties {
  switch (type) {
    case 'fadeIn':
      return { opacity: { keyframes: [{ time: 0, value: 0 }, { time: 500, value: 1 }] } };
    case 'fadeOut':
      return { opacity: { keyframes: [{ time: 0, value: 1 }, { time: 500, value: 0 }] } };
    case 'slideInLeft':
      return { x: { keyframes: [{ time: 0, value: -100 }, { time: 500, value: 0, easing: 'ease-out' }] } };
    case 'slideInRight':
      return { x: { keyframes: [{ time: 0, value: 100 }, { time: 500, value: 0, easing: 'ease-out' }] } };
    case 'scaleUp':
      return { scale: { keyframes: [{ time: 0, value: 0 }, { time: 500, value: 1, easing: 'ease-out' }] } };
    case 'bounce':
      return {
        y: { keyframes: [{ time: 0, value: -50 }, { time: 300, value: 0, easing: 'bounce' }] },
        scale: { keyframes: [{ time: 0, value: 0.8 }, { time: 300, value: 1, easing: 'bounce' }] },
      };
    default:
      return {};
  }
}

/** Export options presets */
export const exportPresets: Record<string, VideoExportOptions> = {
  '720p': { format: 'mp4', quality: 0.8, fps: 30, width: 1280, height: 720 },
  '1080p': { format: 'mp4', quality: 0.9, fps: 30, width: 1920, height: 1080 },
  '4k': { format: 'mp4', quality: 1, fps: 30, width: 3840, height: 2160 },
  'gif': { format: 'gif', quality: 0.7, fps: 15, width: 640, height: 360 },
};
