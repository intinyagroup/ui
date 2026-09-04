export { default as DataTable } from './DataTable.svelte';

export const summaryPresets: Record<string, (values: unknown[]) => unknown> = {
  count: (values: unknown[]) => values.length,
  sum: (values: unknown[]) => values.reduce((a: number, b: unknown) => a + Number(b), 0),
  avg: (values: unknown[]) => values.length ? values.reduce((a: number, b: unknown) => a + Number(b), 0) / values.length : 0,
  min: (values: unknown[]) => Math.min(...values.map(Number)),
  max: (values: unknown[]) => Math.max(...values.map(Number)),
};

export type { ColumnDef, ColumnFiltersState, SortingState, PaginationState, RowSelectionState, ColumnPinningState, ColumnOrderState, ExpandedState, GroupingState } from '@tanstack/table-core';
export type { DataTableMeta } from '@intinyagroup/grid-core';
