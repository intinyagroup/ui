---
title: Clipboard
description: Button that copies text to the clipboard with success feedback and legacy fallback.
---

# Clipboard

A button that copies a string to the clipboard using the async Clipboard API, with a legacy `execCommand` fallback. Shows a "Copied!" state for two seconds after a successful copy.

## Usage

```svelte
<script>
  import { ClipboardButton } from '@intinyagroup/ui';
</script>

<ClipboardButton text="npm install @intinyagroup/ui" />

<ClipboardButton text="secret-token-123" label="Copy token" copiedLabel="Copied!" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | — | Text to copy to the clipboard |
| `label` | `string` | `'Copy'` | Label when not copied |
| `copiedLabel` | `string` | `'Copied!'` | Label after a successful copy |
| `onCopied` | `() => void` | — | Called after a successful copy |
| `class` | `string` | — | Additional CSS classes |

## Features

- Uses `navigator.clipboard.writeText` when available.
- Falls back to a hidden textarea + `execCommand('copy')` in older browsers.
- Success state reverts after two seconds.
- `aria-live="polite"` announces the state change to screen readers.