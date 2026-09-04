---
title: Details
description: Collapsible details/summary element.
---

# Details

A collapsible content section using the native `<details>`/`<summary>` pattern with custom styling.

## Install

```bash
npx @intinyagroup/cli add details
```

## Usage

```svelte
<script>
  import { Details } from '@intinyagroup/ui';
</script>

<Details title="Installation">
  <p>Run the install command to get started.</p>
</Details>

<Details title="Configuration" open>
  <p>This section is open by default.</p>
</Details>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | - | Summary/trigger text |
| open | boolean | false | Initially expanded |
| disabled | boolean | false | Disable toggling |
| class | string | - | Additional CSS classes |

## Slots

| Slot | Description |
|------|-------------|
| default | Collapsible content |

## Accessibility

- Uses native `<details>` element for built-in keyboard and screen reader support.
- Toggle state announced automatically.
