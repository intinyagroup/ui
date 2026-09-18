# Charts

A generic, dark-mode-aware chart component built on [Chart.js](https://www.chartjs.org/). Pass any Chart.js `type` (`bar`, `line`, `pie`, `doughnut`, `radar`, …) and it registers the required controllers automatically. Ships as a standalone package, `@intinyagroup/charts`.

## Usage

```svelte
<script>
  import { Chart } from '@intinyagroup/charts';
</script>

<Chart
  type="line"
  data={{
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{ label: 'Revenue', data: [120, 260, 410] }]
  }}
/>
```

## Chart types

```svelte
<Chart type="bar" {data} />
<Chart type="pie" {data} />
<Chart type="doughnut" {data} />
<Chart type="radar" {data} />
```

## Options

```svelte
<Chart
  type="line"
  {data}
  options={{ responsive: true, plugins: { legend: { display: false } } }}
  height={360}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `ChartType` | `'bar'` | Chart.js chart type (`bar`, `line`, `pie`, `doughnut`, `radar`, …) |
| `data` | `ChartData` | — | Chart datasets and labels (required) |
| `options` | `ChartOptions` | — | Chart.js options, merged over sensible defaults |
| `height` | `number` | `300` | Container height in pixels |
| `width` | `number` | — | Container width in pixels (defaults to 100%) |
| `class` | `string` | — | Additional classes |
| `onRef` | `(chart: ChartJS) => void` | — | Called with the underlying Chart.js instance |

## Convenience exports

`@intinyagroup/charts` also exports `chartPresets` (per-type option presets), `chartColors` (a stable 8-color palette), and `chartColorsAlpha(alpha)`.

## Standalone package

Unlike the other components in `@intinyagroup/ui`, charts live in their own package so you can tree-shake only what you need:

```bash
pnpm add @intinyagroup/charts
```

## Features

- One component for every Chart.js type — no per-chart modules
- Dark-mode aware, theme-aware defaults
- Pre-registered controllers/scales (no manual Chart.js setup)
- Exposed Chart.js instance via `onRef` for advanced control

## Install

```bash
pnpm add @intinyagroup/charts
```