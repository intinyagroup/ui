---
title: Brutalist Theme
description: Heavy type, raw borders, no softness
---

# Brutalist Theme

Raw, monospace-heavy design with thick borders, no shadows, and uppercase text.

## Install

```bash
pnpm add @intinyagroup/tokens
```

## Usage

```svelte
<script>
  import '@intinyagroup/tokens/brutalist.css';
</script>
```

## Token Differences

| Token | shadcn | Brutalist |
|-------|--------|-----------|
| `--ui-radius` | 0.625rem | 0px |
| `--ui-shadow-*` | subtle | none |
| `--ui-border` | oklch subtle | oklch black 2px |
| Font | Inter | Space Mono |
| Letter-spacing | normal | -0.02em |

## Brutalist Accent Colors

```css
--brutalist-red: #dc2626;
--brutalist-yellow: #eab308;
--brutalist-blue: #2563eb;
```

## Global Styles

The brutalist theme overrides button and link styles:

```css
/* All buttons are uppercase with thick borders */
button {
  border: 2px solid var(--ui-border);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

button:hover {
  background: var(--ui-foreground);
  color: var(--ui-background);
}

/* All links are uppercase bold */
a {
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.05em;
}
```

## Usage with Components

```svelte
<script>
  import '@intinyagroup/tokens/brutalist.css';
  import { Button, Card, Input } from '@intinyagroup/ui';
</script>

<Card class="p-6 border-2 border-black">
  <h3 class="text-xl font-bold uppercase tracking-wider">Title</h3>
  <p>Content with monospace font</p>
  <Button class="mt-4">Submit</Button>
</Card>
```

## Best For

- Developer tools
- Portfolios
- Art projects
- Anti-corporate branding

## Dark Mode

```css
[data-ui-theme="brutalist-dark"] {
  --ui-background: oklch(0.10 0 0);
  --ui-foreground: oklch(0.95 0 0);
  --ui-border: oklch(0.95 0 0);
}
```
