---
title: Grid
description: Responsive CSS grid container with responsive column overrides and token gaps.
---

# Grid

A CSS grid container. Sets the column count per breakpoint (`sm`, `md`, `lg`) and the gap from the spacing token scale.

## Usage

```svelte
<script>
  import { Grid } from '@intinyagroup/ui';
</script>

<Grid cols={1} sm={2} lg={4} gap={4}>
  <div>Cell</div>
  <div>Cell</div>
  <div>Cell</div>
  <div>Cell</div>
</Grid>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cols` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | Base column count |
| `sm` | `2 \| 3 \| 4 \| 5 \| 6` | — | Columns at the `sm` breakpoint |
| `md` | `2 \| 3 \| 4 \| 5 \| 6` | — | Columns at the `md` breakpoint |
| `lg` | `2 \| 3 \| 4 \| 5 \| 6` | — | Columns at the `lg` breakpoint |
| `gap` | `number` | `4` | Gap from the spacing token scale |
| `class` | `string` | — | Additional CSS classes |
| `children` | `Snippet` | — | Grid content |

## Features

- Responsive column counts per breakpoint without utility soup.
- Gap restricted to the spacing token scale.
- Works with any children; cells size automatically.