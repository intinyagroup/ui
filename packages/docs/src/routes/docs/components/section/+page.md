---
title: Section
description: Semantic section element for grouping content.
---

# Section

A semantic `<section>` element for grouping related content with an optional heading.

## Install

```bash
npx @intinyagroup/cli add section
```

## Usage

```svelte
<script>
  import { Section } from '@intinyagroup/ui';
</script>

<Section title="Features">
  <p>Describe your product features here.</p>
</Section>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | - | Section heading text |
| class | string | - | Additional CSS classes |

## Slots

| Slot | Description |
|------|-------------|
| default | Section content |

## Accessibility

- Renders as `<section>` with `aria-labelledby` pointing to the heading.
- Screen readers can navigate by section landmarks.
