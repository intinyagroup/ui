---
title: Triangle Alert
description: Triangle-shaped flat warning banner with optional dismiss button.
---

# Triangle Alert

A triangle-shaped alert banner for warnings and notices. Uses `clip-path: polygon(50% 0%, 0% 100%, 100% 100%)`, supports yellow/orange/red tones, and an optional dismiss button.

## Preview

```svelte
<script>
  import { TriangleAlert } from '@intinyagroup/flat';
</script>

<div class="flex flex-col gap-6">
  <TriangleAlert message="Warning: disk space is running low" />
  <TriangleAlert message="Heads up: new version available" color="yellow" />
  <TriangleAlert message="Maintenance window tonight at 2 AM" color="orange" dismissable />
</div>
```

## Usage

```svelte
<script>
  import { TriangleAlert } from '@intinyagroup/flat';
</script>

<TriangleAlert
  message="Your subscription renews in 3 days"
  color="orange"
  dismissable
  ondismiss={handleDismiss}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | — | Alert message text |
| `color` | `'red' \| 'yellow' \| 'orange'` | `'red'` | Alert color |
| `dismissable` | `boolean` | `false` | Shows a dismiss (×) button |
| `ondismiss` | `() => void` | `undefined` | Callback when dismiss is clicked |
| `class` | `string` | `undefined` | Additional CSS classes |

## Install

```bash
npx @intinyagroup/cli add flat-triangle-alert
```