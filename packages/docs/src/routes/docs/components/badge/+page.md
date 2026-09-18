# Badge

A small label used for status, counts, or categories.

## Preview

```svelte
<script>
  import { Badge } from '@intinyagroup/ui';
</script>

<div class="flex flex-wrap gap-2">
  <Badge>Default</Badge>
  <Badge variant="secondary">Secondary</Badge>
  <Badge variant="destructive">Destructive</Badge>
  <Badge variant="outline">Outline</Badge>
  <Badge variant="ghost">Ghost</Badge>
  <Badge variant="link">Link</Badge>
</div>
```

## As a link

```svelte
<Badge href="/docs">Clickable badge</Badge>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'ghost' \| 'link'` | `'default'` |
| `href` | `string` | `undefined` |
| `class` | `string` | — |

Renders a `<span>` by default, or an `<a>` when `href` is set.

## Install

```bash
npx @intinyagroup/cli add badge
```
