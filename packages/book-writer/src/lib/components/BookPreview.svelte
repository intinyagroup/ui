<script lang="ts">
  import { onMount } from 'svelte';
  import { BookOpen, Eye, Layers } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import { getChapterWordCount, type Chapter, type BookMetadata, type BookLayout, pageSizes, getEffectivePageSize } from '../book-model.js';
  import { paginateContent, paginateContentEstimate, type PaginatedPage } from '../pagination-engine.js';

  let {
    metadata,
    layout,
    chapters,
    currentChapterId,
  }: {
    metadata: BookMetadata;
    layout: BookLayout;
    chapters: Chapter[];
    currentChapterId?: string;
  } = $props();

  let viewMode = $state<'flow' | 'paged'>('paged');
  let containerEl: HTMLDivElement | null = $state(null);
  let paginatedChapters = $state<Map<string, PaginatedPage[]>>(new Map());
  let measuring = $state(false);

  const pageSize = $derived(getEffectivePageSize(layout.pageSize, layout.orientation ?? 'portrait'));

  const previewChapters = $derived(
    chapters.filter((ch) => ch.content || ch.title)
  );

  async function repaginate() {
    if (!containerEl || viewMode === 'flow') return;
    measuring = true;

    const containerWidth = containerEl.clientWidth - 48;
    const newMap = new Map<string, PaginatedPage[]>();

    for (const chapter of previewChapters) {
      const titleHtml = `<h2 style="font-size:${layout.chapterTitleSize}pt;font-weight:${layout.chapterTitleWeight};text-align:${layout.chapterTitleAlign};margin-bottom:1.5em;">${chapter.title}</h2>`;
      const contentHtml = titleHtml + (chapter.content || '<p><em>Empty chapter</em></p>');
      const result = await paginateContent(contentHtml, layout, containerWidth);
      newMap.set(chapter.id, result.pages);
    }

    paginatedChapters = newMap;
    measuring = false;
  }

  onMount(() => {
    if (viewMode === 'paged') {
      setTimeout(repaginate, 100);
    }
  });

  $effect(() => {
    if (viewMode === 'paged' && containerEl) {
      setTimeout(repaginate, 50);
    }
  });

  $effect(() => {
    // Re-paginate when layout or content changes
    const _trigger = [layout.fontSize, layout.lineHeight, layout.marginTop, layout.marginBottom, layout.fontFamily];
    if (viewMode === 'paged') {
      setTimeout(repaginate, 100);
    }
  });

  function toggleViewMode() {
    viewMode = viewMode === 'flow' ? 'paged' : 'flow';
    if (viewMode === 'paged') {
      setTimeout(repaginate, 100);
    }
  }
</script>

<div bind:this={containerEl} class="flex-1 flex flex-col overflow-hidden">
  <!-- View mode toggle -->
  <div class="flex items-center justify-between px-6 py-2 border-b border-[var(--ui-border)] bg-[var(--ui-card)]/50">
    <span class="text-xs text-[var(--ui-muted-foreground)]">
      {#if viewMode === 'paged'}
        Paginated view · Content flows automatically across pages
      {:else}
        Flow view · Continuous writing like Google Docs
      {/if}
    </span>
    <Button variant="outline" size="sm" onclick={toggleViewMode} class="h-7 text-xs">
      {#if viewMode === 'paged'}
        <Layers class="size-3.5 mr-1" /> Flow View
      {:else}
        <BookOpen class="size-3.5 mr-1" /> Print Layout
      {/if}
    </Button>
  </div>

  <!-- Content -->
  <div class="flex-1 overflow-auto p-6 bg-[var(--ui-muted)]/30">
    {#if viewMode === 'flow'}
      <!-- Flow mode: continuous writing -->
      <div class="max-w-2xl mx-auto space-y-8">
        <!-- Cover -->
        {#if layout.showCoverPage}
          <div class="bg-white shadow-xl rounded-sm overflow-hidden border border-[var(--ui-border)]" style="aspect-ratio: {pageSize.width}/{pageSize.height};">
            <div class="h-full flex flex-col items-center justify-center p-8 text-center">
              {#if metadata.coverImage}
                <img src={metadata.coverImage} alt="Cover" class="w-32 h-auto mb-8 rounded shadow" />
              {:else}
                <div class="w-20 h-20 rounded-full bg-[var(--ui-primary)]/10 flex items-center justify-center mb-8">
                  <BookOpen class="size-10 text-[var(--ui-primary)]" />
                </div>
              {/if}
              <h1 class="text-3xl font-bold mb-2">{layout.coverTitle || metadata.title}</h1>
              {#if layout.coverSubtitle || metadata.subtitle}
                <p class="text-lg text-[var(--ui-muted-foreground)] mb-4">{layout.coverSubtitle || metadata.subtitle}</p>
              {/if}
              <p class="text-sm text-[var(--ui-muted-foreground)]">{metadata.author}</p>
            </div>
          </div>
        {/if}

        <!-- Chapters (flow) -->
        {#each previewChapters as chapter (chapter.id)}
          <div class="bg-white shadow-lg rounded-lg p-8 border border-[var(--ui-border)]">
            <h2 class="text-xl font-bold mb-4">{chapter.title}</h2>
            {#if chapter.content}
              <div class="text-[var(--ui-foreground)]/80" style="font-family: {layout.fontFamily}; font-size: {layout.fontSize}pt; line-height: {layout.lineHeight};">
                {@html chapter.content}
              </div>
            {:else}
              <p class="text-[var(--ui-muted-foreground)] italic">Empty chapter</p>
            {/if}
          </div>
        {/each}
      </div>

    {:else}
      <!-- Paged mode: real pagination with automatic page breaks -->
      <div class="flex flex-col items-center gap-8">
        <!-- Cover -->
        {#if layout.showCoverPage}
          <div class="bg-white shadow-xl border border-[var(--ui-border)]" style="width: {pageSize.width * 0.75}px; aspect-ratio: {pageSize.width}/{pageSize.height}; padding: {layout.marginTop * 0.75}px {layout.marginRight * 0.75}px {layout.marginBottom * 0.75}px {layout.marginLeft * 0.75}px;">
            <div class="h-full flex flex-col items-center justify-center text-center">
              {#if metadata.coverImage}
                <img src={metadata.coverImage} alt="Cover" class="w-32 h-auto mb-8 rounded shadow" />
              {:else}
                <div class="w-20 h-20 rounded-full bg-[var(--ui-primary)]/10 flex items-center justify-center mb-8">
                  <BookOpen class="size-10 text-[var(--ui-primary)]" />
                </div>
              {/if}
              <h1 class="font-bold mb-2" style="font-size: {layout.chapterTitleSize * 0.75}pt;">
                {layout.coverTitle || metadata.title}
              </h1>
              {#if layout.coverSubtitle || metadata.subtitle}
                <p class="text-[var(--ui-muted-foreground)] mb-4" style="font-size: {layout.fontSize * 0.75}pt;">
                  {layout.coverSubtitle || metadata.subtitle}
                </p>
              {/if}
              <p class="text-[var(--ui-muted-foreground)]" style="font-size: {layout.fontSize * 0.6}pt;">
                {metadata.author}
              </p>
            </div>
          </div>
        {/if}

        <!-- Chapters (paged) -->
        {#each previewChapters as chapter (chapter.id)}
          {@const pages = paginatedChapters.get(chapter.id) ?? []}
          {@const isActive = chapter.id === currentChapterId}

          {#if measuring}
            <!-- Placeholder while measuring -->
            <div class="bg-white shadow-lg border border-[var(--ui-border)] flex items-center justify-center"
              style="width: {pageSize.width * 0.75}px; height: {pageSize.height * 0.75}px;">
              <span class="text-sm text-[var(--ui-muted-foreground)]">Paginating "{chapter.title}"...</span>
            </div>
          {:else if pages.length > 0}
            {#each pages as page, i (page.pageNumber)}
              <div
                class="bg-white shadow-xl border {isActive && i === 0 ? 'border-[var(--ui-primary)]' : 'border-[var(--ui-border)]'} relative"
                style="width: {pageSize.width * 0.75}px; height: {pageSize.height * 0.75}px;"
              >
                <!-- Page content -->
                <div
                  class="absolute inset-0 overflow-hidden text-[var(--ui-foreground)]"
                  style="padding: {layout.marginTop * 0.75}px {layout.marginRight * 0.75}px {layout.marginBottom * 0.75}px {layout.marginLeft * 0.75}px; font-family: {layout.fontFamily}; font-size: {layout.fontSize * 0.75}pt; line-height: {layout.lineHeight};"
                >
                  {@html page.contentHtml}
                </div>

                <!-- Page number -->
                {#if layout.showPageNumbers}
                  <div class="absolute bottom-2 left-0 right-0 text-center text-[var(--ui-muted-foreground)]"
                    style="font-size: {8 * 0.75}pt;">
                    {page.pageNumber}
                  </div>
                {/if}

                <!-- Page indicator (subtle) -->
                <div class="absolute top-2 right-3 text-[10px] text-[var(--ui-muted-foreground)]/40">
                  p.{page.pageNumber}
                </div>
              </div>
            {/each}
          {:else}
            <!-- Empty chapter -->
            <div class="bg-white shadow-lg border border-[var(--ui-border)] flex items-center justify-center"
              style="width: {pageSize.width * 0.75}px; height: {pageSize.height * 0.75}px;">
              <div class="text-center">
                <h2 class="text-xl font-bold mb-2">{chapter.title}</h2>
                <p class="text-sm text-[var(--ui-muted-foreground)] italic">Empty chapter</p>
              </div>
            </div>
          {/if}
        {/each}

        {#if previewChapters.length === 0}
          <div class="bg-white shadow-xl rounded-sm p-8 text-center border border-[var(--ui-border)]">
            <Eye class="size-8 mx-auto mb-3 text-[var(--ui-muted-foreground)]" />
            <p class="text-sm text-[var(--ui-muted-foreground)]">Add chapters to see a paginated preview</p>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
