export { default as Chart } from "./Chart.svelte";
export type { ChartType, ChartData, ChartOptions } from "chart.js";

// Color utilities — extracted to avoid circular dependency with presets
export {
  chartColors,
  readToken,
  getChartColors,
  chartColorsAlpha,
} from "./colors.js";

// Preset factory functions & named presets
export {
  chartPresets,
  createSparklineConfig,
  createStatCardConfig,
  barClean,
  lineSmooth,
  doughnutCentered,
} from "./presets.js";
export type {
  SparklineData,
  SparklineConfig,
  StatCardData,
  StatCardConfig,
} from "./presets.js";
