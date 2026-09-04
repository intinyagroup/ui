---
title: Pull to Refresh
description: Touch and pointer pull-to-refresh wrapper with an 80px threshold and async refresh callback.
---

# Pull to Refresh

A wrapper that turns a downward pull at the top of its scrollable container into a refresh gesture. Works with touch and mouse/pen pointers, shows a spinner while `onRefresh` runs, and snaps back when done.

## Usage

```svelte
<script>
  import { PullToRefresh } from '@intinyagroup/ui';

  let items = $state(['a', 'b', 'c']);

  async function refresh() {
    await new Promise((r) => setTimeout(r, 1200));
    items = [...items, `item ${items.length + 1}`];
  }
</script>

<PullToRefresh onRefresh={refresh}>
  <ul class="p-4">
    {#each items as item}
      <li class="py-2">{item}</li>
    {/each}
  </ul>
</PullToRefresh>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onRefresh` | `() => Promise<void>` | — | Async callback run when the pull crosses the threshold |
| `disabled` | `boolean` | `false` | Disable the refresh gesture |
| `class` | `string` | — | Additional CSS classes |
| `children` | `Snippet` | — | Scrollable content |

## Features

- 80 px trigger threshold with 50% resistance beyond it (max pull 140 px).
- Rotating arrow indicator that spins while refreshing.
- Touch (`touchstart/move/end`) and pointer (mouse/pen) support.
- Only engages when the container is scrolled to the top.
- Native vertical scrolling is preserved; gestures hand off cleanly.