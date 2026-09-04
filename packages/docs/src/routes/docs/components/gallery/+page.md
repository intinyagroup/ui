---
title: Gallery
description: Multi-file image picker with drag-and-drop, live previews, and file-limit enforcement.
---

# Gallery

A gallery picker that supports multiple image selection, drag-and-drop, live previews, removal, and a hard cap on files.

## Usage

```svelte
<script>
  import { GalleryPicker } from '@intinyagroup/ui';

  function handleSelect(files) {
    console.log('Selected', files.length, 'files');
  }
</script>

<GalleryPicker onSelect={handleSelect} maxFiles={8} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `multiple` | `boolean` | `true` | Allow selecting more than one file |
| `accept` | `string` | `'image/*'` | Accepted file types |
| `maxFiles` | `number` | `10` | Maximum files when `multiple` is enabled |
| `onSelect` | `(files: File[]) => void` | — | Called whenever the selection changes |
| `class` | `string` | — | Additional CSS classes |

## Features

- Drag-and-drop with a dragging state.
- Live object-URL previews of selected files.
- Remove individual files or clear all.
- Enforces `maxFiles` and reports the error.
- `multiple` mode accumulates across selections; single mode keeps one.