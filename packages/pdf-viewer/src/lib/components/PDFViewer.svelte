<script lang="ts">
  import { onMount } from 'svelte';
  import { initPdfWorker, pdfjsLib, type Annotation, type AnnotationTool, type FormField, type Bookmark, type SearchResult, type SearchState, type PageOperation, type ViewMode, type ZoomMode, defaultStamps } from '../pdf-core.js';
  import type { PDFDocumentProxy } from 'pdfjs-dist';
  import PDFToolbar from './PDFToolbar.svelte';
  import PDFPage from './PDFPage.svelte';
  import AnnotationSidebar from './AnnotationSidebar.svelte';
  import BookmarkTree from './BookmarkTree.svelte';
  import ThumbnailSidebar from './ThumbnailSidebar.svelte';
  import FormFieldRenderer from './FormFieldRenderer.svelte';
  import SearchPanel from './SearchPanel.svelte';
  import PageManipulationPanel from './PageManipulationPanel.svelte';

  let {
    src,
    class: className,
    onLoad,
    onAnnotationChange,
    onFormFieldChange,
    onPageManipulation,
    onExport,
  }: {
    src: string | ArrayBuffer;
    class?: string;
    onLoad?: (info: { pageCount: number; title: string }) => void;
    onAnnotationChange?: (annotations: Annotation[]) => void;
    onFormFieldChange?: (fieldId: string, value: string | boolean) => void;
    onPageManipulation?: (operations: PageOperation[]) => void;
    onExport?: (format: string, options: any) => void;
  } = $props();

  // Core state
  let pdf = $state<PDFDocumentProxy | null>(null);
  let currentPage = $state(1);
  let totalPages = $state(0);
  let scale = $state(1.5);
  let rotation = $state(0);
  let viewMode = $state<ViewMode>('continuous');
  let zoomMode = $state<ZoomMode>('custom');
  let loading = $state(true);
  let error = $state('');

  // Tools & annotations
  let tool = $state<AnnotationTool>('select');
  let annotations = $state<Annotation[]>([]);
  let selectedAnnotationId = $state<string | undefined>();
  let selectedAnnotationColor = $state('#ffeb3b');
  let selectedPages = $state<Set<number>>(new Set());

  // Form fields
  let formFields = $state<FormField[]>([]);

  // Bookmarks
  let bookmarks = $state<Bookmark[]>([]);

  // Sidebar state
  let sidebarMode = $state<'thumbnails' | 'bookmarks' | 'annotations' | 'pages'>('thumbnails');
  let showSidebar = $state(true);
  let showSearch = $state(false);

  // Search
  let searchState = $state<SearchState>({
    query: '',
    results: [],
    currentResult: 0,
    totalResults: 0,
    caseSensitive: false,
    wholeWord: false,
    regex: false,
  });

  // Page manipulation
  let showPageManipulation = $state(false);

  onMount(async () => {
    initPdfWorker();
    await loadDocument(src);
  });

  async function loadDocument(source: string | ArrayBuffer) {
    loading = true;
    error = '';
    try {
      const loadingTask = pdfjsLib.getDocument(
        typeof source === 'string' ? source : { data: source }
      );
      pdf = await loadingTask.promise;
      totalPages = pdf.numPages;

      // Load bookmarks
      try {
        const outline = await pdf.getOutline();
        if (outline) {
          bookmarks = outline.map((item) => ({
            title: item.title,
            pageNumber: 1,
            children: item.dest ? [] : undefined,
          }));
        }
      } catch {
        bookmarks = [];
      }

      onLoad?.({
        pageCount: totalPages,
        title: 'Document',
      });
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load PDF';
    } finally {
      loading = false;
    }
  }

  // Navigation
  function prevPage() { if (currentPage > 1) currentPage--; }
  function nextPage() { if (currentPage < totalPages) currentPage++; }
  function goToPage(page: number) { currentPage = Math.max(1, Math.min(page, totalPages)); }
  function zoomIn() { scale = Math.min(scale + 0.25, 5); zoomMode = 'custom'; }
  function zoomOut() { scale = Math.max(scale - 0.25, 0.25); zoomMode = 'custom'; }
  function zoomReset() { scale = 1.5; zoomMode = 'custom'; }
  function zoomFitWidth() { zoomMode = 'fit-width'; }
  function zoomFitHeight() { zoomMode = 'fit-height'; }
  function zoomFitPage() { zoomMode = 'fit-page'; }
  function zoomActualSize() { scale = 1; zoomMode = 'actual-size'; }
  function rotate() { rotation = (rotation + 90) % 360; }

  // Annotations
  function handleTextSelect(text: string, rects: { x: number; y: number; width: number; height: number }[]) {
    if (['highlight', 'underline', 'strikethrough', 'squiggly'].includes(tool)) {
      const annotation: Annotation = {
        id: `ann-${Date.now()}`,
        pageNumber: currentPage,
        type: tool as any,
        color: selectedAnnotationColor,
        opacity: tool === 'highlight' ? 0.4 : 1,
        strokeWidth: 2,
        rects,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      annotations = [...annotations, annotation];
      onAnnotationChange?.(annotations);
    }
  }

  function handleAnnotationCreate(newAnnotation: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt'>) {
    const annotation: Annotation = {
      ...newAnnotation,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    annotations = [...annotations, annotation];
    onAnnotationChange?.(annotations);
  }

  function handleAnnotationClick(annotation: Annotation) {
    selectedAnnotationId = annotation.id;
    currentPage = annotation.pageNumber;
  }

  function deleteAnnotation(id: string) {
    annotations = annotations.filter((a) => a.id !== id);
    if (selectedAnnotationId === id) selectedAnnotationId = undefined;
    onAnnotationChange?.(annotations);
  }

  function deleteSelectedAnnotation() {
    if (selectedAnnotationId) deleteAnnotation(selectedAnnotationId);
  }

  // Form fields
  function handleFormFieldChange(fieldId: string, value: string | boolean) {
    formFields = formFields.map((f) =>
      f.id === fieldId ? { ...f, value: String(value) } : f
    );
    onFormFieldChange?.(fieldId, value);
  }

  // Page selection
  function togglePageSelection(page: number) {
    const next = new Set(selectedPages);
    if (next.has(page)) next.delete(page); else next.add(page);
    selectedPages = next;
  }

  function selectAllPages() {
    selectedPages = new Set(Array.from({ length: totalPages }, (_, i) => i + 1));
  }

  function deselectAllPages() {
    selectedPages = new Set();
  }

  function handlePageOperation(op: PageOperation) {
    onPageManipulation?.([op]);
  }

  // Search
  function handleSearch(query: string, options: { caseSensitive: boolean; wholeWord: boolean; regex: boolean }) {
    searchState = { ...searchState, query, ...options };
    // PDF.js text search would be implemented here
    // For now, mock results
    searchState = { ...searchState, totalResults: 0, results: [], currentResult: 0 };
  }

  function handleSearchResultClick(result: SearchResult) {
    currentPage = result.pageNumber;
  }

  // Export
  function handleDownload() {
    onExport?.('download', { format: 'pdf' });
  }

  function handlePrint() {
    onExport?.('print', {});
  }

  function toggleSidebar() { showSidebar = !showSidebar; }

  function handleWatermarkAdd(wm: any) {
    // Add watermark to all pages
    const newAnnotations: Annotation[] = Array.from({ length: totalPages }, (_, i) => ({
      id: `wm-${Date.now()}-${i}`,
      pageNumber: i + 1,
      type: 'text',
      color: wm.color,
      opacity: wm.opacity,
      strokeWidth: 0,
      x: 100,
      y: 400,
      text: wm.text,
      fontSize: wm.fontSize ?? 48,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    annotations = [...annotations, ...newAnnotations];
    onAnnotationChange?.(annotations);
  }
</script>

<div class="flex flex-col h-full bg-[var(--ui-muted)]/30 {className ?? ''}">
  <!-- Toolbar -->
  <PDFToolbar
    {currentPage}
    {totalPages}
    {scale}
    {tool}
    {showSidebar}
    {sidebarMode}
    onPrevPage={prevPage}
    onNextPage={nextPage}
    onZoomIn={zoomIn}
    onZoomOut={zoomOut}
    onZoomReset={zoomReset}
    onZoomFitWidth={zoomFitWidth}
    onZoomFitHeight={zoomFitHeight}
    onZoomFitPage={zoomFitPage}
    onZoomActual={zoomActualSize}
    onRotate={rotate}
    onToolChange={(t) => tool = t}
    onToolColor={(c) => selectedAnnotationColor = c}
    onSearch={() => showSearch = !showSearch}
    onDownload={handleDownload}
    onPrint={handlePrint}
    onAnnotationDelete={deleteSelectedAnnotation}
    onToggleSidebar={toggleSidebar}
    onSidebarMode={(m) => { sidebarMode = m; showSidebar = true; }}
    onTogglePageManipulation={() => showPageManipulation = !showPageManipulation}
  />

  <!-- Content -->
  <div class="flex flex-1 overflow-hidden">
    <!-- Thumbnail sidebar -->
    <ThumbnailSidebar
      {pdf}
      {currentPage}
      onPageSelect={goToPage}
      showThumbnails={showSidebar && sidebarMode === 'thumbnails'}
    />

    <!-- Main PDF view -->
    <div class="flex-1 overflow-auto flex flex-col items-center gap-4 p-4 relative">
      {#if loading}
        <div class="flex items-center justify-center h-64 text-sm text-[var(--ui-muted-foreground)]">
          Loading PDF...
        </div>
      {:else if error}
        <div class="flex items-center justify-center h-64 text-sm text-[var(--ui-destructive)]">
          {error}
        </div>
      {:else if pdf}
        {#each Array.from({ length: totalPages }, (_, i) => i + 1) as pageNum (pageNum)}
          <div class="relative shadow-lg" style="transform: rotate({rotation}deg);">
            <PDFPage
              {pdf}
              pageNumber={pageNum}
              {scale}
              {annotations}
              {tool}
              onTextSelect={handleTextSelect}
              onAnnotationClick={handleAnnotationClick}
              onAnnotationCreate={handleAnnotationCreate}
            />
          </div>
        {/each}
      {/if}
    </div>

    <!-- Right sidebar -->
    {#if showSidebar}
      {#if sidebarMode === 'annotations'}
        <AnnotationSidebar
          {annotations}
          {currentPage}
          {selectedAnnotationId}
          showSidebar={true}
          onSelectAnnotation={(a) => { selectedAnnotationId = a.id; currentPage = a.pageNumber; }}
          onDeleteAnnotation={deleteAnnotation}
          onCommentAdd={(id, text) => {
            annotations = annotations.map((a) =>
              a.id === id ? { ...a, text, updatedAt: new Date().toISOString() } : a
            );
          }}
        />
      {:else if sidebarMode === 'bookmarks'}
        <div class="w-72 border-l border-[var(--ui-border)] bg-[var(--ui-card)]">
          <div class="px-3 py-2.5 border-b border-[var(--ui-border)]">
            <h3 class="text-sm font-semibold">Bookmarks</h3>
          </div>
          <BookmarkTree {bookmarks} onNavigate={goToPage} />
        </div>
      {:else if sidebarMode === 'pages' && showPageManipulation}
        <div class="w-72 border-l border-[var(--ui-border)] bg-[var(--ui-card)] flex flex-col">
          <div class="px-3 py-2.5 border-b border-[var(--ui-border)]">
            <h3 class="text-sm font-semibold">Page Management</h3>
          </div>
          <PageManipulationPanel
            {totalPages}
            {selectedPages}
            onOperation={handlePageOperation}
            onToggleSelect={togglePageSelection}
            onSelectAll={selectAllPages}
            onDeselectAll={deselectAllPages}
          />
        </div>
      {/if}
    {/if}

    <!-- Search panel -->
    {#if showSearch}
      <SearchPanel
        {searchState}
        onSearch={handleSearch}
        onResultClick={handleSearchResultClick}
        onHighlightAll={(h) => {}}
        onClose={() => showSearch = false}
      />
    {/if}
  </div>
</div>
