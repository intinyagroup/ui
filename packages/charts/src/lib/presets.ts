import type { ChartData, ChartOptions } from "chart.js";
import { chartColors, readToken } from "./colors.js";

export interface SparklineData {
  labels: string[];
  datasets: { data: number[] }[];
}

export interface SparklineConfig {
  type: "line";
  data: ChartData<"line">;
  options: ChartOptions<"line">;
}

/**
 * Tiny inline area chart for dashboards.
 * No axes, no legend, no tooltip — just the data curve with a smooth fill.
 */
export function createSparklineConfig(
  data: SparklineData,
  color?: string,
): SparklineConfig {
  const lineColor = color ?? readToken("--ui-primary", chartColors[0]);

  return {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          data: data.datasets[0].data,
          borderColor: lineColor,
          backgroundColor: `${lineColor}26`,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: { display: false },
        y: { display: false },
      },
      elements: { line: { borderWidth: 2 } },
    },
  };
}

export interface StatCardData {
  labels: string[];
  datasets: { data: number[] }[];
}

export interface StatCardConfig {
  type: "line";
  data: ChartData<"line">;
  options: ChartOptions<"line">;
}

/**
 * Card header area chart with gradient fill.
 * Renders a single metric over time; `trend` sets the gradient hue.
 *
 * @param trend `'up'` | `'down'` — maps to `--ui-positive` / `--ui-negative`.
 */
export function createStatCardConfig(
  data: StatCardData,
  color?: string,
  trend: "up" | "down" = "up",
): StatCardConfig {
  const trendColor =
    trend === "up"
      ? readToken("--ui-positive", "oklch(0.648 0.15 160)")
      : readToken("--ui-negative", "oklch(0.577 0.245 27.325)");
  const stroke = color ?? trendColor;

  return {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          data: data.datasets[0].data,
          borderColor: stroke,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: stroke,
          pointHoverBorderColor: "#fff",
          pointHoverBorderWidth: 2,
          backgroundColor(ctx) {
            const { chart } = ctx;
            const { ctx: c, chartArea } = chart;
            if (!chartArea) return `${stroke}26`;
            const g = c.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom,
            );
            g.addColorStop(0, `${stroke}33`);
            g.addColorStop(1, `${stroke}00`);
            return g;
          },
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: readToken("--ui-card", "#ffffff"),
          titleColor: readToken("--ui-foreground", "#000000"),
          bodyColor: readToken("--ui-muted-foreground", "#666666"),
          borderColor: readToken("--ui-border", "#e5e5e5"),
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
        },
      },
      scales: {
        x: { display: false },
        y: {
          display: false,
          beginAtZero: false,
        },
      },
    },
  };
}

/* ---------- named presets (plain ChartOptions) ---------- */

/** Clean bar chart — rounded corners, no grid clutter, compact legend. */
export const barClean: ChartOptions<"bar"> = {
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { display: true, color: "rgba(0,0,0,0.04)" } },
  },
  elements: {
    bar: { borderRadius: 6, borderSkipped: false as const },
  },
};

/** Smooth line chart — subtle tension, minimal hover points. */
export const lineSmooth: ChartOptions<"line"> = {
  elements: {
    line: { tension: 0.4, borderWidth: 2 },
    point: { radius: 3, hoverRadius: 5, hitRadius: 8 },
  },
  plugins: {
    legend: {
      position: "bottom",
      labels: { usePointStyle: true, padding: 16 },
    },
  },
};

/** Centred doughnut — 60 % cutout, thin separator. */
export const doughnutCentered: ChartOptions<"doughnut"> = {
  cutout: "60%",
  plugins: {
    legend: {
      position: "bottom",
      labels: { usePointStyle: true, padding: 12 },
    },
  },
};

/**
 * Ready-to-spread named presets.
 *
 * ```svelte
 * <Chart type="bar" {data} options={chartPresets.barClean} />
 * ```
 */
export const chartPresets = {
  sparkline: createSparklineConfig,
  "stat-card": createStatCardConfig,
  "bar-clean": barClean,
  "line-smooth": lineSmooth,
  "doughnut-centered": doughnutCentered,
} as const;
