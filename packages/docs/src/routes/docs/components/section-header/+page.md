---
title: Section Header
description: Section title with optional action buttons.
---

# Section Header

A heading row combining a title, optional description, and action buttons for a content section.

## Install

```bash
npx @intinyagroup/cli add section-header
```

## Usage

```svelte
<script>
  import { SectionHeader, Button } from '@intinyagroup/ui';
</script>

<SectionHeader title="Recent Activity" description="Your latest project updates.">
  <Button variant="outline" size="sm">View All</Button>
  <Button size="sm">New Activity</Button>
</SectionHeader>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | - | Section title |
| description | string | - | Supporting description text |
| class | string | - | Additional CSS classes |

## Slots

| Slot | Description |
|------|-------------|
| default | Action buttons aligned to the right |
| description | Custom description content |

## Notes

- Title and actions are horizontally aligned.
- Stacks vertically on narrow screens.
