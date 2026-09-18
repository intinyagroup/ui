# @intinyagroup/ui

## 0.2.5

### Patch Changes

- Refine SidebarNav hierarchy, active states, controlled expansion, recursive filtering, and semantic overlay defaults.

## 0.2.4

### Patch Changes

- Add `overlayClass` prop to Dialog, Sheet, and Drawer content components for per-instance backdrop styling.

## 0.2.3

### Patch Changes

- 49fb73e: Fix malformed Firefox number-input spinner selector.

## 0.2.0

### Minor Changes

- BREAKING: migrate table packages to TanStack Table v9. Consumers must replace v8 row-model options with explicit v9 feature and row-model slots, use `table.store`/`table.state` instead of `table.getState()`, use logical column pinning names (`start`/`end`), and update `ColumnDef` generics. Controlled state now uses per-slice `on[State]Change` callbacks.

### Patch Changes

- 2559106: fix(core): merge Dialog, Tabs, Sheet roots into namespaces. `<Dialog.Root>`/`<Dialog.Content>` and `<Tabs.Root>`/`<Tabs.List>` now type-check and render; flat exports (`DialogContent`, `TabsList`, `SheetContent`, …) keep working.
