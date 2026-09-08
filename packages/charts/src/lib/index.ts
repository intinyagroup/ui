export { default as Chart } from './Chart.svelte';
export type { ChartType, ChartData, ChartOptions } from 'chart.js';

export const chartPresets = {
  bar: { borderRadius: 6, borderSkipped: false as const },
  line: { tension: 0.4, pointRadius: 4, pointHoverRadius: 6, fill: false },
  pie: { borderWidth: 0, hoverOffset: 8 },
  doughnut: { borderWidth: 0, hoverOffset: 8, cutout: '65%' },
  radar: { pointRadius: 4, pointHoverRadius: 6 },
} as const;

/** Static fallback palette used when CSS tokens are unavailable. */
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

/** Read a single CSS custom property from the root, falling back to `fallback`. */
function readToken(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

/**
 * Build a chart colour palette from CSS custom properties.
 * Returns the static fallback palette when running server-side or when
 * tokens are not defined.
 */
export function getChartColors(): readonly string[] {
  const primary = readToken('--ui-primary', chartColors[0]);
  const secondary = readToken('--ui-secondary', chartColors[1]);
  const accent = readToken('--ui-accent', chartColors[2]);

  return [
    primary,
    secondary,
    accent,
    ...chartColors.slice(3),
  ];
}

export const chartColorsAlpha = (alpha: number) =>
  getChartColors().map((c) => {
    if (c.startsWith('oklch(')) {
      // oklch supports slash-alpha: oklch(0.5 0.1 200 / 0.5)
      return c.replace(')', ` / ${alpha})`);
    }
    return c;
  });
