# BentoGrid

An asymmetric grid layout for showcasing features in a bento-box style. Use `col-span` and `row-span` classes on children to create the asymmetry.

## Preview

```svelte
<script>
  import { BentoGrid } from '@intinyagroup/ui';
</script>

<BentoGrid cols="3">
  <div class="col-span-2 row-span-2 flex min-h-[300px] items-center justify-center rounded-xl bg-[var(--ui-muted)] p-6">
    <span class="text-lg font-semibold">Large feature</span>
  </div>
  <div class="flex items-center justify-center rounded-xl bg-[var(--ui-muted)] p-6">Small</div>
  <div class="flex items-center justify-center rounded-xl bg-[var(--ui-muted)] p-6">Small</div>
  <div class="col-span-3 flex items-center justify-center rounded-xl bg-[var(--ui-muted)] p-6">Full width</div>
</BentoGrid>
```

## Creating asymmetric layouts

Apply `col-span-*` and `row-span-*` Tailwind classes to children:

| Class | Effect |
|-------|--------|
| `col-span-2` | Spans 2 columns |
| `col-span-3` | Full width |
| `row-span-2` | Double height |

## Props

| Prop | Type | Default |
|------|------|---------|
| `cols` | `'2' \| '3' \| '4'` | `'3'` |
| `class` | `string` | — |

## Install

```bash
npx @intinyagroup/cli add bento-grid
```
