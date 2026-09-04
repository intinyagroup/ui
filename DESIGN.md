# Intinya Design System

Design language and token contract for the Intinya UI ecosystem — `@intinyagroup/ui` (123+ components), `@intinyagroup/md3`, `@intinyagroup/flat`, and 26 publishable packages. This document is the visual spec; `@intinyagroup/tokens` is the implementation. Code is authoritative; this spec describes the intended system.

Live docs: https://ui.intinya.id

---

## 1. Design Principles

1. **One component library, many identities.** Every component renders through semantic tokens. A single CSS import restyles the entire library — no component changes, no rebuild.
2. **Tokens are the only color path.** Components never hard-code colors. `bg-primary`, `text-muted-foreground` resolve through `--ui-*` custom properties; a hard-coded hex breaks all nine themes at once.
3. **CSS custom properties, no JS theme objects.** Zero runtime cost (ADR-002). Themes are pure CSS under `[data-ui-theme="..."]` attribute selectors.
4. **Accessible by default.** Color pairs carry foreground contrast (primary/foreground, card/card-foreground). Mobile components guarantee ≥44px touch targets, safe-area awareness, no hover-dependent behavior.
5. **Boring where it counts.** Components use one reference pattern (Svelte 5 runes, `tv()` variants, `data-slot` hooks, `cn()` merging) so any developer can extend the library.

## 2. Architecture

```
packages/tokens/src/
├── base.css        # neutral (default :root), warm, dark — shadcn-style
├── md3.css         # Material Design 3 light/dark
├── flat.css        # Flat/Geometric light/dark
├── glass.css       # Glassmorphism light/dark
├── brutalist.css   # Brutalist light/dark
├── neumorphism.css # Neumorphism light/dark
├── retro.css       # Retro/Vintage light/dark
├── cyberpunk.css   # Cyberpunk light/dark
└── minimalist.css  # Minimalist light/dark
```

Token flow:

```
theme CSS file                base.css                components
--ui-primary  ──►  @theme inline ──►  --color-primary  ──►  bg-primary
--ui-radius   ──►  --radius-lg      ──►  rounded-lg
```

Each theme file redefines the same `--ui-*` variables under attribute selectors. `base.css` maps them into Tailwind v4's `@theme inline` so utility classes resolve through the token layer. **Consumers must import a theme CSS file explicitly** — `@intinyagroup/ui` does not bundle tokens; unstyled output is the symptom of a missing import.

Themes switch at runtime by setting `data-ui-theme` on the root element:

```html
<html data-ui-theme="flat">
```

## 3. Semantic Color Tokens

Every theme defines these — override them in your root CSS to brand the library:

| Token | Purpose |
|-------|---------|
| `--ui-background` / `--ui-foreground` | Page surface / primary text |
| `--ui-card` / `--ui-card-foreground` | Card surfaces / text |
| `--ui-popover` / `--ui-popover-foreground` | Menus, popovers, sheets |
| `--ui-primary` / `--ui-primary-foreground` | Primary actions, active states / label on primary |
| `--ui-secondary` / `--ui-secondary-foreground` | Secondary actions |
| `--ui-muted` / `--ui-muted-foreground` | Subtle, disabled surfaces |
| `--ui-accent` / `--ui-accent-foreground` | Hover / highlight accents |
| `--ui-destructive` | Errors, destructive actions |
| `--ui-border` | Default borders |
| `--ui-input` | Input borders |
| `--ui-ring` | Focus rings |

Status aliases (theme-dependent values):

| Token | Neutral (base) | MD3 |
|-------|---------------|-----|
| `--ui-success` | `oklch(0.648 0.15 160)` green | `oklch(0.55 0.20 150)` green |
| `--ui-warning` | `oklch(0.769 0.188 70)` amber | `oklch(0.65 0.18 80)` amber |
| `--ui-info` | `oklch(0.646 0.222 41.116)` orange | `oklch(0.50 0.18 260)` blue |

`base.css` additionally defines `--ui-danger` (alias of destructive) in the warm theme. All values are OKLCH for perceptual consistency.

## 4. Typography

Three font tokens per theme, with theme-appropriate defaults:

| Theme | `--ui-font-sans` | `--ui-font-mono` | `--ui-font-serif` |
|-------|------------------|------------------|-------------------|
| base (neutral) | `Inter Variable` | `SFMono-Regular` | `Georgia` |
| md3 | `Roboto` | `Roboto Mono` | — |
| flat | `Outfit` | `JetBrains Mono` | — |
| glass | `Inter` | `SF Mono` | — |
| brutalist | `Space Mono` (mono for everything) | `Space Mono` | — |
| neumorphism | `Inter Variable` | `SFMono-Regular` | `Georgia` |
| retro | `Georgia` (serif for everything) | `Courier New` | `Georgia` |
| cyberpunk | system `ui-monospace` | `SFMono-Regular` | `ui-monospace` |
| minimalist | `system-ui` | `SFMono-Regular` | `Georgia` |

Type personality rules per theme:

- **brutalist** — links and buttons are `uppercase`, `font-weight: 700`, `letter-spacing: 0.05em`; body runs `letter-spacing: -0.02em`, `line-height: 1.5`.
- **retro** — serif display, sepia-toned, `line-height: 1.6`.
- **cyberpunk** — monospace-first, digital feel.
- **minimalist** — system fonts, maximum whitespace.
- **md3** — Roboto at `line-height: 1.6` per Material guidelines.

## 5. Spacing & Radius

**Spacing scale** (`--ui-space-*`), 4px base unit:

```
0   0.25rem  0.5rem  0.75rem  1rem  1.25rem  1.5rem  2rem  2.5rem  3rem  4rem
0     1        2       3       4      5        6       8     10     12    16
```

**Radius** — `--ui-radius` is the base; Tailwind radius utilities derive from it:

| Theme | `--ui-radius` | Character |
|-------|---------------|-----------|
| base (neutral) | `0.625rem` | rounded, safe |
| md3 | `1rem` | Material shapes |
| flat | `0px` | sharp corners |
| glass | `1.5rem` | soft, frosted |
| brutalist | `0px` | raw edges |
| neumorphism | `1.5rem` | very rounded (soft UI) |
| retro | `0px` | vintage print |
| cyberpunk | `0px` | hard, digital |
| minimalist | `0px` | strict |

Derived utilities: `--radius-sm = radius − 4px`, `--radius-md = radius − 2px`, `--radius-lg = radius`, `--radius-xl = radius + 4px`.

## 6. Shadows & Elevation

`--ui-shadow-xs` … `--ui-shadow-xl` (md3 adds `--ui-shadow-2xl`). Three philosophies:

| Theme | Shadow model |
|-------|--------------|
| base, glass | conventional layered elevation (neutral blacks) |
| md3 | Material elevation: tonal shadows + key/ambient pairs; `--ui-shadow-xs: none` |
| flat, brutalist, minimalist | **no shadows** — flat means flat |
| neumorphism | dual shadows: dark offset + light offset (`5px 5px 10px` dark, `-5px -5px 10px` light) for raised surfaces; dark mode inverts to inset for pressed look |
| retro | warm-tinted shadows (`oklch(0.70 0.02 60 / 0.3)`) |
| cyberpunk | neon glow: layered `0 0 Npx` primary-colored halos |

**MD3 state layers** (opacity overlays for interaction feedback):

| State | Opacity |
|-------|---------|
| hover | `0.08` |
| focus | `0.12` |
| pressed | `0.12` |
| dragged | `0.16` |

## 7. Motion

`--ui-transition-fast` / `-base` / `-slow` per theme — duration and curve carry the theme's personality:

| Theme | fast | base | slow | Curve |
|-------|------|------|------|-------|
| base | 150ms | 200ms | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| md3 | 150ms | 250ms | 350ms | `cubic-bezier(0.2, 0, 0, 1)` (emphasized) |
| flat | 100ms | 200ms | 300ms | `ease` |
| glass | 150ms | 250ms | 400ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| brutalist | 50ms | 100ms | 200ms | `linear` (no easing — raw) |
| neumorphism | 200ms | 300ms | 400ms | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` |
| retro | 150ms | 250ms | 400ms | `ease-out` (unhurried) |
| cyberpunk | 80ms | 150ms | 250ms | `cubic-bezier(0.23, 1, 0.32, 1)` (sharp) |
| minimalist | 100ms | 150ms | 200ms | `ease` (barely perceptible) |

## 8. Theme Catalog

| Theme | `data-ui-theme` | Personality | Radius | Shadows | Font | Palette |
|-------|-----------------|-------------|--------|---------|------|---------|
| Neutral | `neutral` (also `:root`), `dark`, `warm` | shadcn-style, muted, safe | 0.625rem | subtle | Inter | neutral slate |
| MD3 | `md3`, `md3-dark` | elevated, stateful, Google-flavored | 1rem | elevation | Roboto | violet primary, tinted surfaces |
| Flat | `flat`, `flat-dark` | bold, geometric, modern | 0 | none | Outfit | saturated indigo primary, 12-color flat palette (`--flat-red` … `--flat-rose`) |
| Glass | `glass`, `glass-dark` | translucent, blur, depth | 1.5rem | soft blur | Inter | frosted white/10 alpha surfaces, gradient background |
| Brutalist | `brutalist`, `brutalist-dark` | heavy type, raw borders, no softness | 0 | none | Space Mono | black/white + `--brutalist-red` `-yellow` `-blue` |
| Neumorphism | `neumorphism`, `neumorphism-dark` | soft UI, dual shadows, pastel | 1.5rem | dual | Inter Variable | soft lavender + `--neumorph-pastel-*` |
| Retro | `retro`, `retro-dark` | vintage warmth, sepia, serif | 0 | warm | Georgia | sepia + `--retro-sepia-brown` `-olive` `-rust` `-gold` |
| Cyberpunk | `cyberpunk`, `cyberpunk-dark` | dark, neon-glowing, futuristic | 0 | neon glow | mono | near-black purple + `--cyber-neon-cyan` `-magenta` `-yellow` `-green` |
| Minimalist | `minimalist`, `minimalist-dark` | ultra-clean, black & white, hairline borders | 0 | none | system-ui | monochrome only |

Theme-specific accent palettes are exposed as flat CSS variables (`--flat-*`, `--brutalist-*`, `--neumorph-pastel-*`, `--retro-*`, `--cyber-neon-*`) for marketing surfaces. Flat additionally ships clip-path polygons (`--clip-hexagon`, `--clip-diamond`, `--clip-pentagon`, `--clip-star`, `--clip-triangle`, `--clip-octagon`) for geometric components. Glass ships `.glass` and `.glass-subtle` utility classes (`backdrop-filter: blur(var(--glass-blur))`).

## 9. Component Conventions

Reference implementation: `packages/core/src/lib/components/button/button.svelte`. Rules for any new component:

- **Svelte 5 runes only** — `$props()`, no `export let`; `$bindable()` for mutable refs; zero `$$restProps` in shipped code.
- **Variants via `tv()`** (`tailwind-variants`) in a `<script lang="ts" module>` block, exported as `<name>Variants` for consumer composition.
- **Props** typed on `WithElementRef` / `WithoutChildren` helpers; `class: className` merged last through `cn()` (clsx + tailwind-merge) so callers can override.
- **Every root element** carries `data-slot="<name>"` as a styling hook.
- **Children** render via `{@render children?.()}`.
- **Style through tokens** — Tailwind utilities that map to `--ui-*` only. Hard-coded colors break all nine themes.
- **Barrel exports** — directory `index.ts`, then package `src/lib/index.ts` grouped by category. CLI registry must be regenerated (`node packages/cli/scripts/generate-registry.mjs`).
- **Mobile** — ≥44px touch targets, safe-area awareness, no hover-dependent behavior.

## 10. Usage

```bash
npm install @intinyagroup/tokens @intinyagroup/ui
```

```css
/* pick a theme: base | md3 | flat | glass | brutalist | neumorphism | retro | cyberpunk | minimalist */
@import "@intinyagroup/tokens/flat.css";
```

```svelte
<script>
  import { Button, Card } from '@intinyagroup/ui';
</script>

<Button>Click me</Button>
```

```html
<html data-ui-theme="flat-dark">
```

### Branding an app (override, not fork)

```css
:root {
  --ui-primary: oklch(0.55 0.2 150);      /* green brand */
  --ui-radius: 0.75rem;                    /* rounder corners */
  --ui-font-sans: "Outfit", system-ui, sans-serif;
}

[data-ui-theme="dark"] {
  --ui-background: oklch(0.17 0.01 260);
  --ui-foreground: oklch(0.96 0.005 260);
}
```

## 11. Do / Don't

| Do | Don't |
|----|-------|
| Style components via `--ui-*` tokens / mapped utilities | Hard-code hex colors in components |
| Override tokens in consumer CSS for branding | Fork a theme file per project |
| Import exactly one theme CSS file per app | Import multiple themes (last one wins on `:root` collisions) |
| Use `data-ui-theme` for runtime switching | Switch themes via JS object mutation |
| Keep foreground pairs contrast-safe in every theme | Add a color that exists in only one theme |
| Regenerate the CLI registry with new components | Add a component without a docs page and navigation entry |

---

Related docs: `packages/tokens/README.md`, `CLAUDE.md` (architecture), Obsidian vault ADRs (002 tokens-over-JS, 004 multi-theme) at `docs/adr/` in the Intinya project vault.
