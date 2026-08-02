<script lang="ts">
  import { Plus, GripVertical, Trash2, ChevronRight, BookOpen, FileText, Scroll, ListOrdered } from 'lucide-svelte';
  import { Button, Badge } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import { getChapterWordCount, type Chapter } from '../book-model.js';

  let {
    chapters,
    activeChapterId,
    onSelectChapter,
    onAddChapter,
    onDeleteChapter,
    onReorderChapters,
    wordCount,
    estimatedPages,
  }: {
    chapters: Chapter[];
    activeChapterId: string;
    onSelectChapter: (id: string) => void;
    onAddChapter: (type: Chapter['type']) => void;
    onDeleteChapter: (id: string) => void;
    onReorderChapters: (from: number, to: number) => void;
    wordCount: number;
    estimatedPages: number;
  } = $props();

  let dragIndex = $state(-1);
  let showAddMenu = $state(false);

  const typeIcons: Record<string, any> = {
    chapter: BookOpen,
    prologue: Scroll,
    epilogue: Scroll,
    appendix: ListOrdered,
    preface: FileText,
  };

  const typeLabels: Record<string, string> = {
    chapter: 'Chapter',
    prologue: 'Prologue',
    epilogue: 'Epilogue',
    appendix: 'Appendix',
    preface: 'Preface',
  };

  function handleDragStart(e: DragEvent, index: number) {
    dragIndex = index;
    e.dataTransfer?.setData('text/plain', String(index));
  }

  function handleDragOver(e: DragEvent, index: number) {
    e.preventDefault();
  }

  function handleDrop(e: DragEvent, toIndex: number) {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer?.getData('text/plain') ?? '-1');
    if (fromIndex >= 0 && fromIndex !== toIndex) {
      onReorderChapters(fromIndex, toIndex);
    }
    dragIndex = -1;
  }

  function formatWordCount(count: number): string {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return String(count);
  }
</script>

<div class="w-64 border-r border-[var(--ui-border)] bg-[var(--ui-card)] flex flex-col shrink-0">
  <!-- Header -->
  <div class="px-3 py-2.5 border-b border-[var(--ui-border)]">
    <h3 class="text-sm font-semibold text-[var(--ui-foreground)]">Chapters</h3>
    <p class="text-[10px] text-[var(--ui-muted-foreground)] mt-0.5">
      {chapters.length} chapters · {formatWordCount(wordCount)} words · ~{estimatedPages} pages
    </p>
  </div>

  <!-- Chapter list -->
  <div class="flex-1 overflow-auto p-2 space-y-1">
    {#each chapters as chapter, index (chapter.id)}
      {@const isActive = chapter.id === activeChapterId}
      {@const Icon = typeIcons[chapter.type] ?? BookOpen}
      {@const chapterWords = getChapterWordCount(chapter)}

      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        draggable="true"
        ondragstart={(e) => handleDragStart(e, index)}
        ondragover={(e) => handleDragOver(e, index)}
        ondrop={(e) => handleDrop(e, index)}
        class={cn(
          "group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors",
          isActive
            ? "bg-[var(--ui-primary)]/10 border border-[var(--ui-primary)]/20"
            : "hover:bg-[var(--ui-secondary)]/50 border border-transparent",
          dragIndex === index ? "opacity-50" : ""
        )}
        onclick={() => onSelectChapter(chapter.id)}
      >
        <GripVertical class="size-3 text-[var(--ui-muted-foreground)] opacity-0 group-hover:opacity-100 cursor-grab shrink-0" />

        <Icon class="size-4 shrink-0 {isActive ? 'text-[var(--ui-primary)]' : 'text-[var(--ui-muted-foreground)]'}" />

        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-[var(--ui-foreground)] truncate">
            {chapter.title}
          </div>
          <div class="text-[10px] text-[var(--ui-muted-foreground)]">
            {typeLabels[chapter.type]} · {formatWordCount(chapterWords)} words
          </div>
        </div>

        <button
          onclick={(e) => { e.stopPropagation(); onDeleteChapter(chapter.id); }}
          class="p-1 rounded text-[var(--ui-muted-foreground)] opacity-0 group-hover:opacity-100 hover:text-[var(--ui-destructive)] hover:bg-[var(--ui-destructive)]/10 cursor-pointer shrink-0"
          aria-label="Delete chapter"
        >
          <Trash2 class="size-3.5" />
        </button>
      </div>
    {/each}
  </div>

  <!-- Add chapter -->
  <div class="p-2 border-t border-[var(--ui-border)]">
    <div class="relative">
      <Button variant="outline" size="sm" class="w-full" onclick={() => showAddMenu = !showAddMenu}>
        <Plus class="size-4 mr-2" /> Add Chapter
      </Button>

      {#if showAddMenu}
        <div class="absolute bottom-full left-0 right-0 mb-1 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)] shadow-lg p-1 z-10">
          {#each Object.entries(typeLabels) as [type, label]}
            <button
              onclick={() => { onAddChapter(type as Chapter['type']); showAddMenu = false; }}
              class="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-left hover:bg-[var(--ui-secondary)] cursor-pointer"
            >
              <svelte:component this={typeIcons[type]} class="size-4 text-[var(--ui-muted-foreground)]" />
              {label}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
