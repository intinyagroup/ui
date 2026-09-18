---
title: Diamond Badge
description: Diamond-shaped flat label with bold colors and three sizes.
---

# Diamond Badge

A diamond-shaped badge for tags, statuses, and labels. Clipped with `polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)` and colored with the flat palette.

## Preview

```svelte
<script>
  import { DiamondBadge } from '@intinyagroup/flat';
</script>

<div class="flex items-center gap-4">
  <DiamondBadge label="NEW" />
  <DiamondBadge label="PREMIUM" color="purple" size="lg" />
  <DiamondBadge label="SALE" color="green" size="sm" />
</div>
```

## Usage

```svelte
<script>
  import { DiamondBadge } from '@intinyagroup/flat';
</script>

<DiamondBadge label="PRO" color="orange" size="md" />
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
npx @intinyagroup/cli add flat-diamond-badge
```