// ============================================
// @intinyagroup/grid-core — Shared Grid Infrastructure
// ============================================

// Table engine (TanStack wrapper)
export {
  createCoreTableModel,
  coreFeatures,
  getColumnSizing,
  getColumnResizing,
  type CoreTableState,
  type ServerSideConfig,
  type DataTableMeta,
  type DataTableColumnSizingInfo,
} from "./table-core.js";

// Pagination
export {
  resolvePagination,
  getPageCount,
  getVisibleRowRange,
  normalizePageSize,
  DEFAULT_PAGE_SIZE_OPTIONS,
} from "./table-pagination.js";

// Keyboard navigation
export {
  createKeyboardNavigation,
  type FocusedCell,
} from "./table-keyboard.js";

// Clipboard
export { createClipboard } from "./table-clipboard.js";

// Persistence
export {
  getTableSettings,
  saveTableSettings,
  clearTableSettings,
} from "./table-persist.js";

// Utilities
export {
  cn,
  formatBytes,
  formatDate,
  formatRelativeDate,
  getFileExtension,
  isImageFile,
  isTextFile,
} from "./utils.js";

// Filter AST & Query Builder Engine
export {
  createFilterGroup,
  createFilterRule,
  isFilterGroup,
  getOperatorsForType,
  evaluateFilterRule,
  evaluateFilterGroup,
  filterGroupToPredicate,
  filterGroupToSQL,
  filterGroupToJSON,
  filterGroupFromJSON,
  addRuleToGroup,
  removeRuleFromGroup,
  updateRuleInGroup,
  updateGroupInGroup,
  type FilterCondition,
  type FilterOperator,
  type FilterRule,
  type FilterGroup,
  type FilterField,
} from "./filter-ast.js";

// Tree Data Model & Utilities
export {
  flatToTree,
  treeToFlat,
  filterTree,
  sortTree,
  cascadeSelect,
  type TreeNodeData,
  type TreeNode,
  type FlatTreeRow,
} from "./tree-model.js";
