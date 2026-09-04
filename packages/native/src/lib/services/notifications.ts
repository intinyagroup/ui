import {
  LocalNotifications,
  type LocalNotificationSchema
} from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';

export interface LocalNotifyOptions {
  title: string;
  body: string;
  id?: number;
  schedule?: Date;
}

/**
 * Schedule a local notification. Uses @capacitor/local-notifications on
 * native; falls back to the web `Notification` API.
 */
export async function localNotify(options: LocalNotifyOptions): Promise<void> {
  try {
    const notif: LocalNotificationSchema = {
      title: options.title,
      body: options.body,
      id: options.id ?? Date.now(),
      schedule: options.schedule ? { at: options.schedule } : undefined
    };
    await LocalNotifications.schedule({ notifications: [notif] });
    return;
  } catch {
    // fall through to the web Notification API
  }
  await showWebNotification(options);
}

interface WebNotificationCtor {
  new (title: string, options?: { body?: string }): unknown;
  permission: string;
  requestPermission(): Promise<string>;
}

async function showWebNotification(options: LocalNotifyOptions): Promise<void> {
  const g = globalThis as { Notification?: unknown };
  const ctor = g.Notification as WebNotificationCtor | undefined;
  if (!ctor) throw new Error('Notifications are not supported in this environment');

  let permission = ctor.permission;
  if (permission === 'default') {
    permission = await ctor.requestPermission();
  }
  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }
  new ctor(options.title, { body: options.body });
}

/**
 * Request push notification permission (native plugins only). Resolves with
 * the permission status ('granted' | 'denied' | 'prompt').
 */
export async function requestPushPermission(): Promise<string> {
  try {
    await PushNotifications.requestPermissions();
    const status = await PushNotifications.checkPermissions();
    return status.receive ?? 'prompt';
  } catch {
    return 'prompt';
  }
}