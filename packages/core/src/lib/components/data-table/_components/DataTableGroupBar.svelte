<script lang="ts">
  import { GripVertical, X } from 'lucide-svelte';
  import type { Column } from '@tanstack/table-core';

  let {
    columns,
    grouping,
    onGroupingChange,
  }: {
    columns: Column<any, unknown>[];
    grouping: string[];
    onGroupingChange: (grouping: string[]) => void;
  } = $props();

  let dragOver = $state(false);

  function getColumnLabel(columnId: string): string {
    const col = columns.find((c) => c.id === columnId);
    if (!col) return columnId;
    return typeof col.columnDef.header === 'string' ? col.columnDef.header : columnId;
  }

  function handleDragStart(e: DragEvent, columnId: string) {
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', columnId);
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    dragOver = true;
  }

  function handleDragLeave() {
    dragOver = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragOver = false;
    const columnId = e.dataTransfer?.getData('text/plain');
    if (columnId && !grouping.includes(columnId)) {
      onGroupingChange([...grouping, columnId]);
    }
  }

  function removeGroup(columnId: string) {
    onGroupingChange(grouping.filter((id) => id !== columnId));
  }

  function clearAll() {
    onGroupingChange([]);
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-[var(--ui-border)] bg-[var(--ui-secondary)]/30 px-3 py-2 transition-colors {dragOver ? 'border-[var(--ui-primary)] bg-[var(--ui-primary)]/5' : ''}"
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
  ondrop={handleDrop}
>
  <span class="text-[11px] font-medium uppercase tracking-wider text-[var(--ui-muted-foreground)]">Group by:</span>

  {#if grouping.length === 0}
    <span class="text-xs text-[var(--ui-muted-foreground)]/60">Drag column here to group</span>
  {:else}
    {#each grouping as columnId (columnId)}
      <span class="inline-flex items-center gap-1.5 rounded-md bg-[var(--ui-primary)]/10 px-2.5 py-1 text-xs font-medium text-[var(--ui-primary)]">
        <GripVertical class="size-3 opacity-50" />
        {getColumnLabel(columnId)}
        <button
          onclick={() => removeGroup(columnId)}
          class="ml-0.5 rounded-full p-0.5 hover:bg-[var(--ui-primary)]/20 transition-colors cursor-pointer"
          aria-label="Remove group"
        >
          <X class="size-3" />
        </button>
      </span>
    {/each}
    <button
      onclick={clearAll}
      class="text-[11px] text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] transition-colors cursor-pointer"
    >
      Clear all
    </button>
  {/if}
</div>
