---
title: Action Sheet
description: A modal bottom sheet listing contextual actions, styled for mobile with destructive variants and focus trapping.
---

# Action Sheet

A mobile-style modal panel that slides in from the bottom and presents a list of actions. Each action is a full-width button; the sheet traps focus, closes on `Escape` or overlay tap, and supports destructive styling.

## Usage

```svelte
<script>
  import { ActionSheet, ActionSheetItem } from '@intinyagroup/ui';

  let open = $state(false);
</script>

<button onclick={() => (open = true)}>Open Sheet</button>

<ActionSheet bind:open title="Choose an action">
  <ActionSheetItem label="Copy Link" onselect={() => console.log('copied')} />
  <ActionSheetItem label="Share" />
  <ActionSheetItem label="Delete" destructive onselect={() => console.log('deleted')} />
</ActionSheet>
```

## Props

### ActionSheet

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Bindable visibility state |
| `title` | `string` | — | Optional header title |
| `cancelLabel` | `string` | `'Cancel'` | Label for the cancel button |
| `showCancel` | `boolean` | `true` | Show the cancel button |
| `onclose` | `() => void` | — | Called when the sheet closes |
| `class` | `string` | — | Additional CSS classes |
| `children` | `Snippet` | — | Sheet content / items |

### ActionSheetItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Item text |
| `destructive` | `boolean` | `false` | Styles the item with the destructive color |
| `icon` | `Snippet` | — | Optional leading icon |
| `onselect` | `() => void` | — | Called when the item is selected |
| `onclick` | `(e: MouseEvent) => void` | — | Native click handler |
| `disabled` | `boolean` | `false` | Disables the item |
| `class` | `string` | — | Additional CSS classes |

## Features

- Modal panel sliding from the bottom (mobile-first pattern).
- Focus trap keeps Tab navigation within the sheet while open.
- Closes on `Escape`, cancel button, or selecting an item.
- Destructive items styled with the destructive token.
- Optional leading icon snippets per item.