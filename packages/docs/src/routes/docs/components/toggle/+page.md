# Toggle

A two-state button that can be toggled on or off. Built on bits-ui toggle primitives.

## Install

```bash
npx @intinyagroup/cli add toggle
```

## Usage

```svelte
<script>
  import { Toggle } from '@intinyagroup/ui';
  import Bold from 'lucide-svelte/icons/bold';
</script>

<Toggle aria-label="Toggle bold">
  <Bold class="size-4" />
</Toggle>
```

## With Text

```svelte
<script>
  import { Toggle } from '@intinyagroup/ui';
</script>

<Toggle variant="outline" size="sm" aria-label="Toggle italic">
  Italic
</Toggle>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `pressed` | `boolean` | `false` |
| `variant` | `'default' \| 'outline'` | `'default'` |
| `size` | `'default' \| 'sm' \| 'lg'` | `'default'` |
| `disabled` | `boolean` | `false` |
| `class` | `string` | — |

The toggle uses `aria-pressed` for accessibility and applies `bg-muted` when active.
