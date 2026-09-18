---
title: Progress Steps
description: Stepped progress indicator with completed, current, and upcoming states and backward navigation.
---

# Progress Steps

A multi-step progress indicator. Completed steps show a check and are clickable for backwards jumps; the current step is highlighted; upcoming steps are inert.

## Usage

```svelte
<script>
  import { ProgressSteps } from '@intinyagroup/ui';

  let steps = [
    { label: 'Cart' },
    { label: 'Shipping' },
    { label: 'Payment' },
    { label: 'Confirm' }
  ];
  let current = $state(1);
  let completed = $state(0);
</script>

<ProgressSteps {steps} bind:current {completed} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `Step[]` | — | Step labels (`{ label, icon? }`) |
| `current` | `number` | — | Bindable active step index (0-based) |
| `completed` | `number` | — | Highest completed index; enables jumping to it and earlier |
| `class` | `string` | — | Additional CSS classes |

### Step

```ts
{
  label: string;
  icon?: string;
}
```

## Features

- Distinct completed / current / upcoming states.
- Completed steps are buttons that jump back on click.
- Connectors between steps with themed states.
- `current` is bindable for wizard-style flows.