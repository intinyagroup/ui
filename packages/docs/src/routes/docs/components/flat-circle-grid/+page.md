---
title: Circle Grid
description: Row of flat colored circles for decoration and patterns.
---

# Circle Grid

Renders a configurable number of flat colored circles in a wrapping row. Useful for decorative patterns, dot markers, and visual rhythm.

## Preview

```svelte
<script>
  import { CircleGrid } from '@intinyagroup/flat';
</script>

<CircleGrid count={8} color="blue" size="md" />
```

## Usage

```svelte
<script>
  import { CircleGrid } from '@intinyagroup/flat';
</script>

<CircleGrid count={12} color="purple" size="sm" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | `6` | Number of circles |
| `color` | `'red' \| 'blue' \| 'green' \| 'purple' \| 'pink' \| 'orange' \| 'teal'` | `'blue'` | Circle color |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Circle size |
| `class` | `string` | `undefined` | Additional CSS classes |

## Install

```bash
npx @intinyagroup/cli add flat-circle-grid
```