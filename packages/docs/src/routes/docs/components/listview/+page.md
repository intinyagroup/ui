---
title: List View
description: Mobile settings-style list with grouped items, leading/trailing content, and chevron navigation.
---

# List View

A mobile settings-style list. `ListView` renders an optional rounded, bordered card group; `ListItem` renders a row with title, description, leading icon, trailing content, and an optional chevron.

## Usage

```svelte
<script>
  import { ListView, ListItem } from '@intinyagroup/ui';
  import { Settings, User, Bell } from 'lucide-svelte';
</script>

<ListView>
  <ListItem
    title="Account"
    description="Manage your profile"
    leading={() => <User />}
    chevron
  />
  <ListItem
    title="Notifications"
    description="2 unread"
    leading={() => <Bell />}
    trailing={() => <span class="text-xs">On</span>}
    onclick={() => console.log('open notifications')}
  />
  <ListItem title="Delete" destructive />
</ListView>
```

## Props

### ListView

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inset` | `boolean` | `true` | Group the list in a rounded, bordered card |
| `class` | `string` | — | Additional CSS classes |
| `children` | `Snippet` | — | List items |

### ListItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Row title |
| `description` | `string` | — | Optional secondary text |
| `leading` | `Snippet` | — | Icon/content rendered on the left |
| `trailing` | `Snippet` | — | Content rendered on the right |
| `chevron` | `boolean` | `false` | Show a chevron navigation hint |
| `onclick` | `(e: MouseEvent) => void` | — | Renders the row as a button when set |
| `disabled` | `boolean` | `false` | Disables the row button |
| `class` | `string` | — | Additional CSS classes |

## Features

- `inset` groups rows in a mobile settings-style card.
- Rows become buttons when `onclick` is provided.
- Leading/trailing snippets for flexible row composition.
- Chevron affordance for navigation rows.
- Rows divide by the border token.