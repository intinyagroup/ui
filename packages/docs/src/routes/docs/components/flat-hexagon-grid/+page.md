---
title: Hexagon Grid
description: Honeycomb-style layout container that clips its children into hexagons.
---

# Hexagon Grid

A honeycomb layout container. Every direct child is clipped into a hexagon shape, with alternating rows offset to create the classic honeycomb pattern.

## Preview

```svelte
<script>
  import { HexagonGrid } from '@intinyagroup/flat';
</script>

<HexagonGrid columns={3}>
  <div class="bg-[var(--flat-blue)]"></div>
  <div class="bg-[var(--flat-purple)]"></div>
  <div class="bg-[var(--flat-pink)]"></div>
  <div class="bg-[var(--flat-green)]"></div>
  <div class="bg-[var(--flat-orange)]"></div>
  <div class="bg-[var(--flat-teal)]"></div>
</HexagonGrid>
```

## Usage

```svelte
<script>
  import { HexagonGrid } from '@intinyagroup/flat';
</script>

<HexagonGrid columns={4} gap="1.5rem">
  {#each tiles as tile}
    <img src={tile.src} alt={tile.alt} class="object-cover" />
  {/each}
</HexagonGrid>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `2 \| 3 \| 4` | `3` | Number of hexagon columns |
| `gap` | `string` | `'1rem'` | Gap between hexagons (any CSS length) |
| `class` | `string` | `undefined` | Additional CSS classes |
| `children` | `Snippet` | `undefined` | Hexagon cells (direct children are clipped) |

## Install

```bash
npx @intinyagroup/cli add flat-hexagon-grid
```