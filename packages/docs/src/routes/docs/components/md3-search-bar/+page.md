---
title: Search Bar
description: Material Design 3 search input with leading icon, clear button, and full-pill styling.
---

# Search Bar

A Material Design 3 search field with a rounded-full pill container, state layer, leading/trailing icons, and a built-in clear button.

## Preview

```svelte
<script>
  import { SearchBar } from '@intinyagroup/md3';
</script>

<SearchBar placeholder="Search messages" />
```

## Usage

```svelte
<script>
  import { SearchBar } from '@intinyagroup/md3';

  let query = $state('');
</script>

<SearchBar
  bind:value={query}
  placeholder="Search files"
>
  {#snippet leadingIcon()}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
  {/snippet}
  {#snippet trailingIcon()}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4a8 8 0 1 0 7.73 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
    </svg>
  {/snippet}
</SearchBar>
```

## Features

- Clear (×) button appears when there is a value; Escape clears or blurs
- Focus state shows primary color border with ring
- `leadingIcon` and `trailingIcon` snippets

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` (bindable) | `''` | Search input value |
| `placeholder` | `string` | `'Search'` | Placeholder text |
| `leadingIcon` | `Snippet` | `undefined` | Icon rendered on the left |
| `trailingIcon` | `Snippet` | `undefined` | Icon rendered on the right |
| `class` | `string` | `undefined` | Additional CSS classes |

## Install

```bash
npx @intinyagroup/cli add md3-search-bar
```
