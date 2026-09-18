# Dropdown Menu

A menu of actions triggered by a button. Built on bits-ui dropdown menu.

## Preview

```svelte
<script>
  import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '@intinyagroup/ui';
  import { Button } from '@intinyagroup/ui';
</script>

<DropdownMenu>
  <DropdownMenuTrigger><Button variant="outline">Open menu</Button></DropdownMenuTrigger>
  <DropdownMenuContent class="w-48">
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Structure

- `DropdownMenu` — root
- `DropdownMenuTrigger` — opens the menu
- `DropdownMenuContent` — the popup panel
- `DropdownMenuItem` — a selectable action
- `DropdownMenuLabel` / `DropdownMenuSeparator` — group headers/dividers

## Install

```bash
npx @intinyagroup/cli add dropdown-menu
```
