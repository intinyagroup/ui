---
title: Themes
description: Choose a visual direction for your app
---

# Themes

Intinya UI offers multiple design directions. Swap one import to change your entire app's personality.

## Available Themes

| Theme | Import | Personality |
|-------|--------|-------------|
| **shadcn** | `@intinyagroup/tokens/base` | Clean, muted, safe — great for dashboards |
| [**Material Design 3**](/docs/themes/md3) | `@intinyagroup/tokens/md3` | Elevated, stateful, Google-flavored |
| [**Flat**](/docs/themes/flat) | `@intinyagroup/tokens/flat` | Bold colors, sharp corners, geometric shapes |
| [**Glass**](/docs/themes/glass) | `@intinyagroup/tokens/glass` | Translucent, blur, depth |
| [**Brutalist**](/docs/themes/brutalist) | `@intinyagroup/tokens/brutalist` | Raw, heavy type, no softness |

## How It Works

Each theme redefines the same CSS custom properties with different values. Your components don't change — only the tokens do.

```svelte
<script>
  // Swap this one line to change your entire app
  import '@intinyagroup/tokens/flat.css';
</script>
```

## Theme Tokens

All themes share the same token names:

```css
/* Colors */
--ui-primary, --ui-secondary, --ui-muted, --ui-accent, --ui-destructive
--ui-background, --ui-foreground, --ui-card, --ui-border

/* Typography */
--ui-font-sans, --ui-font-mono

/* Spacing */
--ui-space-1 through --ui-space-16

/* Shadows */
--ui-shadow-xs through --ui-shadow-xl

/* Transitions */
--ui-transition-fast, --ui-transition-base, --ui-transition-slow
```

## Combining with Components

Base components from `@intinyagroup/ui` work with ANY theme:

```svelte
<script>
  import '@intinyagroup/tokens/flat.css'; // flat theme
  import { Button, Card, Input } from '@intinyagroup/ui'; // works with flat tokens
</script>
```

Theme-specific components (MD3, Flat composites) need their own packages:

```svelte
<script>
  import '@intinyagroup/tokens/md3.css';
  import { FAB, Chip, Snackbar } from '@intinyagroup/md3';
</script>
```
