---
title: Testimonial Carousel
description: Rotating carousel of customer testimonials.
---

# Testimonial Carousel

A carousel that displays customer testimonials one at a time with auto-play and navigation.

## Install

```bash
npx @intinyagroup/cli add testimonial-carousel
```

## Usage

```svelte
<script>
  import { TestimonialCarousel } from '@intinyagroup/ui';

  const testimonials = [
    {
      quote: 'Intinya UI transformed our design system.',
      author: 'Jane Smith',
      role: 'CTO at Acme',
      avatar: '/avatars/jane.jpg',
    },
    {
      quote: 'Best component library we have used.',
      author: 'Bob Johnson',
      role: 'Lead Dev at Startup',
      avatar: '/avatars/bob.jpg',
    },
  ];
</script>

<TestimonialCarousel {testimonials} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| testimonials | Testimonial[] | [] | Array of testimonial objects |
| autoPlay | boolean | true | Auto-rotate between testimonials |
| interval | number | 5000 | Auto-play interval in ms |
| showDots | boolean | true | Show dot navigation indicators |
| showArrows | boolean | true | Show prev/next arrow buttons |
| class | string | - | Additional CSS classes |

## Testimonial Properties

| Property | Type | Description |
|----------|------|-------------|
| quote | string | Testimonial text |
| author | string | Author name |
| role | string | Author title/company |
| avatar | string | Author avatar image URL |

## Notes

- Swipe support on touch devices.
- Transitions between testimonials with a crossfade animation.
- Pauses auto-play on hover or focus.
