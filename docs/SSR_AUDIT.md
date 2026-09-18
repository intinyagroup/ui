# SSR & Hydration Safety Audit

## Status: PASS

Audited `packages/core/src/lib/components/` and `packages/data-table/src/lib/` on 2026-09-18.

## Findings

### No Critical Issues

All browser-only APIs (`window`, `document`, `localStorage`, `matchMedia`) are correctly guarded.

| Component                                  | API Used                            | Guard                                                    | Status |
| :----------------------------------------- | :---------------------------------- | :------------------------------------------------------- | :----- |
| `charts/BarChart.svelte`                   | `window.matchMedia`                 | Inside `$effect()` — client-only                         | Safe   |
| `charts/DonutChart.svelte`                 | `window.matchMedia`                 | Inside `$effect()`                                       | Safe   |
| `charts/LineChart.svelte`                  | `window.matchMedia`                 | Inside `$effect()`                                       | Safe   |
| `charts/PieChart.svelte`                   | `window.matchMedia`                 | Inside `$effect()`                                       | Safe   |
| `sidebar/SidebarNav.svelte`                | `window.localStorage`               | `typeof window === "undefined"` guard inside `$effect()` | Safe   |
| `mention/Mention.svelte`                   | `window.getSelection`               | Inside `$effect()`                                       | Safe   |
| `segmentedcontrol/SegmentedControl.svelte` | `window.addEventListener('resize')` | Inside `$effect()` with cleanup                          | Safe   |
| `gyroscope/Gyroscope.svelte`               | `window.addEventListener`           | Inside `$effect()` with cleanup                          | Safe   |

### Svelte 5 Rule

In Svelte 5, `$effect()` only runs on the client. Any browser-only code inside `$effect()` is automatically SSR-safe. No additional wrapping needed.

### Recommendation

- New components: Always put browser API calls inside `$effect()` or guard with `if (typeof window === "undefined") return`.
- Never access browser APIs at the top level of `<script>` outside `$effect`.
- Use `{#if browser}` from `$app/environment` only when conditional rendering depends on the client check (not needed for imperative code in `$effect`).
