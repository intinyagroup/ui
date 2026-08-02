// ============================================
// Sheet store — multi-sheet state management
// ============================================

import { writable, derived, get } from 'svelte/store';
import { createCellMap, type CellMap, type CellValue, type CellStyle } from './cell-model.js';
import { createSelectionState, type SelectionState } from './selection-store.js';

export type Sheet = {
  id: string;
  name: string;
  cells: CellMap;
  selection: SelectionState;
  columnWidths: Map<number, number>;
  rowHeights: Map<number, number>;
  frozenRows: number;
  frozenCols: number;
};

export type WorkbookState = {
  sheets: Sheet[];
  activeSheetId: string;
};

let sheetCounter = 0;

export function createSheet(name?: string): Sheet {
  const id = `sheet-${++sheetCounter}`;
  return {
    id,
    name: name ?? `Sheet ${sheetCounter}`,
    cells: createCellMap(),
    selection: createSelectionState(),
    columnWidths: new Map(),
    rowHeights: new Map(),
    frozenRows: 0,
    frozenCols: 0,
  };
}

export function createWorkbookState(sheetCount = 1): WorkbookState {
  const sheets = Array.from({ length: sheetCount }, (_, i) => createSheet());
  return {
    sheets,
    activeSheetId: sheets[0].id,
  };
}

export type UndoEntry = {
  sheetId: string;
  cells: CellMap;
  description: string;
};

export function getActiveSheet(state: WorkbookState): Sheet | undefined {
  return state.sheets.find((s) => s.id === state.activeSheetId);
}

export function getActiveSheetIndex(state: WorkbookState): number {
  return state.sheets.findIndex((s) => s.id === state.activeSheetId);
}

export function addSheet(state: WorkbookState, name?: string): WorkbookState {
  const sheet = createSheet(name);
  return {
    sheets: [...state.sheets, sheet],
    activeSheetId: sheet.id,
  };
}

export function removeSheet(state: WorkbookState, sheetId: string): WorkbookState {
  if (state.sheets.length <= 1) return state;
  const filtered = state.sheets.filter((s) => s.id !== sheetId);
  const nextActiveId = state.activeSheetId === sheetId
    ? filtered[0].id
    : state.activeSheetId;
  return { sheets: filtered, activeSheetId: nextActiveId };
}

export function renameSheet(state: WorkbookState, sheetId: string, name: string): WorkbookState {
  return {
    ...state,
    sheets: state.sheets.map((s) => s.id === sheetId ? { ...s, name } : s),
  };
}

export function setActiveSheet(state: WorkbookState, sheetId: string): WorkbookState {
  return { ...state, activeSheetId: sheetId };
}
