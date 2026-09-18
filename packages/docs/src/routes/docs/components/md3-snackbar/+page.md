---
title: Snackbar
description: Material Design 3 transient notification message with optional action.
---

# Snackbar

A brief message that appears at the bottom of the screen to provide feedback about an operation. Supports an optional action button and auto-dismiss.

## Preview

```svelte
<script>
  import { Snackbar } from '@intinyagroup/md3';

  let show = $state(false);
</script>

<button onclick={() => (show = true)}>Show Snackbar</button>

<Snackbar
  bind:show
  message="Message sent"
  action="Undo"
  onaction={() => console.log('Undo clicked')}
/>
```

## Features

- Auto-dismiss after configurable duration
- Optional action button with callback
- Escape key to dismiss
- Animated entrance and exit
- Configurable duration

## Usage

```svelte
<script>
  import { Snackbar } from '@intinyagroup/md3';

  let show = $state(false);
</script>

<Snackbar
  bind:show
  message="File deleted"
  action="Restore"
  duration={4000}
  onaction={handleRestore}
  ondismiss={handleDismissComplete}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | — | Snackbar message text |
| `action` | `string` | `undefined` | Action button label |
| `onaction` | `() => void` | `undefined` | Callback when action button is clicked |
| `ondismiss` | `() => void` | `undefined` | Callback when snackbar is dismissed |
| `duration` | `number` | `5000` | Auto-dismiss duration in ms (0 to disable) |
| `show` | `boolean` (bindable) | `false` | Controls visibility |
| `class` | `string` | `undefined` | Additional CSS classes |

## Install

```bash
npx @intinyagroup/cli add md3-snackbar
```
