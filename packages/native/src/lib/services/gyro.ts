export interface MotionData {
  /** acceleration including gravity (m/s^2) */
  accelerationIncludingGravity: { x: number; y: number; z: number };
  /** rotation rate in rad/s (gyroscope) */
  rotationRate?: { alpha: number; beta: number; gamma: number };
  /** timestamp in ms */
  timestamp: number;
}

type MotionEventCtor = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

type MotionHandler = (data: MotionData) => void;

let motionPermission: 'granted' | 'prompt' | 'denied' = 'prompt';

function motionCtor(): MotionEventCtor | undefined {
  const g = globalThis as { DeviceMotionEvent?: unknown };
  return g.DeviceMotionEvent as MotionEventCtor | undefined;
}

/**
 * Ask the iOS device-motion permission gate, if present. Resolves true when a
 * synchronous `devicemotion` listener may be registered.
 */
export async function requestMotionPermission(): Promise<boolean> {
  const ctor = motionCtor();
  if (ctor && typeof ctor.requestPermission === 'function') {
    try {
      motionPermission = await ctor.requestPermission();
      return motionPermission === 'granted';
    } catch {
      motionPermission = 'denied';
      return false;
    }
  }
  motionPermission = 'granted';
  return true;
}

function handleMotionEvent(event: DeviceMotionEvent, cb: MotionHandler): void {
  const accel = event.accelerationIncludingGravity;
  const rot = event.rotationRate;
  cb({
    accelerationIncludingGravity: {
      x: accel?.x ?? 0,
      y: accel?.y ?? 0,
      z: accel?.z ?? 0
    },
    rotationRate: rot
      ? { alpha: rot.alpha ?? 0, beta: rot.beta ?? 0, gamma: rot.gamma ?? 0 }
      : undefined,
    timestamp: event.timeStamp ?? Date.now()
  });
}

/**
 * Watch device motion (accelerometer + gyroscope) via the DeviceMotionEvent
 * API. On iOS, register after resolving `requestMotionPermission()`. Returns
 * an unsubscribe function.
 */
export function watchMotion(cb: MotionHandler): () => void {
  const listener = (event: DeviceMotionEvent) => handleMotionEvent(event, cb);
  window.addEventListener('devicemotion', listener);
  return () => window.removeEventListener('devicemotion', listener);
}

export interface AccelerationData {
  /** acceleration excluding gravity (m/s^2) */
  acceleration: { x: number; y: number; z: number };
  timestamp: number;
}

/**
 * Watch raw acceleration (gravity removed) via DeviceMotionEvent.
 * Returns an unsubscribe function.
 */
export function watchAcceleration(cb: (data: AccelerationData) => void): () => void {
  const listener = (event: DeviceMotionEvent) => {
    const a = event.acceleration;
    cb({
      acceleration: { x: a?.x ?? 0, y: a?.y ?? 0, z: a?.z ?? 0 },
      timestamp: event.timeStamp ?? Date.now()
    });
  };
  window.addEventListener('devicemotion', listener);
  return () => window.removeEventListener('devicemotion', listener);
}