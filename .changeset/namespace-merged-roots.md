---
"@intinyagroup/ui": patch
---

fix(core): merge Dialog, Tabs, Sheet roots into namespaces. `<Dialog.Root>`/`<Dialog.Content>` and `<Tabs.Root>`/`<Tabs.List>` now type-check and render; flat exports (`DialogContent`, `TabsList`, `SheetContent`, …) keep working.
