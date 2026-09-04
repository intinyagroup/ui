---
title: Aside
description: Semantic aside element for sidebar or tangential content.
---

# Aside

Semantic aside element for sidebar content or information tangentially related to the main content.

## Install

```bash
npx @intinyagroup/cli add aside
```

## Usage

```svelte
<script>
  import { Aside } from '@intinyagroup/ui';
</script>

<Aside>
  <p>Related information goes here.</p>
</Aside>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| class | string | - | Additional CSS classes |

## Slots

| Slot | Description |
|------|-------------|
| default | Aside content |

## Accessibility

- Renders as `<aside>`, which is semantically associated with tangential content.
- Screen readers will announce this region as complementary.
