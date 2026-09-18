# @intinyagroup/ui

## 0.2.9

### Minor Changes

- Add InputMask, Toolbar/AppBar, Message, ListBox, and DropdownTree components with focused accessibility behavior tests.

## 0.2.8

### Patch Changes

- Harden overlay focus restoration, drawer scroll locking, reduced-motion behavior, reduced-transparency fallback, and SidebarNav keyboard navigation.

## 0.2.7

### Patch Changes

- 753000b: Adjust DialogOverlay to use semantic foreground opacity and a 4px backdrop blur for lighter, theme-aware modal backdrops.
- Standardize package export conditions with default and import fallbacks, resolve Svelte 5 reactivity and import issues, and align tiptap dependencies.

## 0.2.6

### Patch Changes

- Add generic sidebar sections, badge tones, shortcut metadata, controlled expansion, recursive filtering, and overlay dismissal controls.

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
