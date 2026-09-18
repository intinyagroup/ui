---
title: Rating
description: Star rating with half-star and read-only modes.
---

# Rating

A star rating component supporting full, half, and fractional ratings with optional interaction.

## Install

```bash
npx @intinyagroup/cli add rating
```

## Usage

```svelte
<script>
  import { Rating } from '@intinyagroup/ui';

  let rating = $state(3.5);
</script>

<Rating bind:value={rating} />

<Rating value={4} readOnly />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | number | 0 | Current rating (0-5) |
| max | number | 5 | Maximum rating value |
| readOnly | boolean | false | Disable interaction |
| allowHalf | boolean | false | Allow half-star ratings |
| class | string | - | Additional CSS classes |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| change | number | Fires when rating is selected |

## Accessibility

- Uses `role="slider"` with `aria-valuenow` and `aria-valuemax`.
- Keyboard navigable with Arrow keys.
