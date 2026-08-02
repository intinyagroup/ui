import {
  createTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
  type ColumnFiltersState,
} from '@tanstack/table-core';

export type CoreTableState = {
  sorting: SortingState;
  pagination: PaginationState;
  globalFilter: string;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
};

export function createCoreTableModel<TData>(input: {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  state?: Partial<CoreTableState>;
}) {
  const state: CoreTableState = {
    sorting: input.state?.sorting ?? [],
    pagination: input.state?.pagination ?? { pageIndex: 0, pageSize: 20 },
    globalFilter: input.state?.globalFilter ?? '',
    columnFilters: input.state?.columnFilters ?? [],
    columnVisibility: input.state?.columnVisibility ?? {},
    rowSelection: input.state?.rowSelection ?? {},
  };

  return createTable<TData>({
    data: input.data,
    columns: input.columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state,
    onStateChange: () => {},
    renderFallbackValue: null,
  });
}
