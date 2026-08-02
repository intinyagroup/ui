export { default as Chart } from './Chart.svelte';
export type { ChartType, ChartData, ChartOptions } from 'chart.js';

export const chartPresets = {
  bar: { borderRadius: 6, borderSkipped: false as const },
  line: { tension: 0.4, pointRadius: 4, pointHoverRadius: 6, fill: false },
  pie: { borderWidth: 0, hoverOffset: 8 },
  doughnut: { borderWidth: 0, hoverOffset: 8, cutout: '65%' },
  radar: { pointRadius: 4, pointHoverRadius: 6 },
} as const;

export const chartColors = [
  'oklch(0.216 0.006 56.043)',
  'oklch(0.553 0.013 58.071)',
  'oklch(0.648 0.15 160)',
  'oklch(0.769 0.188 70)',
  'oklch(0.577 0.245 27.325)',
  'oklch(0.556 0.01 264)',
  'oklch(0.646 0.222 41.116)',
  'oklch(0.7 0.15 320)',
] as const;

export const chartColorsAlpha = (alpha: number) =>
  chartColors.map((c) => c.replace(')', `, ${alpha})`));
