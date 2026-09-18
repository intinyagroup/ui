---
title: FAB
description: Floating Action Button — Material Design 3 component for primary actions.
---

# FAB

A Floating Action Button for the most important action on a screen. Supports elevated, surface, and tertiary variants with small and large sizes.

## Preview

```svelte
<script>
  import { FAB } from '@intinyagroup/md3';
</script>

<div class="flex items-end gap-4">
  <FAB label="Create" variant="elevated" />
  <FAB label="Edit" variant="surface" />
  <FAB label="Share" variant="tertiary" />
  <FAB variant="elevated" size="small">
    {#snippet icon()}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </svg>
    {/snippet}
  </FAB>
</div>
```

## Variants

- **`elevated`** — Primary color with elevation shadow (default)
- **`surface`** — Secondary color with subtle shadow
- **`tertiary`** — Accent color with medium shadow

## Sizes

- **`small`** — 48×48 icon-only square
- **`large`** — 56px height with optional label text (default)

## Usage

```svelte
<script>
  import { FAB } from '@intinyagroup/md3';
</script>

<FAB label="Add" variant="elevated" size="large" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'elevated' \| 'surface' \| 'tertiary'` | `'elevated'` | Visual style variant |
| `size` | `'small' \| 'large'` | `'large'` | Button size |
| `label` | `string` | `undefined` | Text label (only shown in `large` size) |
| `icon` | `Snippet` | `undefined` | Leading icon snippet |
| `onclick` | `(e: MouseEvent) => void` | `undefined` | Click handler |
| `class` | `string` | `undefined` | Additional CSS classes |

## Install

```bash
npx @intinyagroup/cli add md3-fab
```
