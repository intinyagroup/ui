---
title: Swipeable Item
description: List row that swipes to reveal actions with rubber-band physics and axis detection.
---

# Swipeable Item

A list row that swipes horizontally to reveal action buttons pinned behind it. Detects the gesture axis (vertical drags pass through to native scroll), rubber-bands past the open bound, and settles open or closed based on the threshold.

## Usage

```svelte
<script>
  import { SwipeableItem } from '@intinyagroup/ui';
  import { Trash2, Archive } from 'lucide-svelte';
</script>

<SwipeableItem
  actions={() => (
    <div class="flex h-full">
      <button class="w-20 bg-red-600 text-white" onclick={() => console.log('delete')}>
        <Trash2 class="mx-auto" />
      </button>
      <button class="w-20 bg-zinc-700 text-white" onclick={() => console.log('archive')}>
        <Archive class="mx-auto" />
      </button>
    </div>
  )}
>
  <div class="border-b bg-white p-4">Swipe me left</div>
</SwipeableItem>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `Snippet` | — | Visible row content |
| `actions` | `Snippet` | — | Buttons revealed behind the content |
| `threshold` | `number` | `80` | Pixels swiped before the item stays open |
| `direction` | `'left' \| 'right'` | `'left'` | Which swipe reveals the actions |
| `class` | `string` | — | Additional CSS classes |

## Features

- Touch and pointer support; axis detection hands vertical drags to native scroll.
- Rubber-band damping past the open bound (40% resistance).
- Settles open when the swipe passes `threshold` or half the action width.
- Click on an open item closes it; drag-then-click is suppressed.
- `direction="right"` reveals actions on the left edge.