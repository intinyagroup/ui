# Dialog

A modal overlay for focused interactions. Built on bits-ui dialog primitives.

## Preview

```svelte
<script>
  import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@intinyagroup/ui';
  import { Button } from '@intinyagroup/ui';
</script>

<Dialog>
  <DialogTrigger><Button variant="outline">Open dialog</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose><Button variant="outline">Cancel</Button></DialogClose>
      <Button>Continue</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Structure

- `Dialog` — root wrapper
- `DialogTrigger` — opens the dialog
- `DialogContent` — the modal panel (portal)
- `DialogHeader` / `DialogFooter` — layout regions
- `DialogTitle` / `DialogDescription` — accessible labels
- `DialogClose` — closes the dialog

## Props

All sub-components forward props to their bits-ui counterparts. `DialogContent` renders inside a portal with an overlay, handles Escape-to-close, and focus trapping.

## Install

```bash
npx @intinyagroup/cli add dialog
```
