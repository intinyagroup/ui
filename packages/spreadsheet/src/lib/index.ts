// ============================================
// @intinyagroup/spreadsheet — Excel-like Grid
// ============================================

// Main component
export { default as Spreadsheet } from './components/Spreadsheet.svelte';

// Sub-components
export { default as CellGrid } from './components/CellGrid.svelte';
export { default as CellEditor } from './components/CellEditor.svelte';
export { default as FormulaBar } from './components/FormulaBar.svelte';
export { default as SheetTabs } from './components/SheetTabs.svelte';

// Data model
export { createCell, createCellMap, getCellValue, setCellValue, setCellStyle, formatCellDisplay, coerceValue, type Cell, type CellMap, type CellValue, type CellStyle } from './cell-model.js';

// Cell utilities
export { colIndexToLabel, colLabelToIndex, getCellId, parseCellId, clamp, defaultColumns, defaultRows } from './cell-utils.js';

// Selection
export { createSelectionState, normalizeRange, isCellInRange, isCellInRanges, isCellActive, getRangeSize, getCellsInRange, type CellRange, type SelectionState } from './selection-store.js';

// Sheet store
export { createSheet, createWorkbookState, getActiveSheet, addSheet, removeSheet, renameSheet, setActiveSheet, type Sheet, type WorkbookState } from './sheet-store.js';

// Undo/Redo
export { createUndoRedoState, pushUndo, undo, redo, type UndoRedoState, type UndoEntry } from './undo-redo.js';
