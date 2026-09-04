export { cn } from './utils.js';

// device
export {
  getDeviceInfo,
  getPlatform,
  getLocale,
  isCapacitorAvailable,
  type DeviceInfo
} from './services/device.js';

// camera
export { takePhoto, CameraResultType, CameraSource, type Photo, type PhotoSource } from './services/camera.js';

// notifications
export {
  localNotify,
  requestPushPermission,
  type LocalNotifyOptions
} from './services/notifications.js';

// clipboard
export { writeClipboard, readClipboard } from './services/clipboard.js';

// gyro / motion
export {
  watchMotion,
  watchAcceleration,
  requestMotionPermission,
  type MotionData,
  type AccelerationData
} from './services/gyro.js';

// share
export { shareContent, type ShareOptions } from './services/share.js';

// preferences
export {
  getPreference,
  setPreference,
  removePreference,
  getPreferenceKeys,
  clearPreferences,
  getJSONPreference,
  setJSONPreference
} from './services/preferences.js';

// haptics
export { haptic, type HapticType } from './services/haptics.js';