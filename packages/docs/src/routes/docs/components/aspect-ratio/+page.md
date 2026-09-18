---
title: Aspect Ratio
description: Container that maintains a specific aspect ratio.
---

# Aspect Ratio

Container that maintains a specific width-to-height ratio regardless of its content or container size.

## Install

```bash
npx @intinyagroup/cli add aspect-ratio
```

## Usage

```svelte
<script>
  import { AspectRatio } from '@intinyagroup/ui';
</script>

<AspectRatio ratio={16 / 9}>
  <img src="/hero.jpg" alt="Hero" class="h-full w-full object-cover" />
</AspectRatio>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| ratio | number | 1 | Width-to-height ratio (e.g. `16/9`) |
| class | string | - | Additional CSS classes |

## Slots

| Slot | Description |
|------|-------------|
| default | Content constrained to the aspect ratio |

## Notes

- Uses `aspect-ratio` CSS property with a fallback `padding-bottom` trick.
- Works with images, videos, maps, or any embedded content.
