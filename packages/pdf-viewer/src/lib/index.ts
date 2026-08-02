// ============================================
// @intinyagroup/pdf-viewer — PDF Viewer + Annotations
// ============================================

// Main component
export { default as PDFViewer } from './components/PDFViewer.svelte';

// Sub-components
export { default as PDFPage } from './components/PDFPage.svelte';
export { default as PDFToolbar } from './components/PDFToolbar.svelte';
export { default as AnnotationSidebar } from './components/AnnotationSidebar.svelte';

// Core utilities
export {
  initPdfWorker,
  pdfjsLib,
  type PDFPageInfo,
  type PDFDocumentInfo,
  type TextItem,
  type AnnotationType,
  type Annotation,
  type FormField,
} from './pdf-core.js';
