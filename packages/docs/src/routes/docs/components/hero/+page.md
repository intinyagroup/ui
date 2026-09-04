# Hero

A prominent landing-page section for introducing your product. Three variants available.

## Preview

```svelte
<script>
  import { Hero } from '@intinyagroup/ui';
  import { Button } from '@intinyagroup/ui';
</script>

<Hero>
  <h1 class="text-4xl font-bold">Build faster with Intinya UI</h1>
  <p class="text-lg text-[var(--ui-muted-foreground)]">A Svelte 5 component library.</p>
  <Button>Get started</Button>
</Hero>
```

## Variants

| Variant | Use case |
|---------|----------|
| `centered` | Classic centered hero with headline + CTA |
| `split` | Side-by-side text + image layout |
| `fullwidth` | Full-width background with overlay content |

```svelte
<Hero variant="split" class="max-w-6xl mx-auto">
  <div class="flex-1">
    <h1 class="text-3xl font-bold">Left side</h1>
    <p>Content goes here</p>
  </div>
  <div class="flex-1">
    <img src="/hero.png" alt="Hero" class="rounded-xl" />
  </div>
</Hero>
```

## Sizes

| Size | Padding |
|------|---------|
| `sm` | 48px vertical |
| `default` | 64px vertical (96px on md+) |
| `lg` | 80px vertical (128px on md+) |

## Props

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'centered' \| 'split' \| 'fullwidth'` | `'centered'` |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` |
| `class` | `string` | — |

## Install

```bash
npx @intinyagroup/cli add hero
```
