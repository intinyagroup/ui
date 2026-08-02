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

export type ServerSideConfig = {
  /** Total row count from server (required for server-side pagination) */
  rowCount: number;
  /** Disable client-side pagination (use server pagination) */
  manualPagination?: boolean;
  /** Disable client-side sorting (use server sorting) */
  manualSorting?: boolean;
  /** Disable client-side filtering (use server filtering) */
  manualFiltering?: boolean;
};

export function createCoreTableModel<TData>(input: {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  state?: Partial<CoreTableState>;
  serverSide?: ServerSideConfig;
}) {
  const state: CoreTableState = {
    sorting: input.state?.sorting ?? [],
    pagination: input.state?.pagination ?? { pageIndex: 0, pageSize: 20 },
    globalFilter: input.state?.globalFilter ?? '',
    columnFilters: input.state?.columnFilters ?? [],
    columnVisibility: input.state?.columnVisibility ?? {},
    rowSelection: input.state?.rowSelection ?? {},
  };

  const serverSide = input.serverSide;

  return createTable<TData>({
    data: input.data,
    columns: input.columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: serverSide?.manualPagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: serverSide?.manualSorting ? undefined : getSortedRowModel(),
    getFilteredRowModel: serverSide?.manualFiltering ? undefined : getFilteredRowModel(),
    pageCount: serverSide?.manualPagination ? Math.ceil(serverSide.rowCount / (state.pagination.pageSize || 10)) : undefined,
    state,
    onStateChange: () => {},
    renderFallbackValue: null,
  });
}
