---
title: Star Card
description: Star-shaped flat highlight card with title and value.
---

# Star Card

A star-shaped card for highlighting a feature or rating. Clipped with the `--clip-star` polygon from the Flat theme, with a bindable element reference.

## Preview

```svelte
<script>
  import { StarCard } from '@intinyagroup/flat';
</script>

<div class="flex flex-wrap items-center gap-8">
  <StarCard title="Best Choice" value="Editor's pick" color="yellow" />
  <StarCard title="Top Rated" value="4.9/5" color="orange" size="lg" />
</div>
```

## Usage

```svelte
<script>
  import { StarCard } from '@intinyagroup/flat';
</script>

<StarCard title="Featured" value="Most loved component" color="purple" size="md" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Card title |
| `value` | `string` | `undefined` | Supporting value text |
| `color` | `'red' \| 'blue' \| 'green' \| 'purple' \| 'pink' \| 'yellow' \| 'orange'` | `'yellow'` | Flat color variant |
| `size` | `'md' \| 'lg'` | `'md'` | Card size |
| `ref` | `HTMLElement \| null` (bindable) | `null` | Bound element reference |
| `class` | `string` | `undefined` | Additional CSS classes |

## Install

```bash
npx @intinyagroup/cli add flat-star-card
```