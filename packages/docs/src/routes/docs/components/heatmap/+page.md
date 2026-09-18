---
title: Heatmap
description: GitHub-style intensity heatmap with interpolated color scale and axis labels.
---

# Heatmap

A GitHub-contribution-style heatmap. Cells are addressed by `x`/`y` keys with a numeric `value`; intensity is interpolated across a three-stop color scale. Optional `x`/`y` axis labels and legend.

## Usage

```svelte
<script>
  import { Heatmap } from '@intinyagroup/ui';

  const data = [
    { x: 'Mon', y: 'Week 1', value: 3 },
    { x: 'Tue', y: 'Week 1', value: 8 },
    { x: 'Wed', y: 'Week 1', value: 0 },
    { x: 'Mon', y: 'Week 2', value: 5 },
    { x: 'Tue', y: 'Week 2', value: 12 }
  ];
</script>

<Heatmap {data} xLabels={['Mon', 'Tue', 'Wed']} yLabels={['Week 1', 'Week 2']} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `HeatmapCell[]` | — | `{ x, y, value }` cells |
| `colorScale` | `[string, string, string]` | `['#ebedf0', '#9be9a8', '#216e39']` | Low → mid → high CSS colors |
| `xLabels` | `(string \| number)[]` | — | Labels for the x axis; defaults to data keys |
| `yLabels` | `(string \| number)[]` | — | Labels for the y axis; defaults to data keys |
| `showLegend` | `boolean` | `true` | Show the low-to-high legend |
| `cellSize` | `string` | `'h-8 w-8'` | Tailwind size classes for each cell |
| `class` | `string` | — | Additional CSS classes |

### HeatmapCell

```ts
{
  x: string | number;
  y: string | number;
  value: number;
}
```

## Features

- Interpolates cell color across a three-stop scale relative to the data min/max.
- Duplicate `x`/`y` keys resolve to the last value.
- Optional axis labels default to the sorted data keys.
- Custom `colorScale` and `cellSize` for branding.