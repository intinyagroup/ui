---
title: Progress Indicator
description: Material Design 3 linear and circular progress indicators with determinate and indeterminate states.
---

# Progress Indicator

Shows progress of an operation. Supports both linear and circular variants, with determinate (value-driven) and indeterminate (animated) states.

## Preview

```svelte
<script>
  import { ProgressIndicator } from '@intinyagroup/md3';
</script>

<div class="flex flex-col gap-8">
  <!-- Linear determinate -->
  <ProgressIndicator value={60} />

  <!-- Linear indeterminate -->
  <ProgressIndicator />

  <!-- Circular determinate -->
  <ProgressIndicator variant="circular" value={60} />

  <!-- Circular indeterminate -->
  <ProgressIndicator variant="circular" />
</div>
```

## Usage

```svelte
<script>
  import { ProgressIndicator } from '@intinyagroup/md3';
</script>

<ProgressIndicator value={uploadProgress} />
```

Omit `value` for an indeterminate indicator.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `undefined` | Progress value 0–100. Omit for indeterminate |
| `variant` | `'linear' \| 'circular'` | `'linear'` | Progress indicator shape |
| `class` | `string` | `undefined` | Additional CSS classes |

## Accessibility

- Renders `role="progressbar"` with `aria-valuenow`, `aria-valuemin="0"`, and `aria-valuemax="100"` in determinate mode.

## Install

```bash
npx @intinyagroup/cli add md3-progress-indicator
```
