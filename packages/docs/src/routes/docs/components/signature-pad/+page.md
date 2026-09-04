---
title: Signature Pad
description: Canvas-based signature capture input.
---

# Signature Pad

A canvas element for capturing handwritten signatures or drawings via mouse or touch.

## Install

```bash
npx @intinyagroup/cli add signature-pad
```

## Usage

```svelte
<script>
  import { SignaturePad, Button } from '@intinyagroup/ui';

  let pad;

  function save() {
    const dataUrl = pad.toDataURL();
    console.log('Signature:', dataUrl);
  }
</script>

<SignaturePad bind:this={pad} />

<Button onclick={save}>Save Signature</Button>
<Button variant="outline" onclick={() => pad.clear()}>Clear</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| width | number | 400 | Canvas width in pixels |
| height | number | 200 | Canvas height in pixels |
| penColor | string | '#000000' | Stroke color |
| backgroundColor | string | '#ffffff' | Canvas background |
| class | string | - | Additional CSS classes |

## Methods

| Method | Description |
|--------|-------------|
| `clear()` | Clear the canvas |
| `toDataURL()` | Export signature as data URL |

## Notes

- Supports mouse, touch, and stylus input.
- Exports as PNG data URL for server upload.
