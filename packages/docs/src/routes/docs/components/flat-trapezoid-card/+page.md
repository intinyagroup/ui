---
title: Trapezoid Card
description: Trapezoid-shaped flat card with a tilted top edge.
---

# Trapezoid Card

A trapezoid-shaped card whose top edge is narrower than its bottom edge. Clipped with `polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)` for a subtle wedge silhouette.

## Preview

```svelte
<script>
  import { TrapezoidCard } from '@intinyagroup/flat';
</script>

<div class="flex flex-wrap gap-8">
  <TrapezoidCard title="Launch" color="blue">
    Coming soon
  </TrapezoidCard>
  <TrapezoidCard title="Featured" color="orange">
    Editor's choice
  </TrapezoidCard>
</div>
```

## Usage

```svelte
<script>
  import { TrapezoidCard } from '@intinyagroup/flat';
</script>

<TrapezoidCard title="New" color="green">
  <!-- Card body -->
</TrapezoidCard>
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
npx @intinyagroup/cli add flat-trapezoid-card
```