# Contributing to Intinya UI

Thanks for helping build Intinya UI! Here's how to contribute.

## Development Setup

```bash
# Clone
git clone https://github.com/intinyagroup/ui.git
cd ui

# Install (pnpm required)
pnpm install

# Build core packages
pnpm --filter @intinyagroup/ui build

# Run tests
pnpm --filter @intinyagroup/ui test

# Type check
pnpm --filter @intinyagroup/ui check
```

## Project Structure

```
packages/
├── core/          # @intinyagroup/ui — main components
├── tokens/        # @intinyagroup/tokens — 9 themes
├── md3/           # Material Design 3 components
├── flat/          # Geometric/clip-path components
├── native/        # Capacitor device services
├── data-table/    # Enterprise data grid
├── cli/           # Component installer
├── editor-core/   # Visual editor engine (Svelte-native DnD)
├── image-editor/  # Image filters
├── rich-text/     # Tiptap editor wrapper
└── docs/          # Documentation site
```

## Adding a Component

1. **Create component dir** in `packages/core/src/lib/components/<name>/`
2. **Component file**: `<name>.svelte` using Svelte 5 runes:
   - `$props()` for props, `$state` for local state
   - `cn()` from relative `../../utils.js`
   - Use `var(--ui-*)` tokens for theming
3. **index.ts** barrel export
4. **Add to main index**: `packages/core/src/lib/index.ts`
5. **Add tests**: `<name>.test.ts` (Vitest + Testing Library)
6. **Add docs**: `packages/docs/src/routes/docs/components/<name>/+page.md`
7. **Regenerate registry**: `node packages/cli/scripts/generate-registry.mjs`

## Component Guidelines

- **Svelte 5 only**: runes, no `$$restProps`/`export let`/dispatchers
- **Theming**: CSS variables (`var(--ui-primary)`, `var(--ui-muted)`, etc)
- **Accessible**: semantic HTML, ARIA, keyboard nav
- **Touch-friendly**: ≥44px targets for mobile components
- **No hover-dependent** features in mobile components
- **Tests**: every component needs basic render + interaction tests

## Testing

```bash
# All tests
pnpm --filter @intinyagroup/ui test

# Single component
cd packages/core && npx vitest run src/lib/components/button
```

We have 230+ tests. Keep them passing.

## CI

GitHub Actions runs on every PR/push:
- Build all core packages
- Run tests
- Build docs

## Publishing

Uses **staged publishing** (approve on npmjs.com):

```bash
./scripts/stage-publish.sh          # rewrite workspace:* + stage
# then approve at https://www.npmjs.com/settings/intinya/packages
```

New packages (never published) need `npm publish` + 2FA:
```bash
cd packages/<name> && npm publish --tag alpha
```

## Code of Conduct

Be kind, be respectful, build great software.

## License

MIT
