// ============================================
// @intinyagroup/data-table — Enterprise Data Grid
// ============================================

// Components
export { default as DataTable } from "./components/data-table/DataTable.svelte";
export { default as DataTableHeader } from "./components/data-table/_components/DataTableHeader.svelte";
export { default as DataTableRow } from "./components/data-table/_components/DataTableRow.svelte";
export { default as DataTablePagination } from "./components/data-table/_components/DataTablePagination.svelte";
export { default as DataTableFilter } from "./components/data-table/_components/DataTableFilter.svelte";
export { default as DataTableGroupBar } from "./components/data-table/_components/DataTableGroupBar.svelte";
export { default as DataTableStatusBar } from "./components/data-table/_components/DataTableStatusBar.svelte";
export { default as DataTableDetailRow } from "./components/data-table/_components/DataTableDetailRow.svelte";
export { default as DataTableCellEdit } from "./components/data-table/_components/DataTableCellEdit.svelte";
export { default as QueryBuilder } from "./components/query-builder/QueryBuilder.svelte";
export {
  default as TreeGrid,
  type TreeGridColumn,
} from "./components/tree-grid/TreeGrid.svelte";

// Re-export grid-core infrastructure for convenience
export {
  createCoreTableModel,
  resolvePagination,
  getPageCount,
  getVisibleRowRange,
  normalizePageSize,
  DEFAULT_PAGE_SIZE_OPTIONS,
  createKeyboardNavigation,
  createClipboard,
  getTableSettings,
  saveTableSettings,
  clearTableSettings,
  createFilterGroup,
  createFilterRule,
  isFilterGroup,
  evaluateFilterRule,
  evaluateFilterGroup,
  filterGroupToPredicate,
  filterGroupToSQL,
  filterGroupToJSON,
  filterGroupFromJSON,
  flatToTree,
  treeToFlat,
  filterTree,
  sortTree,
  cascadeSelect,
} from "@intinyagroup/grid-core";

export { summaryPresets } from "./components/data-table/index.js";

export type {
  CoreTableState,
  ServerSideConfig,
  DataTableMeta,
  FocusedCell,
  FilterCondition,
  FilterOperator,
  FilterRule,
  FilterGroup,
  FilterField,
  TreeNodeData,
  TreeNode,
  FlatTreeRow,
} from "@intinyagroup/grid-core";

export type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  PaginationState,
  RowSelectionState,
  ColumnPinningState,
  ColumnOrderState,
  ExpandedState,
  GroupingState,
} from "@tanstack/table-core";
