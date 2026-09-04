# Skeleton

A loading placeholder that pulses to indicate content is being fetched.

## Preview

```svelte
<script>
  import { Skeleton } from '@intinyagroup/ui';
</script>

<div class="flex items-center space-x-4">
  <Skeleton class="h-12 w-12 rounded-full" />
  <div class="space-y-2">
    <Skeleton class="h-4 w-[250px]" />
    <Skeleton class="h-4 w-[200px]" />
  </div>
</div>
```

## Card Skeleton

```svelte
<script>
  import { Skeleton } from '@intinyagroup/ui';
</script>

<div class="flex flex-col space-y-3">
  <Skeleton class="h-[125px] w-[250px] rounded-xl" />
  <div class="space-y-2">
    <Skeleton class="h-4 w-[250px]" />
    <Skeleton class="h-4 w-[200px]" />
  </div>
</div>
```

## Table Rows Skeleton

```svelte
<script>
  import { Skeleton } from '@intinyagroup/ui';
</script>

<div class="space-y-2">
  {#each Array(5) as _}
    <div class="flex items-center gap-4">
      <Skeleton class="h-8 w-8 rounded-full" />
      <Skeleton class="h-4 flex-1" />
      <Skeleton class="h-4 w-20" />
    </div>
  {/each}
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `class` | `string` | — | Additional classes for sizing/styling |

All other props are forwarded to the underlying `<div>` element.

## Accessibility

- Uses `aria-hidden="true"` or a `role="status"` context — screen readers skip it.
- Communicates loading state to assistive tech via parent `aria-busy="true"`.
- Pulse animation uses `animate-pulse` (Tailwind) — respects `prefers-reduced-motion`.

## Install

```bash
npx @intinyagroup/cli add skeleton
```
