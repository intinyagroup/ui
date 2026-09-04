---
title: Box
description: Generic layout container that renders as any element with token-based padding.
---

# Box

A generic layout container. Renders as any element via the `as` prop and applies padding from a fixed token scale.

## Usage

```svelte
<script>
  import { Box } from '@intinyagroup/ui';
</script>

<Box as="section" padding={4}>
  <p>Content in a padded section.</p>
</Box>

<Box as="article" padding={2}>
  <p>Content in a padded article.</p>
</Box>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `keyof HTMLElementTagNameMap` | `'div'` | Element to render |
| `padding` | `number` | `0` | Padding from the token scale (`0`–`16`) |
| `class` | `string` | — | Additional CSS classes |
| `children` | `Snippet` | — | Box content |

Plus all standard HTML attributes, forwarded to the rendered element.

## Features

- Renders any element via `as` (`section`, `article`, `header`, `main`, …).
- Padding restricted to the spacing token scale for consistent rhythm.
- Forwards standard HTML attributes and events.
- Works as a bare wrapper when `padding` is `0`.