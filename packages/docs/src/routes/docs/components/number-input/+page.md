---
title: Number Input
description: Numeric input with increment/decrement buttons.
---

# Number Input

A numeric input field with + and - buttons for adjusting the value.

## Install

```bash
npx @intinyagroup/cli add number-input
```

## Usage

```svelte
<script>
  import { NumberInput } from '@intinyagroup/ui';

  let value = $state(1);
</script>

<NumberInput bind:value min={0} max={100} step={1} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | number | 0 | Current numeric value |
| min | number | - | Minimum allowed value |
| max | number | - | Maximum allowed value |
| step | number | 1 | Increment/decrement step |
| disabled | boolean | false | Disable interaction |
| class | string | - | Additional CSS classes |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| change | number | Fires when value changes |

## Notes

- Supports direct keyboard input in addition to buttons.
- Respects `min`/`max` bounds when using buttons.
