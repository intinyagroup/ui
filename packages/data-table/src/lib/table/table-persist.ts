import type { ColumnPinningState, ColumnVisibilityState, ColumnOrderState, SortingState, ColumnSizingState } from '@tanstack/table-core';

export type PersistedTableSettings = {
  columnVisibility: ColumnVisibilityState;
  columnPinning: ColumnPinningState;
  columnOrder: ColumnOrderState;
  columnSizing: ColumnSizingState;
  sorting: SortingState;
  density: 'compact' | 'spacious';
  pageSize: number;
};

const STORAGE_PREFIX = 'uitable:';

export function getTableSettings(tableId: string): Partial<PersistedTableSettings> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${tableId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveTableSettings(tableId: string, settings: Partial<PersistedTableSettings>): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getTableSettings(tableId) ?? {};
    const merged = { ...existing, ...settings };
    localStorage.setItem(`${STORAGE_PREFIX}${tableId}`, JSON.stringify(merged));
  } catch {
    // localStorage full or disabled
  }
}

export function clearTableSettings(tableId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${tableId}`);
  } catch {
    // ignore
  }
}
