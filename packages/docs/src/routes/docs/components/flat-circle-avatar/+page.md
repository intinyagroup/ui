---
title: Circle Avatar
description: Flat avatar with a thick colored ring, image or initials.
---

# Circle Avatar

A circular avatar with a bold flat-color ring. Shows an image when `src` is provided, otherwise renders initials on a flat color background.

## Preview

```svelte
<script>
  import { CircleAvatar } from '@intinyagroup/flat';
</script>

<div class="flex items-center gap-6">
  <CircleAvatar initials="AK" ringColor="blue" />
  <CircleAvatar initials="ML" ringColor="pink" size="lg" ringWidth="6px" />
  <CircleAvatar src="/images/avatar.png" alt="User" ringColor="green" size="xl" />
</div>
```

## Usage

```svelte
<script>
  import { CircleAvatar } from '@intinyagroup/flat';
</script>

<CircleAvatar
  src="/team/alex.jpg"
  alt="Alex"
  ringColor="purple"
  size="xl"
  ringWidth="4px"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | `undefined` | Image source |
| `alt` | `string` | `''` | Image alt text |
| `initials` | `string` | `undefined` | Initials shown when no image |
| `ringColor` | `'red' \| 'blue' \| 'green' \| 'purple' \| 'pink' \| 'orange' \| 'teal'` | `'blue'` | Ring color |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Avatar size |
| `ringWidth` | `string` | `'4px'` | Ring border width |
| `class` | `string` | `''` | Additional CSS classes |

## Install

```bash
npx @intinyagroup/cli add flat-circle-avatar
```