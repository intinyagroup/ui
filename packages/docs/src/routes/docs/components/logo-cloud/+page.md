---
title: Logo Cloud
description: Grid of partner or customer logos.
---

# Logo Cloud

Displays a grid of partner, sponsor, or customer logos with consistent sizing.

## Install

```bash
npx @intinyagroup/cli add logo-cloud
```

## Usage

```svelte
<script>
  import { LogoCloud } from '@intinyagroup/ui';
</script>

<LogoCloud>
  <img src="/logos/company-a.svg" alt="Company A" />
  <img src="/logos/company-b.svg" alt="Company B" />
  <img src="/logos/company-c.svg" alt="Company C" />
  <img src="/logos/company-d.svg" alt="Company D" />
</LogoCloud>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| columns | number | 4 | Number of grid columns |
| grayscale | boolean | true | Apply grayscale filter to logos |
| class | string | - | Additional CSS classes |

## Slots

| Slot | Description |
|------|-------------|
| default | Logo images or components |

## Notes

- Logos are displayed with equal sizing in a responsive grid.
- Grayscale mode provides visual consistency across different logo styles.
