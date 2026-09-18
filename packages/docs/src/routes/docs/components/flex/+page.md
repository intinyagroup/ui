---
title: Flex
description: Flexbox layout container with direction, alignment, justification, gap, and wrap props.
---

# Flex

A flexbox layout container driven by props instead of utility classes. Maps `direction`, `align`, `justify`, `gap`, and `wrap` onto the corresponding flex utilities.

## Usage

```svelte
<script>
  import { Flex } from '@intinyagroup/ui';
</script>

<Flex direction="row" justify="between" align="center" gap={4}>
  <div>Left</div>
  <div>Right</div>
</Flex>

<Flex direction="col" gap={2} wrap>
  <span>Item</span>
  <span>Item</span>
</Flex>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'row' \| 'col'` | `'row'` | Flex direction |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` | `'stretch'` | Cross-axis alignment |
| `justify` | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | `'start'` | Main-axis justification |
| `gap` | `number` | `0` | Gap from the spacing token scale |
| `wrap` | `boolean` | `false` | Allow items to wrap |
| `class` | `string` | — | Additional CSS classes |
| `children` | `Snippet` | — | Flex content |

## Features

- Prop-driven API removes repetitive utility classes.
- Gap limited to the spacing token scale for consistent rhythm.
- Composes with any children, including other layout components.