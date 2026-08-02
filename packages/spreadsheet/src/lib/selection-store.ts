// ============================================
// Selection store — active cell, range selection
// ============================================

export type CellRange = {
  start: { row: number; col: number };
  end: { row: number; col: number };
};

export type SelectionState = {
  active: { row: number; col: number };
  ranges: CellRange[];
  isSelecting: boolean;
  anchor: { row: number; col: number } | null;
};

export function createSelectionState(initialRow = 0, initialCol = 0): SelectionState {
  return {
    active: { row: initialRow, col: initialCol },
    ranges: [],
    isSelecting: false,
    anchor: null,
  };
}

export function normalizeRange(range: CellRange): CellRange {
  return {
    start: {
      row: Math.min(range.start.row, range.end.row),
      col: Math.min(range.start.col, range.end.col),
    },
    end: {
      row: Math.max(range.start.row, range.end.row),
      col: Math.max(range.start.col, range.end.col),
    },
  };
}

export function isCellInRange(row: number, col: number, range: CellRange): boolean {
  const normalized = normalizeRange(range);
  return (
    row >= normalized.start.row &&
    row <= normalized.end.row &&
    col >= normalized.start.col &&
    col <= normalized.end.col
  );
}

export function isCellInRanges(row: number, col: number, ranges: CellRange[]): boolean {
  return ranges.some((range) => isCellInRange(row, col, range));
}

export function isCellActive(row: number, col: number, active: { row: number; col: number }): boolean {
  return row === active.row && col === active.col;
}

export function getRangeSize(range: CellRange): { rows: number; cols: number } {
  const normalized = normalizeRange(range);
  return {
    rows: normalized.end.row - normalized.start.row + 1,
    cols: normalized.end.col - normalized.start.col + 1,
  };
}

export function getCellsInRange(range: CellRange): { row: number; col: number }[] {
  const normalized = normalizeRange(range);
  const cells: { row: number; col: number }[] = [];
  for (let r = normalized.start.row; r <= normalized.end.row; r++) {
    for (let c = normalized.start.col; c <= normalized.end.col; c++) {
      cells.push({ row: r, col: c });
    }
  }
  return cells;
}
