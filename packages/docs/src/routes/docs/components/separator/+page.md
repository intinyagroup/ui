# Separator

A visual divider to separate content sections. Built on bits-ui separator primitive.

## Preview

```svelte
<script>
  import { Separator } from '@intinyagroup/ui';
</script>

<div>
  <h4 class="text-sm font-medium">Intinya UI</h4>
  <p class="text-sm text-muted-foreground">An open-source design system.</p>
  <Separator class="my-4" />
  <div class="flex items-center gap-4">
    <span class="text-sm">Blog</span>
    <Separator orientation="vertical" class="h-4" />
    <span class="text-sm">Docs</span>
    <Separator orientation="vertical" class="h-4" />
    <span class="text-sm">GitHub</span>
  </div>
</div>
```

## Orientation

```svelte
<script>
  import { Separator } from '@intinyagroup/ui';
</script>

<!-- Horizontal (default) -->
<Separator />

<!-- Vertical -->
<div class="h-8">
  <Separator orientation="vertical" />
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Divider direction |
| `decorative` | `boolean` | `undefined` | When true, removes semantic role |
| `class` | `string` | — | Additional classes |

All other props are forwarded to the underlying element.

## Accessibility

- Horizontal separators use `role="separator"` with `aria-orientation="horizontal"`.
- Vertical separators use `aria-orientation="vertical"`.
- Set `decorative={true}` for purely visual separators that should be ignored by screen readers.
- Hidden from assistive technology when decorative.

## Install

```bash
npx @intinyagroup/cli add separator
```
