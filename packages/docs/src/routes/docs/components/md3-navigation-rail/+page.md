---
title: Navigation Rail
description: Material Design 3 vertical navigation for tablet and desktop layouts.
---

# Navigation Rail

A vertical navigation component for tablet and desktop layouts. Displays navigation items with icons and labels, and supports an optional FAB at the top.

## Preview

```svelte
<script>
  import { NavigationRail } from '@intinyagroup/md3';
</script>

<div class="h-96">
  <NavigationRail
    items={[
      { label: 'Home', active: true },
      { label: 'Search' },
      { label: 'Favorites' }
    ]}
  />
</div>
```

## Usage

```svelte
<script>
  import { NavigationRail } from '@intinyagroup/md3';
</script>

<NavigationRail
  items={navItems}
>
  {#snippet fab()}
    <FAB variant="tertiary" size="small" />
  {/snippet}
</NavigationRail>
```

Each item requires a `label` string and an `icon` snippet. Set `active: true` on the current item.

## Props

### NavigationRail

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `NavigationItem[]` | `[]` | Array of navigation items |
| `fab` | `Snippet` | `undefined` | Optional FAB rendered at the top |
| `class` | `string` | `undefined` | Additional CSS classes |

### NavigationItem

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Item label text |
| `icon` | `Snippet` | Icon snippet |
| `active` | `boolean` | Whether this item is currently active |

## Install

```bash
npx @intinyagroup/cli add md3-navigation-rail
```
