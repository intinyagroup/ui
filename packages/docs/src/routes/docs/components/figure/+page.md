---
title: Figure
description: Figure element with an optional caption.
---

# Figure

A semantic `<figure>` element with an optional caption for images, diagrams, or code snippets.

## Install

```bash
npx @intinyagroup/cli add figure
```

## Usage

```svelte
<script>
  import { Figure } from '@intinyagroup/ui';
</script>

<Figure caption="Figure 1: Application architecture overview">
  <img src="/architecture.png" alt="Architecture diagram" />
</Figure>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| caption | string | - | Figure caption text |
| captionPosition | 'bottom' \| 'top' | 'bottom' | Caption placement |
| class | string | - | Additional CSS classes |

## Slots

| Slot | Description |
|------|-------------|
| default | Figure content (image, diagram, etc.) |
| caption | Custom caption content (overrides `caption` prop) |

## Accessibility

- Renders as `<figure>` with `<figcaption>` for proper semantics.
- Screen readers associate the caption with the content.
