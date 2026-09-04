---
title: Editable Label
description: Inline text that becomes an input on click, rendered as any heading or span.
---

# Editable Label

A label that switches to an inline text input when clicked. Committing (`Enter` or blur) updates the bindable `value` and fires `onEdit`; `Escape` cancels. Render as any heading level or a span via `as`.

## Usage

```svelte
<script>
  import { EditableLabel } from '@intinyagroup/ui';

  let title = $state('My Project');
</script>

<EditableLabel bind:value={title} as="h2" onEdit={(v) => console.log('Renamed to', v)} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Bindable label text |
| `placeholder` | `string` | `'Click to edit'` | Placeholder when empty |
| `as` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'span' \| 'p'` | `'span'` | Element rendered while not editing |
| `onEdit` | `(value: string) => void` | — | Called when a change is committed |
| `maxLength` | `number` | — | Max input length while editing |
| `class` | `string` | — | Additional CSS classes |

## Features

- Click to edit, `Enter`/blur to commit, `Escape` to cancel.
- Automatically focuses and selects the input when editing starts.
- Heading elements get token-based typography sizes.
- Empty commits revert to the previous value.