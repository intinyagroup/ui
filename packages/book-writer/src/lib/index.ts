// ============================================
// @intinyagroup/book-writer — Book Writing & Export
// ============================================

// Main component
export { default as BookWriter } from './components/BookWriter.svelte';

// Sub-components
export { default as BookSidebar } from './components/BookSidebar.svelte';
export { default as ChapterEditor } from './components/ChapterEditor.svelte';
export { default as BookPreview } from './components/BookPreview.svelte';
export { default as BookSettings } from './components/BookSettings.svelte';
export { default as ExportDialog } from './components/ExportDialog.svelte';
export { default as ImageUploader } from './components/ImageUploader.svelte';

// Data model & utilities
export {
  createChapter,
  createDefaultSettings,
  reorderChapters,
  getChapterWordCount,
  getTotalWordCount,
  getEstimatedPages,
  pageSizes,
  fontOptions,
  type Chapter,
  type BookMetadata,
  type BookLayout,
  type BookSettings,
} from './book-model.js';

// Pagination engine
export {
  paginateContent,
  paginateContentEstimate,
  type PaginatedPage,
  type PaginationResult,
} from './pagination-engine.js';

// Markdown utilities
export {
  htmlToMarkdown,
  markdownToHtml,
  exportToMarkdown,
  downloadAsFile,
  downloadBlob,
} from './markdown-utils.js';

// EPUB utilities
export { exportToEpub } from './epub-utils.js';

// Footnote utilities
export {
  extractFootnotes,
  insertFootnoteMarker,
  addFootnoteDefinition,
  renderFootnotesSection,
  getNextFootnoteNumber,
  type Footnote,
} from './footnote-utils.js';

// Image utilities
export {
  fetchImageAsBytes,
  getImageType,
  resizeImage,
  dataUrlToBytes,
  extractImageUrls,
} from './image-utils.js';

// Cross-reference utilities
export {
  resolveCrossRef,
  insertCrossRef,
  extractCrossRefs,
  renderCrossRefs,
  generateChapterAnchor,
  getCrossRefOptions,
  type CrossRef,
  type CrossRefType,
} from './crossref-utils.js';

// Math utilities
export {
  renderMath,
  loadKaTeX,
  hasMath,
  extractMath,
  processInlineMath,
  processDisplayMath,
  mathTemplates,
} from './math-utils.js';
