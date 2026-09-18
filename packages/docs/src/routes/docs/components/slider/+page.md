# Slider

A draggable slider for selecting a value or range from a continuous scale. Built on bits-ui slider primitives.

## Install

```bash
npx @intinyagroup/cli add slider
```

## Usage

```svelte
<script>
  import { Slider } from '@intinyagroup/ui';
</script>

<Slider value={[50]} min={0} max={100} step={1} />
```

## With Labels

```svelte
<script>
  import { Slider } from '@intinyagroup/ui';
</script>

<Slider
  value={[25, 75]}
  min={0}
  max={100}
  step={1}
  showLabels
  labelPosition="top"
/>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `value` | `number[]` | `[0]` |
| `min` | `number` | `0` |
| `max` | `number` | `100` |
| `step` | `number` | `1` |
| `disabled` | `boolean` | `false` |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `showLabels` | `boolean` | `false` |
| `labelPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` |
| `labelFormatter` | `(value: number, index: number) => string` | — |
| `class` | `string` | — |

## Sub-components

You can also use the lower-level bits-ui primitives directly:

- `SliderRoot` — the track
- `SliderRange` — the filled range
- `SliderThumb` — a draggable thumb
