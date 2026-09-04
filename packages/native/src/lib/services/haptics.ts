import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export type HapticType = 'light' | 'heavy' | 'success' | 'vibrate';

/**
 * Trigger a haptic feedback. Uses @capacitor/haptics on native; attempts
 * `navigator.vibrate` on the web (mobile browsers only). No-ops when nothing
 * is available.
 */
export async function haptic(type: HapticType = 'light'): Promise<void> {
  try {
    switch (type) {
      case 'light':
        await Haptics.impact({ style: ImpactStyle.Light });
        break;
      case 'heavy':
        await Haptics.impact({ style: ImpactStyle.Heavy });
        break;
      case 'success':
        await Haptics.notification({ type: NotificationType.Success });
        break;
      case 'vibrate':
        await Haptics.vibrate();
        break;
    }
    return;
  } catch {
    // fall through to web vibrate
  }

  const w = globalThis as { navigator?: { vibrate?: (pattern: number | number[]) => boolean } };
  const vibrate = w.navigator?.vibrate;
  if (vibrate) {
    const pattern = type === 'light' ? 10 : type === 'vibrate' ? 200 : [30, 40, 80];
    vibrate(pattern);
  }
}