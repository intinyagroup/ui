// ============================================
// Undo/Redo — cell-level undo stack
// ============================================

import type { CellMap } from './cell-model.js';

export type UndoEntry = {
  sheetId: string;
  cellsSnapshot: CellMap;
  timestamp: number;
};

export type UndoRedoState = {
  undoStack: UndoEntry[];
  redoStack: UndoEntry[];
  maxSize: number;
};

export function createUndoRedoState(maxSize = 100): UndoRedoState {
  return { undoStack: [], redoStack: [], maxSize };
}

export function pushUndo(state: UndoRedoState, entry: Omit<UndoEntry, 'timestamp'>): UndoRedoState {
  const newStack = [...state.undoStack, { ...entry, timestamp: Date.now() }];
  if (newStack.length > state.maxSize) newStack.shift();
  return { ...state, undoStack: newStack, redoStack: [] };
}

export function undo(state: UndoRedoState): { state: UndoRedoState; entry: UndoEntry | null } {
  if (!state.undoStack.length) return { state, entry: null };
  const stack = [...state.undoStack];
  const entry = stack.pop()!;
  return {
    state: { ...state, undoStack: stack, redoStack: [...state.redoStack, entry] },
    entry,
  };
}

export function redo(state: UndoRedoState): { state: UndoRedoState; entry: UndoEntry | null } {
  if (!state.redoStack.length) return { state, entry: null };
  const stack = [...state.redoStack];
  const entry = stack.pop()!;
  return {
    state: { ...state, redoStack: stack, undoStack: [...state.undoStack, entry] },
    entry,
  };
}
