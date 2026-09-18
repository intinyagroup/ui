---
title: Zigzag Divider
description: Flat zigzag SVG divider between sections.
---

# Zigzag Divider

A full-width zigzag divider rendered as an SVG polygon. Use it to separate sections with a saw-tooth edge in any flat color.

## Preview

```svelte
<script>
  import { ZigzagDivider } from '@intinyagroup/flat';
</script>

<div class="bg-white">
  <ZigzagDivider color="blue" height="32px" />
</div>
<div class="h-24 bg-[var(--flat-blue)]"></div>
```

## Usage

```svelte
<script>
  import { ZigzagDivider } from '@intinyagroup/flat';
</script>

<ZigzagDivider color="teal" height="24px" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `'red' \| 'blue' \| 'green' \| 'purple' \| 'pink' \| 'orange' \| 'teal'` | `'blue'` | Divider color |
| `height` | `string` | `'24px'` | Divider height |
| `class` | `string` | `undefined` | Additional CSS classes |

## Install

```bash
npx @intinyagroup/cli add flat-zigzag-divider
```