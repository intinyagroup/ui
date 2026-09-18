---
title: Blob Card
description: Organic-shaped flat card with a SVG blob clip-path and bold colors.
---

# Blob Card

An organic, blob-shaped card for the Flat theme. Uses an inline SVG `clip-path` with an `objectBoundingBox` path, bold flat colors, and a hover lift effect.

## Preview

```svelte
<script>
  import { BlobCard } from '@intinyagroup/flat';
</script>

<div class="flex flex-wrap gap-8">
  <BlobCard title="Growth" description="+42% this quarter" color="blue" />
  <BlobCard title="Reach" description="2.4M users" color="purple" />
  <BlobCard title="Revenue" description="$1.2M" color="green" />
</div>
```

## Usage

```svelte
<script>
  import { BlobCard } from '@intinyagroup/flat';
</script>

<BlobCard
  title="Engagement"
  description="Daily active users"
  color="pink"
>
  <!-- Optional extra content -->
</BlobCard>
```

The card is always square (`aspect-square`) and clips to an organic blob path.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `'red' \| 'blue' \| 'green' \| 'purple' \| 'pink' \| 'orange' \| 'teal'` | `'blue'` | Flat color variant |
| `title` | `string` | `undefined` | Card title |
| `description` | `string` | `undefined` | Card description |
| `class` | `string` | `undefined` | Additional CSS classes |
| `children` | `Snippet` | `undefined` | Extra content below title/description |

## Install

```bash
npx @intinyagroup/cli add flat-blob-card
```