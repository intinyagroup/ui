<script lang="ts">
  import { BookOpen, Eye } from 'lucide-svelte';
  import { cn } from '@intinyagroup/grid-core/utils';
  import { getChapterWordCount, type Chapter, type BookMetadata, type BookLayout, pageSizes } from '../book-model.js';

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

  const pageSize = $derived(pageSizes[layout.pageSize] ?? pageSizes.a4);

  // Calculate approximate content for preview
  const previewChapters = $derived(
    chapters.filter((ch) => ch.content || ch.title)
  );

  function htmlToPlainText(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }
</script>

<div class="flex-1 overflow-auto p-6 bg-[var(--ui-muted)]/30">
  <div class="max-w-lg mx-auto space-y-8">
    {#if layout.showCoverPage}
      <!-- Cover Page -->
      <div
        class="bg-white shadow-xl rounded-sm overflow-hidden border border-[var(--ui-border)]"
        style="aspect-ratio: {pageSize.width}/{pageSize.height};"
      >
        <div class="h-full flex flex-col items-center justify-center p-8 text-center">
          {#if metadata.coverImage}
            <img src={metadata.coverImage} alt="Cover" class="w-32 h-auto mb-8 rounded shadow" />
          {:else}
            <div class="w-20 h-20 rounded-full bg-[var(--ui-primary)]/10 flex items-center justify-center mb-8">
              <BookOpen class="size-10 text-[var(--ui-primary)]" />
            </div>
          {/if}

          <h1 class="text-3xl font-bold text-[var(--ui-foreground)] mb-2">
            {layout.coverTitle || metadata.title}
          </h1>
          {#if layout.coverSubtitle || metadata.subtitle}
            <p class="text-lg text-[var(--ui-muted-foreground)] mb-4">
              {layout.coverSubtitle || metadata.subtitle}
            </p>
          {/if}
          <p class="text-sm text-[var(--ui-muted-foreground)]">{metadata.author}</p>
        </div>
      </div>
    {/if}

    <!-- TOC Page -->
    {#if layout.generateTOC && previewChapters.length > 0}
      <div
        class="bg-white shadow-xl rounded-sm overflow-hidden border border-[var(--ui-border)] p-8"
        style="aspect-ratio: {pageSize.width}/{pageSize.height};"
      >
        <h2 class="text-xl font-bold text-center mb-6">{layout.tocTitle}</h2>
        <div class="space-y-2">
          {#each previewChapters as chapter, i}
            <div class="flex items-baseline gap-2 text-sm">
              <span class="text-[var(--ui-muted-foreground)]">{i + 1}.</span>
              <span class="text-[var(--ui-foreground)]">{chapter.title}</span>
              <span class="flex-1 border-b border-dotted border-[var(--ui-border)]"></span>
              <span class="text-[var(--ui-muted-foreground)]">...</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Chapter Pages -->
    {#each previewChapters as chapter, i (chapter.id)}
      {@const isActive = chapter.id === currentChapterId}
      <div
        class="bg-white shadow-xl rounded-sm overflow-hidden border {isActive ? 'border-[var(--ui-primary)] shadow-lg' : 'border-[var(--ui-border)]'}"
        style="aspect-ratio: {pageSize.width}/{pageSize.height};"
      >
        <div class="p-8">
          <h2 class="text-xl font-bold text-[var(--ui-foreground)] mb-4">{chapter.title}</h2>

          {#if chapter.content}
            <div
              class="text-sm leading-relaxed text-[var(--ui-foreground)]/80"
              style="font-family: {layout.fontFamily}; font-size: {layout.fontSize}pt; line-height: {layout.lineHeight};"
            >
              {@html chapter.content}
            </div>
          {:else}
            <p class="text-sm text-[var(--ui-muted-foreground)] italic">No content yet...</p>
          {/if}
        </div>
      </div>
    {/each}

    {#if previewChapters.length === 0}
      <div class="bg-white shadow-xl rounded-sm p-8 text-center border border-[var(--ui-border)]">
        <Eye class="size-8 mx-auto mb-3 text-[var(--ui-muted-foreground)]" />
        <p class="text-sm text-[var(--ui-muted-foreground)]">
          Add chapters to see a preview of your book
        </p>
      </div>
    {/if}
  </div>
</div>
