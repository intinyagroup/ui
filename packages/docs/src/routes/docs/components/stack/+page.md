---
title: Stack
description: Vertical flex container with token gaps and an optional divider between children.
---

# Stack

A vertical flex container. Sets the gap from the spacing token scale and can render dividers between children.

## Usage

```svelte
<script>
  import { Stack } from '@intinyagroup/ui';
</script>

<Stack gap={2}>
  <p>First</p>
  <p>Second</p>
</Stack>

<Stack gap={1} divider>
  <p>Divided</p>
  <p>Rows</p>
</Stack>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gap` | `number` | `4` | Gap from the spacing token scale |
| `divider` | `boolean` | `false` | Render a border between children |
| `class` | `string` | — | Additional CSS classes |
| `children` | `Snippet` | — | Stack content |

## Features

- Single-axis vertical layout.
- Gap restricted to the spacing token scale.
- `divider` adds hairline separators with the border token.