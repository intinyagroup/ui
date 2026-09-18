---
title: Main
description: Semantic main element for primary page content.
---

# Main

Semantic `<main>` element wrapper for the primary content area of a page.

## Install

```bash
npx @intinyagroup/cli add main
```

## Usage

```svelte
<script>
  import { Main } from '@intinyagroup/ui';
</script>

<Main>
  <h1>Welcome</h1>
  <p>This is the main content area.</p>
</Main>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| class | string | - | Additional CSS classes |

## Slots

| Slot | Description |
|------|-------------|
| default | Primary page content |

## Accessibility

- Renders as `<main>`, the landmark for primary page content.
- Only one `<main>` should exist per page.
- Screen readers use this for "jump to main content" navigation.
