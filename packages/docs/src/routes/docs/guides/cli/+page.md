---
title: CLI Workflow
description: Component installation with the Intinya CLI — init, add, update, doctor
---

# CLI Workflow

The Intinya CLI installs components directly into your project — copy mode or npm mode.

## Install

```bash
npx @intinyagroup/cli init
```

This sets up:
- `components.json` — alias config
- `src/lib/utils.ts` — `cn()` helper
- Token CSS import

## Add Components

```bash
# Copy mode (shadcn-style) — sources copied into your project
npx @intinyagroup/cli add button card badge

# MD3 + flat components
npx @intinyagroup/cli add fab chip snackbar
npx @intinyagroup/cli add blob-card hexagon-grid diamond-badge

# Npm mode — adds @intinyagroup/ui to package.json instead of copying
npx @intinyagroup/cli add button --mode npm
```

Copy mode rewrites `$lib` imports to your project aliases automatically.

## Dependency Resolution

The CLI resolves transitive dependencies automatically:

```bash
npx @intinyagroup/cli add pagination
# Pulls in: button (pagination uses it)
# Adds deps: clsx, tailwind-merge, tailwind-variants
```

Component registries are versioned:
- **155 components** across core, md3, and flat packages
- Embedded file contents — works offline, no monorepo needed

## Update

```bash
# Update specific components
npx @intinyagroup/cli update button

# Update everything installed
npx @intinyagroup/cli update --all
```

## Doctor

```bash
npx @intinyagroup/cli doctor
```

Checks:
- `components.json` exists + aliases valid
- Token CSS imported
- Installed components match registry
- Missing npm dependencies

## Browse

```bash
# List all components by category
npx @intinyagroup/cli list

# With descriptions
npx @intinyagroup/cli list --verbose
```

## Components.json

```json
{
  "components": "./src/lib/components",
  "utils": "./src/lib/utils.ts",
  "ui": "./src/lib/components",
  "registry": "./registry/index.json"
}
```

## Publishing Components

Components come from the [Intinya UI monorepo](https://github.com/intinyagroup/ui). The registry generator scans `packages/{core,md3,flat}/src/lib/components/` and embeds:
- File contents
- Runtime dependencies
- Props metadata (for tooling)

## Next Steps

- [Browse all 155 components](/docs/components)
- [Playground](/playground)
- [Theming guide](/docs/guides/theming)
