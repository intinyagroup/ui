---
title: Parallelogram Card
description: Slanted parallelogram flat card with title and content.
---

# Parallelogram Card

A slanted card with parallel edges. Clipped with `polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)` to create a dynamic, diagonal silhouette.

## Preview

```svelte
<script>
  import { ParallelogramCard } from '@intinyagroup/flat';
</script>

<div class="flex flex-col gap-6">
  <ParallelogramCard title="Velocity" color="blue">
    Ship faster with prebuilt components
  </ParallelogramCard>
  <ParallelogramCard title="Impact" color="pink">
    Bold shapes that stand out
  </ParallelogramCard>
</div>
```

## Usage

```svelte
<script>
  import { ParallelogramCard } from '@intinyagroup/flat';
</script>

<ParallelogramCard title="Mission" color="orange">
  <!-- Card body -->
</ParallelogramCard>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `undefined` | Card title |
| `color` | `'red' \| 'blue' \| 'green' \| 'purple' \| 'pink' \| 'orange' \| 'teal'` | `'blue'` | Flat color variant |
| `class` | `string` | `undefined` | Additional CSS classes |
| `children` | `Snippet` | `undefined` | Card body content |

## Install

```bash
npx @intinyagroup/cli add flat-parallelogram-card
```