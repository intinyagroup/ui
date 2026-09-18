---
title: Color Picker
description: Color picker input with preview and input modes.
---

# Color Picker

A color picker component that supports visual selection, hex input, and preset swatches.

## Install

```bash
npx @intinyagroup/cli add color-picker
```

## Usage

```svelte
<script>
  import { ColorPicker } from '@intinyagroup/ui';

  let color = $state('#6366f1');
</script>

<ColorPicker bind:value={color} />
<p>Selected: {color}</p>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string | '#000000' | Current color value (hex) |
| showInput | boolean | true | Show hex input field |
| showSwatches | boolean | false | Show preset color swatches |
| swatches | string[] | [] | Preset color hex values |
| disabled | boolean | false | Disable interaction |
| class | string | - | Additional CSS classes |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| change | string | Fires when color changes |

## Notes

- Accepts and emits hex color values.
- Supports RGB and HSL internally for smooth selection.
