# Alert Dialog

A modal overlay that interrupts the user with important content and expects a response. Built on bits-ui alert dialog primitives.

## Install

```bash
npx @intinyagroup/cli add alert-dialog
```

## Usage

```svelte
<script>
  import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel
  } from '@intinyagroup/ui';
  import { Button } from '@intinyagroup/ui';
</script>

<AlertDialog>
  <AlertDialogTrigger>
    <Button variant="destructive">Delete account</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Structure

- `AlertDialog` — root wrapper
- `AlertDialogTrigger` — opens the dialog
- `AlertDialogContent` — the modal panel (portal)
- `AlertDialogHeader` / `AlertDialogFooter` — layout regions
- `AlertDialogTitle` / `AlertDialogDescription` — accessible labels
- `AlertDialogAction` / `AlertDialogCancel` — action buttons with built-in close behavior

## Props

All sub-components forward props to their bits-ui counterparts. `AlertDialogContent` renders inside a portal with an overlay, handles Escape-to-close, and focus trapping.
