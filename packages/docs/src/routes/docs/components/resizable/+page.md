---
title: Resizable
description: Resizable panels with drag handles.
---

# Resizable

Containers with draggable dividers that allow users to resize adjacent panels.

## Install

```bash
npx @intinyagroup/cli add resizable
```

## Usage

```svelte
<script>
  import { Resizable } from '@intinyagroup/ui';
</script>

<Resizable direction="horizontal">
  <Resizable.Panel defaultSize={30} minSize={20}>
    <div class="p-4">Sidebar</div>
  </Resizable.Panel>
  <Resizable.Handle />
  <Resizable.Panel defaultSize={70} minSize={30}>
    <div class="p-4">Main content</div>
  </Resizable.Panel>
</Resizable>
```

## Subcomponents

| Component | Description |
|-----------|-------------|
| `Resizable` | Container with direction (`horizontal`/`vertical`) |
| `Resizable.Panel` | Individual resizable panel |
| `Resizable.Handle` | Draggable divider between panels |

## Panel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultSize | number | 50 | Initial size as percentage |
| minSize | number | 10 | Minimum size percentage |
| maxSize | number | 90 | Maximum size percentage |
| collapsible | boolean | false | Allow panel to collapse |

## Notes

- Supports nested resizable layouts.
- Handles are keyboard accessible (Arrow keys to resize).
