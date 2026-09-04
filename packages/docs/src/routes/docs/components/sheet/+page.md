# Sheet

A modal panel that slides in from an edge of the viewport. Similar to Dialog but used for secondary content like settings or details.

## Install

```bash
npx @intinyagroup/cli add sheet
```

## Usage

```svelte
<script>
  import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose
  } from '@intinyagroup/ui';
  import { Button } from '@intinyagroup/ui';
</script>

<Sheet>
  <SheetTrigger>
    <Button variant="outline">Open Sheet</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Edit profile</SheetTitle>
      <SheetDescription>
        Make changes to your profile here. Click save when you're done.
      </SheetDescription>
    </SheetHeader>
    <div class="grid gap-4 py-4">
      <!-- Form content -->
    </div>
    <SheetFooter>
      <SheetClose>
        <Button>Save changes</Button>
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

## Structure

- `Sheet` — root wrapper
- `SheetTrigger` — opens the sheet
- `SheetContent` — the sliding panel (portal with overlay)
- `SheetHeader` / `SheetFooter` — layout regions
- `SheetTitle` / `SheetDescription` — accessible labels
- `SheetClose` — closes the sheet

## Props

| Sub-component | Description |
|---------------|-------------|
| `SheetContent` | Accepts `side` (`'top' \| 'bottom' \| 'left' \| 'right'`) — defaults to `'right'` |
| `SheetTrigger` | Opens the sheet on click |
| `SheetClose` | Closes the sheet on click |
