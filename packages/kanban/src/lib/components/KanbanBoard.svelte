<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Plus, GripVertical, ChevronDown, ChevronRight, X, AlertTriangle } from 'lucide-svelte';
  import { Button, Badge, Dialog } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';

  export type KanbanLabel = {
    text: string;
    color: string;
  };

  export type KanbanColumn = {
    id: string;
    title: string;
    color?: string;
    wipLimit?: number;
  };

  export type KanbanCard = {
    id: string;
    columnId: string;
    title: string;
    description?: string;
    tags?: string[];
    labels?: KanbanLabel[];
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
    onCardUpdate,
    onWipExceeded,
    swimlaneBy,
    cardSnippet,
    class: className,
  }: {
    columns: KanbanColumn[];
    cards: KanbanCard[];
    onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string, newIndex: number) => void;
    onCardClick?: (card: KanbanCard) => void;
    onAddCard?: (columnId: string) => void;
    onAddColumn?: () => void;
    onCardUpdate?: (card: KanbanCard, changes: Partial<KanbanCard>) => void;
    onWipExceeded?: (column: KanbanColumn, count: number) => void;
    swimlaneBy?: string;
    cardSnippet?: Snippet<[KanbanCard]>;
    class?: string;
  } = $props();

  let draggedCardId = $state<string | null>(null);
  let dragOverColumnId = $state<string | null>(null);
  let dragOverIndex = $state<number>(-1);

  // Inline editing state
  let editingCardId = $state<string | null>(null);
  let editingTitle = $state('');

  // Card detail modal state
  let detailCard = $state<KanbanCard | null>(null);
  let detailOpen = $state(false);
  let detailTitle = $state('');
  let detailDescription = $state('');
  let detailPriority = $state<string>('');
  let detailAssignee = $state('');

  // Swimlane collapsed state
  let collapsedSwimlanes = $state<Record<string, boolean>>({});

  function getColumnCards(columnId: string): KanbanCard[] {
    return cards.filter((c) => c.columnId === columnId);
  }

  function getSwimlaneValues(columnId: string): string[] {
    if (!swimlaneBy) return [];
    const colCards = getColumnCards(columnId);
    const values = [...new Set(colCards.map((c) => (c[swimlaneBy] as string) ?? 'Unset'))];
    return values.sort();
  }

  function getSwimlaneCards(columnId: string, value: string): KanbanCard[] {
    return getColumnCards(columnId).filter(
      (c) => ((c[swimlaneBy!] as string) ?? 'Unset') === value
    );
  }

  function isSwimlaneCollapsed(columnId: string, value: string): boolean {
    return collapsedSwimlanes[`${columnId}:${value}`] === true;
  }

  function toggleSwimlane(columnId: string, value: string) {
    const key = `${columnId}:${value}`;
    collapsedSwimlanes = { ...collapsedSwimlanes, [key]: !collapsedSwimlanes[key] };
  }

  function isWipExceeded(column: KanbanColumn): boolean {
    if (column.wipLimit == null) return false;
    return getColumnCards(column.id).length >= column.wipLimit;
  }

  // Drag & drop
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

  // Inline title editing
  function startEditing(card: KanbanCard) {
    editingCardId = card.id;
    editingTitle = card.title;
  }

  function saveEditing(card: KanbanCard) {
    if (editingTitle.trim() && editingTitle.trim() !== card.title) {
      onCardUpdate?.(card, { title: editingTitle.trim() });
    }
    editingCardId = null;
    editingTitle = '';
  }

  function cancelEditing() {
    editingCardId = null;
    editingTitle = '';
  }

  // Card detail modal
  function openDetail(card: KanbanCard) {
    detailCard = card;
    detailTitle = card.title;
    detailDescription = card.description ?? '';
    detailPriority = card.priority ?? '';
    detailAssignee = card.assignee ?? '';
    detailOpen = true;
    onCardClick?.(card);
  }

  function saveDetail() {
    if (!detailCard) return;
    onCardUpdate?.(detailCard, {
      title: detailTitle.trim() || detailCard.title,
      description: detailDescription,
      priority: (detailPriority || undefined) as KanbanCard['priority'],
      assignee: detailAssignee || undefined,
    });
    detailOpen = false;
  }

  function closeDetail() {
    detailOpen = false;
    detailCard = null;
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
    {@const exceeded = isWipExceeded(column)}
    {@const swimlaneValues = swimlaneBy ? getSwimlaneValues(column.id) : []}

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
          <Badge variant={exceeded ? 'destructive' : 'secondary'} class="text-[10px] px-1.5 py-0">
            {columnCards.length}{column.wipLimit != null ? `/${column.wipLimit}` : ''}
          </Badge>
          {#if exceeded}
            <AlertTriangle class="size-3.5 text-red-500" />
          {/if}
        </div>
        {#if onAddCard}
          <button
            onclick={() => {
              if (exceeded) {
                onWipExceeded?.(column, columnCards.length);
                return;
              }
              onAddCard(column.id);
            }}
            class={cn(
              'p-1 rounded-md transition-colors cursor-pointer',
              exceeded
                ? 'text-red-400 hover:text-red-600 hover:bg-red-50'
                : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]'
            )}
            aria-label={exceeded ? 'WIP limit reached' : 'Add card'}
          >
            <Plus class="size-4" />
          </button>
        {/if}
      </div>

      <!-- Cards -->
      <div class="flex-1 p-2 space-y-2 min-h-[100px]">
        {#if swimlaneBy && swimlaneValues.length > 0}
          {#each swimlaneValues as sv (sv)}
            {@const svCards = getSwimlaneCards(column.id, sv)}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div>
              <button
                onclick={() => toggleSwimlane(column.id, sv)}
                class="flex items-center gap-1.5 w-full text-left text-xs font-medium text-[var(--ui-muted-foreground)] py-1 px-1 rounded hover:bg-[var(--ui-secondary)] transition-colors cursor-pointer"
              >
                {#if isSwimlaneCollapsed(column.id, sv)}
                  <ChevronRight class="size-3" />
                {:else}
                  <ChevronDown class="size-3" />
                {/if}
                <span>{sv}</span>
                <Badge variant="secondary" class="text-[9px] px-1 py-0 ml-auto">{svCards.length}</Badge>
              </button>
              {#if !isSwimlaneCollapsed(column.id, sv)}
                <div class="space-y-2 pl-2 border-l-2 border-[var(--ui-border)] ml-1 mt-1">
                  {#each svCards as card, index (card.id)}
                    {@render cardRenderer(card, column.id, index)}
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        {:else}
          {#each columnCards as card, index (card.id)}
            {@render cardRenderer(card, column.id, index)}
          {/each}
        {/if}
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

<!-- Card Detail Modal -->
{#if detailCard}
  <Dialog.Root bind:open={detailOpen} onOpenChange={(open) => { if (!open) closeDetail(); }}>
    <Dialog.Content class="sm:max-w-lg">
      <Dialog.Header>
        <div class="flex items-center justify-between">
          <Dialog.Title class="text-lg font-semibold">Card Details</Dialog.Title>
          <button
            onclick={closeDetail}
            class="p-1 rounded-md text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X class="size-4" />
          </button>
        </div>
      </Dialog.Header>

      <div class="space-y-4 py-2">
        <!-- Title -->
        <div>
          <label class="text-xs font-medium text-[var(--ui-muted-foreground)] mb-1 block">Title</label>
          <input
            type="text"
            bind:value={detailTitle}
            class="w-full text-sm px-3 py-2 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)] text-[var(--ui-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ui-primary)]/50"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="text-xs font-medium text-[var(--ui-muted-foreground)] mb-1 block">Description</label>
          <textarea
            bind:value={detailDescription}
            rows={4}
            class="w-full text-sm px-3 py-2 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)] text-[var(--ui-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ui-primary)]/50 resize-none"
            placeholder="Add a description..."
          ></textarea>
        </div>

        <!-- Labels -->
        {#if detailCard.labels && detailCard.labels.length > 0}
          <div>
            <label class="text-xs font-medium text-[var(--ui-muted-foreground)] mb-1 block">Labels</label>
            <div class="flex flex-wrap gap-1.5">
              {#each detailCard.labels as label}
                <span
                  class="text-[10px] font-medium px-2 py-0.5 rounded-full text-white"
                  style="background-color: {label.color}"
                >
                  {label.text}
                </span>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Priority -->
        <div>
          <label class="text-xs font-medium text-[var(--ui-muted-foreground)] mb-1 block">Priority</label>
          <select
            bind:value={detailPriority}
            class="w-full text-sm px-3 py-2 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)] text-[var(--ui-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ui-primary)]/50"
          >
            <option value="">None</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <!-- Assignee -->
        <div>
          <label class="text-xs font-medium text-[var(--ui-muted-foreground)] mb-1 block">Assignee</label>
          <input
            type="text"
            bind:value={detailAssignee}
            class="w-full text-sm px-3 py-2 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)] text-[var(--ui-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ui-primary)]/50"
            placeholder="Assign someone..."
          />
        </div>

        <!-- Tags -->
        {#if detailCard.tags && detailCard.tags.length > 0}
          <div>
            <label class="text-xs font-medium text-[var(--ui-muted-foreground)] mb-1 block">Tags</label>
            <div class="flex flex-wrap gap-1.5">
              {#each detailCard.tags as tag}
                <Badge variant="secondary" class="text-[10px]">{tag}</Badge>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <Dialog.Footer>
        <Button variant="outline" onclick={closeDetail}>Cancel</Button>
        <Button onclick={saveDetail}>Save Changes</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
{/if}

{#snippet cardRenderer(card: KanbanCard, columnId: string, index: number)}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    role="button"
    tabindex="0"
    draggable="true"
    ondragstart={(e) => handleDragStart(e, card)}
    ondragover={(e) => handleDragOver(e, columnId, index)}
    ondragend={handleDragEnd}
    onclick={(e) => {
      if (editingCardId === card.id) return;
      e.stopPropagation();
      openDetail(card);
    }}
    ondblclick={(e) => {
      e.stopPropagation();
      startEditing(card);
    }}
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (editingCardId === card.id) {
          saveEditing(card);
        } else {
          openDetail(card);
        }
      }
    }}
    class="group flex items-start gap-2 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)] p-3 cursor-grab active:cursor-grabbing transition-all hover:shadow-sm text-left
      {draggedCardId === card.id ? 'opacity-50 scale-95' : ''}
      {dragOverColumnId === columnId && dragOverIndex === index ? 'border-[var(--ui-primary)] border-dashed' : ''}"
  >
    <GripVertical class="size-4 mt-0.5 text-[var(--ui-muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />

    <div class="flex-1 min-w-0">
      {#if cardSnippet}
        {@render cardSnippet(card)}
      {:else}
        <!-- Labels -->
        {#if card.labels && card.labels.length > 0}
          <div class="flex flex-wrap gap-1 mb-1.5">
            {#each card.labels as label}
              <span
                class="text-[9px] font-medium px-1.5 py-0.5 rounded-full text-white"
                style="background-color: {label.color}"
              >
                {label.text}
              </span>
            {/each}
          </div>
        {/if}

        <!-- Title (inline editable) -->
        {#if editingCardId === card.id}
          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <input
            type="text"
            value={editingTitle}
            oninput={(e) => { editingTitle = e.currentTarget.value; }}
            onkeydown={(e) => {
              if (e.key === 'Enter') saveEditing(card);
              if (e.key === 'Escape') cancelEditing();
            }}
            onblur={() => saveEditing(card)}
            class="w-full text-sm font-medium px-1 py-0.5 -mx-1 -my-0.5 rounded border border-[var(--ui-primary)] bg-[var(--ui-card)] text-[var(--ui-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ui-primary)]"
            onclick={(e) => e.stopPropagation()}
          />
        {:else}
          <p class="text-sm font-medium text-[var(--ui-foreground)]">{card.title}</p>
        {/if}

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
{/snippet}
