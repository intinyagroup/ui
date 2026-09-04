# @intinyagroup/native

[![npm version](https://img.shields.io/npm/v/@intinyagroup/native?style=flat-square&color=7c3aed)](https://www.npmjs.com/package/@intinyagroup/native)
[![Docs](https://img.shields.io/badge/docs-ui.intinya.id-7c3aed?style=flat-square&labelColor=1a1a1a)](https://ui.intinya.id)
[![License MIT](https://img.shields.io/npm/l/@intinyagroup/native?style=flat-square&color=7c3aed)](https://github.com/intinyagroup/ui/blob/main/LICENSE)


Capacitor plugin wrappers and web fallbacks for native device capabilities. Every service tries the native [Capacitor](https://capacitorjs.com) plugin first and gracefully falls back to a Web API when running in a plain browser, so the same code path works on iOS, Android, and the web.

## Install

```bash
pnpm add @intinyagroup/native
```

## Capacitor setup

1. Add the Capacitor plugins to your app project:

```bash
pnpm add @capacitor/core @capacitor/camera @capacitor/device @capacitor/clipboard \
  @capacitor/local-notifications @capacitor/push-notifications @capacitor/share \
  @capacitor/preferences @capacitor/haptics
```

2. Add a native platform, then sync:

```bash
npx cap add ios   # or: npx cap add android
npx cap sync
```

3. Some plugins need extra native configuration:

- **Camera** — on Android set `CameraSource.Camera` requires the CAMERA permission (auto-added by the plugin) and an `android:requestLegacyExternalStorage` consideration on Android 10 for stored photos.
- **Local notifications** — on iOS, notifications require you to request permission (see `requestPushPermission`) and register the `UNUserNotificationCenter` delegate via `AppDelegate.swift` when using push. On Android, exact alarms may require the `SCHEDULE_EXACT_ALARM` permission for the `exact` schedule option.
- **Push notifications** — iOS requires a Push Notifications entitlement and an APNs key in Capacitor config; Android needs Firebase setup (`google-services.json`).

See the [Capacitor docs](https://capacitorjs.com/docs) for per-plugin native setup.

## Usage

```ts
import {
  getDeviceInfo,
  takePhoto,
  localNotify,
  requestPushPermission,
  writeClipboard,
  readClipboard,
  watchMotion,
  watchAcceleration,
  requestMotionPermission,
  shareContent,
  setPreference,
  getPreference,
  haptic
} from '@intinyagroup/native';
```

### Device

```ts
const info = await getDeviceInfo();
// { platform, model, osVersion, isNative, isWeb }

const platform = await getPlatform(); // 'ios' | 'android' | 'web'
const locale = await getLocale();
```

### Camera

```ts
const photo = await takePhoto('camera'); // 'camera' | 'gallery'
// { path, dataUrl, format }
```

### Notifications

```ts
await requestPushPermission();

await localNotify({ title: 'Hello', body: 'From Intinya', schedule: new Date(Date.now() + 5000) });
```

### Clipboard

```ts
await writeClipboard('text to copy');
const text = await readClipboard();
```

### Motion / Gyroscope

```ts
await requestMotionPermission(); // required on iOS

const stop = watchMotion(({ accelerationIncludingGravity, rotationRate }) => {
  console.log(accelerationIncludingGravity, rotationRate);
});

const stopAccel = watchAcceleration(({ acceleration }) => {
  console.log(acceleration);
});

// later: stop(); stopAccel();
```

### Share

```ts
await shareContent({ title: 'Intinya', text: 'Share this', url: 'https://intinya.digital' });
```

### Preferences

```ts
await setPreference('theme', 'dark');
const theme = await getPreference('theme'); // 'dark'
await setJSONPreference('settings', { theme: 'dark' });
await removePreference('theme');
```

### Haptics

```ts
await haptic('light'); // 'light' | 'heavy' | 'success' | 'vibrate'
```

## Web fallbacks

| Service | Native plugin | Web fallback |
| --- | --- | --- |
| Device | `@capacitor/device` | userAgent parse |
| Camera | `@capacitor/camera` | `<input type="file">` picker |
| Notifications | `@capacitor/local-notifications` | `Notification` API |
| Clipboard | `@capacitor/clipboard` | `navigator.clipboard` / `execCommand` |
| Motion | `DeviceMotionEvent` API | same (browser) — no native plugin |
| Share | `@capacitor/share` | `navigator.share` |
| Preferences | `@capacitor/preferences` | none (native only) |
| Haptics | `@capacitor/haptics` | `navigator.vibrate` |

## Development

```bash
pnpm install
pnpm --filter @intinyagroup/native build
pnpm --filter @intinyagroup/native check
```