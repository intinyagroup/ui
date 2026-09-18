# Drawer

A panel that slides in from an edge of the viewport. Supports top, bottom, left, and right directions.

## Install

```bash
npx @intinyagroup/cli add drawer
```

## Usage

```svelte
<script>
  import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose
  } from '@intinyagroup/ui';
  import { Button } from '@intinyagroup/ui';
</script>

<Drawer>
  <DrawerTrigger>
    <Button variant="outline">Open Drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Move Goal</DrawerTitle>
      <DrawerDescription>Set your daily activity goal.</DrawerDescription>
    </DrawerHeader>
    <div class="p-4">
      <!-- Drawer body content -->
    </div>
    <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

## Structure

- `Drawer` — root wrapper (manages open state)
- `DrawerTrigger` — opens the drawer
- `DrawerContent` — the sliding panel with direction support
- `DrawerHeader` / `DrawerFooter` — layout regions
- `DrawerTitle` / `DrawerDescription` — accessible labels
- `DrawerClose` — closes the drawer
- `DrawerOverlay` — backdrop overlay

## Props

| Sub-component | Description |
|---------------|-------------|
| `Drawer` | Root — accepts `open` (bindable) and `direction` (`'top' \| 'bottom' \| 'left' \| 'right'`) |
| `DrawerContent` | The sliding panel — animates in from the specified direction |
| `DrawerTrigger` | Opens the drawer on click |
| `DrawerClose` | Closes the drawer on click |
