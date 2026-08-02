// ============================================
// Cell utilities — column/row label conversion
// ============================================

/** Convert column index (0-based) to letter label: 0→A, 1→B, ..., 25→Z, 26→AA */
export function colIndexToLabel(index: number): string {
  let label = '';
  let i = index;
  while (i >= 0) {
    label = String.fromCharCode(65 + (i % 26)) + label;
    i = Math.floor(i / 26) - 1;
  }
  return label;
}

/** Convert column letter label to index: A→0, B→1, ..., Z→25, AA→26 */
export function colLabelToIndex(label: string): number {
  let index = 0;
  for (let i = 0; i < label.length; i++) {
    index = index * 26 + (label.charCodeAt(i) - 64);
  }
  return index - 1;
}

/** Get cell ID from row/col indices: (0,0) → "A1" */
export function getCellId(row: number, col: number): string {
  return `${colIndexToLabel(col)}${row + 1}`;
}

/** Parse cell ID to row/col indices: "B3" → (2, 1) */
export function parseCellId(cellId: string): { row: number; col: number } {
  const match = cellId.match(/^([A-Z]+)(\d+)$/);
  if (!match) return { row: 0, col: 0 };
  return {
    row: parseInt(match[2], 10) - 1,
    col: colLabelToIndex(match[1]),
  };
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Generate default column count (26 = A-Z) */
export function defaultColumns(count = 26): string[] {
  return Array.from({ length: count }, (_, i) => colIndexToLabel(i));
}

/** Generate default row count */
export function defaultRows(count = 100): number[] {
  return Array.from({ length: count }, (_, i) => i + 1);
}
