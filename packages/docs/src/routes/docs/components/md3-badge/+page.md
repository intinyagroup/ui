---
title: Badge (MD3)
description: Material Design 3 notification badge — dot, number, or icon
---

# Badge (MD3)

Material Design 3 notification badge for showing status, counts, or icons — dot, numbered, or icon variants.

## Preview

```svelte
<script>
  import { Badge } from '@intinyagroup/md3';
</script>

<div class="flex flex-col gap-4">
  <div class="flex items-center gap-6">
    <div class="relative">
      <div class="size-8 rounded-full bg-[var(--ui-muted)]"></div>
      <Badge class="absolute -right-1 -top-1" />
    </div>
    <span class="text-sm">Dot badge</span>
  </div>

  <div class="flex items-center gap-6">
    <div class="relative">
      <div class="size-8 rounded-full bg-[var(--ui-muted)]"></div>
      <Badge variant="number" class="absolute -right-2 -top-2">3</Badge>
    </div>
    <span class="text-sm">Number badge</span>
  </div>

  <div class="flex items-center gap-6">
    <div class="relative">
      <div class="size-8 rounded-full bg-[var(--ui-muted)]"></div>
      <Badge variant="icon" class="absolute -right-1 -top-1 bg-red-500">!</Badge>
    </div>
    <span class="text-sm">Icon badge</span>
  </div>
</div>
```

## Usage

```svelte
<script>
  import { Badge } from '@intinyagroup/md3';
</script>

<!-- Dot (default) -->
<Badge />

<!-- Numbered -->
<Badge variant="number">5</Badge>

<!-- Icon -->
<Badge variant="icon" class="bg-red-500">!</Badge>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'dot' \| 'number' \| 'icon'` | `'dot'` | Badge style |
| `class` | `string` | — | Extra classes |

## Features

- Three variants: dot, numbered, icon
- Position with `absolute` on a relative parent
- Style color via `class` (uses MD3 error red by default)
- Compact sizes with proper vertical alignment

## Install

```bash
npx @intinyagroup/cli add badge
```

From the `@intinyagroup/md3` package.

## Related

- [Snackbar (MD3)](/docs/components/md3-snackbar)
- [TopAppBar (MD3)](/docs/components/md3-top-app-bar)
