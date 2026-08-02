// ============================================
// @intinyagroup/pdf-viewer — Adobe Acrobat Level PDF Viewer
// ============================================

// Main component
export { default as PDFViewer } from './components/PDFViewer.svelte';

// Sub-components
export { default as PDFPage } from './components/PDFPage.svelte';
export { default as PDFToolbar } from './components/PDFToolbar.svelte';
export { default as AnnotationSidebar } from './components/AnnotationSidebar.svelte';
export { default as BookmarkTree } from './components/BookmarkTree.svelte';
export { default as ThumbnailSidebar } from './components/ThumbnailSidebar.svelte';
export { default as FormFieldRenderer } from './components/FormFieldRenderer.svelte';
export { default as SearchPanel } from './components/SearchPanel.svelte';
export { default as PageManipulationPanel } from './components/PageManipulationPanel.svelte';
export { default as WatermarkPanel } from './components/WatermarkPanel.svelte';

// Core utilities & types
export {
  initPdfWorker,
  pdfjsLib,
  defaultStamps,
  type PDFPageInfo,
  type PDFDocumentInfo,
  type TextItem,
  type AnnotationType,
  type Annotation,
  type AnnotationTool,
  type AnnotationColor,
  type StampTemplate,
  type FormFieldType,
  type FormField,
  type Bookmark,
  type PageOperation,
  type PageThumbnail,
  type SearchResult,
  type SearchState,
  type ExportFormat,
  type ExportOptions,
  type ViewMode,
  type ZoomMode,
} from './pdf-core.js';
