---
title: Scroll Area
description: Custom-styled scrollbar container.
---

# Scroll Area

A container with a custom-styled scrollbar, replacing the browser default.

## Install

```bash
npx @intinyagroup/cli add scroll-area
```

## Usage

```svelte
<script>
  import { ScrollArea } from '@intinyagroup/ui';
</script>

<ScrollArea class="h-64">
  <div class="space-y-4 p-4">
    {#each Array(50) as _, i}
      <p>Scroll item {i + 1}</p>
    {/each}
  </div>
</ScrollArea>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| orientation | 'vertical' \| 'horizontal' \| 'both' | 'vertical' | Scroll direction |
| scrollbarWidth | number | 8 | Scrollbar width in pixels |
| class | string | - | Additional CSS classes |

## Slots

| Slot | Description |
|------|-------------|
| default | Scrollable content |

## Notes

- Scrollbar appears on hover or during scroll.
- Hides automatically when content doesn't overflow.
- Works consistently across browsers (custom scrollbar).
