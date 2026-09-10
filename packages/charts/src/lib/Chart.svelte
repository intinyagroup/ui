<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    Chart as ChartJS,
    type ChartData,
    type ChartOptions,
    type ChartType,
  } from "chart.js";
  import { cn } from "@intinyagroup/ui/utils";

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
  } from "chart.js";

  const registeredTypes = new Set<ChartType>();

  function registerForType(chartType: ChartType) {
    if (registeredTypes.has(chartType)) return;
    const components: any[] = [Tooltip, Legend];
    if (chartType === "bar")
      components.push(CategoryScale, LinearScale, BarController, BarElement);
    else if (chartType === "line")
      components.push(
        CategoryScale,
        LinearScale,
        LineController,
        LineElement,
        PointElement,
        Filler,
      );
    else if (chartType === "pie") components.push(ArcElement, PieController);
    else if (chartType === "doughnut")
      components.push(ArcElement, DoughnutController);
    else if (chartType === "radar")
      components.push(
        RadialLinearScale,
        PointElement,
        LineElement,
        RadarController,
      );
    else components.push(CategoryScale, LinearScale, PointElement, LineElement);
    ChartJS.register(...components);
    registeredTypes.add(chartType);
  }

  let {
    type = "bar",
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
    title?: import("svelte").Snippet;
  } = $props();

  let canvas: HTMLCanvasElement | null = $state(null);
  let chart: ChartJS | null = $state(null);

  function readToken(name: string, fallback: string): string {
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim() || fallback
    );
  }

  const defaultOptions: ChartOptions<any> = $derived.by(() => {
    const tooltipBg = readToken("--ui-card", "rgba(0,0,0,0.8)");
    const gridColor = readToken("--ui-border", "rgba(0,0,0,0.05)");
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            padding: 16,
            usePointStyle: true,
            pointStyle: "circle",
            font: { size: 12 },
          },
        },
        tooltip: {
          backgroundColor: tooltipBg,
          titleFont: { size: 13, weight: "bold" },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 8,
        },
      },
      scales:
        type === "bar" || type === "line"
          ? {
              x: { grid: { display: false }, ticks: { font: { size: 11 } } },
              y: { grid: { color: gridColor }, ticks: { font: { size: 11 } } },
            }
          : undefined,
    } as const;
  });

  let lastData: ChartData<any> | undefined;
  let lastOptions: ChartOptions<any> | undefined;

  function createChart() {
    if (!canvas) return;
    registerForType(type);
    if (chart) chart.destroy();
    chart = new ChartJS(canvas, {
      type,
      data,
      options: { ...defaultOptions, ...options },
    });
    lastData = data;
    lastOptions = options;
    onRef?.(chart);
  }

  function updateChart() {
    if (!chart || (data === lastData && options === lastOptions)) return;
    chart.data = data;
    if (options) chart.options = { ...defaultOptions, ...options } as any;
    chart.update();
    lastData = data;
    lastOptions = options;
  }

  onMount(createChart);
  onDestroy(() => {
    if (chart) {
      chart.destroy();
      chart = null;
    }
  });
  $effect(() => {
    if (chart) updateChart();
  });
</script>

<div
  class={cn(
    "rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] p-4",
    className,
  )}
  style:height="{height}px"
  style:width={width ? `${width}px` : "100%"}
>
  {@render title?.()}
  <div role="img" aria-label="{type} chart" class="relative h-full w-full">
    <canvas bind:this={canvas} aria-hidden="true"></canvas>
  </div>
</div>
