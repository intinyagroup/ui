<script lang="ts">
  import { onMount } from 'svelte';
  import { initPdfWorker, pdfjsLib, type Annotation } from '../pdf-core.js';
  import type { PDFDocumentProxy } from 'pdfjs-dist';
  import PDFToolbar from './PDFToolbar.svelte';
  import PDFPage from './PDFPage.svelte';
  import AnnotationSidebar from './AnnotationSidebar.svelte';

  let {
    src,
    class: className,
    onLoad,
    onAnnotationChange,
  }: {
    src: string | ArrayBuffer;
    class?: string;
    onLoad?: (info: { pageCount: number; title: string }) => void;
    onAnnotationChange?: (annotations: Annotation[]) => void;
  } = $props();

  let pdf = $state<PDFDocumentProxy | null>(null);
  let currentPage = $state(1);
  let totalPages = $state(0);
  let scale = $state(1.5);
  let rotation = $state(0);
  let tool = $state('select');
  let annotations = $state<Annotation[]>([]);
  let selectedAnnotationId = $state<string | undefined>();
  let showSidebar = $state(true);
  let loading = $state(true);
  let error = $state('');

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

      const metadata = await pdf.getMetadata();
      onLoad?.({
        pageCount: totalPages,
        title: (metadata.info as any)?.Title ?? 'Untitled',
      });
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load PDF';
    } finally {
      loading = false;
    }
  }

  function prevPage() { if (currentPage > 1) currentPage--; }
  function nextPage() { if (currentPage < totalPages) currentPage++; }
  function zoomIn() { scale = Math.min(scale + 0.25, 5); }
  function zoomOut() { scale = Math.max(scale - 0.25, 0.25); }
  function zoomReset() { scale = 1.5; }
  function rotate() { rotation = (rotation + 90) % 360; }

  function handleTextSelect(text: string, rects: { x: number; y: number; width: number; height: number }[]) {
    if (tool === 'highlight') {
      const annotation: Annotation = {
        id: `ann-${Date.now()}`,
        pageNumber: currentPage,
        type: 'highlight',
        color: '#ffeb3b',
        opacity: 0.4,
        rects,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      annotations = [...annotations, annotation];
      onAnnotationChange?.(annotations);
    } else if (tool === 'underline') {
      const annotation: Annotation = {
        id: `ann-${Date.now()}`,
        pageNumber: currentPage,
        type: 'underline',
        color: '#2196f3',
        opacity: 1,
        rects: rects.map((r) => ({ ...r, y: r.y + r.height - 2, height: 3 })),
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
    if (selectedAnnotationId) {
      deleteAnnotation(selectedAnnotationId);
    }
  }

  function handleDownload() {
    if (!pdf) return;
    const link = document.createElement('a');
    if (typeof src === 'string') {
      link.href = src;
    } else {
      const blob = new Blob([src], { type: 'application/pdf' });
      link.href = URL.createObjectURL(blob);
    }
    link.download = 'document.pdf';
    link.click();
  }

  function handlePrint() {
    window.print();
  }

  function handleSearch(query: string) {
    // PDF.js text search would go here
    console.log('Search:', query);
  }

  function handleAnnotationComment(annotationId: string, text: string) {
    annotations = annotations.map((a) =>
      a.id === annotationId ? { ...a, text, updatedAt: new Date().toISOString() } : a
    );
    onAnnotationChange?.(annotations);
  }

  function toggleSidebar() { showSidebar = !showSidebar; }
</script>

<div class="flex flex-col h-full bg-[var(--ui-muted)]/30 {className ?? ''}">
  <!-- Toolbar -->
  <PDFToolbar
    {currentPage}
    {totalPages}
    {scale}
    {tool}
    {showSidebar}
    onPrevPage={prevPage}
    onNextPage={nextPage}
    onZoomIn={zoomIn}
    onZoomOut={zoomOut}
    onZoomReset={zoomReset}
    onRotate={rotate}
    onToolChange={(t) => tool = t}
    onSearch={handleSearch}
    onDownload={handleDownload}
    onPrint={handlePrint}
    onAnnotationDelete={deleteSelectedAnnotation}
    onToggleSidebar={toggleSidebar}
  />

  <!-- Content -->
  <div class="flex flex-1 overflow-hidden">
    <!-- PDF pages -->
    <div class="flex-1 overflow-auto flex flex-col items-center gap-4 p-4">
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

    <!-- Annotation sidebar -->
    <AnnotationSidebar
      {annotations}
      {currentPage}
      {selectedAnnotationId}
      {showSidebar}
      onSelectAnnotation={(a) => { selectedAnnotationId = a.id; currentPage = a.pageNumber; }}
      onDeleteAnnotation={deleteAnnotation}
      onCommentAdd={handleAnnotationComment}
    />
  </div>
</div>
