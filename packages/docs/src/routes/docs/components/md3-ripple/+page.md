---
title: Ripple
description: Material Design 3 CSS-only touch ripple overlay effect.
---

# Ripple

A container that adds an expanding ripple animation on pointer interaction. Wraps any content and adds the Material Design 3 state layer effect.

## Preview

```svelte
<script>
  import { Ripple } from '@intinyagroup/md3';
</script>

<Ripple class="rounded-lg bg-white p-8 shadow-md cursor-pointer">
  <p class="text-gray-800">Click or tap anywhere to see the ripple effect</p>
</Ripple>
```

## Custom Color

```svelte
<Ripple color="#6750a4" class="rounded-2xl bg-purple-50 p-8">
  <p class="text-purple-900">Purple ripple</p>
</Ripple>
```

## Usage

```svelte
<script>
  import { Ripple } from '@intinyagroup/md3';
</script>

<Ripple class="rounded-lg bg-surface p-4">
  <Button>Press me</Button>
</Ripple>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `'currentColor'` | Ripple color (CSS color value) |
| `class` | `string` | `undefined` | Additional CSS classes |
| `children` | `Snippet` | `undefined` | Content to wrap |

The ripple responds to pointer down events and creates an expanding circular animation from the click position.

## Install

```bash
npx @intinyagroup/cli add md3-ripple
```
