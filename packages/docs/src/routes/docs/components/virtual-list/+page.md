---
title: Virtual List
description: Windowing for rendering 10K+ items smoothly
---

# Virtual List

Renders only visible items using fixed-height windowing. Perfect for large lists, chat feeds, and infinite scrolling.

## Install

```bash
npx @intinyagroup/cli add virtual-list
```

## Usage

```html
<script>
  import { VirtualList } from '@intinyagroup/ui';

  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    label: `Item ${i}`
  }));
</script>

<VirtualList {items} itemHeight={48} class="h-96">
  {#snippet children({ item })}
    <div class="flex h-full items-center border-b px-4">
      {item.label}
    </div>
  {/snippet}
</VirtualList>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | any[] | [] | List data (bindable) |
| `itemHeight` | number | 48 | Fixed row height (px) |
| `overscan` | number | 5 | Extra rows rendered outside viewport |
| `onEndReached` | () => void | - | Load more at bottom |
| `class` | string | - | Container classes |

## Features

- Renders only visible items (windowing)
- Handles 10K+ items smoothly
- onEndReached for infinite loading
- Scrollable container (set height via class)

## Example: Infinite Feed

```html
<script>
  import { VirtualList } from '@intinyagroup/ui';
  
  let items = $state([]);
  let page = $state(0);
  
  function loadMore() {
    page++;
    const next = Array.from({ length: 100 }, (_, i) => ({
      id: items.length + i,
      label: `Item ${items.length + i}`
    }));
    items = [...items, ...next];
  }
</script>

<VirtualList {items} itemHeight={48} onEndReached={loadMore} class="h-screen">
  {#snippet children({ item })}
    <div class="border-b px-4 py-2">{item.label}</div>
  {/snippet}
</VirtualList>
```
