import {
  constructTable,
  tableFeatures,
  createCoreRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createGroupedRowModel,
  createExpandedRowModel,
  createFacetedRowModel,
  createFacetedUniqueValues,
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  columnPinningFeature,
  columnOrderingFeature,
  columnGroupingFeature,
  columnVisibilityFeature,
  columnResizingFeature,
  columnSizingFeature,
  rowExpandingFeature,
  columnFacetingFeature,
  globalFilteringFeature,
  rowSelectionFeature,
  type ColumnDef,
  type Table,
  type PaginationState,
  type SortingState,
  type ColumnVisibilityState,
  type RowSelectionState,
  type ColumnFiltersState,
  type ColumnPinningState,
  type ColumnOrderState,
  type ExpandedState,
  type GroupingState,
  type ColumnSizingState,
  type OnChangeFn,
} from "@tanstack/table-core";
import { storeReactivityBindings } from "@tanstack/table-core/store-reactivity-bindings";

export type CoreTableState = {
  sorting: SortingState;
  pagination: PaginationState;
  globalFilter: string;
  columnFilters: ColumnFiltersState;
  columnVisibility: ColumnVisibilityState;
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
  align?: "left" | "right" | "center";
  filterType?: "text" | "number" | "select" | "date";
  filterOptions?: string[];
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  aggregate?: (values: unknown[]) => unknown;
  formatValue?: (value: unknown) => string;
};

/** Feature + row-model registry shared by every grid in the workspace. */
export const coreFeatures = tableFeatures({
  coreReactivityFeature: storeReactivityBindings(),
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  columnPinningFeature,
  columnOrderingFeature,
  columnGroupingFeature,
  columnVisibilityFeature,
  columnResizingFeature,
  columnSizingFeature,
  rowExpandingFeature,
  columnFacetingFeature,
  globalFilteringFeature,
  rowSelectionFeature,
  coreRowModel: createCoreRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  groupedRowModel: createGroupedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
});

/** v9 transient resize state; replaces v8 `ColumnSizingInfoState`. */
export type DataTableColumnSizingInfo = {
  columnSizingStart: Array<[string, number]>;
  deltaOffset: number | null;
  deltaPercentage: number | null;
  isResizingColumn: string | false;
  startOffset: number | null;
  startSize: number | null;
};

/**
 * Creates a TanStack Table v9 instance.
 *
 * v9 has no aggregate `onStateChange`. Controlled callers own each state slice
 * and pass matching `on[State]Change` callbacks. Vanilla store reactivity is
 * used here because this factory is also consumed by non-table Svelte helpers.
 */
export function createCoreTableModel<TData>(input: {
  data: TData[];
  columns: ColumnDef<typeof coreFeatures, TData, unknown>[];
  state?: Partial<CoreTableState>;
  onSortingChange?: OnChangeFn<SortingState>;
  onPaginationChange?: OnChangeFn<PaginationState>;
  onGlobalFilterChange?: OnChangeFn<string>;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  onColumnVisibilityChange?: OnChangeFn<ColumnVisibilityState>;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onColumnPinningChange?: OnChangeFn<ColumnPinningState>;
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>;
  onGroupingChange?: OnChangeFn<GroupingState>;
  onExpandedChange?: OnChangeFn<ExpandedState>;
  onColumnSizingChange?: OnChangeFn<ColumnSizingState>;
  serverSide?: ServerSideConfig;
  meta?: Record<string, unknown>;
  enableResizing?: boolean;
}): Table<typeof coreFeatures, TData> {
  const state: CoreTableState = {
    sorting: input.state?.sorting ?? [],
    pagination: input.state?.pagination ?? { pageIndex: 0, pageSize: 20 },
    globalFilter: input.state?.globalFilter ?? "",
    columnFilters: input.state?.columnFilters ?? [],
    columnVisibility: input.state?.columnVisibility ?? {},
    rowSelection: input.state?.rowSelection ?? {},
    columnPinning: input.state?.columnPinning ?? { start: [], end: [] },
    columnOrder:
      input.state?.columnOrder ?? input.columns.map((_, i) => String(i)),
    grouping: input.state?.grouping ?? [],
    expanded: input.state?.expanded ?? {},
    columnSizing: input.state?.columnSizing ?? {},
  };
  const serverSide = input.serverSide;
  const resizing = input.enableResizing ?? false;
  const columns = resizing
    ? input.columns
    : input.columns.map((column) => ({ ...column, enableResizing: false }));

  return constructTable({
    features: coreFeatures,
    data: input.data,
    columns,
    state,
    rowCount: serverSide?.rowCount,
    manualPagination: serverSide?.manualPagination,
    manualSorting: serverSide?.manualSorting,
    manualFiltering: serverSide?.manualFiltering,
    manualGrouping: serverSide?.manualGrouping,
    manualExpanding: serverSide?.manualExpanding,
    onSortingChange: input.onSortingChange,
    onPaginationChange: input.onPaginationChange,
    onGlobalFilterChange: input.onGlobalFilterChange,
    onColumnFiltersChange: input.onColumnFiltersChange,
    onColumnVisibilityChange: input.onColumnVisibilityChange,
    onRowSelectionChange: input.onRowSelectionChange,
    onColumnPinningChange: input.onColumnPinningChange,
    onColumnOrderChange: input.onColumnOrderChange,
    onGroupingChange: input.onGroupingChange,
    onExpandedChange: input.onExpandedChange,
    onColumnSizingChange: input.onColumnSizingChange,
    columnResizeMode: "onChange",
    enableMultiSort: true,
    enableSortingRemoval: true,
    enableColumnResizing: resizing,
    renderFallbackValue: null,
    meta: input.meta,
  });
}

export function getColumnSizing<TData>(
  table: Table<typeof coreFeatures, TData>,
) {
  return table.store.state.columnSizing;
}

export function getColumnResizing<TData>(
  table: Table<typeof coreFeatures, TData>,
) {
  return table.store.state.columnResizing;
}
