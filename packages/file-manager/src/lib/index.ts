// ============================================
// @intinyagroup/file-manager — Enterprise File Manager
// ============================================

export { default as FileManager } from "./components/FileManager.svelte";
export { default as FolderTree } from "./components/FolderTree.svelte";
export { default as FileManagerToolbar } from "./components/FileManagerToolbar.svelte";
export { default as FileViewGrid } from "./components/FileViewGrid.svelte";
export { default as FileViewList } from "./components/FileViewList.svelte";
export { default as FilePreviewModal } from "./components/FilePreviewModal.svelte";
export { default as FileIcon } from "./components/FileIcon.svelte";

export {
  formatFileSize,
  getFileExtension,
  getFileCategory,
  buildBreadcrumbs,
  getChildrenInFolder,
  sortFileItems,
  filterFileItems,
  type FileItem,
  type FilePermissions,
  type ViewMode,
  type SortField,
  type SortDirection,
  type SortConfig,
  type BreadcrumbItem,
  type FileCategory,
  type UploadItem,
} from "./file-model.js";
