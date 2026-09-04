# Command

A fast, composable command palette for searching actions, navigating, or executing commands. Built on cmdk (via bits-ui).

## Install

```bash
npx @intinyagroup/cli add command
```

## Usage

```svelte
<script>
  import {
    Command,
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandSeparator
  } from '@intinyagroup/ui';
  import { onMount } from 'svelte';

  let open = $state(false);

  onMount(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        open = !open;
      }
    }
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  });
</script>

<CommandDialog bind:open>
  <CommandInput placeholder="Type a command..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
      <CommandItem>Search Emoji</CommandItem>
      <CommandItem>Calculator</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Settings">
      <CommandItem>Profile</CommandItem>
      <CommandItem>Billing</CommandItem>
      <CommandItem>Settings</CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>
```

## Structure

- `Command` / `CommandDialog` — root container (CommandDialog wraps in a Dialog)
- `CommandInput` — search input
- `CommandList` — scrollable results list
- `CommandEmpty` — shown when no results match
- `CommandGroup` — groups related items with a heading
- `CommandItem` — a single selectable item
- `CommandSeparator` — visual divider between groups
- `CommandShortcut` — keyboard shortcut hint

## Props

| Sub-component | Description |
|---------------|-------------|
| `CommandDialog` | Wraps Command in a Dialog — accepts `open` (bindable), `title`, `description` |
| `CommandInput` | Search input — accepts `value` (bindable) |
| `CommandItem` | Accepts `value` for filtering, `onSelect` callback |
| `CommandGroup` | Accepts `heading` for group label |
