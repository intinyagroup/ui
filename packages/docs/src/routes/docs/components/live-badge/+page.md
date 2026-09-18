---
title: Live Badge
description: Pulsing LIVE badge with an optional viewer count.
---

# Live Badge

A pulsing "LIVE" badge for streams and real-time sessions, with an optional viewer count. Exported as both `LiveBadge` and `FollowBadge`.

## Usage

```svelte
<script>
  import { LiveBadge } from '@intinyagroup/ui';
</script>

<LiveBadge viewers={1284} />

<LiveBadge label="REC" viewers={0} pulsing={false} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `viewers` | `number` | — | Viewer count shown next to the badge |
| `label` | `string` | `'LIVE'` | Badge text |
| `pulsing` | `boolean` | `true` | Animate the ping ring |
| `class` | `string` | — | Additional CSS classes |

## Features

- Ping animation for the status dot, toggleable.
- Locale-formatted viewer count with `tabular-nums`.
- `role="status"` with a descriptive `aria-label`.
- Also exported as `FollowBadge`.