<script lang="ts">
  import { onMount } from 'svelte';
  import { cn } from '@intinyagroup/grid-core/utils';
  import type { PDFDocumentProxy } from 'pdfjs-dist';
  import * as pdfjsLib from 'pdfjs-dist';

  let {
    pdf,
    currentPage,
    onPageSelect,
    showThumbnails,
  }: {
    pdf: PDFDocumentProxy | null;
    currentPage: number;
    onPageSelect: (page: number) => void;
    showThumbnails: boolean;
  } = $props();

  let thumbnails = $state<Map<number, string>>(new Map());
  let containerEl: HTMLDivElement | null = null;

  async function renderThumbnails() {
    if (!pdf) return;
    const maxPages = Math.min(pdf.numPages, 50);

    for (let i = 1; i <= maxPages; i++) {
      if (thumbnails.has(i)) continue;
      try {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.2 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          thumbnails.set(i, canvas.toDataURL('image/jpeg', 0.5));
          thumbnails = new Map(thumbnails);
        }
      } catch {
        // Skip failed thumbnails
      }
    }
  }

  $effect(() => {
    if (pdf && showThumbnails) {
      renderThumbnails();
    }
  });

  function scrollToCurrentPage() {
    if (!containerEl) return;
    const el = containerEl.querySelector(`[data-page="${currentPage}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  $effect(() => {
    if (showThumbnails) {
      scrollToCurrentPage();
    }
  });
</script>

{#if showThumbnails}
  <div
    bind:this={containerEl}
    class="w-32 border-r border-[var(--ui-border)] bg-[var(--ui-card)] overflow-y-auto p-2 space-y-2 shrink-0"
  >
    {#each Array.from({ length: pdf?.numPages ?? 0 }, (_, i) => i + 1) as pageNum (pageNum)}
      {@const thumbnail = thumbnails.get(pageNum)}
      {@const isActive = pageNum === currentPage}

      <button
        onclick={() => onPageSelect(pageNum)}
        class={cn(
          'w-full rounded-lg border-2 transition-all cursor-pointer overflow-hidden',
          isActive
            ? 'border-[var(--ui-primary)] shadow-md'
            : 'border-transparent hover:border-[var(--ui-border)]'
        )}
      >
        {#if thumbnail}
          <img
            src={thumbnail}
            alt="Page {pageNum}"
            class="w-full bg-white"
            loading="lazy"
          />
        {:else}
          <div class="w-full h-24 bg-[var(--ui-secondary)] animate-pulse"></div>
        {/if}
        <div class={cn(
          'py-1 text-center text-[10px] font-medium',
          isActive ? 'text-[var(--ui-primary)] bg-[var(--ui-primary)]/5' : 'text-[var(--ui-muted-foreground)]'
        )}>
          {pageNum}
        </div>
      </button>
    {/each}
  </div>
{/if}
