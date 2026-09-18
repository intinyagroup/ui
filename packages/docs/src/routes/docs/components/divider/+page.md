---
title: Divider
description: Visual divider or separator between content sections.
---

# Divider

A horizontal or vertical divider to visually separate content sections.

## Install

```bash
npx @intinyagroup/cli add divider
```

## Usage

```svelte
<script>
  import { Divider } from '@intinyagroup/ui';
</script>

<p>Content above</p>
<Divider />
<p>Content below</p>

<Divider orientation="vertical" class="h-8 mx-4" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| orientation | 'horizontal' \| 'vertical' | 'horizontal' | Divider direction |
| class | string | - | Additional CSS classes |

## Notes

- Renders a semantic `<hr>` element for horizontal dividers.
- Vertical divider renders a `<div>` with `role="separator"`.
- Supports custom styling via Tailwind classes.
