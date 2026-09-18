# Context Menu

A right-click menu that appears at the cursor position. Built on bits-ui context menu primitives.

## Install

```bash
npx @intinyagroup/cli add context-menu
```

## Usage

```svelte
<script>
  import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuLabel
  } from '@intinyagroup/ui';
</script>

<ContextMenu>
  <ContextMenuTrigger class="flex h-40 w-40 items-center justify-center rounded-md border border-dashed text-sm">
    Right click here
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuLabel>Actions</ContextMenuLabel>
    <ContextMenuItem>Back</ContextMenuItem>
    <ContextMenuItem>Forward</ContextMenuItem>
    <ContextMenuItem>Reload</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem>Inspect</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

## Structure

- `ContextMenu` — root wrapper
- `ContextMenuTrigger` — the element that opens the menu on right-click
- `ContextMenuContent` — the dropdown panel
- `ContextMenuItem` — a single menu item
- `ContextMenuCheckboxItem` — toggleable item with check indicator
- `ContextMenuRadioGroup` / `ContextMenuRadioItem` — radio selection group
- `ContextMenuSeparator` — visual divider
- `ContextMenuLabel` — section heading
- `ContextMenuShortcut` — keyboard shortcut hint

## Props

All sub-components forward props to their bits-ui counterparts with keyboard navigation and ARIA roles built in.
