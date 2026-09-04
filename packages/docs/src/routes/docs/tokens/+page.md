# Design Tokens

Intinya UI is themed entirely through CSS custom properties. Override them in your root CSS — no rebuild needed.

## Core Tokens

| Token | Purpose | Default |
|-------|---------|---------|
| `--ui-background` | Page background | `oklch(0.985 0.003 247.858)` |
| `--ui-foreground` | Primary text | `oklch(0.21 0.006 285.885)` |
| `--ui-card` / `--ui-card-foreground` | Card surfaces | white / text |
| `--ui-popover` / `--ui-popover-foreground` | Popovers, menus | white / text |
| `--ui-primary` / `--ui-primary-foreground` | Primary actions | violet / white |
| `--ui-secondary` / `--ui-secondary-foreground` | Secondary actions | light gray |
| `--ui-muted` / `--ui-muted-foreground` | Disabled, subtle | light gray |
| `--ui-accent` / `--ui-accent-foreground` | Hover accents | light gray |
| `--ui-destructive` | Errors, delete | red |
| `--ui-border` | Borders | light gray |
| `--ui-input` | Input borders | light gray |
| `--ui-ring` | Focus rings | violet |
| `--ui-radius` | Corner radius scale | `0.5rem` |

## Typography

| Token | Default |
|-------|---------|
| `--ui-font-sans` | `"Inter Variable", system-ui` |
| `--ui-font-mono` | `"SFMono-Regular", ui-monospace` |
| `--ui-font-serif` | `"Georgia", serif` |

## Theming Example

```css
:root {
  --ui-primary: oklch(0.55 0.2 150);       /* green brand */
  --ui-radius: 0.75rem;                     /* rounder corners */
  --ui-font-sans: "Outfit", system-ui, sans-serif;
}

[data-ui-theme="dark"] {
  --ui-background: oklch(0.17 0.01 260);
  --ui-foreground: oklch(0.96 0.005 260);
}
```

## Theme Switching

Set `data-ui-theme` on the `<html>` element to switch themes:

```html
<html data-ui-theme="warm">
```

Available themes: `neutral`, `warm`, `dark`, `ocean`, `forest`.
