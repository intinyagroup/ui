---
title: Glass Theme
description: Translucent, blur, depth — creative sites and overlays
---

# Glass Theme

Glassmorphism with translucent surfaces, backdrop blur, and depth.

## Install

```bash
pnpm add @intinyagroup/tokens
```

## Usage

```svelte
<script>
  import '@intinyagroup/tokens/glass.css';
</script>
```

## Token Differences

| Token | shadcn | Glass |
|-------|--------|-------|
| `--ui-radius` | 0.625rem | 1.5rem |
| `--ui-card` | solid white | oklch white / 0.6 |
| `--ui-border` | oklch solid | oklch white / 0.2 |
| Font | Inter | Inter |
| Body | solid bg | gradient bg |

## Glass-Specific Tokens

```css
--glass-blur: 12px;
--glass-bg: oklch(1 0 0 / 0.6);
--glass-border: oklch(1 0 0 / 0.2);
--glass-shadow: 0 8px 32px oklch(0 0 0 / 0.1);
```

## Utility Classes

The glass theme adds utility classes:

```svelte
<!-- Full glass panel -->
<div class="glass">
  Translucent content
</div>

<!-- Subtle glass -->
<div class="glass-subtle">
  Lighter glass effect
</div>
```

## Usage with Components

```svelte
<script>
  import '@intinyagroup/tokens/glass.css';
  import { Button, Card } from '@intinyagroup/ui';
</script>

<!-- Card inherits glass tokens -->
<Card class="p-6">
  <h3>Glass Card</h3>
  <p>This card uses translucent background</p>
  <Button>Click me</Button>
</Card>
```

## Best For

- Hero sections with background images
- Overlay panels
- Creative portfolios
- Music/media apps

## Dark Mode

```css
[data-ui-theme="glass-dark"] {
  --glass-blur: 16px;
  --glass-bg: oklch(0.15 0.01 264 / 0.6);
  --glass-border: oklch(1 0 0 / 0.1);
}
```
