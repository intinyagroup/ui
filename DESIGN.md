---
name: Technical Vanguard
colors:
  surface: "#faf8ff"
  surface-dim: "#d2d9f4"
  surface-bright: "#faf8ff"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f2f3ff"
  surface-container: "#eaedff"
  surface-container-high: "#e2e7ff"
  surface-container-highest: "#dae2fd"
  on-surface: "#131b2e"
  on-surface-variant: "#3f4850"
  inverse-surface: "#283044"
  inverse-on-surface: "#eef0ff"
  outline: "#707881"
  outline-variant: "#bfc7d2"
  surface-tint: "#006398"
  primary: "#006194"
  on-primary: "#ffffff"
  primary-container: "#007bb9"
  on-primary-container: "#fdfcff"
  inverse-primary: "#93ccff"
  secondary: "#855300"
  on-secondary: "#ffffff"
  secondary-container: "#fea619"
  on-secondary-container: "#684000"
  tertiary: "#006195"
  on-tertiary: "#ffffff"
  tertiary-container: "#287ab3"
  on-tertiary-container: "#fdfcff"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#cce5ff"
  primary-fixed-dim: "#93ccff"
  on-primary-fixed: "#001d31"
  on-primary-fixed-variant: "#004b73"
  secondary-fixed: "#ffddb8"
  secondary-fixed-dim: "#ffb95f"
  on-secondary-fixed: "#2a1700"
  on-secondary-fixed-variant: "#653e00"
  tertiary-fixed: "#cde5ff"
  tertiary-fixed-dim: "#94ccff"
  on-tertiary-fixed: "#001d32"
  on-tertiary-fixed-variant: "#004b74"
  background: "#faf8ff"
  on-background: "#131b2e"
  surface-variant: "#dae2fd"
  sky-deep: "#075985"
  amber-dark: "#d97706"
  slate-surface: "#f8fafc"
  slate-subtle: "#f1f5f9"
  slate-border: "#e2e8f0"
  slate-muted: "#64748b"
  slate-body: "#334155"
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: "700"
    lineHeight: 56px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: "600"
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: "600"
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "600"
    lineHeight: 24px
  title-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "600"
    lineHeight: 20px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "400"
    lineHeight: 16px
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
    letterSpacing: 0.02em
  label-badge:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: "600"
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies high-velocity technical capability, structural discipline, and executive clarity. Designed for modern enterprise SaaS, the interface bridges developer-grade precision with intuitive administrative workflows. It prioritizes information density without visual fatigue, turning complex infrastructure telemetry, data grids, and configuration trees into legible, confident UI.

The aesthetic philosophy draws from modern corporate minimalism integrated with subtle technical isometric influences. Layouts feel structured and intentional, defined by crisp contrast lines, layered cool surfaces, and tactical color pops. Vibrant sky-blue gradients anchor core navigation and primary operational verbs, while concentrated warm amber is reserved strictly for focal engagement, critical notifications, and high-value status moments.

## Colors

The color palette establishes an analytical, high-reliability workspace. The base canvas relies on ultra-clean white (`#ffffff`) and slate-tinted neutral fills (`#f8fafc`), framed by structured hairpins in pale slate (`#e2e8f0`).

- **Primary (`#0284c7`) & Tertiary (`#0369a1`)**: Serve as the core functional drivers. Primary blue governs main CTAs, active selection tabs, focused borders, and core progress trackers. Tertiary blue provides depth stops in gradient accents and interactive hover states.
- **Secondary (`#f59e0b`) & Amber Dark (`#d97706`)**: Used as the focal contrast accent. Because of its intense chromatic energy against cool slate backgrounds, amber is applied surgically: alert pings, warning states, featured KPI indicators, and contextual tittle markers.
- **Neutrals (`#0f172a`, `#334155`, `#64748b`)**: Deep slate handles high-contrast typographic rendering, ensuring maximum readability for enterprise metrics and dense text columns.

## Typography

The typographic hierarchy utilizes a multi-engine layout tailored for enterprise utilities:

1. **Space Grotesk** commands page heads, card titles, and high-impact numerical stats. Its geometric DNA reflects the isometric angles of the brand logo, injecting technical identity without feeling illegible.
2. **Inter** runs the entire interface backbone: body prose, form fields, tabular data, and navigational links. It maintains supreme legibility under dense information layouts.
3. **JetBrains Mono** governs precise technical elements, API endpoints, raw metrics, and syntax-driven status pills.

Keep tabular numbers enabled (`tnum` / `font-variant-numeric: tabular-nums`) across all numerical displays in dashboards and tables to prevent shifting baselines during live data streaming.

## Layout & Spacing

This design system uses a strict 8pt modular scale overlaid on a 12-column responsive fluid grid.

- **Desktop (1280px+)**: 12 columns, 24px gutters (`1.5rem`), with a maximum viewport boundary of 1440px for standard dashboard shells. Lateral canvas margins are fixed at `2rem`.
- **Tablet (768px - 1279px)**: 8 columns with 16px gutters. Structural sidebars collapse into persistent icon-rail configurations (64px wide).
- **Mobile (< 768px)**: 4 columns, 12px gutters (`0.75rem`), with outer canvas padding of `1rem`. Secondary analytical panels collapse below the primary action surface.

Internal component rhythm follows strict geometric density: micro-element gaps utilize `space-xs` (4px) and `space-sm` (8px); form rows and control groupings consistently use `space-md` (16px); section demarcations inside cards use `space-lg` (24px).

## Elevation & Depth

Visual depth avoids heavy, muddy drop shadows. The system is built on an architectural layering strategy:

1. **Base Layer (Level 0)**: Canvas ground (`#f8fafc`) with subtle structural borders (`#e2e8f0`).
2. **Surface Layer (Level 1)**: Pure white (`#ffffff`) interactive cards, tables, and panels enclosed in a 1px border (`#e2e8f0`). Subtle ambient drop: `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
3. **Floating Overlays (Level 2)**: Popovers, context dropdowns, and flyout selectors. These receive crisp outlines paired with expanded ambient diffusion: `box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`.
4. **Modal Layer (Level 3)**: Dialogue modals feature a 40% opacity slate backdrop overlay (`#0f172a66`) paired with 4px backdrop blur, focusing interaction exclusively on the elevated module.

## Shapes

The system implements a hybrid shape philosophy that balances geometric containment with ergonomic human touchpoints:

- **Structural Elements (Cards, Panels, Modals)**: Standardized at Level 2 roundedness (`rounded-lg` / 16px or `rounded` / 8px) with sharp, precise 1px borders.
- **Micro-Controls (Buttons, Status Chips, Indicators)**: Fully rounded pill silhouettes (`rounded-full` / 9999px) are deliberately applied to action buttons, search bars, and status tags. This creates an immediate visual signature inspired by the brand's tittle dot, setting interactive click targets apart from square analytical data grids.

## Components

### Buttons

- **Primary Action**: Pill-shaped (`rounded-full`), rendered with a directional brand gradient (`linear-gradient(135deg, #0284c7 0%, #0369a1 100%)`), pure white text, medium weight, with 12px vertical and 24px horizontal padding. Hover shifts brightness upwards by 4%.
- **Secondary Action**: White fill, 1px border (`#cbd5e1`), slate text (`#0f172a`). Hover introduces background `#f8fafc` and border `#0284c7`.
- **Accent Action**: Energetic warm amber fill (`linear-gradient(135deg, #f59e0b 0%, #d97706 100%)`) with white text, exclusively deployed for conversion triggers or immediate resolution steps.

### Chips & Badges

- Strict pill architecture (`rounded-full`). Height is capped at 22px with 8px horizontal padding.
- **Info / Active**: `#e0f2fe` background with `#0369a1` text and an optional `#0284c7` pulsing dot.
- **Warning / Staged**: `#fef3c7` background with `#b45309` text.
- **Neutral / Metric**: `#f1f5f9` background with `#475569` text in monospaced font.

### Form Inputs & Selectors

- Height 40px, rounded to 8px (`rounded-md`). Surface is white with 1px slate border (`#cbd5e1`).
- Focus state: Border transitions to `#0284c7` with a 3px outer glow ring (`rgba(2, 132, 199, 0.15)`). Placeholder text set in `#94a3b8`.

### Checkboxes & Radios

- Checkboxes: 16px square with 4px border radius. Radios: 16px circles.
- Inactive: Border `#cbd5e1` on white.
- Checked: `#0284c7` solid fill with crisp white check/dot icon inside.

### Cards & Tables

- **Cards**: Pure white, 1px outline in `#e2e8f0`, rounded to 12px. Headers feature a distinct subtle baseline separator (`#f1f5f9`).
- **Data Tables**: Header row uses `#f8fafc` with uppercase 11px label typography (`#64748b`). Row dividers use crisp 1px lines in `#f1f5f9`. Hover over any row initiates `#f8fafc` background transition.

### Code & Telemetry Blocks

- Dark slate container (`#0f172a`) with 8px corner radii, syntax highlights utilizing `#38bdf8` (sky accent) and `#fbbf24` (amber accent). Internal typography strictly `JetBrains Mono` at 12px.
