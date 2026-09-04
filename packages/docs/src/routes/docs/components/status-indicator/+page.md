---
title: Status Indicator
description: Presence dot with online, offline, away, busy, and custom states, in three sizes.
---

# Status Indicator

A presence dot with optional text label. States: `online`, `offline`, `away`, `busy`, plus `custom` with any color. Three sizes: `sm`, `md`, `lg`.

## Usage

```svelte
<script>
  import { StatusIndicator } from '@intinyagroup/ui';
</script>

<StatusIndicator status="online" label="Online" />
<StatusIndicator status="away" label="Away" />
<StatusIndicator status="busy" label="In a call" />
<StatusIndicator status="custom" customColor="#a855f7" label="Streaming" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `'online' \| 'offline' \| 'away' \| 'busy' \| 'custom'` | `'online'` | Presence state |
| `label` | `string` | — | Visible text label; also the accessible name |
| `customColor` | `string` | `'#22c55e'` | Dot color for `status="custom"` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Dot size |
| `class` | `string` | — | Additional CSS classes |

## Features

- Token-colored states: success, muted, warning, destructive.
- Custom color via `customColor` for bespoke states.
- `role="img"` with `aria-label` derived from `label` or the status.