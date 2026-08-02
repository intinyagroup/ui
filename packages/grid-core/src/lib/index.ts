// ============================================
// @intinyagroup/grid-core — Shared Grid Infrastructure
// ============================================

// Table engine (TanStack wrapper)
export { createCoreTableModel, type CoreTableState, type ServerSideConfig, type DataTableMeta } from './table-core.js';

// Pagination
export { resolvePagination, getPageCount, getVisibleRowRange, normalizePageSize, DEFAULT_PAGE_SIZE_OPTIONS } from './table-pagination.js';

// Keyboard navigation
export { createKeyboardNavigation, type FocusedCell } from './table-keyboard.js';

// Clipboard
export { createClipboard } from './table-clipboard.js';

// Persistence
export { getTableSettings, saveTableSettings, clearTableSettings } from './table-persist.js';

// Utilities
export { cn, formatBytes, formatDate, formatRelativeDate, getFileExtension, isImageFile, isTextFile } from './utils.js';
