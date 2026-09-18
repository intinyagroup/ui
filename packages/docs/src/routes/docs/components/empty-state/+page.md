---
title: Empty State
description: Placeholder display when no data is available.
---

# Empty State

Displays a message and optional action when a section has no data or results.

## Install

```bash
npx @intinyagroup/cli add empty-state
```

## Usage

```svelte
<script>
  import { EmptyState, Button } from '@intinyagroup/ui';
</script>

<EmptyState
  title="No results found"
  description="Try adjusting your search filters."
>
  <Button onclick={() => resetFilters()}>Clear Filters</Button>
</EmptyState>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | 'No data' | Heading text |
| description | string | - | Supporting description text |
| class | string | - | Additional CSS classes |

## Slots

| Slot | Description |
|------|-------------|
| default | Action buttons or custom content |
| icon | Custom icon above the title |

## Notes

- Often used inside tables, lists, or search results when data is empty.
- Include an icon slot for visual context.
