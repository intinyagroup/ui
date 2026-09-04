---
title: Menubar
description: Application menu bar with dropdown menus.
---

# Menubar

A horizontal menu bar with dropdown menus, suitable for application-style navigation.

## Install

```bash
npx @intinyagroup/cli add menubar
```

## Usage

```svelte
<script>
  import { Menubar } from '@intinyagroup/ui';
</script>

<Menubar>
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item>New File</Menubar.Item>
      <Menubar.Item>Open...</Menubar.Item>
      <Menubar.Separator />
      <Menubar.Item>Exit</Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>

  <Menubar.Menu>
    <Menubar.Trigger>Edit</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item>Undo</Menubar.Item>
      <Menubar.Item>Redo</Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar>
```

## Subcomponents

| Component | Description |
|-----------|-------------|
| `Menubar.Menu` | Wraps a trigger and its dropdown content |
| `Menubar.Trigger` | Menu button that opens the dropdown |
| `Menubar.Content` | Dropdown menu panel |
| `Menubar.Item` | Clickable menu item |
| `Menubar.Separator` | Visual divider between items |
| `Menubar.Shortcut` | Keyboard shortcut display |

## Accessibility

- Keyboard navigable: Arrow keys between menus, Enter to select, Escape to close.
- ARIA `menubar`, `menu`, and `menuitem` roles applied automatically.
