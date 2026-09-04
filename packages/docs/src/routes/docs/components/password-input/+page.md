---
title: Password Input
description: Password input with show/hide toggle.
---

# Password Input

A password input field with a toggle button to show or hide the entered text.

## Install

```bash
npx @intinyagroup/cli add password-input
```

## Usage

```svelte
<script>
  import { PasswordInput } from '@intinyagroup/ui';

  let password = $state('');
</script>

<PasswordInput bind:value={password} placeholder="Enter password" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string | '' | Current password value |
| placeholder | string | - | Input placeholder |
| disabled | boolean | false | Disable input |
| class | string | - | Additional CSS classes |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| change | string | Fires when value changes |

## Notes

- Toggle button switches between `type="password"` and `type="text"`.
- Use eye/eye-off icons in the toggle for clear affordance.
