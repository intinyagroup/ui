---
title: Text Field
description: Material Design 3 text fields with floating labels, helper text, and error states.
---

# Text Field

A Material Design 3 text input with a floating label, support text, and error states. Available in filled and outlined variants.

## Preview

```svelte
<script>
  import { TextField } from '@intinyagroup/md3';
</script>

<div class="flex flex-col gap-6">
  <TextField label="Name" placeholder="Enter your name" />
  <TextField label="Email" variant="outlined" type="email" />
  <TextField label="Password" error="Password must be at least 8 characters" />
</div>
```

## Variants

- **`filled`** — Surface container with an active indicator bar (default)
- **`outlined`** — Full border outline with floating label

## Usage

```svelte
<script>
  import { TextField } from '@intinyagroup/md3';

  let name = $state('');
</script>

<TextField
  bind:value={name}
  label="Full name"
  helperText="As it appears on your ID"
  disabled={false}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` (bindable) | `''` | Input value |
| `label` | `string` | `''` | Floating label text |
| `placeholder` | `string` | `''` | Placeholder text |
| `variant` | `'filled' \| 'outlined'` | `'filled'` | Text field style |
| `error` | `string` | `undefined` | Error message (shows error state) |
| `disabled` | `boolean` | `false` | Disables the input |
| `class` | `string` | `undefined` | Additional CSS classes |
| `id` | `string` | `undefined` | Input id (auto-generated from label otherwise) |
| `type` | `string` | `'text'` | Input type |
| `helperText` | `string` | `undefined` | Supporting text below the field |

All other props are forwarded to the underlying `<input>` element.

## Install

```bash
npx @intinyagroup/cli add md3-text-field
```
