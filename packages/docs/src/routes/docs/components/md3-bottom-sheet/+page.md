---
title: Bottom Sheet
description: Material Design 3 modal panel that slides up from the bottom of the screen.
---

# Bottom Sheet

A modal surface that slides up from the bottom of the screen, typically used on mobile. Supports standard and expanding variants with a drag handle.

## Preview

```svelte
<script>
  import { BottomSheet } from '@intinyagroup/md3';

  let open = $state(false);
</script>

<button onclick={() => (open = true)}>Open Sheet</button>

<BottomSheet bind:open title="Options">
  <div class="flex flex-col gap-3 py-4">
    <button class="text-left p-2 hover:bg-black/5 rounded-lg">Profile</button>
    <button class="text-left p-2 hover:bg-black/5 rounded-lg">Settings</button>
    <button class="text-left p-2 hover:bg-black/5 rounded-lg">Help</button>
  </div>
</BottomSheet>
```

## Variants

- **`standard`** — Max height 80dvh (default)
- **`expanding`** — Can expand to full viewport height (100dvh)

## Features

- Click overlay to dismiss
- Escape key to dismiss
- Slide animation with cubic easing
- Drag handle indicator
- Optional title

## Usage

```svelte
<script>
  import { BottomSheet } from '@intinyagroup/md3';

  let open = $state(false);
</script>

<BottomSheet bind:open variant="expanding" title="Filter Options">
  <!-- Sheet content -->
</BottomSheet>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` (bindable) | `false` | Controls visibility |
| `variant` | `'standard' \| 'expanding'` | `'standard'` | Max height behavior |
| `title` | `string` | `undefined` | Optional title displayed above content |
| `children` | `Snippet` | `undefined` | Panel content |
| `class` | `string` | `undefined` | Additional CSS classes for the panel |

## Install

```bash
npx @intinyagroup/cli add md3-bottom-sheet
```
