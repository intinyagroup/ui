---
title: Theming Guide
description: Advanced theming with Intinya UI tokens — custom themes, dark mode, runtime switching
---

# Theming Guide

Intinya UI uses CSS custom properties for theming. This guide covers advanced patterns beyond the basics.

## Anatomy of a Theme

Every theme is a CSS file that redefines the same variables:

```css
/* Custom theme: brand.css */
@import "@intinyagroup/tokens/base";

:root {
  --ui-background: oklch(0.98 0.01 240);
  --ui-foreground: oklch(0.2 0.02 240);
  --ui-primary: oklch(0.55 0.2 265);
  --ui-primary-foreground: oklch(1 0 0);
  --ui-radius: 0.75rem;
}
```

Import it instead of the base theme:

```css
/* app.css */
@import "@intinyagroup/tokens/brand.css"; /* your custom theme */
```

## Dark Mode with Two Themes

Stack themes with a class toggle:

```css
/* app.css */
@import "@intinyagroup/tokens/base";

html.dark {
  --ui-background: oklch(0.15 0.01 240);
  --ui-foreground: oklch(0.95 0 0);
  --ui-primary: oklch(0.7 0.15 265);
  --ui-card: oklch(0.2 0.01 240);
}
```

```ts
// Theme toggle
const theme = localStorage.getItem('theme') ?? 'light';
document.documentElement.classList.toggle('dark', theme === 'dark');

function toggle() {
  const dark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}
```

## All Variables

| Variable | Purpose |
|----------|---------|
| `--ui-background` | Page background |
| `--ui-foreground` | Default text |
| `--ui-card` | Card surface |
| `--ui-card-foreground` | Card text |
| `--ui-primary` | Primary action color |
| `--ui-primary-foreground` | Text on primary |
| `--ui-secondary` | Secondary surface |
| `--ui-muted` | Muted surface |
| `--ui-muted-foreground` | Muted text |
| `--ui-accent` | Accent color |
| `--ui-border` | Border color |
| `--ui-ring` | Focus ring |
| `--ui-radius` | Border radius |
| `--ui-shadow-sm/md/lg/xl` | Shadow levels |

## Building a Custom Theme

1. **Start from a base** — copy `@intinyagroup/tokens/base` or any theme
2. **Override semantic colors** — keep the variable names, change values
3. **Test contrast** — foreground on background, primary on primary-foreground
4. **Export** — publish as `@your-brand/tokens` for your team

## Theme Recipes

### Minimal

```css
:root {
  --ui-radius: 0.25rem;
  --ui-background: oklch(0.99 0 0);
  --ui-primary: oklch(0.25 0 0);
  --ui-primary-foreground: oklch(0.99 0 0);
  --ui-border: oklch(0.9 0 0);
}
```

### Warm

```css
:root {
  --ui-background: oklch(0.98 0.01 80);
  --ui-primary: oklch(0.6 0.15 45);
  --ui-border: oklch(0.9 0.02 80);
}
```

### High Contrast

```css
:root {
  --ui-background: oklch(1 0 0);
  --ui-foreground: oklch(0 0 0);
  --ui-primary: oklch(0 0 0);
  --ui-primary-foreground: oklch(1 0 0);
  --ui-radius: 0;
}
```

## Next Steps

- [Explore the 9 built-in themes](/docs/themes)
- [Get started with installation](/docs/getting-started)
- [Browse components](/docs/components)
