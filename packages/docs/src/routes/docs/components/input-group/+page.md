---
title: Input Group
description: Input field with leading/trailing addons.
---

# Input Group

An input field with optional leading or trailing addons (text, icons, or buttons).

## Install

```bash
npx @intinyagroup/cli add input-group
```

## Usage

```svelte
<script>
  import { InputGroup, Input } from '@intinyagroup/ui';
</script>

<InputGroup>
  <InputGroup.Leader>
    <span class="text-muted-foreground">@</span>
  </InputGroup.Leader>
  <Input placeholder="username" />
  <InputGroup.Trailer>
    <span class="text-muted-foreground">.com</span>
  </InputGroup.Trailer>
</InputGroup>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| class | string | - | Additional CSS classes |

## Slots

| Slot | Description |
|------|-------------|
| default | The input element |
| leader | Content before the input |
| trailer | Content after the input |

## Notes

- Addons inherit border radius from the group container.
- Combine with Button for action inputs (e.g. search, submit).
