---
title: Avatar Group
description: Stack multiple avatars in an overlapping layout.
---

# Avatar Group

Displays a collection of avatars in a compact, overlapping stack with an optional overflow count.

## Install

```bash
npx @intinyagroup/cli add avatar-group
```

## Usage

```svelte
<script>
  import { AvatarGroup, Avatar } from '@intinyagroup/ui';
</script>

<AvatarGroup max={3}>
  <Avatar src="/users/alice.jpg" alt="Alice" />
  <Avatar src="/users/bob.jpg" alt="Bob" />
  <Avatar src="/users/carol.jpg" alt="Carol" />
  <Avatar src="/users/dave.jpg" alt="Dave" />
</AvatarGroup>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| max | number | 5 | Maximum visible avatars before +N overflow |
| class | string | - | Additional CSS classes |

## Slots

| Slot | Description |
|------|-------------|
| default | `Avatar` components to display |

## Accessibility

- Overflow count is announced (e.g. "and 2 more").
- Each avatar retains its `alt` text.
