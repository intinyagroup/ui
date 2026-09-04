---
title: Flat Theme
description: Bold colors, no shadows, sharp corners, geometric shapes
---

# Flat Theme

Flat design with saturated colors, zero border-radius, and geometric clip-path shapes.

## Install

```bash
pnpm add @intinyagroup/tokens
```

## Usage

```svelte
<script>
  import '@intinyagroup/tokens/flat.css';
</script>
```

## Token Differences

| Token | shadcn | Flat |
|-------|--------|------|
| `--ui-radius` | 0.625rem | 0px |
| `--ui-shadow-*` | subtle | none |
| `--ui-border` | oklch subtle | oklch black |
| Font | Inter | Outfit |

## Flat Color Palette

```css
--flat-red: #ef4444;
--flat-blue: #3b82f6;
--flat-green: #22c55e;
--flat-yellow: #eab308;
--flat-purple: #a855f7;
--flat-pink: #ec4899;
--flat-orange: #f97316;
--flat-teal: #14b8a6;
```

## Clip-Path Polygons

```css
--clip-hexagon: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
--clip-diamond: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
--clip-pentagon: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
--clip-star: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
--clip-triangle: polygon(50% 0%, 0% 100%, 100% 100%);
--clip-octagon: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
```

## Flat Composites

For geometric components, use `@intinyagroup/flat`:

```svelte
<script>
  import '@intinyagroup/tokens/flat.css';
  import { BlobCard, HexagonGrid, DiamondBadge, WaveSection, PentagonStat, StarCard } from '@intinyagroup/flat';
</script>

<BlobCard color="blue" title="Hello">
  Content here
</BlobCard>

<HexagonGrid columns={3}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</HexagonGrid>

<PentagonStat value="98%" label="Satisfaction" color="green" />
```

### Available Flat Components

| Component | Shape | Description |
|-----------|-------|-------------|
| `BlobCard` | SVG blob | Organic-shaped card |
| `HexagonGrid` | Hexagon | Honeycomb layout container |
| `DiamondBadge` | Diamond | Rotated label |
| `WaveSection` | Wave | Section divider with SVG wave |
| `PentagonStat` | Pentagon | Metric display |
| `StarCard` | Star | Highlight card |
| `TriangleAlert` | Triangle | Warning banner |
| `CircleAvatar` | Circle | Avatar with colored ring |

## Dark Mode

```css
[data-ui-theme="flat-dark"] {
  /* dark tokens */
}
```
