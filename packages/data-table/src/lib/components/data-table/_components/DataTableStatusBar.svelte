<script lang="ts">
  import type { SortingState, ColumnFiltersState } from '@tanstack/table-core';

  let {
    rowCount,
    selectedCount,
    sorting,
    columnFilters,
    tableId,
    actions,
  }: {
    rowCount: number;
    selectedCount: number;
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
    tableId?: string;
    actions?: import('svelte').Snippet;
  } = $props();

  const activeFilters = $derived(columnFilters.length);
  const activeSorts = $derived(sorting.length);
</script>

<div class="flex flex-wrap items-center gap-4 border-t border-[var(--ui-border)] bg-[var(--ui-card)] px-5 py-3 text-xs text-[var(--ui-muted-foreground)] sm:px-6">
  <div class="flex items-center gap-3">
    <span class="inline-flex items-center gap-1.5 rounded-md bg-[var(--ui-secondary)] px-2.5 py-1 font-medium text-[var(--ui-foreground)]">
      {rowCount.toLocaleString()} rows
    </span>

    {#if selectedCount > 0}
      <span class="inline-flex items-center gap-1.5 rounded-md bg-[var(--ui-primary)]/10 px-2.5 py-1 font-medium text-[var(--ui-primary)]">
        {selectedCount.toLocaleString()} selected
      </span>
    {/if}

    {#if activeSorts > 0}
      <span class="inline-flex items-center gap-1.5 rounded-md bg-[var(--ui-secondary)] px-2.5 py-1 font-medium">
        {activeSorts} sort{activeSorts !== 1 ? 's' : ''}
      </span>
    {/if}

    {#if activeFilters > 0}
      <span class="inline-flex items-center gap-1.5 rounded-md bg-[var(--ui-warning)]/10 px-2.5 py-1 font-medium text-[var(--ui-warning)]">
        {activeFilters} filter{activeFilters !== 1 ? 's' : ''}
      </span>
    {/if}
  </div>

  {#if tableId}
    <span class="text-[var(--ui-muted-foreground)]/60">id: {tableId}</span>
  {/if}

  <div class="ml-auto">
    {#if actions}
      {@render actions()}
    {/if}
  </div>
</div>
