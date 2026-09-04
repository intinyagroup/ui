---
title: FAB Menu
description: Floating action button speed dial that expands a stack of actions.
---

# FAB Menu

A floating action button that expands into a vertical speed dial of action items. Each item has a `label`, optional icon snippet, and `action` callback. Closes on item select or outside tap.

## Usage

```svelte
<script>
  import { FabMenu } from '@intinyagroup/ui';
  import { Camera, Image, Video } from 'lucide-svelte';
</script>

<FabMenu
  items={[
    { label: 'Take Photo', icon: () => <Camera />, action: () => console.log('camera') },
    { label: 'Gallery', icon: () => <Image />, action: () => console.log('gallery') },
    { label: 'Record', icon: () => <Video />, action: () => console.log('record') }
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `{ label: string; icon?: Snippet; action: () => void }[]` | — | Speed dial items |
| `position` | `'bottom-right' \| 'bottom-left'` | `'bottom-right'` | Corner the FAB sits in |
| `label` | `string` | `'Actions'` | Accessible name for the speed-dial group |
| `class` | `string` | — | Additional CSS classes |

## Features

- Speed dial expands upward from the main FAB.
- Item actions close the menu automatically.
- Closes on outside pointer down.
- Accessible group label for screen readers.