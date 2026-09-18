---
title: Mobile Toast
description: Lightweight toast for mobile UIs with variants, duration, position, and an optional action.
---

# Mobile Toast

A compact toast designed for mobile. Supports variants, auto-dismiss duration, top/bottom positioning, and an optional action button. Pauses auto-dismiss while an action is present.

## Usage

```svelte
<script>
  import { MobileToast } from '@intinyagroup/ui';

  let open = $state(false);
</script>

<button onclick={() => (open = true)}>Show Toast</button>

<MobileToast
  bind:open
  message="Changes saved"
  variant="success"
  duration={3000}
/>

<MobileToast
  bind:open
  message="New version available"
  action="Update"
  onAction={() => console.log('updating…')}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | — | Toast text |
| `open` | `boolean` | `false` | Bindable visibility state |
| `variant` | `'default' \| 'success' \| 'error' \| 'warning'` | `'default'` | Visual variant |
| `duration` | `number` | `4000` | Auto-dismiss ms; `0` disables |
| `position` | `'bottom' \| 'top'` | `'bottom'` | Screen position |
| `action` | `string` | — | Optional action button label |
| `onAction` | `() => void` | — | Called when the action is pressed |
| `ondismiss` | `() => void` | — | Called after the toast closes |
| `class` | `string` | — | Additional CSS classes |

## Features

- Four variants with distinct icon + color pairs.
- Auto-dismiss with a 200 ms exit animation.
- Auto-dismiss is disabled while an action button is shown.
- Action press fires `onAction` and closes the toast.