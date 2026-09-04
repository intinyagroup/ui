---
title: Copy to Clipboard
description: Button that copies text to the clipboard with feedback.
---

# Copy to Clipboard

A button that copies specified text to the system clipboard and provides visual feedback on success.

## Install

```bash
npx @intinyagroup/cli add copy-to-clipboard
```

## Usage

```svelte
<script>
  import { CopyToClipboard } from '@intinyagroup/ui';
</script>

<CopyToClipboard text="npm install @intinyagroup/ui">
  <span class="font-mono">npm install @intinyagroup/ui</span>
</CopyToClipboard>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | string | - | Text to copy to clipboard |
| copiedDuration | number | 2000 | Duration (ms) to show copied state |
| class | string | - | Additional CSS classes |

## Slots

| Slot | Description |
|------|-------------|
| default | Trigger element (button content) |
| copied | Content shown during copied state |

## Accessibility

- Uses `navigator.clipboard.writeText()`.
- Announces "Copied!" to screen readers via `aria-live`.
