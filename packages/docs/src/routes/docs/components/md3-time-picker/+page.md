---
title: Time Picker
description: Material Design 3 time picker with analog clock and keyboard input modes.
---

# Time Picker

A Material Design 3 time picker dialog with an analog clock face, AM/PM toggle, and keyboard input mode. Supports 12-hour and 24-hour formats.

## Preview

```svelte
<script>
  import { TimePicker } from '@intinyagroup/md3';

  let time = $state('14:30');
</script>

<TimePicker bind:value={time} />
```

## Usage

```svelte
<script>
  import { TimePicker } from '@intinyagroup/md3';

  let time = $state('09:00');
</script>

<TimePicker
  bind:value={time}
  format="12h"
  onchange={(t) => console.log('New time:', t)}
/>
```

## Features

- Analog clock face with hour and minute rings (auto-switches from hours to minutes)
- Keyboard input mode (type HH:MM, Enter to commit)
- AM/PM toggle in 12-hour format
- 24-hour format with inner/outer hour rings

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` (bindable) | `'12:00'` | Time value in `HH:MM` format |
| `format` | `'12h' \| '24h'` | `'24h'` | Time format |
| `onchange` | `(time: string) => void` | `undefined` | Callback when value changes |
| `class` | `string` | `undefined` | Additional CSS classes |

## Install

```bash
npx @intinyagroup/cli add md3-time-picker
```
