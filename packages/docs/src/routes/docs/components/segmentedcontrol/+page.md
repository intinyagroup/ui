---
title: Segmented Control
description: Pill-style tab switcher with a sliding indicator and bindable value.
---

# Segmented Control

A pill-style control for switching between a small set of options. The active pill glides between options with a smooth indicator and re-measures on resize.

## Usage

```svelte
<script>
  import { SegmentedControl } from '@intinyagroup/ui';

  let options = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' }
  ];
  let value = $state('week');
</script>

<SegmentedControl bind:value {options} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| number` | — | Bindable selected option value |
| `options` | `{ value: string \| number; label: string }[]` | — | Options to render |
| `class` | `string` | — | Additional CSS classes |

## Features

- Gliding active pill with a springy cubic-bezier transition.
- Re-measures the indicator on resize and orientation change.
- Keyboard-operable via `role="tablist"` / `role="tab"` with roving `tabindex`.