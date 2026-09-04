---
title: Gyroscope
description: Device orientation sensor with permission handling, sensitivity, and a mouse-simulation fallback for desktop.
---

# Gyroscope

Reads device orientation (`alpha`, `beta`, `gamma`) from the DeviceOrientation/DeviceMotion APIs. Handles iOS-style permission requests and falls back to an eased mouse simulation on desktop so the UI still animates during development.

## Usage

```svelte
<script>
  import { Gyroscope } from '@intinyagroup/ui';

  function handleReading({ alpha, beta, gamma }) {
    console.log(alpha.toFixed(1), beta.toFixed(1), gamma.toFixed(1));
  }
</script>

<Gyroscope onReading={handleReading} />
```

Use the reading in your own UI via the children snippet:

```svelte
<Gyroscope bind:enabled>
  {#snippet children(reading)}
    <p>Tilt: {reading.beta.toFixed(0)}°</p>
  {/snippet}
</Gyroscope>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Bindable toggle for the sensor |
| `sensitivity` | `number` | `1` | Multiplier applied to `beta`/`gamma` |
| `onReading` | `(data: { alpha: number; beta: number; gamma: number }) => void` | — | Called with each reading |
| `children` | `Snippet<[Reading]>` | — | Receives the current reading |
| `class` | `string` | — | Additional CSS classes |

## Features

- Reads `deviceorientation` and `devicemotion` events.
- Requests permission where the API requires a user gesture (iOS 13+).
- `sensitivity` scales tilt values with clamping.
- Desktop fallback simulates orientation from mouse movement.
- Displays α/β/γ readouts and a permission status chip.
- Cleans up all listeners on disable or unmount.