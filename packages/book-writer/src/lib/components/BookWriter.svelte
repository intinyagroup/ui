<script lang="ts">
  import { Download, Eye, Edit3, Settings } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import {
    createChapter,
    createContentBlock,
    createDefaultSettings,
    reorderChapters,
    getTotalWordCount,
    getEstimatedPages,
    type Chapter,
    type ContentBlock,
    type BookMetadata,
    type BookLayout,
    type BookSettings,
  } from '../book-model.js';
  import BookSidebar from './BookSidebar.svelte';
  import ChapterEditor from './ChapterEditor.svelte';
  import BookPreview from './BookPreview.svelte';
  import BookSettingsPanel from './BookSettings.svelte';
  import ExportDialog from './ExportDialog.svelte';

  let {
    initialSettings,
    class: className,
    onSave,
    onExport,
  }: {
    initialSettings?: BookSettings;
    class?: string;
    onSave?: (settings: BookSettings) => void;
    onExport?: (blob: Blob) => void;
  } = $props();

  let settings = $state(initialSettings ?? createDefaultSettings());
  let activeChapterId = $state(settings.chapters[0]?.id ?? '');
  let viewMode = $state<'edit' | 'preview'>('edit');
  let showSettings = $state(false);
  let showExport = $state(false);

  const activeChapter = $derived(settings.chapters.find((ch) => ch.id === activeChapterId));
  const wordCount = $derived(getTotalWordCount(settings.chapters));
  const estimatedPages = $derived(getEstimatedPages(settings.chapters));

  function handleSelectChapter(id: string) {
    activeChapterId = id;
  }

  function handleAddChapter(type: any = 'page', parentId: string | null = null) {
    const defaultTitle = parentId ? 'Sub-page' : `Page ${settings.chapters.length + 1}`;
    const newBlock = createContentBlock(defaultTitle, type, parentId, settings.chapters.length);
    settings = {
      ...settings,
      chapters: [...settings.chapters, newBlock],
    };
    activeChapterId = newBlock.id;
  }

  function handleDeleteChapter(id: string) {
    if (settings.chapters.length <= 1) return;
    const filtered = settings.chapters.filter((ch) => ch.id !== id);
    settings = { ...settings, chapters: reorderChapters(filtered) };
    if (activeChapterId === id) {
      activeChapterId = filtered[0]?.id ?? '';
    }
  }

  function handleReorderChapters(fromIndex: number, toIndex: number) {
    const chapters = [...settings.chapters];
    const [moved] = chapters.splice(fromIndex, 1);
    chapters.splice(toIndex, 0, moved);
    settings = { ...settings, chapters: reorderChapters(chapters) };
  }

  function handleContentChange(content: string) {
    if (!activeChapterId) return;
    settings = {
      ...settings,
      chapters: settings.chapters.map((ch) =>
        ch.id === activeChapterId
          ? { ...ch, content, updatedAt: new Date().toISOString() }
          : ch
      ),
    };
  }

  function handleTitleChange(title: string) {
    if (!activeChapterId) return;
    settings = {
      ...settings,
      chapters: settings.chapters.map((ch) =>
        ch.id === activeChapterId
          ? { ...ch, title, updatedAt: new Date().toISOString() }
          : ch
      ),
    };
  }

  function handleMetadataChange(metadata: BookMetadata) {
    settings = { ...settings, metadata };
  }

  function handleLayoutChange(layout: BookLayout) {
    settings = { ...settings, layout };
  }

  function handleSave() {
    onSave?.(settings);
  }

  function handleExportComplete(blob: Blob) {
    onExport?.(blob);
    showExport = false;
  }
</script>

<div class="flex flex-col h-full {className ?? ''}">
  <!-- Top bar -->
  <div class="flex items-center justify-between px-4 py-2 border-b border-[var(--ui-border)] bg-[var(--ui-card)]">
    <div class="flex items-center gap-4">
      <h1 class="text-sm font-semibold text-[var(--ui-foreground)] truncate max-w-xs">
        {settings.metadata.title}
      </h1>
      <span class="text-xs text-[var(--ui-muted-foreground)]">
        {settings.chapters.length} chapters · {wordCount.toLocaleString()} words · ~{estimatedPages} pages
      </span>
    </div>

    <div class="flex items-center gap-2">
      <!-- View mode toggle -->
      <div class="flex items-center border border-[var(--ui-border)] rounded-lg overflow-hidden">
        <button
          onclick={() => viewMode = 'edit'}
          class={cn("px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
            viewMode === 'edit' ? "bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)]" : "text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)]"
          )}
        >
          <Edit3 class="size-3.5 inline mr-1" /> Edit
        </button>
        <button
          onclick={() => viewMode = 'preview'}
          class={cn("px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
            viewMode === 'preview' ? "bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)]" : "text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)]"
          )}
        >
          <Eye class="size-3.5 inline mr-1" /> Preview
        </button>
      </div>

      <Button variant="outline" size="sm" onclick={() => showSettings = !showSettings}>
        <Settings class="size-3.5" />
      </Button>

      <Button variant="outline" size="sm" onclick={handleSave}>
        Save
      </Button>

      <Button size="sm" onclick={() => showExport = true}>
        <Download class="size-3.5 mr-1" /> Export
      </Button>
    </div>
  </div>

  <!-- Main content -->
  <div class="flex flex-1 overflow-hidden">
    <!-- Sidebar -->
    <BookSidebar
      chapters={settings.chapters}
      {activeChapterId}
      onSelectChapter={handleSelectChapter}
      onAddChapter={handleAddChapter}
      onDeleteChapter={handleDeleteChapter}
      onReorderChapters={handleReorderChapters}
      {wordCount}
      {estimatedPages}
    />

    <!-- Editor or Preview -->
    {#if viewMode === 'edit'}
      {#if activeChapter}
        <ChapterEditor
          chapter={activeChapter}
          allChapters={settings.chapters}
          onContentChange={handleContentChange}
          onTitleChange={handleTitleChange}
        />
      {:else}
        <div class="flex-1 flex items-center justify-center text-[var(--ui-muted-foreground)]">
          Select or add a chapter to start writing
        </div>
      {/if}
    {:else}
      <BookPreview
        metadata={settings.metadata}
        layout={settings.layout}
        chapters={settings.chapters}
        currentChapterId={activeChapterId}
      />
    {/if}

    <!-- Settings panel -->
    {#if showSettings}
      <BookSettingsPanel
        metadata={settings.metadata}
        layout={settings.layout}
        onMetadataChange={handleMetadataChange}
        onLayoutChange={handleLayoutChange}
      />
    {/if}
  </div>
</div>

<!-- Export dialog -->
<ExportDialog
  open={showExport}
  metadata={settings.metadata}
  layout={settings.layout}
  chapters={settings.chapters}
  onClose={() => showExport = false}
  onExportComplete={handleExportComplete}
/>
