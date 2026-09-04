---
title: Switch (MD3)
description: Material Design 3 switch for on/off toggles
---

# Switch (MD3)

Material Design 3 switch for binary on/off states — track + thumb with ripple press feedback.

## Preview

```svelte
<script>
  import { Switch } from '@intinyagroup/md3';
</script>

<div class="flex flex-col gap-3">
  <div class="flex items-center gap-3">
    <Switch checked />
    <span>Wi-Fi</span>
  </div>
  <div class="flex items-center gap-3">
    <Switch />
    <span>Bluetooth</span>
  </div>
  <div class="flex items-center gap-3">
    <Switch disabled />
    <span class="text-[var(--ui-muted-foreground)]">Disabled</span>
  </div>
</div>
```

## Usage

```svelte
<script>
  import { Switch } from '@intinyagroup/md3';
  let enabled = $state(true);
</script>

<Switch bind:checked={enabled} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Toggle state (bindable) |
| `disabled` | `boolean` | `false` | Disable interaction |
| `class` | `string` | — | Extra classes |

## Features

- MD3 track + thumb styling
- Press ripple feedback (`isPressed` state)
- `$bindable` checked for two-way binding
- Touch-friendly 44px+ hit target

## Install

```bash
npx @intinyagroup/cli add switch
```

From the `@intinyagroup/md3` package.

## Related

- [Chip (MD3)](/docs/components/md3-chip)
- [SegmentedButton (MD3)](/docs/components/md3-segmented-button)
