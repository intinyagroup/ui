---
title: Octagon Card
description: Octagon-shaped flat card with title, description, and content.
---

# Octagon Card

An octagon-shaped card for tiles and highlights. Clipped with `polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)`.

## Preview

```svelte
<script>
  import { OctagonCard } from '@intinyagroup/flat';
</script>

<div class="flex flex-wrap gap-8">
  <OctagonCard title="Performance" description="12ms response time" color="blue" />
  <OctagonCard title="Security" description="SOC 2 certified" color="green" />
  <OctagonCard title="Scale" description="99.99% uptime" color="purple" />
</div>
```

## Usage

```svelte
<script>
  import { OctagonCard } from '@intinyagroup/flat';
</script>

<OctagonCard
  title="Customers"
  description="Loved by 10k teams"
  color="teal"
>
  <!-- Optional extra content -->
</OctagonCard>
```

The card has an aspect ratio of 1:1 and centers its content.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `undefined` | Card title |
| `description` | `string` | `undefined` | Card description |
| `color` | `'red' \| 'blue' \| 'green' \| 'purple' \| 'pink' \| 'orange' \| 'teal'` | `'blue'` | Flat color variant |
| `class` | `string` | `undefined` | Additional CSS classes |
| `children` | `Snippet` | `undefined` | Extra content below title/description |

## Install

```bash
npx @intinyagroup/cli add flat-octagon-card
```