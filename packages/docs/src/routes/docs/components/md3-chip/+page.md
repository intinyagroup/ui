---
title: Chip
description: Material Design 3 chips for filtering, actions, and suggestions.
---

# Chip

Compact elements representing an input, attribute, or action. Supports assist, filter, input, and suggestion variants with optional leading/trailing icons.

## Preview

```svelte
<script>
  import { Chip } from '@intinyagroup/md3';
</script>

<div class="flex flex-wrap gap-2">
  <Chip variant="assist">Assist</Chip>
  <Chip variant="filter" selected>Filtered</Chip>
  <Chip variant="input">Input</Chip>
  <Chip variant="suggestion">Suggestion</Chip>
</div>
```

## Variants

- **`assist`** — Helps complete a task (with optional trailing icon)
- **`filter`** — Toggles selection state (selected/unselected)
- **`input`** — Represents entered text (removable)
- **`suggestion`** — Suggested content for the user

## Usage

```svelte
<script>
  import { Chip } from '@intinyagroup/md3';
</script>

<Chip variant="filter" selected={isActive} onclick={toggleFilter}>
  Filter
</Chip>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'assist' \| 'filter' \| 'input' \| 'suggestion'` | `'assist'` | Chip type |
| `selected` | `boolean` | `false` | Selection state (for filter chips) |
| `icon` | `Snippet` | `undefined` | Leading icon snippet |
| `trailingIcon` | `Snippet` | `undefined` | Trailing icon snippet |
| `onclick` | `(e: MouseEvent) => void` | `undefined` | Click handler |
| `class` | `string` | `undefined` | Additional CSS classes |
| `children` | `Snippet` | `undefined` | Label content |

All other props are forwarded to the underlying `<button>` element.

## Install

```bash
npx @intinyagroup/cli add md3-chip
```
