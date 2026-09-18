---
title: Slide Menu
description: Edge drawer that slides in from the left or right with overlay, focus trap, and Escape-to-close.
---

# Slide Menu

A drawer that slides in from the left or right edge. Supports an optional dimming overlay with tap-to-close, a focus trap, Escape-to-close, and focus restoration on close.

## Usage

```svelte
<script>
  import { SlideMenu } from '@intinyagroup/ui';

  let open = $state(false);
</script>

<button onclick={() => (open = true)}>Open Menu</button>

<SlideMenu bind:open side="right" title="Settings">
  <nav class="flex flex-col gap-2 p-4">
    <a href="/profile">Profile</a>
    <a href="/account">Account</a>
    <a href="/help">Help</a>
  </nav>
</SlideMenu>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Bindable visibility state |
| `side` | `'left' \| 'right'` | `'left'` | Edge the drawer slides from |
| `overlay` | `boolean` | `true` | Dim the page behind; tap to close |
| `title` | `string` | — | Optional header title next to the close button |
| `onclose` | `() => void` | — | Called when the drawer closes |
| `class` | `string` | — | Additional CSS classes |
| `children` | `Snippet` | — | Drawer content |

## Features

- Slides from either edge with animated transform.
- Focus trap keeps Tab navigation inside while open; focus returns on close.
- Closes on `Escape`, overlay tap, or the close button.