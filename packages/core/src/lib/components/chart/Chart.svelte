<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import {
    Chart as ChartJS,
    type ChartConfiguration,
    type ChartData,
    type ChartOptions,
    type ChartType,
    type DatasetChartOptions,
    type scales as Scales,
  } from 'chart.js';
  import { cn } from '../../utils.js';

  // Register all Chart.js components
  import {
    ArcElement,
    BarElement,
    CategoryScale,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    PieController,
    DoughnutController,
    BarController,
    RadialLinearScale,
    RadarController,
    Tooltip,
    Filler,
  } from 'chart.js';

  ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    PieController,
    DoughnutController,
    BarController,
    RadialLinearScale,
    RadarController,
    Tooltip,
    Filler
  );

  let {
    type = 'bar',
    data,
    options,
    height = 300,
    width,
    class: className,
    onRef,
  }: {
    type?: ChartType;
    data: ChartData<any>;
    options?: ChartOptions<any>;
    height?: number;
    width?: number;
    class?: string;
    onRef?: (chart: ChartJS) => void;
  } = $props();

  let canvas: HTMLCanvasElement | null = null;
  let chart: ChartJS | null = null;

  const themeColors = {
    primary: 'oklch(0.216 0.006 56.043)',
    secondary: 'oklch(0.553 0.013 58.071)',
    success: 'oklch(0.648 0.15 160)',
    warning: 'oklch(0.769 0.188 70)',
    destructive: 'oklch(0.577 0.245 27.325)',
    muted: 'oklch(0.556 0.01 264)',
    border: 'oklch(0.923 0.003 48.717)',
  };

  const defaultOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: type === 'bar' || type === 'line'
      ? {
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 } },
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { font: { size: 11 } },
          },
        }
      : undefined,
  };

  function createChart() {
    if (!canvas) return;
    if (chart) chart.destroy();

    const config: ChartConfiguration = {
      type,
      data,
      options: { ...defaultOptions, ...options },
    };

    chart = new ChartJS(canvas, config);
    onRef?.(chart);
  }

  function updateChart() {
    if (!chart) return;
    chart.data = data;
    if (options) {
      chart.options = { ...defaultOptions, ...options } as any;
    }
    chart.update();
  }

  onMount(() => {
    createChart();
  });

  onDestroy(() => {
    if (chart) {
      chart.destroy();
      chart = null;
    }
  });

  $effect(() => {
    if (chart) {
      updateChart();
    }
  });
</script>

<div class={cn('relative', className)} style:height="{height}px" style:width={width ? `${width}px` : '100%'}>
  <canvas bind:this={canvas}></canvas>
</div>
