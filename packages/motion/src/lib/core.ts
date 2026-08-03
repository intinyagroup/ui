// ============================================
// Core Composition model — Remotion-like architecture
// ============================================

// ----- Composition -----
export type Composition = {
  id: string;
  name: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  durationMs: number;
  background: string;
  sequences: Sequence[];
  metadata?: Record<string, any>;
};

// ----- Sequence -----
export type Sequence = {
  id: string;
  name: string;
  from: number; // frame offset
  durationInFrames: number;
  type: 'video' | 'audio' | 'image' | 'text' | 'shape' | 'component';
  props: Record<string, any>;
  style: SequenceStyle;
  effects: Effect[];
  transition?: Transition;
  transitionDuration?: number;
};

export type SequenceStyle = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  scale?: number;
  opacity?: number;
  borderRadius?: number;
  overflow?: 'visible' | 'hidden' | 'scroll';
};

// ----- Effects -----
export type EffectType =
  | 'blur' | 'brightness' | 'contrast' | 'saturate'
  | 'hue-rotate' | 'sepia' | 'invert' | 'grayscale'
  | 'drop-shadow' | 'glow' | 'vignette'
  | 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'pan-up' | 'pan-down'
  | 'rotate' | 'shake' | 'bounce' | 'pulse'
  | 'fade-in' | 'fade-out'
  | 'custom';

export type Effect = {
  id: string;
  type: EffectType;
  params: Record<string, number | string>;
  fromFrame?: number;
  toFrame?: number;
  easing?: EasingFunction;
};

export type EasingFunction =
  | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
  | 'cubic-bezier' | 'bounce' | 'elastic' | 'spring'
  | 'back-in' | 'back-out';

// ----- Transitions -----
export type TransitionType =
  | 'none' | 'fade' | 'cross-fade'
  | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down'
  | 'wipe-left' | 'wipe-right' | 'wipe-up' | 'wipe-down'
  | 'dissolve' | 'blur' | 'zoom' | 'rotate'
  | 'push-left' | 'push-right' | 'push-up' | 'push-down'
  | 'cover-left' | 'cover-right' | 'cover-up' | 'cover-down'
  | 'custom';

export type Transition = {
  type: TransitionType;
  durationInFrames: number;
  params?: Record<string, any>;
};

// ----- Keyframes -----
export type Keyframe = {
  frame: number;
  value: number | string;
  easing?: EasingFunction;
};

export type AnimatedProperty = {
  keyframes: Keyframe[];
  extrapolateLeft?: 'clamp' | 'extend';
  extrapolateRight?: 'clamp' | 'extend';
};

export type AnimatedProps = {
  x?: AnimatedProperty;
  y?: AnimatedProperty;
  scale?: AnimatedProperty;
  rotation?: AnimatedProperty;
  opacity?: AnimatedProperty;
  width?: AnimatedProperty;
  height?: AnimatedProperty;
  blur?: AnimatedProperty;
  brightness?: AnimatedProperty;
  [key: string]: AnimatedProperty | undefined;
};

// ----- Audio -----
export type AudioTrack = {
  id: string;
  src: string;
  volume: number;
  startFrame: number;
  durationInFrames: number;
  fadeIn?: number;
  fadeOut?: number;
};

// ----- Track (timeline) -----
export type Track = {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'text' | 'effect';
  muted: boolean;
  locked: boolean;
  visible: boolean;
  sequences: Sequence[];
};

// ----- Easing functions -----
export const easings: Record<EasingFunction, (t: number) => number> = {
  linear: (t) => t,
  'ease-in': (t) => t * t,
  'ease-out': (t) => t * (2 - t),
  'ease-in-out': (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  'cubic-bezier': (t) => t * t * (3 - 2 * t), // Simple cubic
  bounce: (t) => {
    if (t < 1 / 2.75) return 7.5625 * t * t;
    if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  },
  elastic: (t) => {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
  },
  spring: (t) => {
    return 1 - Math.exp(-6 * t) * Math.cos(6 * t);
  },
  'back-in': (t) => t * t * (2.70158 * t - 1.70158),
  'back-out': (t) => 1 + (--t) * t * (2.70158 * t + 1.70158),
};

// ----- Interpolation -----
export function interpolate(
  inputRange: [number, number],
  outputRange: [number, number],
  frame: number,
  easing: EasingFunction = 'linear'
): number {
  const [inMin, inMax] = inputRange;
  const [outMin, outMax] = outputRange;
  const t = Math.max(0, Math.min(1, (frame - inMin) / (inMax - inMin)));
  const eased = easings[easing](t);
  return outMin + (outMax - outMin) * eased;
}

export function interpolateKeyframes(keyframes: Keyframe[], frame: number): number {
  if (keyframes.length === 0) return 0;
  if (keyframes.length === 1) return keyframes[0].value as number;

  // Before first keyframe
  if (frame <= keyframes[0].frame) return keyframes[0].value as number;

  // After last keyframe
  if (frame >= keyframes[keyframes.length - 1].frame) return keyframes[keyframes.length - 1].value as number;

  // Find surrounding keyframes
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (frame >= keyframes[i].frame && frame <= keyframes[i + 1].frame) {
      return interpolate(
        [keyframes[i].frame, keyframes[i + 1].frame],
        [keyframes[i].value as number, keyframes[i + 1].value as number],
        frame,
        keyframes[i + 1].easing ?? 'linear'
      );
    }
  }

  return keyframes[0].value as number;
}

// ----- Factory functions -----
export function createComposition(overrides: Partial<Composition> = {}): Composition {
  return {
    id: `comp-${Date.now()}`,
    name: 'Untitled Composition',
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 300, // 10 seconds at 30fps
    durationMs: 10000,
    background: '#000000',
    sequences: [],
    ...overrides,
  };
}

export function createSequence(overrides: Partial<Sequence> = {}): Sequence {
  return {
    id: `seq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: 'Sequence',
    from: 0,
    durationInFrames: 90,
    type: 'text',
    props: {},
    style: {},
    effects: [],
    ...overrides,
  };
}

export function createTrack(overrides: Partial<Track> = {}): Track {
  return {
    id: `track-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: 'Track',
    type: 'video',
    muted: false,
    locked: false,
    visible: true,
    sequences: [],
    ...overrides,
  };
}

export function createEffect(type: EffectType, params: Record<string, number | string> = {}): Effect {
  return {
    id: `fx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    params,
  };
}

export function createTransition(type: TransitionType, durationInFrames: number = 30): Transition {
  return { type, durationInFrames };
}
