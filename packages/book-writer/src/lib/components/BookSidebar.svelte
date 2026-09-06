<script lang="ts">
  import {
    Plus,
    GripVertical,
    Trash2,
    ChevronRight,
    ChevronDown,
    BookOpen,
    FileText,
    Folder,
    CornerDownRight
  } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import {
    getChapterWordCount,
    buildBlockTree,
    type ContentBlock,
    type ContentBlockType
  } from '../book-model.js';

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
    chapters: ContentBlock[];
    activeChapterId: string;
    onSelectChapter: (id: string) => void;
    onAddChapter: (type: ContentBlockType, parentId?: string | null) => void;
    onDeleteChapter: (id: string) => void;
    onReorderChapters: (from: number, to: number) => void;
    onReparentBlock?: (blockId: string, newParentId: string | null) => void;
    wordCount: number;
    estimatedPages: number;
  }: {
    chapters: ContentBlock[];
    activeChapterId: string;
    onSelectChapter: (id: string) => void;
    onAddChapter: (type: ContentBlockType, parentId?: string | null) => void;
    onDeleteChapter: (id: string) => void;
    onReorderChapters: (from: number, to: number) => void;
    onReparentBlock?: (blockId: string, newParentId: string | null) => void;
    wordCount: number;
    estimatedPages: number;
  } = $props();

  let draggedBlockId = $state<string | null>(null);
  let dropTargetBlockId = $state<string | null>(null);
  let collapsedMap = $state<Record<string, boolean>>({});
  const blockTree = $derived(buildBlockTree(chapters));

  function toggleCollapse(id: string) {
    collapsedMap = { ...collapsedMap, [id]: !collapsedMap[id] };
  }

  function formatWordCount(count: number): string {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return String(count);
  }
</script>

{#snippet blockNode(node: ContentBlock, depth: number)}
  {@const isActive = node.id === activeChapterId}
  {@const isCollapsed = !!collapsedMap[node.id]}
  {@const hasChildren = !!node.children && node.children.length > 0}
  {@const words = getChapterWordCount(node)}

  <div class="flex flex-col">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      draggable="true"
      ondragstart={(e) => {
        draggedBlockId = node.id;
        e.dataTransfer?.setData('text/plain', node.id);
      }}
      ondragover={(e) => {
        e.preventDefault();
        if (draggedBlockId !== node.id) dropTargetBlockId = node.id;
      }}
      ondragleave={() => {
        if (dropTargetBlockId === node.id) dropTargetBlockId = null;
      }}
      ondrop={(e) => {
        e.preventDefault();
        const blockId = e.dataTransfer?.getData('text/plain');
        if (blockId && blockId !== node.id) {
          onReparentBlock?.(blockId, node.id);
        }
        draggedBlockId = null;
        dropTargetBlockId = null;
      }}
      class={cn(
        "group flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors text-xs select-none relative",
        isActive
          ? "bg-[var(--ui-primary)]/10 text-[var(--ui-primary)] font-semibold border border-[var(--ui-primary)]/20"
          : "hover:bg-[var(--ui-secondary)]/50 text-[var(--ui-foreground)] border border-transparent",
        draggedBlockId === node.id && "opacity-40",
        dropTargetBlockId === node.id && "bg-[var(--ui-primary)]/15 ring-2 ring-inset ring-[var(--ui-primary)]"
      )}
      style="padding-left: {depth * 14 + 8}px;"
      onclick={() => onSelectChapter(node.id)}
    >
      {#if hasChildren}
        <button
          type="button"
          onclick={(e) => {
            e.stopPropagation();
            toggleCollapse(node.id);
          }}
          class="size-4 p-0 rounded flex items-center justify-center text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)]"
        >
          {#if isCollapsed}
            <ChevronRight class="size-3.5" />
          {:else}
            <ChevronDown class="size-3.5" />
          {/if}
        </button>
      {:else}
        <span class="size-4 shrink-0"></span>
      {/if}

      <span class="text-sm shrink-0 select-none">
        {node.icon || (node.type === 'section' ? '📁' : '📄')}
      </span>

      <span class="truncate flex-1 font-medium">
        {node.title || 'Untitled'}
      </span>

      <span class="text-[10px] text-[var(--ui-muted-foreground)] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {formatWordCount(words)}w
      </span>

      <!-- Action buttons -->
      <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          type="button"
          onclick={(e) => {
            e.stopPropagation();
            onAddChapter('page', node.id);
          }}
          class="p-1 rounded text-[var(--ui-muted-foreground)] hover:text-[var(--ui-primary)] hover:bg-[var(--ui-secondary)]"
          title="Add sub-page"
        >
          <CornerDownRight class="size-3" />
        </button>
        <button
          type="button"
          onclick={(e) => {
            e.stopPropagation();
            onDeleteChapter(node.id);
          }}
          class="p-1 rounded text-[var(--ui-muted-foreground)] hover:text-[var(--ui-destructive)] hover:bg-[var(--ui-destructive)]/10"
          title="Delete block"
        >
          <Trash2 class="size-3" />
        </button>
      </div>
    </div>

    <!-- Recursive children tree -->
    {#if hasChildren && !isCollapsed}
      <div class="flex flex-col">
        {#each node.children! as child (child.id)}
          {@render blockNode(child, depth + 1)}
        {/each}
      </div>
    {/if}
  </div>
{/snippet}

<div class="w-64 border-r border-[var(--ui-border)] bg-[var(--ui-card)] flex flex-col shrink-0">
  <!-- Header -->
  <div class="px-3 py-2.5 border-b border-[var(--ui-border)] flex items-center justify-between">
    <div>
      <h3 class="text-xs font-bold text-[var(--ui-foreground)] uppercase tracking-wider">Pages & Blocks</h3>
      <p class="text-[10px] text-[var(--ui-muted-foreground)] mt-0.5">
        {chapters.length} blocks · {formatWordCount(wordCount)} words · ~{estimatedPages} pages
      </p>
    </div>
  </div>

  <!-- Recursive Block tree list -->
  <div class="flex-1 overflow-auto p-2 space-y-0.5">
    {#each blockTree as rootNode (rootNode.id)}
      {@render blockNode(rootNode, 0)}
    {/each}
  </div>

  <!-- Add Root Block Button -->
  <div class="p-2 border-t border-[var(--ui-border)]">
    <Button
      variant="outline"
      size="sm"
      class="w-full text-xs font-semibold gap-1.5"
      onclick={() => onAddChapter('page', null)}
    >
      <Plus class="size-3.5" /> Add New Page
    </Button>
  </div>
</div>
