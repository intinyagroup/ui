---
title: Tab Bar
description: Fixed bottom tab bar for mobile apps with icons, badges, blur, and safe-area insets.
---

# Tab Bar

A fixed bottom navigation bar for mobile apps. `TabBar` pins to the bottom with an optional backdrop blur and safe-area padding; `TabBarItem` renders a tab with icon, label, and an optional badge.

## Usage

```svelte
<script>
  import { TabBar, TabBarItem } from '@intinyagroup/ui';
  import { Home, Search, Plus, User } from 'lucide-svelte';

  let active = $state('home');
</script>

<TabBar bind:value={active}>
  <TabBarItem value="home" label="Home" icon={() => <Home />} />
  <TabBarItem value="search" label="Search" icon={() => <Search />} />
  <TabBarItem value="profile" label="Profile" icon={() => <User />} badge={3} />
</TabBar>
```

## Props

### TabBar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| number` | — | Bindable active tab value |
| `blur` | `boolean` | `true` | Backdrop blur behind the bar |
| `class` | `string` | — | Additional CSS classes |
| `children` | `Snippet` | — | `TabBarItem`s |

### TabBarItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| number` | — | Tab value, compared against the parent's |
| `label` | `string` | — | Tab label |
| `icon` | `Snippet` | — | Optional icon |
| `badge` | `number` | — | Badge count; caps display at `99+` |
| `onclick` | `(e: MouseEvent) => void` | — | Click handler |
| `active` | `boolean` | — | Override the parent's value comparison |
| `class` | `string` | — | Additional CSS classes |

## Features

- Fixed bottom bar with `env(safe-area-inset-bottom)` padding.
- Active tab highlighted with the primary token; `aria-selected` reflects state.
- Badges with `99+` overflow cap.
- Backdrop blur when `blur` is enabled.