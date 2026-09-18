---
title: Navigation Bar
description: Material Design 3 bottom navigation bar for mobile layouts.
---

# Navigation Bar

A bottom navigation bar for mobile layouts with 3–5 destinations. Each item has an icon and label, with an active indicator pill animation.

## Preview

```svelte
<script>
  import { NavigationBar, NavigationBarItem } from '@intinyagroup/md3';

  let value = $state('home');
</script>

<div class="relative">
  <div class="h-24"><!-- page content --></div>
  <NavigationBar bind:value>
    <NavigationBarItem value="home" label="Home">
      {#snippet icon()}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
      {/snippet}
    </NavigationBarItem>
    <NavigationBarItem value="search" label="Search">
      {#snippet icon()}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      {/snippet}
    </NavigationBarItem>
  </NavigationBar>
</div>
```

## Usage

```svelte
<script>
  import { NavigationBar, NavigationBarItem } from '@intinyagroup/md3';
</script>

<NavigationBar bind:value={activeTab}>
  <NavigationBarItem value="home" label="Home">
    {#snippet icon()}<HomeIcon />{/snippet}
  </NavigationBarItem>
  <NavigationBarItem value="chat" label="Chat">
    {#snippet icon()}<ChatIcon />{/snippet}
  </NavigationBarItem>
</NavigationBar>
```

## Props

### NavigationBar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` (bindable) | — | Currently selected item value |
| `class` | `string` | `undefined` | Additional CSS classes |
| `children` | `Snippet` | `undefined` | NavigationBarItem children |

### NavigationBarItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Unique identifier for this item |
| `label` | `string` | — | Accessible label text |
| `icon` | `Snippet` | — | Icon snippet |
| `class` | `string` | `undefined` | Additional CSS classes |

## Install

```bash
npx @intinyagroup/cli add md3-navigation-bar
```
