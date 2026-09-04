---
title: Material Design 3
description: Elevated, stateful, Google-flavored design tokens
---

# Material Design 3 Theme

MD3 brings Google's design language: elevation, state layers, and rounded containers.

## Install

```bash
pnpm add @intinyagroup/tokens
```

## Usage

```svelte
<script>
  import '@intinyagroup/tokens/md3.css';
</script>
```

## Token Differences

| Token | shadcn | MD3 |
|-------|--------|-----|
| `--ui-radius` | 0.625rem | 1rem |
| `--ui-shadow-*` | subtle | elevation 0-5 |
| `--ui-primary` | oklch violet | oklch blue |
| Font | Inter | Roboto |

## MD3-Specific Tokens

```css
/* Elevation shadows */
--ui-shadow-xs: none;
--ui-shadow-sm: 0 1px 2px oklch(0 0 0 / 0.3), 0 1px 3px 1px oklch(0 0 0 / 0.15);
--ui-shadow-md: 0 1px 2px oklch(0 0 0 / 0.3), 0 2px 6px 2px oklch(0 0 0 / 0.15);
--ui-shadow-lg: 0 4px 8px 3px oklch(0 0 0 / 0.15), 0 1px 3px oklch(0 0 0 / 0.3);

/* State layers */
--ui-state-hover: 0.08;
--ui-state-focus: 0.12;
--ui-state-pressed: 0.12;
--ui-state-dragged: 0.16;
```

## MD3 Components

For components that don't exist in shadcn, use `@intinyagroup/md3`:

```svelte
<script>
  import '@intinyagroup/tokens/md3.css';
  import { FAB, Chip, Snackbar, BottomSheet, TopAppBar } from '@intinyagroup/md3';
</script>

<FAB variant="elevated" onclick={handleClick}>
  <PlusIcon />
</FAB>

<Chip variant="filter" selected={isActive} onclick={toggleFilter}>
  Filter
</Chip>
```

### Available MD3 Components

| Component | Description |
|-----------|-------------|
| `FAB` | Floating Action Button (elevated, surface, tertiary) |
| `Chip` | Filter, assist, input, suggestion chips |
| `Snackbar` | Bottom notification bar |
| `BottomSheet` | Modal bottom panel |
| `TopAppBar` | App bar (small, medium, large, center) |
| `NavigationRail` | Vertical side nav for tablets |
| `Ripple` | Touch ripple effect |
| `Badge` | Notification badge (dot, number, icon) |

## Dark Mode

```css
[data-ui-theme="md3-dark"] {
  /* dark tokens */
}
```

Set `data-ui-theme="md3-dark"` on `<html>` to enable.
