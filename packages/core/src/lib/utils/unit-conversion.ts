// ============================================
// Unit conversion utilities — px, pt, mm, cm, inch, em, rem
// ============================================

// Standard DPI: 96 (CSS standard), 72 (PostScript/PDF), 300 (print)
const DPI = {
  css: 96,
  postscript: 72,
  print: 300,
} as const;

// Conversion factors to pixels (at CSS 96dpi)
const TO_PX: Record<string, number> = {
  px: 1,
  pt: 96 / 72,          // 1pt = 1.333px
  mm: 96 / 25.4,        // 1mm = 3.7795px
  cm: 96 / 2.54,        // 1cm = 37.795px
  inch: 96,             // 1in = 96px
  em: 16,               // 1em = 16px (base)
  rem: 16,              // 1rem = 16px (root)
} as const;

/**
 * Convert a value from one unit to another
 */
export function convertUnit(value: number, from: string, to: string): number {
  const fromUnit = from.toLowerCase();
  const toUnit = to.toLowerCase();

  if (fromUnit === toUnit) return value;

  const fromFactor = TO_PX[fromUnit];
  const toFactor = TO_PX[toUnit];

  if (!fromFactor || !toFactor) {
    console.warn(`Unknown unit: ${fromUnit} or ${toUnit}`);
    return value;
  }

  // Convert to px first, then to target
  const px = value * fromFactor;
  return px / toFactor;
}

// Convenience functions
export function mmToPx(mm: number): number { return convertUnit(mm, 'mm', 'px'); }
export function pxToMm(px: number): number { return convertUnit(px, 'px', 'mm'); }
export function cmToPx(cm: number): number { return convertUnit(cm, 'cm', 'px'); }
export function pxToCm(px: number): number { return convertUnit(px, 'px', 'cm'); }
export function inchToPx(inch: number): number { return convertUnit(inch, 'inch', 'px'); }
export function pxToInch(px: number): number { return convertUnit(px, 'px', 'inch'); }
export function ptToPx(pt: number): number { return convertUnit(pt, 'pt', 'px'); }
export function pxToPt(px: number): number { return convertUnit(px, 'px', 'pt'); }
export function emToPx(em: number, fontSize: number = 16): number { return em * fontSize; }
export function pxToEm(px: number, fontSize: number = 16): number { return px / fontSize; }

/**
 * Format a value with unit
 */
export function formatUnit(value: number, unit: string, decimals = 2): string {
  return `${value.toFixed(decimals)}${unit}`;
}

/**
 * Parse a CSS value string (e.g., "16px", "2.5cm", "12pt")
 */
export function parseCssValue(value: string): { value: number; unit: string } | null {
  const match = value.match(/^([\d.]+)\s*(px|pt|mm|cm|inch|in|em|rem)$/i);
  if (!match) return null;
  const unit = match[2].toLowerCase() === 'in' ? 'inch' : match[2].toLowerCase();
  return { value: parseFloat(match[1]), unit };
}

/**
 * Get page dimensions in a specific unit
 */
export function getPageDimensions(
  pageSize: string,
  orientation: 'portrait' | 'landscape' = 'portrait',
  unit: string = 'mm'
): { width: number; height: number } {
  // Import from book-model to avoid circular dependency
  const pageSizes: Record<string, { width: number; height: number }> = {
    a4: { width: 210, height: 297 },
    a5: { width: 148, height: 210 },
    a6: { width: 105, height: 148 },
    b5: { width: 176, height: 250 },
    b4: { width: 250, height: 353 },
    f4: { width: 210, height: 330 },
    letter: { width: 216, height: 279 },
    legal: { width: 216, height: 356 },
    tabloid: { width: 279, height: 432 },
  };

  const base = pageSizes[pageSize] ?? pageSizes.a4;
  let width = base.width;
  let height = base.height;

  if (orientation === 'landscape') {
    [width, height] = [height, width];
  }

  if (unit !== 'mm') {
    width = convertUnit(width, 'mm', unit);
    height = convertUnit(height, 'mm', unit);
  }

  return { width, height };
}

/**
 * CSS unit options for UI dropdowns
 */
export const cssUnits = [
  { value: 'px', label: 'px (Pixels)', description: 'Screen pixels' },
  { value: 'pt', label: 'pt (Points)', description: 'Print points (1/72 inch)' },
  { value: 'mm', label: 'mm (Millimeters)', description: 'Metric' },
  { value: 'cm', label: 'cm (Centimeters)', description: 'Metric' },
  { value: 'inch', label: 'in (Inches)', description: 'Imperial' },
  { value: 'em', label: 'em', description: 'Relative to font size' },
  { value: 'rem', label: 'rem', description: 'Relative to root font size' },
] as const;
