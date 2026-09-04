# Carousel

A swipeable, touch-friendly carousel with dot navigation and optional auto-play. Built with CSS scroll-snap — no external dependencies.

## Preview

```svelte
<script>
  import { Carousel } from '@intinyagroup/ui';
</script>

<Carousel class="w-full max-w-2xl">
  <div class="flex h-48 items-center justify-center rounded-xl bg-[var(--ui-muted)] text-lg">Slide 1</div>
  <div class="flex h-48 items-center justify-center rounded-xl bg-[var(--ui-muted)] text-lg">Slide 2</div>
  <div class="flex h-48 items-center justify-center rounded-xl bg-[var(--ui-muted)] text-lg">Slide 3</div>
</Carousel>
```

## Options

```svelte
<!-- Auto-play every 3 seconds, no dots -->
<Carousel autoplay interval={3000} showDots={false}>
  ...
</Carousel>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoplay` | `boolean` | `false` | Auto-advance slides |
| `interval` | `number` | `4000` | Auto-play interval (ms) |
| `showDots` | `boolean` | `true` | Show dot indicators |
| `showArrows` | `boolean` | `true` | Show prev/next arrows |
| `class` | `string` | — | Additional classes |

Each child of the carousel becomes a slide.

## Install

```bash
npx @intinyagroup/cli add carousel
```
