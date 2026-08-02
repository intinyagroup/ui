<script lang="ts">
  import { onMount } from 'svelte';
  import type { PDFDocumentProxy } from 'pdfjs-dist';
  import type { Annotation } from '../pdf-core.js';

  let {
    pdf,
    pageNumber,
    scale = 1,
    annotations = [],
    onTextSelect,
    onAnnotationClick,
    onAnnotationCreate,
    tool = 'select',
  }: {
    pdf: PDFDocumentProxy;
    pageNumber: number;
    scale?: number;
    annotations?: Annotation[];
    onTextSelect?: (text: string, rects: { x: number; y: number; width: number; height: number }[]) => void;
    onAnnotationClick?: (annotation: Annotation) => void;
    onAnnotationCreate?: (annotation: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt'>) => void;
    tool?: string;
  } = $props();

  let canvas: HTMLCanvasElement | null = null;
  let container: HTMLDivElement | null = null;
  let textLayer: HTMLDivElement | null = null;
  let rendering = $state(false);

  onMount(async () => {
    await renderPage();
  });

  async function renderPage() {
    if (!canvas || !pdf) return;
    rendering = true;

    try {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      await page.render({ canvasContext: ctx, viewport }).promise;

      // Render text layer
      if (textLayer) {
        textLayer.innerHTML = '';
        const textContent = await page.getTextContent();

        for (const item of textContent.items) {
          if (!('str' in item) || !item.str) continue;
          const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);

          const span = document.createElement('span');
          span.textContent = item.str;
          span.style.position = 'absolute';
          span.style.left = `${tx[4]}px`;
          span.style.top = `${tx[5] - item.height}px`;
          span.style.fontSize = `${Math.abs(item.height)}px`;
          span.style.fontFamily = 'sans-serif';
          span.style.color = 'transparent';
          span.style.userSelect = 'text';
          span.dataset.text = item.str;

          textLayer.appendChild(span);
        }
      }
    } finally {
      rendering = false;
    }
  }

  function handleCanvasClick(e: MouseEvent) {
    if (!canvas || !onAnnotationCreate) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    if (tool === 'text') {
      onAnnotationCreate({
        pageNumber,
        type: 'text',
        color: '#ff0000',
        opacity: 1,
        x,
        y,
        text: '',
      });
    } else if (tool === 'note') {
      onAnnotationCreate({
        pageNumber,
        type: 'note',
        color: '#ffeb3b',
        opacity: 1,
        x,
        y,
        text: '',
      });
    }
  }

  function handleTextSelection() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !onTextSelect) return;

    const range = selection.getRangeAt(0);
    const clientRects = Array.from(range.getClientRects());

    if (clientRects.length === 0) return;

    const canvasRect = canvas?.getBoundingClientRect();
    if (!canvasRect) return;

    const rects = clientRects.map((r) => ({
      x: (r.left - canvasRect.left) / scale,
      y: (r.top - canvasRect.top) / scale,
      width: r.width / scale,
      height: r.height / scale,
    }));

    const text = selection.toString();
    if (text.trim()) {
      onTextSelect(text, rects);
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={container}
  class="relative inline-block bg-white"
  onmouseup={handleTextSelection}
>
  <canvas bind:this={canvas} onclick={handleCanvasClick} class="block shadow-lg"></canvas>

  <!-- Text layer for selection -->
  <div
    bind:this={textLayer}
    class="absolute inset-0 overflow-hidden pointer-events-none"
    style="opacity: 0.5;"
  ></div>

  <!-- Annotation overlay -->
  <div class="absolute inset-0 pointer-events-none">
    {#each annotations.filter((a) => a.pageNumber === pageNumber) as annotation (annotation.id)}
      {#if annotation.type === 'highlight' && annotation.rects}
        {#each annotation.rects as rect}
          <div
            class="absolute pointer-events-auto cursor-pointer hover:opacity-80"
            style="left: {rect.x * scale}px; top: {rect.y * scale}px; width: {rect.width * scale}px; height: {rect.height * scale}px; background-color: {annotation.color}; opacity: {annotation.opacity};"
            onclick={() => onAnnotationClick?.(annotation)}
          ></div>
        {/each}
      {/if}

      {#if annotation.type === 'note' && annotation.x !== undefined && annotation.y !== undefined}
        <div
          class="absolute pointer-events-auto cursor-pointer w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md hover:scale-110 transition-transform"
          style="left: {annotation.x * scale}px; top: {annotation.y * scale}px; background-color: {annotation.color};"
          onclick={() => onAnnotationClick?.(annotation)}
        >
          📝
        </div>
      {/if}
    {/each}
  </div>

  {#if rendering}
    <div class="absolute inset-0 flex items-center justify-center bg-white/80">
      <span class="text-sm text-gray-500">Rendering...</span>
    </div>
  {/if}
</div>
