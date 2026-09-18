---
title: Stats Counter
description: Animated number counter for metrics.
---

# Stats Counter

An animated counter that increments from zero (or a start value) to a target number.

## Install

```bash
npx @intinyagroup/cli add stats-counter
```

## Usage

```svelte
<script>
  import { StatsCounter } from '@intinyagroup/ui';
</script>

<StatsCounter value={12345} duration={2000} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | number | 0 | Target number to animate to |
| start | number | 0 | Starting number |
| duration | number | 1500 | Animation duration in ms |
| separator | boolean | true | Add thousand separators |
| prefix | string | '' | Prefix (e.g. `$`) |
| suffix | string | '' | Suffix (e.g. `%`) |
| decimals | number | 0 | Decimal places |
| class | string | - | Additional CSS classes |

## Notes

- Animates when the element enters the viewport (Intersection Observer).
- Re-animates when the `value` prop changes.
- Use for hero sections, dashboards, and landing pages.
