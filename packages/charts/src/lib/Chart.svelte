<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import {
    Chart as ChartJS,
    type ChartData,
    type ChartOptions,
    type ChartType,
  } from 'chart.js';
  import { cn } from '@intinyagroup/ui/utils';

  // Register all Chart.js components
  import {
    ArcElement, BarElement, CategoryScale, Legend, LinearScale,
    LineController, LineElement, PointElement, PieController,
    DoughnutController, BarController, RadialLinearScale,
    RadarController, Tooltip, Filler,
  } from 'chart.js';

  ChartJS.register(
    ArcElement, BarElement, CategoryScale, Legend, LinearScale,
    LineController, LineElement, PointElement, PieController,
    DoughnutController, BarController, RadialLinearScale,
    RadarController, Tooltip, Filler
  );

  let {
    type = 'bar',
    data,
    options,
    height = 300,
    width,
    class: className,
    onRef,
    title,
  }: {
    type?: ChartType;
    data: ChartData<any>;
    options?: ChartOptions<any>;
    height?: number;
    width?: number;
    class?: string;
    onRef?: (chart: ChartJS) => void;
    title?: import('svelte').Snippet;
  } = $props();

  let canvas: HTMLCanvasElement | null = $state(null);
  let chart: ChartJS | null = $state(null);

  function readToken(name: string, fallback: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  }

  const defaultOptions: ChartOptions<any> = $derived.by(() => {
    const tooltipBg = readToken('--ui-card', 'rgba(0,0,0,0.8)');
    const gridColor = readToken('--ui-border', 'rgba(0,0,0,0.05)');
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: { padding: 16, usePointStyle: true, pointStyle: 'circle', font: { size: 12 } },
        },
        tooltip: {
          backgroundColor: tooltipBg,
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 8,
        },
      },
      scales: type === 'bar' || type === 'line'
        ? {
            x: { grid: { display: false }, ticks: { font: { size: 11 } } },
            y: { grid: { color: gridColor }, ticks: { font: { size: 11 } } },
          }
        : undefined,
    } as const;
  });

  function createChart() {
    if (!canvas) return;
    if (chart) chart.destroy();
    chart = new ChartJS(canvas, { type, data, options: { ...defaultOptions, ...options } });
    onRef?.(chart);
  }

  function updateChart() {
    if (!chart) return;
    chart.data = data;
    if (options) chart.options = { ...defaultOptions, ...options } as any;
    chart.update();
  }

  onMount(createChart);
  onDestroy(() => { if (chart) { chart.destroy(); chart = null; } });
  $effect(() => { if (chart) updateChart(); });
</script>

<div class={cn('rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] p-4', className)} style:height="{height}px" style:width={width ? `${width}px` : '100%'}>
  {@render title?.()}
  <canvas bind:this={canvas} aria-label="{type} chart" role="img"></canvas>
</div>
