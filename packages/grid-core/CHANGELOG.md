# @intinyagroup/grid-core

## 0.2.1

### Patch Changes

- Standardize package export conditions with default and import fallbacks, resolve Svelte 5 reactivity and import issues, and align tiptap dependencies.
- Updated dependencies [753000b]
- Updated dependencies
  - @intinyagroup/ui@0.2.7

## 0.2.0

### Minor Changes

- BREAKING: migrate table packages to TanStack Table v9. Consumers must replace v8 row-model options with explicit v9 feature and row-model slots, use `table.store`/`table.state` instead of `table.getState()`, use logical column pinning names (`start`/`end`), and update `ColumnDef` generics. Controlled state now uses per-slice `on[State]Change` callbacks.

### Patch Changes

- Updated dependencies [2559106]
- Updated dependencies
  - @intinyagroup/ui@0.2.0
