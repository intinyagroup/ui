# Intinya UI Registry

Every entry maps a component name to its source files inside `packages/core/src/lib/components/<name>/`.

The CLI resolves transitive dependencies by following `$lib/components/...` and `$lib/utils*` imports.

Add a new component here when it is ready to be installable.
