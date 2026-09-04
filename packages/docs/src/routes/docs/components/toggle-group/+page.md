# Toggle Group

A set of two-state toggle buttons where only one (or multiple) can be active at a time. Built on bits-ui toggle group primitives.

## Install

```bash
npx @intinyagroup/cli add toggle-group
```

## Usage

```svelte
<script>
  import { ToggleGroup, ToggleGroupItem } from '@intinyagroup/ui';
  import AlignLeft from 'lucide-svelte/icons/align-left';
  import AlignCenter from 'lucide-svelte/icons/align-center';
  import AlignRight from 'lucide-svelte/icons/align-right';
</script>

<ToggleGroup type="single" defaultValue="center" aria-label="Text alignment">
  <ToggleGroupItem value="left" aria-label="Align left">
    <AlignLeft class="size-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="center" aria-label="Align center">
    <AlignCenter class="size-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="right" aria-label="Align right">
    <AlignRight class="size-4" />
  </ToggleGroupItem>
</ToggleGroup>
```

## Props

| Sub-component | Prop | Type | Default |
|---------------|------|------|---------|
| `ToggleGroup` | `type` | `'single' \| 'multiple'` | `'single'` |
| `ToggleGroup` | `value` | `string \| string[]` | — |
| `ToggleGroup` | `defaultValue` | `string \| string[]` | — |
| `ToggleGroup` | `disabled` | `boolean` | `false` |
| `ToggleGroupItem` | `value` | `string` | required |
| `ToggleGroupItem` | `variant` | `'default' \| 'outline'` | `'default'` |
| `ToggleGroupItem` | `size` | `'default' \| 'sm' \| 'lg'` | `'default'` |
