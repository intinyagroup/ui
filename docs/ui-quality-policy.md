# UI package quality and release gates

Run `pnpm ui:quality` in CI and before release. API snapshot changes require review; additions print as informational diffs, removals or source-path changes fail. Establish a new baseline only with `pnpm ui:api:snapshot` after reviewing the public API change.

## Compatibility and compile fixture

The API manifest is `scripts/ui-api.snapshot.json`. It captures every named export from `packages/core/src/lib/index.ts`, including source modules. Breaking exports fail with actionable names. Compile fixtures must import from `@intinyagroup/ui`, not internal paths; run `pnpm --filter @intinyagroup/ui check` and build as consumer checks. Treat removed exports, changed prop/event/type signatures, and changed defaults as semver-major unless deprecated for one release with migration notes.

## Dependency and bundle budgets

`pnpm bundle:budget` runs `scripts/check-bundle-budgets.mjs` against `scripts/bundle-budgets.json`. Dist output must remain under each package's `maxSizeKb`; warning thresholds prompt review. Keep runtime dependencies justified, avoid duplicate implementations, declare CSS/runtime side effects accurately, and verify tree-shaking through package subpath imports. Update budgets only with measured output and rationale.

## Interactive primitive content contract

Every interactive primitive example must show an accessible name (visible label, `aria-label`, or `aria-labelledby`), keyboard operation, disabled/loading/empty/error states where applicable, controlled and uncontrolled usage where supported, and locale-neutral defaults. User-facing labels, descriptions, placeholders, and announcements must be overrideable/localizable; never assume English, directionality, date/number formats, or a particular locale. Include RTL, light/dark, narrow viewport, and reduced-motion checks for visual changes. Decorative icons must be hidden from assistive technology; icon-only controls require an accessible name.

## Docs, examples, and regressions

Document public exports with an importable usage example, prop/event behavior, accessibility notes, controlled/uncontrolled semantics, edge-state matrix, and migration guidance for changed behavior. Storybook/test coverage should exercise representative states; visual baselines must include light/dark, RTL, mobile, and reduced motion. Review snapshots deliberately—never auto-accept unexplained diffs. `pnpm ui:quality` checks manifest consistency and required policy presence; component tests and visual snapshots remain the behavioral evidence.
