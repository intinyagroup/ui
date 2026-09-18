---
title: Stepper
description: Step-by-step wizard with progress indicator.
---

# Stepper

A step wizard component that guides users through a multi-step process.

## Install

```bash
npx @intinyagroup/cli add stepper
```

## Usage

```svelte
<script>
  import { Stepper } from '@intinyagroup/ui';

  let currentStep = $state(0);
</script>

<Stepper bind:currentStep>
  <Stepper.Step title="Account" description="Create your account">
    <p>Account form here</p>
  </Stepper.Step>
  <Stepper.Step title="Profile" description="Set up your profile">
    <p>Profile form here</p>
  </Stepper.Step>
  <Stepper.Step title="Confirm" description="Review and confirm">
    <p>Confirmation here</p>
  </Stepper.Step>
</Stepper>
```

## Subcomponents

| Component | Description |
|-----------|-------------|
| `Stepper` | Container managing step state |
| `Stepper.Step` | Individual step with content |
| `Stepper.Navigation` | Optional prev/next button bar |

## Step Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | - | Step title |
| description | string | - | Step description |
| icon | Component | - | Custom step icon |

## Navigation Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| prevLabel | string | 'Back' | Previous button text |
| nextLabel | string | 'Next' | Next button text |
| submitLabel | string | 'Submit' | Final step button text |

## Notes

- Step indicator shows completed, active, and upcoming states.
- Supports both controlled (`bind:currentStep`) and uncontrolled modes.
