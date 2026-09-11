# @intinyagroup/ui

## 0.2.0

### Minor Changes

- BREAKING: migrate table packages to TanStack Table v9. Consumers must replace v8 row-model options with explicit v9 feature and row-model slots, use `table.store`/`table.state` instead of `table.getState()`, use logical column pinning names (`start`/`end`), and update `ColumnDef` generics. Controlled state now uses per-slice `on[State]Change` callbacks.

### Patch Changes

- 2559106: fix(core): merge Dialog, Tabs, Sheet roots into namespaces. `<Dialog.Root>`/`<Dialog.Content>` and `<Tabs.Root>`/`<Tabs.List>` now type-check and render; flat exports (`DialogContent`, `TabsList`, `SheetContent`, …) keep working.
