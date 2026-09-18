# Infinite Scroll

A scroll container that automatically loads more content when the user approaches the bottom. Uses an `IntersectionObserver` sentinel, so it works in any scrollable area with no manual scroll listeners.

## Usage

```svelte
<script>
  import { InfiniteScroll } from '@intinyagroup/ui';

  let items = $state([...Array(25).keys()]);
  let loading = $state(false);
  let hasMore = $state(true);

  async function loadMore() {
    loading = true;
    await new Promise((r) => setTimeout(r, 600));
    const next = items.length + 1;
    items = [...items, ...Array.from({ length: 25 }, (_, i) => next + i)];
    hasMore = items.length < 250;
    loading = false;
  }
</script>

<InfiniteScroll
  bind:hasMore
  bind:loading
  {onLoadMore: loadMore}
  class="h-96 overflow-y-auto"
>
  {#each items as item}
    <div class="border-b p-4">Item {item}</div>
  {/each}
</InfiniteScroll>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hasMore` | `boolean` | `true` | Whether more items exist (bindable) |
| `loading` | `boolean` | `false` | Loading state; shows a spinner when true (bindable) |
| `error` | `boolean` | `false` | Error state; shows a retry button when true (bindable) |
| `onLoadMore` | `() => void \| Promise<void>` | — | Called when the sentinel scrolls into view (required) |
| `onRetry` | `() => void \| Promise<void>` | — | Called when the retry button is pressed |
| `threshold` | `number` | `200` | Distance (px) from the bottom that triggers a load |
| `class` | `string` | — | Additional classes (add `overflow` for the scroll container) |

## States

- **Loading** — a spinner replaces the bottom sentinel while `loading` is true
- **Error** — a message with a **Retry** button (falls back to `onLoadMore` if `onRetry` isn't set)
- **End** — a "No more items" message appears when `hasMore` becomes false

## Features

- IntersectionObserver-based auto-loading — no scroll-throttling
- Built-in loading, error, and end states
- Bindable `loading`/`error`/`hasMore` so you control data flow

## Install

```bash
npx @intinyagroup/cli add infinite-scroll
```