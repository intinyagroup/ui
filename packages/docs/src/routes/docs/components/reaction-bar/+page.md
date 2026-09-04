---
title: Reaction Bar
description: Emoji reaction pills with counts, selection state, and optional deselect.
---

# Reaction Bar

A row of emoji reaction pills with counts. Clicking a pill selects it (highlighted), clicking again deselects unless `allowDeselect` is off. `onReact` receives the selected id or `null`.

## Usage

```svelte
<script>
  import { ReactionBar } from '@intinyagroup/ui';

  let reactions = [
    { id: 'like', emoji: '👍', count: 42, label: 'Like' },
    { id: 'love', emoji: '❤️', count: 17, label: 'Love' },
    { id: 'laugh', emoji: '😂', count: 8, label: 'Laugh' }
  ];
  let selected = $state(null);

  function react(id) {
    selected = id;
  }
</script>

<ReactionBar {reactions} bind:selected onReact={react} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `reactions` | `Reaction[]` | — | Pills to render |
| `onReact` | `(id: string \| null) => void` | — | Called with the selected id (or `null` on deselect) |
| `selected` | `string \| null` | — | Currently selected reaction id |
| `allowDeselect` | `boolean` | `true` | Allow clicking the selected pill to deselect |
| `class` | `string` | — | Additional CSS classes |

### Reaction

```ts
{
  id: string;
  emoji: string;
  count: number;
  label?: string;
}
```

## Features

- Pill buttons with `aria-pressed` and accessible labels.
- Selected pill highlighted with the primary token.
- Counts use `tabular-nums`.
- Counts of zero hide the number.