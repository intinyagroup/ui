---
title: Ellipse Badge
description: Pill-shaped flat badge with bold colors and three sizes.
---

# Ellipse Badge

An ellipse-shaped badge for tags, counts, and labels. Clipped with `ellipse(50% 50% at 50% 50%)` for a pill silhouette.

## Preview

```svelte
<script>
  import { EllipseBadge } from '@intinyagroup/flat';
</script>

<div class="flex items-center gap-6">
  <EllipseBadge label="PRO" color="blue" />
  <EllipseBadge label="BETA" color="orange" size="lg" />
  <EllipseBadge label="2x" color="teal" size="sm" />
</div>
```

## Usage

```svelte
<script>
  import { EllipseBadge } from '@intinyagroup/flat';
</script>

<EllipseBadge label="LIMITED" color="purple" size="md" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Badge text |
| `color` | `'red' \| 'blue' \| 'green' \| 'purple' \| 'pink' \| 'orange' \| 'teal'` | `'blue'` | Flat color variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size |
| `class` | `string` | `undefined` | Additional CSS classes |

## Install

```bash
npx @intinyagroup/cli add flat-ellipse-badge
```