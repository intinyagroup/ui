---
title: Emoji
description: Emoji picker with search and categories.
---

# Emoji

An emoji picker component with category tabs, search, and skin tone selection.

## Install

```bash
npx @intinyagroup/cli add emoji
```

## Usage

```svelte
<script>
  import { Emoji } from '@intinyagroup/ui';

  let selected = $state('👍');
</script>

<Emoji bind:value={selected} />
<p>Selected: {selected}</p>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string | - | Currently selected emoji |
| showPreview | boolean | true | Show emoji preview on hover |
| showSkinTones | boolean | true | Show skin tone selector |
| class | string | - | Additional CSS classes |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| select | string | Fires when an emoji is picked |

## Notes

- Emojis are grouped by category (smileys, animals, food, etc.).
- Search filters by emoji name and keywords.
- Uses native emoji rendering (no image assets).
