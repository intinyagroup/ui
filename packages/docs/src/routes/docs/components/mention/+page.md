# Mention

A contenteditable rich-text editor for `@mention` mentions. As the user types `@`, a dropdown of users appears at the caret; selecting one inserts a non-editable mention token. Includes full keyboard navigation.

## Usage

```svelte
<script>
  import { Mention } from '@intinyagroup/ui';

  let value = $state('');
  const users = [
    { id: '1', name: 'Ada Lovelace' },
    { id: '2', name: 'Grace Hopper', avatar: '/ada.png' }
  ];

  function onMention(user) {
    console.log('Mentioned', user);
  }
</script>

<Mention bind:value {users} placeholder="Write a comment…" {onMention} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | Editor HTML content (bindable) |
| `users` | `MentionUser[]` | `[]` | Selectable users, filtered by name (bindable) |
| `placeholder` | `string` | `'Type @ to mention someone…'` | Placeholder shown when empty |
| `onMention` | `(user: MentionUser) => void` | — | Called when a mention is inserted |
| `class` | `string` | — | Additional classes |

```ts
type MentionUser = { id: string; name: string; avatar?: string };
```

## Keyboard navigation

| Key | Action |
|-----|--------|
| `ArrowUp` / `ArrowDown` | Move through the suggestion list |
| `Enter` | Insert the highlighted mention |
| `Escape` | Close the dropdown |

The dropdown repositions to the caret as it moves (clicks, `selectionchange`, undo, etc.).

## Features

- Caret-aware `@` trigger with inline dropdown positioned at the caret
- Non-editable mention tokens that stay intact while typing around them
- Keyboard navigation (arrows, Enter, Escape)
- Controlled `value` + `onMention` callback

## Install

```bash
npx @intinyagroup/cli add mention
```