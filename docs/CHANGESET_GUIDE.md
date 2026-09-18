# Adding Changesets for New Components

## File Format

Create a new file in `.changeset/` with the naming convention `<kebab-case-description>.md`:

```md
---
"@intinyagroup/data-table": minor
"@intinyagroup/grid-core": patch
---

Add TreeGrid component and QueryBuilder engine for hierarchical data display and visual query filtering.
```

## Rules

1. **One file per logical change.** Each `.md` file represents one atomic change or feature.
2. **Scope:** Declare every `@intinyagroup/*` package affected.
3. **Version level:**
   - `patch`: Bug fixes, internal refactors, exports tweaks, CI changes
   - `minor`: New components, new props, new exports, new features
   - `major`: Breaking API changes (rename props, remove exports, change component signatures)
4. **Body:** One paragraph describing the change in plain language. No markdown headings.

## Where to Put Files

```
.changeset/fix-tooltip-overlay.md
.changeset/add-tree-grid.md
```

## How They're Consumed

1. `pnpm changeset version` reads all pending `.changeset/*.md` files.
2. Bumps version numbers of affected packages.
3. Appends to each package's `CHANGELOG.md`.
4. Deletes the consumed `.changeset/*.md` files.

## New Package Checklist

When adding a brand-new package to the monorepo:

1. Create `packages/<name>/package.json` with `"version": "0.1.0"` and `"exports"` map.
2. Create a changeset: `.changeset/add-<name>.md` with `"@intinyagroup/<name>": minor`.
3. Add the package to `scripts/stage-publish.sh` PACKAGES array.
4. Add the package to `.github/workflows/publish.yml` ORDER array.
5. Add `"@intinyagroup/<name>": "workspace:*"` to any package that depends on it.
