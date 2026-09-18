---
title: Radio
description: Material Design 3 radio buttons and radio groups for single-choice selection.
---

# Radio

A Material Design 3 radio button for single-choice selection. Pairs with `RadioGroup` for arrow-key navigable groups with a shared name.

## Preview

```svelte
<script>
  import { Radio, RadioGroup } from '@intinyagroup/md3';

  let selected = $state('option-1');
</script>

<RadioGroup bind:value={selected} name="example">
  <Radio value="option-1">Option 1</Radio>
  <Radio value="option-2">Option 2</Radio>
  <Radio value="option-3" disabled>Option 3 (disabled)</Radio>
</RadioGroup>
```

## Standalone

A `Radio` can also be used without a group, with its own bindable `checked` state:

```svelte
<script>
  import { Radio } from '@intinyagroup/md3';

  let checked = $state(false);
</script>

<Radio bind:checked>Enable feature</Radio>
```

## Props

### RadioGroup

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` (bindable) | `''` | Currently selected value |
| `name` | `string` | `''` | Shared form name for child radios |
| `disabled` | `boolean` | `false` | Disables the whole group |
| `class` | `string` | `undefined` | Additional CSS classes |
| `children` | `Snippet` | `undefined` | Radio children |

### Radio

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | Value submitted when selected |
| `checked` | `boolean` (bindable) | `false` | Selection state (when standalone) |
| `disabled` | `boolean` | `false` | Disables the radio |
| `class` | `string` | `undefined` | Additional CSS classes |
| `children` | `Snippet` | `undefined` | Label content |

## Accessibility

- Group renders `role="radiogroup"` with `aria-disabled` support
- Arrow keys move focus and selection between radios

## Install

```bash
npx @intinyagroup/cli add md3-radio
```
