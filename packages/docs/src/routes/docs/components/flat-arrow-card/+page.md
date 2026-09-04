---
title: Arrow Card
description: Arrow-pointed flat card with direction variants.
---

# Arrow Card

A card whose edge points left or right like an arrow. Clipped to a pointed polygon with a bold flat color, ideal for callouts, step flows, and directional hints.

## Preview

```svelte
<script>
  import { ArrowCard } from '@intinyagroup/flat';
</script>

<div class="flex flex-col gap-6">
  <ArrowCard title="Next step" direction="right" color="blue">
    Continues to the right
  </ArrowCard>
  <ArrowCard title="Go back" direction="left" color="orange">
    Points to the previous step
  </ArrowCard>
</div>
```

## Usage

```svelte
<script>
  import { ArrowCard } from '@intinyagroup/flat';
</script>

<ArrowCard title="Checkout" direction="right" color="green">
  <!-- Card body -->
</ArrowCard>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `undefined` | Card title |
| `direction` | `'left' \| 'right'` | `'right'` | Direction the arrow points |
| `color` | `'red' \| 'blue' \| 'green' \| 'purple' \| 'pink' \| 'orange' \| 'teal'` | `'blue'` | Flat color variant |
| `class` | `string` | `undefined` | Additional CSS classes |
| `children` | `Snippet` | `undefined` | Card body content |

## Install

```bash
npx @intinyagroup/cli add flat-arrow-card
```