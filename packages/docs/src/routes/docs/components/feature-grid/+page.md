# FeatureGrid

A responsive grid for displaying feature cards with icon, title, and description.

## Preview

```svelte
<script>
  import { FeatureGrid } from '@intinyagroup/ui';
  import { Zap, Shield, Globe, Layers } from 'lucide-svelte';
</script>

<FeatureGrid cols="4">
  <div class="flex flex-col gap-2 p-4">
    <Zap class="size-8 text-[var(--ui-primary)]" />
    <h3 class="font-semibold">Fast</h3>
    <p class="text-sm text-[var(--ui-muted-foreground)]">Built for speed with Svelte 5.</p>
  </div>
  <div class="flex flex-col gap-2 p-4">
    <Shield class="size-8 text-[var(--ui-primary)]" />
    <h3 class="font-semibold">Secure</h3>
    <p class="text-sm text-[var(--ui-muted-foreground)]">Type-safe by default.</p>
  </div>
  <div class="flex flex-col gap-2 p-4">
    <Globe class="size-8 text-[var(--ui-primary)]" />
    <h3 class="font-semibold">Global</h3>
    <p class="text-sm text-[var(--ui-muted-foreground)]">RTL and i18n support.</p>
  </div>
  <div class="flex flex-col gap-2 p-4">
    <Layers class="size-8 text-[var(--ui-primary)]" />
    <h3 class="font-semibold">Composable</h3>
    <p class="text-sm text-[var(--ui-muted-foreground)]">Mix and match components.</p>
  </div>
</FeatureGrid>
```

## Column variants

| `cols` | Layout |
|--------|--------|
| `2` | 1 col mobile, 2 col sm+ |
| `3` | 1 col mobile, 2 col sm, 3 col lg |
| `4` | 1 col mobile, 2 col sm, 4 col lg |

## Props

| Prop | Type | Default |
|------|------|---------|
| `cols` | `'2' \| '3' \| '4'` | `'3'` |
| `class` | `string` | — |

## Install

```bash
npx @intinyagroup/cli add feature-grid
```
