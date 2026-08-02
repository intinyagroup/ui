import {
  createTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
  type ColumnFiltersState,
  type ColumnPinningState,
  type ColumnOrderState,
  type ExpandedState,
  type GroupingState,
  type ColumnSizingState,
} from '@tanstack/table-core';

export type CoreTableState = {
  sorting: SortingState;
  pagination: PaginationState;
  globalFilter: string;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
  columnPinning: ColumnPinningState;
  columnOrder: ColumnOrderState;
  grouping: GroupingState;
  expanded: ExpandedState;
  columnSizing: ColumnSizingState;
};

export type ServerSideConfig = {
  rowCount: number;
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  manualGrouping?: boolean;
  manualExpanding?: boolean;
};

export type DataTableMeta<TData> = {
  editable?: boolean;
  align?: 'left' | 'right' | 'center';
  filterType?: 'text' | 'number' | 'select' | 'date';
  filterOptions?: string[];
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  aggregate?: (values: unknown[]) => unknown;
  formatValue?: (value: unknown) => string;
};

export function createCoreTableModel<TData>(input: {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  state?: Partial<CoreTableState>;
  serverSide?: ServerSideConfig;
  meta?: Record<string, unknown>;
}) {
  const state: CoreTableState = {
    sorting: input.state?.sorting ?? [],
    pagination: input.state?.pagination ?? { pageIndex: 0, pageSize: 20 },
    globalFilter: input.state?.globalFilter ?? '',
    columnFilters: input.state?.columnFilters ?? [],
    columnVisibility: input.state?.columnVisibility ?? {},
    rowSelection: input.state?.rowSelection ?? {},
    columnPinning: input.state?.columnPinning ?? { left: [], right: [] },
    columnOrder: input.state?.columnOrder ?? input.columns.map((_, i) => String(i)),
    grouping: input.state?.grouping ?? [],
    expanded: input.state?.expanded ?? {},
    columnSizing: input.state?.columnSizing ?? {},
  };

  const serverSide = input.serverSide;

  return createTable<TData>({
    data: input.data,
    columns: input.columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: serverSide?.manualPagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: serverSide?.manualSorting ? undefined : getSortedRowModel(),
    getFilteredRowModel: serverSide?.manualFiltering ? undefined : getFilteredRowModel(),
    getGroupedRowModel: serverSide?.manualGrouping ? undefined : getGroupedRowModel(),
    getExpandedRowModel: serverSide?.manualExpanding ? undefined : getExpandedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    pageCount: serverSide?.manualPagination
      ? Math.ceil(serverSide.rowCount / (state.pagination.pageSize || 10))
      : undefined,
    columnResizeMode: 'onChange',
    enableMultiSort: true,
    enableSortingRemoval: true,
    state,
    onStateChange: () => {},
    renderFallbackValue: null,
    meta: input.meta,
  });
}
