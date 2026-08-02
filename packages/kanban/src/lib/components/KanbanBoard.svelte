<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Plus, GripVertical } from 'lucide-svelte';
  import { Button, Badge } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';

  export type KanbanColumn = {
    id: string;
    title: string;
    color?: string;
  };

  export type KanbanCard = {
    id: string;
    columnId: string;
    title: string;
    description?: string;
    tags?: string[];
    priority?: 'low' | 'medium' | 'high';
    assignee?: string;
    [key: string]: any;
  };

  let {
    columns = [],
    cards = [],
    onCardMove,
    onCardClick,
    onAddCard,
    onAddColumn,
    cardSnippet,
    class: className,
  }: {
    columns: KanbanColumn[];
    cards: KanbanCard[];
    onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string, newIndex: number) => void;
    onCardClick?: (card: KanbanCard) => void;
    onAddCard?: (columnId: string) => void;
    onAddColumn?: () => void;
    cardSnippet?: Snippet<[KanbanCard]>;
    class?: string;
  } = $props();

  let draggedCardId = $state<string | null>(null);
  let dragOverColumnId = $state<string | null>(null);
  let dragOverIndex = $state<number>(-1);

  function getColumnCards(columnId: string): KanbanCard[] {
    return cards.filter((c) => c.columnId === columnId);
  }

  function handleDragStart(e: DragEvent, card: KanbanCard) {
    draggedCardId = card.id;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', card.id);
    }
  }

  function handleDragOver(e: DragEvent, columnId: string, index: number) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    dragOverColumnId = columnId;
    dragOverIndex = index;
  }

  function handleDrop(e: DragEvent, toColumnId: string, toIndex: number) {
    e.preventDefault();
    if (!draggedCardId) return;

    const card = cards.find((c) => c.id === draggedCardId);
    if (card && card.columnId !== toColumnId) {
      onCardMove?.(draggedCardId, card.columnId, toColumnId, toIndex);
    }

    draggedCardId = null;
    dragOverColumnId = null;
    dragOverIndex = -1;
  }

  function handleDragEnd() {
    draggedCardId = null;
    dragOverColumnId = null;
    dragOverIndex = -1;
  }

  const priorityColors: Record<string, string> = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };
</script>

<div class={cn('flex gap-4 overflow-x-auto pb-4', className)}>
  {#each columns as column (column.id)}
    {@const columnCards = getColumnCards(column.id)}

    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="flex flex-col w-72 shrink-0 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-secondary)]/30"
      ondragover={(e) => handleDragOver(e, column.id, columnCards.length)}
      ondrop={(e) => handleDrop(e, column.id, columnCards.length)}
    >
      <!-- Column header -->
      <div class="flex items-center justify-between px-3 py-2.5 border-b border-[var(--ui-border)]">
        <div class="flex items-center gap-2">
          {#if column.color}
            <div class="size-2.5 rounded-full" style="background-color: {column.color}"></div>
          {/if}
          <span class="text-sm font-semibold text-[var(--ui-foreground)]">{column.title}</span>
          <Badge variant="secondary" class="text-[10px] px-1.5 py-0">{columnCards.length}</Badge>
        </div>
        {#if onAddCard}
          <button
            onclick={() => onAddCard(column.id)}
            class="p-1 rounded-md text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)] transition-colors cursor-pointer"
            aria-label="Add card"
          >
            <Plus class="size-4" />
          </button>
        {/if}
      </div>

      <!-- Cards -->
      <div class="flex-1 p-2 space-y-2 min-h-[100px]">
        {#each columnCards as card, index (card.id)}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            draggable="true"
            ondragstart={(e) => handleDragStart(e, card)}
            ondragover={(e) => handleDragOver(e, column.id, index)}
            ondragend={handleDragEnd}
            onclick={() => onCardClick?.(card)}
            class="group flex items-start gap-2 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)] p-3 cursor-grab active:cursor-grabbing transition-all hover:shadow-sm
              {draggedCardId === card.id ? 'opacity-50 scale-95' : ''}
              {dragOverColumnId === column.id && dragOverIndex === index ? 'border-[var(--ui-primary)] border-dashed' : ''}"
          >
            <GripVertical class="size-4 mt-0.5 text-[var(--ui-muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />

            <div class="flex-1 min-w-0">
              {#if cardSnippet}
                {@render cardSnippet(card)}
              {:else}
                <p class="text-sm font-medium text-[var(--ui-foreground)]">{card.title}</p>
                {#if card.description}
                  <p class="text-xs text-[var(--ui-muted-foreground)] mt-1 line-clamp-2">{card.description}</p>
                {/if}
                <div class="flex flex-wrap items-center gap-1.5 mt-2">
                  {#if card.priority}
                    <span class="text-[10px] font-medium px-1.5 py-0.5 rounded {priorityColors[card.priority] ?? ''}">
                      {card.priority}
                    </span>
                  {/if}
                  {#if card.tags}
                    {#each card.tags as tag}
                      <span class="text-[10px] px-1.5 py-0.5 rounded bg-[var(--ui-secondary)] text-[var(--ui-muted-foreground)]">
                        {tag}
                      </span>
                    {/each}
                  {/if}
                  {#if card.assignee}
                    <span class="text-[10px] text-[var(--ui-muted-foreground)] ml-auto">
                      {card.assignee}
                    </span>
                  {/if}
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/each}

  {#if onAddColumn}
    <button
      onclick={onAddColumn}
      class="flex items-center justify-center w-72 shrink-0 rounded-xl border-2 border-dashed border-[var(--ui-border)] text-[var(--ui-muted-foreground)] hover:border-[var(--ui-primary)]/50 hover:text-[var(--ui-primary)] transition-colors cursor-pointer min-h-[120px]"
    >
      <div class="flex items-center gap-2 text-sm font-medium">
        <Plus class="size-4" /> Add column
      </div>
    </button>
  {/if}
</div>
