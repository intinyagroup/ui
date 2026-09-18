---
title: Avatar Stack
description: Overlapping row of avatars that collapses extras into a +N badge.
---

# Avatar Stack

Renders an overlapping row of avatar images from an array of URLs. When the list exceeds `max`, remaining avatars collapse into a `+N` badge.

## Usage

```svelte
<script>
  import { AvatarStack } from '@intinyagroup/ui';

  const srcs = [
    'https://github.com/shadcn.png',
    'https://github.com/leerob.png',
    'https://github.com/evilrabbit.png',
    'https://github.com/vercel.png'
  ];
</script>

<AvatarStack {srcs} max={3} size="md" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `srcs` | `string[]` | — | Array of avatar image URLs |
| `max` | `number` | `5` | Max avatars shown before collapsing into a `+N` badge |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Avatar size |
| `class` | `string` | — | Additional CSS classes |

## Features

- Overlapping avatars with ring borders for a grouped look.
- Collapses to a `+N` badge once the count exceeds `max`.
- Role `img` with a descriptive `aria-label` for screen readers.
- Three sizes: `sm`, `md`, `lg`.
- Extra badge is marked `aria-hidden`.