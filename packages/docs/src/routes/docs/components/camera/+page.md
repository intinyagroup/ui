---
title: Camera
description: Camera capture component using getUserMedia with facing mode, capture, and file-input fallback.
---

# Camera

A camera capture component built on `navigator.mediaDevices.getUserMedia`. Start the camera, take a photo, and receive a `File`/`Blob` via `onCapture`. When the camera is unsupported or permission is denied, it falls back to a file input.

## Usage

```svelte
<script>
  import { CameraCapture } from '@intinyagroup/ui';

  function handleCapture(file) {
    console.log('Captured', file.name, file.type, file.size);
  }
</script>

<CameraCapture onCapture={handleCapture} />
```

Use the rear camera:

```svelte
<CameraCapture facing="environment" width={1280} onCapture={handleCapture} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `facing` | `'user' \| 'environment'` | `'user'` | Which camera to request |
| `width` | `number` | `640` | Ideal video width; height is derived at 4:3 |
| `onCapture` | `(file: File \| Blob) => void` | — | Called with the captured photo or picked file |
| `class` | `string` | — | Additional CSS classes |

## Features

- Live preview with `autoplay`, `muted`, and `playsinline` for mobile.
- Captures a JPEG at 92% quality via canvas.
- Switches between front (`user`) and rear (`environment`) cameras.
- Fallback to a file input when `getUserMedia` is unavailable or permission is denied.
- Stops all media tracks and revokes preview URLs on unmount.