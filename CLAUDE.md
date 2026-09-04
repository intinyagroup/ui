# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`intinya-ui` is a pnpm monorepo of 28 packages under `packages/`, 26 of which publish to npm as `@intinyagroup/*` (`docs` and `storybook` are `private`). It is a Svelte 5 component ecosystem — shadcn-style core, Material Design 3, flat/geometric, mobile/native, editors, motion. All publishable packages are versioned and released together as one unit.

Live docs: https://ui.intinya.id (Cloudflare Pages, auto-deployed from `main`).

## Commands

pnpm is required (workspace protocol + `link:` overrides in the root `package.json`).

```bash
pnpm install

# Build. Order matters: tokens → ui → everything else.
pnpm build                          # tokens + @intinyagroup/ui only (fast path)
pnpm build:all                      # every package (pnpm -r)
pnpm --filter @intinyagroup/ui build      # single package

pnpm --filter @intinyagroup/ui test       # 230+ Vitest tests (only package with tests)
pnpm check                          # `pnpm -r run check` — real svelte-check only in core/md3/flat/editor-core/native/docs; cli runs tsc --noEmit, 20 packages stub it as `echo 'no check'`, image-editor has none. Green does not mean type-clean.
pnpm dev                            # Storybook on :6006 (alias of `pnpm storybook`)
pnpm --filter @intinyagroup/docs dev      # docs site on :5173
pnpm format                         # prettier --write .
```

Run a single test file or component directory:

```bash
cd packages/core && npx vitest run src/lib/components/button
cd packages/core && npx vitest run src/lib/components/button/Button.test.ts
```

Test files are PascalCase (`Button.test.ts`, `Tabs.test.ts`). A lowercase path resolves on macOS but fails in CI, which runs on case-sensitive Linux.

After adding, renaming, or deleting a component, regenerate the CLI registry:

```bash
node packages/cli/scripts/generate-registry.mjs    # from repo root
```

`svelte-kit sync` must have run before `check`/`build` in a fresh clone (CI does this for the root, `packages/core`, and `packages/docs`).

## Architecture

### Package layout

`packages/core` publishes as **`@intinyagroup/ui`** — the directory name and package name differ, which trips up filters. Everything else matches its directory (`packages/md3` → `@intinyagroup/md3`).

Dependency direction is acyclic, but wider than three tiers. There are two independent roots — `@intinyagroup/tokens` and `@intinyagroup/motion` — and `@intinyagroup/cli` / `@intinyagroup/native` depend on no workspace package at all:

```
@intinyagroup/tokens ──► md3, flat, image-editor      (core takes it as a devDependency only)
@intinyagroup/ui (packages/core)
      └─► grid-core ─► data-table, kanban, spreadsheet, pdf-viewer,
                       rich-text, slides, book-writer, collaboration,
                       motion-player, motion-studio
      └─► calendar, charts, editor-core, image-editor, docs, storybook
          rich-text ─► slides, book-writer ─► collaboration
@intinyagroup/motion ──► motion-captions, -effects, -media, -player, -three, -studio
```

The CLI is decoupled on purpose: it ships the pre-generated `registry/index.json` and never imports the component packages, so adding a component means regenerating the registry rather than bumping a version.

**`@intinyagroup/ui` lists `@intinyagroup/tokens` as a `devDependency`, not a dependency** (`packages/core/package.json`) — unlike `md3` and `flat`, which take it as a real dependency. An app installing only `@intinyagroup/ui` gets no token CSS, and every component renders unstyled because all the Tailwind color utilities resolve through `--ui-*`. Consumers must install and import `@intinyagroup/tokens` separately. This is the most likely "why is everything broken" moment for a newcomer.

`@intinyagroup/tokens` is pure CSS with no build step (its `build` script is an `echo`). It has no `dist` — `exports` point directly at `src/*.css`, with a `style` condition alongside `default` so both bundlers and plain CSS importers resolve.

Component packages (`core`, `md3`, `flat`) build with `svelte-package -o dist`. `@intinyagroup/ui`'s build then runs `find dist -name "*.test.*" -delete` followed by the same `find dist -name "*Test.svelte*" ! -name "Testimonial*" -delete` command **twice** — the duplicate is a copy-paste artifact, and `find -delete` is idempotent, so the second pass is a no-op.

The `! -name "Testimonial*"` filter is also dead weight, not a safeguard: `-name` tests the basename, so no file can both match `*Test.svelte*` and start with `Testimonial`. What the chain actually removes are three dev scratch harnesses — `ProgressStepsTest.svelte`, `TabsTest.svelte`, `TabBarTest.svelte`. The Testimonial components (`testimonial/testimonial.svelte`, `testimonial-carousel/TestimonialCarousel.svelte`) were never candidates. The whole chain reduces safely to `find dist \( -name "*.test.*" -o -name "*Test.svelte*" \) -delete`.

### Theming

Themes are CSS custom properties only — no JS theme objects, no runtime cost (ADR-002). Each theme file redefines the same `--ui-*` variables under an attribute selector:

```css
[data-ui-theme="cyberpunk"] { --ui-primary: ...; }
[data-ui-theme="cyberpunk-dark"] { ... }
```

`base.css` maps `--ui-*` into Tailwind v4's `@theme inline` (`--color-primary: var(--ui-primary)`), so components style themselves with Tailwind utility classes (`bg-primary`, `text-muted-foreground`) that resolve through the token layer. Consumers switch themes by importing one CSS file and setting `data-ui-theme` on the root element. Nine theme CSS files in `packages/tokens/src/`, exposing **19 distinct `data-ui-theme` values**. Eight files are true light/dark pairs — md3, flat, glass, brutalist, neumorphism, retro, cyberpunk, minimalist, each with a `-dark` variant. `base.css` holds the remaining three: `neutral` (also bound to `:root`), `warm` (no dark variant), and `dark` (which serves as neutral's dark variant and is also aliased to the legacy `.dark` class).

When adding a component, style through tokens/Tailwind utilities that map to `--ui-*`. Hard-coded colors break all nine themes at once.

### Component conventions

Svelte 5 runes only — zero occurrences of `export let` anywhere in `packages/`, and zero `$$restProps` in `packages/core/src/lib/components`. Keep it that way. (Four legacy `$$restProps` usages survive in Storybook templates — `Alert.stories.ts` and `Hero.stories.ts` — which are story snippets, not shipped components.) `packages/core/src/lib/components/button/button.svelte` is the reference implementation:

- Variants live in a `<script lang="ts" module>` block using `tv()` from `tailwind-variants`, exported as `buttonVariants` so consumers can compose them.
- Props are a single destructured `$props()` call with `class: className`, `ref = $bindable(null)`, and `...restProps`.
- Props types build on the `WithElementRef` / `WithoutChildren` helpers from `src/lib/utils.ts`.
- Every root element carries `data-slot="<name>"` for styling hooks.
- Children render via `{@render children?.()}`.
- Classes merge through `cn()` (clsx + tailwind-merge) with `className` last so callers can override.

Imports of `cn()` use `$lib/utils.js` (197 files) over relative `../../utils.js` (84 files, all at exactly that one depth). Prefer `$lib/utils.js` for new components; CONTRIBUTING.md still says relative, and the CLI rewrites `$lib` aliases at install time either way.

`md3` and `flat` each carry their own `src/lib/utils.ts`, and their components import it via their own `$lib`. The registry generator resolves `$lib` per-package for this reason. Note the specifier is inconsistent within those two packages — some files import `$lib/utils.js`, others extensionless `$lib/utils` — so any grep or codemod keyed only on the `.js` form silently misses a subset.

### CLI and the registry

`packages/cli/scripts/generate-registry.mjs` scans `packages/{core,md3,flat}/src/lib/components/*` and emits `packages/cli/registry/index.json` — one entry per component with source files, transitive `$lib` deps, category, tags, and a best-effort props/description extraction parsed from the `tv()` and `$props()` blocks. The registry is committed and shipped in the published package (`files: ["dist", "registry"]`), so it is only as fresh as the last generator run. Regenerate and commit it in the same change as the component.

Categories are a hard-coded kebab-case name → category map inside the generator. A new component whose directory name isn't listed silently becomes `uncategorized`; add it to the map.

Two install models are supported (ADR-003):
- `--mode copy` (default) — copies files into the consumer's project, rewriting `$lib` imports to their aliases.
- `--mode npm` — adds `@intinyagroup/ui` to their `package.json` and prints import snippets.

### Docs site

`packages/docs` is SvelteKit + `adapter-static` (SPA fallback) + mdsvex. Component pages are `src/routes/docs/components/<name>/+page.md` — mostly plain markdown: a heading, fenced ```svelte usage samples, and a props table. Code samples import from the barrel (`import { Badge } from '@intinyagroup/ui'`), the convention in 122 of 153 pages. `md3-*` and `flat-*` pages import from `@intinyagroup/md3` / `@intinyagroup/flat`.

`src/lib/components/Playground.svelte` (props-schema driven) and `ComponentPreview.svelte` exist but are barely adopted: only `button/+page.md` uses `Playground` — with a live `<script>` block and a subpath import — and nothing uses `ComponentPreview`. Treat a live playground as the exception, not the page template. All `.md`/`.svx` files render through the shared layout at `src/routes/docs/_layout.svelte`.

The docs `build` runs Vite, then Pagefind over `build/`, then `scripts/copy-pagefind.mjs`. The third step is preview-only — it copies `build/pagefind` into `.svelte-kit/output/client/` so `vite preview` can serve search assets, and exits 0 with a warning if that directory is absent. The Cloudflare Pages deploy serves `build/` directly and does not need it. `svelte.config.js` aliases `$ui` → `../core/src/lib`, though no page currently imports through it.

Adding a component page means updating **two** hand-maintained lists, neither of which reads the filesystem:

- `src/lib/navigation.ts` — the only sidebar, rendered by `src/routes/docs/+layout.svelte`.
- `src/routes/docs/components/+page.md` — the hand-curated components index table.

Both have drifted badly. There are 153 component `+page.md` directories but only 89 navigation entries, so **64 component pages are live and crawlable but unreachable from any sidebar link** — including core primitives like `avatar`, `checkbox`, `tooltip`, `slider`, `switch`, `progress`, `separator`, and `pagination`. The sitemap (`src/routes/sitemap.xml/+server.ts`) enumerates the filesystem, so those pages are indexed while being invisible in-app. Treat this as a known backlog item, not a per-component surprise.

### Tests

`@intinyagroup/ui` is the only package with a test suite — it is the only one defining a `test` script, and CI runs only `pnpm --filter @intinyagroup/ui test`. Tests live beside components in `packages/core` as `<name>.test.ts` (~25 files, 230+ tests). Vitest + jsdom + `@testing-library/svelte`, configured in `packages/core/vitest.config.ts` with `sequence.concurrent: false`, `isolate: true`, and a `$lib` alias. Svelte is pre-compiled with `dev: false` for speed. `src/test-setup.ts` is the setup file.

## Adding a component (full checklist)

1. `packages/core/src/lib/components/<name>/<name>.svelte` — follow the button conventions above.
2. `index.ts` barrel in that directory.
3. Export from `packages/core/src/lib/index.ts` (grouped by category with comment headers) — this is what makes the barrel import and `--mode npm` work.
4. `<name>.test.ts` — render + interaction. PascalCase filename.
5. `packages/docs/src/routes/docs/components/<name>/+page.md`.
6. Add to `packages/docs/src/lib/navigation.ts` — the only sidebar; omit it and the page is reachable only by direct URL.
7. Add a row to the table in `packages/docs/src/routes/docs/components/+page.md` — the curated index does not read the filesystem.
8. Add the directory name to the category map in `packages/cli/scripts/generate-registry.mjs`, then regenerate the registry (otherwise it ships as `uncategorized`).

In a fresh clone, run `svelte-kit sync` before `check`/`build`. If the component lands in a brand-new package, also add that package to the hard-coded list in `scripts/stage-publish.sh` or it will never publish.

Mobile components additionally need ≥44px touch targets, safe-area awareness, and no hover-dependent behavior.

## Publishing

Two paths exist. **Prefer the GitHub Actions workflow:**

```bash
gh workflow run publish.yml -f release-type=alpha
gh workflow run publish.yml -f release-type=stable -f version=patch|minor|major
```

The workflow bumps every non-private package in lockstep, commits, builds, publishes in dependency order, tags `v<version>`, and creates a GitHub Release. Prerelease bumping is stage-aware: same stage increments (`alpha.15` → `alpha.16`), a different stage resets to `.0`.

The manual path is `./scripts/stage-publish.sh [tag]` → approve at npmjs.com Staged Packages → `pnpm stage:apply`. Never-before-published packages need `npm publish --tag alpha` + 2FA from their directory.

**Critical:** npm does not resolve pnpm's `workspace:*` specifiers when packing (verified with `npm pack`) — a tarball published with `workspace:*` intact fails on install. Both paths must rewrite `workspace:*` to the resolved workspace version first; `stage-publish.sh` does this via an embedded Python script and supports `--rewrite-only` for CI. The rewrite mutates local `package.json` files — restore with `git checkout packages/*/package.json`.

`scripts/stage-publish.sh` hard-codes its package list (26 entries, dependency-ordered) and `.github/workflows/publish.yml` hard-codes a **second** list in its `ORDER=(...)` array. Both must be updated when adding a package, or it will be version-bumped every release and silently never published — the bump step iterates every non-private package, but the publish loop only walks `ORDER`. `image-editor` was missing from `ORDER` until it was added; keep the two lists in sync.

The publish workflow now runs `pnpm -r run build` before publishing. It previously built only 7 packages while shipping 25 — the other 18 declare `files: ["dist"]`, `dist/` is gitignored, and no package defines `prepublishOnly`/`prepare`/`prepack`, so their tarballs went to npm with no built output.

## CI

- `ci.yml` — on push/PR to `main`: install, `svelte-kit sync`, build core packages, run `@intinyagroup/ui` tests, build docs.
- `publish.yml` — manual dispatch, described above.
- `deploy-docs.yml` — push to `main` touching docs paths → build → Cloudflare Pages (`intinya-docs` project). Needs `CF_API_TOKEN` + `CF_ACCOUNT_ID` secrets.

## External documentation

Product and architecture docs live outside this repo, in an Obsidian vault at
`/Users/antoniusjoshua/PARA/Project/personal/secondbrain/010 Projects/020 Projects/Intinya/`:

- `_Status.md` — publish status per package, component category tables, current priorities, deploy details. Most current snapshot of the ecosystem.
- `docs/technical/architecture.md` — system/package/token diagrams (mermaid), performance and a11y targets.
- `docs/adr/` — accepted decisions: 001 Svelte 5 first, 002 CSS tokens over JS themes, 003 clipboard install model, 004 multi-theme architecture, 007 open-source vs paid editor.
- `docs/prd/` — per-product requirements (`intinya-ui`, `intinya-editor`, `intinya-image-editor`, `intinya-marketplace`, `intinya-react`).
- `docs/brd/`, `docs/business/` — market analysis, business model, go-to-market.
- `intinya-npm-publishing-guide.md`, `intinya-docs-architecture.md`, `intinya-improvement-roadmap.md`, `intinya-ecosystem-plan.md`, `docs/component-inventory.md`.

These are planning documents and drift from the code — several were written when there were 5 themes and 50 components. Treat the repo as authoritative for anything mechanical; treat the vault as authoritative for intent, rationale, and roadmap. Some vault docs are written in a mix of English and Indonesian.

The visual editor is a separate proprietary repo (`intinya-digital-asia/editor`), as is the `intinya-admin` template.


<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:6cd5cc61 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.

## Agent Context Profiles

The managed Beads block is task-tracking guidance, not permission to override repository, user, or orchestrator instructions.

- **Conservative (default)**: Use `bd` for task tracking. Do not run git commits, git pushes, or Dolt remote sync unless explicitly asked. At handoff, report changed files, validation, and suggested next commands.
- **Minimal**: Keep tool instruction files as pointers to `bd prime`; use the same conservative git policy unless active instructions say otherwise.
- **Team-maintainer**: Only when the repository explicitly opts in, agents may close beads, run quality gates, commit, and push as part of session close. A current "do not commit" or "do not push" instruction still wins.

## Session Completion

This protocol applies when ending a Beads implementation workflow. It is subordinate to explicit user, repository, and orchestrator instructions.

1. **File issues for remaining work** - Create beads for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **Handle git/sync by active profile**:
   ```bash
   # Conservative/minimal/default: report status and proposed commands; wait for approval.
   git status

   # Team-maintainer opt-in only, unless current instructions forbid it:
   git pull --rebase
   git push
   git status
   ```
5. **Hand off** - Summarize changes, validation, issue status, and any blocked sync/commit/push step

**Critical rules:**
- Explicit user or orchestrator instructions override this Beads block.
- Do not commit or push without clear authority from the active profile or the current user request.
- If a required sync or push is blocked, stop and report the exact command and error.
<!-- END BEADS INTEGRATION -->
