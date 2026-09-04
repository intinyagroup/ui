import { Device } from '@capacitor/device';

export interface DeviceInfo {
  /** 'android' | 'ios' | 'web' | 'electron' | ... */
  platform: string;
  model: string;
  /** full OS version string, e.g. '17.4.1' */
  osVersion: string;
  /** whether running inside a Capacitor native shell */
  isNative: boolean;
  /** whether running in a plain browser */
  isWeb: boolean;
}

/**
 * Whether the current environment exposes the Capacitor native bridge.
 * Safe to call in any context; returns false on the web.
 */
export function isCapacitorAvailable(): boolean {
  return typeof globalThis !== 'undefined' && 'Capacitor' in globalThis;
}

/**
 * Resolve a `getDeviceInfo`-style result by walking the window globals that
 * @capacitor/device sets on the web. Returns null when nothing is available.
 */
async function resolveWebDeviceInfo(): Promise<DeviceInfo | null> {
  const nav = (globalThis as typeof window & { navigator?: Navigator }).navigator;
  if (!nav) return null;
  const ua = nav.userAgent ?? '';
  const osVersion = /(?:iPhone OS|Android)\s([\d_.]+)/i.exec(ua)?.[1]?.replace(/_/g, '.') ?? 'unknown';
  const model = /\(([^)]+)\)/.exec(ua)?.[1] ?? 'web';
  return {
    platform: 'web',
    model,
    osVersion,
    isNative: false,
    isWeb: true
  };
}

/**
 * Resolve device information, preferring the native @capacitor/device plugin
 * and falling back to a userAgent parse in the browser.
 */
export async function getDeviceInfo(): Promise<DeviceInfo> {
  try {
    const info = await Device.getInfo();
    const platform = (info.platform ?? 'web') as DeviceInfo['platform'];
    return {
      platform,
      model: info.model || 'unknown',
      osVersion: info.osVersion ?? 'unknown',
      isNative: platform !== 'web',
      isWeb: platform === 'web'
    };
  } catch {
    return (await resolveWebDeviceInfo()) ?? {
      platform: 'web',
      model: 'web',
      osVersion: 'unknown',
      isNative: false,
      isWeb: true
    };
  }
}

/**
 * Resolve a semantically-useful platform string for feature detection.
 * Native: 'ios' | 'android' | 'web'. Non-native shells fall back to the
 * browser userAgent platform.
 */
export async function getPlatform(): Promise<'ios' | 'android' | 'web'> {
  const info = await getDeviceInfo();
  const g = globalThis as { navigator?: Navigator };
  const nav = g.navigator;
  if (info.platform === 'ios') return 'ios';
  if (info.platform === 'android') return 'android';
  if (info.platform === 'web') {
    const nav = (globalThis as any).navigator as Navigator | undefined;
    const ua = nav?.userAgent ?? '';
    if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
    if (/Android/.test(ua)) return 'android';
  }
  return 'web';
}

/**
 * Best-effort language/country from the native plugin or the browser.
 */
export async function getLocale(): Promise<string> {
  try {
    const lang = (await Device.getLanguageCode()) as unknown as {
      value?: string;
    };
    return lang.value ?? getWebLocale();
  } catch {
    return getWebLocale();
  }
}

function getWebLocale(): string {
  const nav = globalThis as unknown as { navigator?: Navigator };
  return nav.navigator?.language ?? 'en-US';
}