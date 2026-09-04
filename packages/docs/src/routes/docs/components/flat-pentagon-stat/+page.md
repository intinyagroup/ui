---
title: Pentagon Stat
description: Pentagon-shaped flat metric display with value and label.
---

# Pentagon Stat

A pentagon-shaped statistic display for key metrics. Uses `clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)` to create the pentagon silhouette.

## Preview

```svelte
<script>
  import { PentagonStat } from '@intinyagroup/flat';
</script>

<div class="flex flex-wrap items-center gap-8">
  <PentagonStat value="98%" label="Uptime" color="green" />
  <PentagonStat value="4.9" label="Rating" color="purple" />
  <PentagonStat value="2.4M" label="Users" color="blue" size="lg" />
</div>
```

## Usage

```svelte
<script>
  import { PentagonStat } from '@intinyagroup/flat';
</script>

<PentagonStat value="1.2M" label="Downloads" color="orange" size="md" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Metric value text |
| `label` | `string` | — | Metric label |
| `color` | `'red' \| 'blue' \| 'green' \| 'purple' \| 'pink' \| 'orange' \| 'teal'` | `'blue'` | Flat color variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Stat size |
| `class` | `string` | `undefined` | Additional CSS classes |

## Install

```bash
npx @intinyagroup/cli add flat-pentagon-stat
```