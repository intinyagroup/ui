---
title: Cross Badge
description: Plus-shaped flat badge with bold colors and three sizes.
---

# Cross Badge

A plus/cross-shaped badge for special tags. Clipped with a 12-point polygon that leaves notches at the midpoints of each edge.

## Preview

```svelte
<script>
  import { CrossBadge } from '@intinyagroup/flat';
</script>

<div class="flex items-center gap-6">
  <CrossBadge label="+" color="red" />
  <CrossBadge label="NEW" color="blue" size="lg" />
  <CrossBadge label="VIP" color="green" size="sm" />
</div>
```

## Usage

```svelte
<script>
  import { CrossBadge } from '@intinyagroup/flat';
</script>

<CrossBadge label="HOT" color="orange" size="md" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Badge text |
| `color` | `'red' \| 'blue' \| 'green' \| 'purple' \| 'pink' \| 'orange' \| 'teal'` | `'red'` | Flat color variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size |
| `class` | `string` | `undefined` | Additional CSS classes |

## Install

```bash
npx @intinyagroup/cli add flat-cross-badge
```