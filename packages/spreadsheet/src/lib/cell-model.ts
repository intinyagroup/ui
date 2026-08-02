// ============================================
// Cell data model — sparse 2D storage
// ============================================

export type CellValue = string | number | boolean | null;
export type CellStyle = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  textColor?: string;
  bgColor?: string;
  fontSize?: number;
  fontFamily?: string;
  format?: 'plain' | 'currency' | 'percent' | 'date' | 'number';
};

export type Cell = {
  value: CellValue;
  formula?: string;
  display?: string;
  style?: CellStyle;
};

export type CellMap = Map<string, Cell>;

export function createCell(value: CellValue = null, formula?: string): Cell {
  return { value, formula };
}

export function createCellMap(): CellMap {
  return new Map();
}

export function getCellValue(cells: CellMap, cellId: string): CellValue {
  return cells.get(cellId)?.value ?? null;
}

export function setCellValue(cells: CellMap, cellId: string, value: CellValue, formula?: string): CellMap {
  const next = new Map(cells);
  const existing = next.get(cellId);
  if (value === null && !formula) {
    next.delete(cellId);
  } else {
    next.set(cellId, { ...existing, value, formula });
  }
  return next;
}

export function setCellStyle(cells: CellMap, cellId: string, style: Partial<CellStyle>): CellMap {
  const next = new Map(cells);
  const existing = next.get(cellId) ?? { value: null };
  next.set(cellId, { ...existing, style: { ...existing.style, ...style } });
  return next;
}

/** Format cell value for display */
export function formatCellDisplay(value: CellValue, format?: string): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  if (typeof value === 'number') {
    switch (format) {
      case 'currency': return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'percent': return `${(value * 100).toFixed(1)}%`;
      case 'number': return value.toLocaleString('en-US');
      default: return String(value);
    }
  }
  return String(value);
}

/** Detect numeric string and convert */
export function coerceValue(value: string): CellValue {
  if (value === '' || value === null) return null;
  if (value === 'TRUE') return true;
  if (value === 'FALSE') return false;
  const num = Number(value);
  if (!isNaN(num) && value.trim() !== '') return num;
  return value;
}
