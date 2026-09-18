# Component Release Checklist

Use this checklist before publishing any `@intinyagroup/*` package update.

## Pre-Release

- [ ] All new APIs have JSDoc comments / TypeScript doc comments on exported types
- [ ] `pnpm check` passes with 0 errors across all packages
- [ ] `pnpm test` passes — no skipped tests without justification
- [ ] `pnpm build:all` succeeds — every package builds clean
- [ ] No Svelte compiler warnings (`state_referenced_locally`, `a11y_*`) in changed files
- [ ] No bundler warnings (circular deps, unresolved imports)

## Bundle Size

- [ ] `node scripts/check-bundle-budgets.mjs` passes — no package exceeds its budget
- [ ] New packages have a budget defined in `scripts/bundle-budgets.json`
- [ ] No unexpected size regressions in `dist/` of changed packages

## API & Documentation

- [ ] New/changed exports are listed in a changeset file (`.changeset/*.md`)
- [ ] Breaking changes bump the major version and are documented in CHANGELOG
- [ ] New components have a Storybook story with at least one happy-path variant
- [ ] New components have unit tests covering core behavior

## Accessibility

- [ ] All interactive elements have `aria-label` or visible text
- [ ] Form inputs have associated `<label>` elements
- [ ] Keyboard navigation works for tree/list/grid components
- [ ] No `a11y_*` compiler warnings in Storybook build

## SSR & Hydration

- [ ] No top-level `window` / `document` access outside `{#if browser}` or `$effect`
- [ ] `mounted` / lifecycle code guarded by browser check
- [ ] SvelteKit `adapter-static` preview renders without hydration mismatch

## CI

- [ ] `ci.yml` passes: typecheck, test, build-all
- [ ] `deploy-docs.yml` builds successfully (docs + storybook)
- [ ] Bundle budgets check passes in CI (`node scripts/check-bundle-budgets.mjs`)

## Post-Release

- [ ] `pnpm changeset version` creates valid CHANGELOG entries
- [ ] `pnpm --filter @intinyagroup/<pkg> build` regenerates dist
- [ ] Publish via `Publish` GitHub Actions workflow (prepared or stable)
- [ ] Verify `npm view @intinyagroup/<pkg> version` matches local version
- [ ] GitHub Release tag created automatically by workflow
