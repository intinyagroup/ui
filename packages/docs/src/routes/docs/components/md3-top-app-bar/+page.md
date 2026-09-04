---
title: Top App Bar
description: Material Design 3 app bars in small, center, medium, and large sizes with scroll collapse.
---

# Top App Bar

A Material Design 3 top app bar that displays screen content and actions. Available in four sizes; medium and large collapse on scroll.

## Preview

```svelte
<script>
  import { TopAppBar } from '@intinyagroup/md3';
</script>

<TopAppBar title="Home" variant="small" />
```

## Variants

- **`small`** — 64px standard bar (default)
- **`center`** — Centered title with side actions
- **`medium`** — 128px expanded bar that collapses on scroll
- **`large`** — 192px expanded bar with large title that collapses on scroll

## Usage

```svelte
<script>
  import { TopAppBar } from '@intinyagroup/md3';
</script>

<TopAppBar
  title="Library"
  variant="large"
>
  {#snippet navigationIcon()}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
    </svg>
  {/snippet}
  {#snippet actions()}
    <button class="p-2 rounded-full hover:bg-black/5" aria-label="Search">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    </button>
  {/snippet}
</TopAppBar>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'center' \| 'small' \| 'medium' \| 'large'` | `'small'` | App bar size/style |
| `title` | `string` | `''` | Bar title text |
| `navigationIcon` | `Snippet` | `undefined` | Leading icon snippet (e.g. menu) |
| `actions` | `Snippet` | `undefined` | Trailing action buttons |
| `class` | `string` | `undefined` | Additional CSS classes |

## Install

```bash
npx @intinyagroup/cli add md3-top-app-bar
```
