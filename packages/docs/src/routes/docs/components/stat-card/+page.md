---
title: Stat Card
description: Card displaying a single metric with label and trend.
---

# Stat Card

A card that highlights a key metric with a label, value, and optional trend indicator.

## Install

```bash
npx @intinyagroup/cli add stat-card
```

## Usage

```svelte
<script>
  import { StatCard } from '@intinyagroup/ui';
</script>

<div class="grid grid-cols-3 gap-4">
  <StatCard label="Total Users" value="12,345" trend="up" trendValue="+12%" />
  <StatCard label="Revenue" value="$48,290" trend="up" trendValue="+8.5%" />
  <StatCard label="Churn Rate" value="2.4%" trend="down" trendValue="-0.3%" />
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | - | Metric label |
| value | string \| number | - | Metric value |
| trend | 'up' \| 'down' \| 'neutral' | 'neutral' | Trend direction |
| trendValue | string | - | Trend value (e.g. "+12%") |
| icon | Component | - | Optional leading icon |
| class | string | - | Additional CSS classes |

## Notes

- Trend colors: green for up, red for down, muted for neutral.
- Use within a grid for dashboard metric rows.
