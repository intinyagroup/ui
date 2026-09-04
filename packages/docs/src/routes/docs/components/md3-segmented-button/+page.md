---
title: Segmented Button
description: Material Design 3 segmented buttons for single or multi selection.
---

# Segmented Button

A group of buttons in a pill container used to display available options and help select a single or multiple options.

## Preview

```svelte
<script>
  import { SegmentedButton, SegmentedButtonItem } from '@intinyagroup/md3';

  let selected = $state('day');
</script>

<SegmentedButton bind:value={selected}>
  <SegmentedButtonItem value="day" label="Day" />
  <SegmentedButtonItem value="week" label="Week" />
  <SegmentedButtonItem value="month" label="Month" />
</SegmentedButton>
```

## Multi-select

Set `multiple` to allow toggling several options at once:

```svelte
<script>
  import { SegmentedButton, SegmentedButtonItem } from '@intinyagroup/md3';

  let selected = $state(['bold', 'italic']);
</script>

<SegmentedButton multiple bind:value={selected}>
  <SegmentedButtonItem value="bold" label="Bold" />
  <SegmentedButtonItem value="italic" label="Italic" />
  <SegmentedButtonItem value="underline" label="Underline" />
</SegmentedButton>
```

## Props

### SegmentedButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| string[]` (bindable) | `[]` | Selected value(s); array when `multiple` |
| `multiple` | `boolean` | `false` | Enables multi-selection |
| `class` | `string` | `undefined` | Additional CSS classes |
| `children` | `Snippet` | `undefined` | SegmentedButtonItem children |

### SegmentedButtonItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Unique value for this segment |
| `label` | `string` | — | Segment label text |
| `icon` | `Snippet` | `undefined` | Optional icon shown when unselected |
| `class` | `string` | `undefined` | Additional CSS classes |

## Install

```bash
npx @intinyagroup/cli add md3-segmented-button
```
