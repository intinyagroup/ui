<script lang="ts">
  import type { PaginationState } from '@tanstack/table-core';
  import { ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { getPageCount, getVisibleRowRange, normalizePageSize } from '@intinyagroup/grid-core';

  let {
    pagination,
    rowCount,
    pageSizeOptions = [5, 10, 20, 50, 100],
    onPageChange,
    onPageSizeChange,
  }: {
    pagination: PaginationState;
    rowCount: number;
    pageSizeOptions?: number[];
    onPageChange: (pageIndex: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  } = $props();

  const pageCount = $derived(getPageCount(rowCount, pagination.pageSize));
  const visibleRange = $derived(getVisibleRowRange(rowCount, pagination));
  const safePageSizeOptions = $derived(
    Array.from(new Set([...pageSizeOptions, pagination.pageSize]))
      .filter((opt) => Number.isFinite(opt) && opt > 0)
      .map((opt) => Math.floor(opt))
      .sort((a, b) => a - b)
  );
</script>

<div class="flex flex-col gap-4 border-t border-[var(--ui-border)] bg-[var(--ui-secondary)]/35 px-5 py-4 text-xs font-medium text-[var(--ui-muted-foreground)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
  <div class="flex items-center gap-3">
    <span class="inline-flex h-6 items-center rounded-md bg-[var(--ui-card)] px-2.5 text-[11px] font-semibold text-[var(--ui-foreground)] shadow-sm">
      {#if rowCount === 0}
        0 rows
      {:else}
        {visibleRange.from}-{visibleRange.to} of {rowCount.toLocaleString()}
      {/if}
    </span>
    <p>records</p>
  </div>

  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
    <label class="flex items-center gap-3">
      <span class="text-[11px] text-[var(--ui-muted-foreground)]">Per page</span>
      <select
        class="h-8 rounded-md border border-[var(--ui-border)] bg-[var(--ui-card)] px-2 text-[11px] font-semibold text-[var(--ui-foreground)] outline-none focus:ring-2 focus:ring-[var(--ui-ring)]/20"
        value={pagination.pageSize}
        onchange={(e) => onPageSizeChange(Number((e.currentTarget as HTMLSelectElement).value))}
      >
        {#each safePageSizeOptions as option (option)}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </label>

    <div class="flex items-center gap-1 rounded-lg bg-[var(--ui-card)] p-1 shadow-sm">
      <Button variant="ghost" size="sm" class="size-8 p-0" disabled={pagination.pageIndex === 0} onclick={() => onPageChange(0)}>
        <ChevronsLeft class="size-3.5" />
      </Button>
      <Button variant="ghost" size="sm" class="size-8 p-0" disabled={pagination.pageIndex === 0} onclick={() => onPageChange(pagination.pageIndex - 1)}>
        <ChevronLeft class="size-3.5" />
      </Button>

      <div class="h-4 w-px bg-[var(--ui-border)]"></div>

      <span class="px-3 text-[11px] font-bold tracking-wider text-[var(--ui-foreground)]">
        {pagination.pageIndex + 1} / {pageCount}
      </span>

      <div class="h-4 w-px bg-[var(--ui-border)]"></div>

      <Button variant="ghost" size="sm" class="size-8 p-0" disabled={pagination.pageIndex >= pageCount - 1} onclick={() => onPageChange(pagination.pageIndex + 1)}>
        <ChevronRight class="size-3.5" />
      </Button>
      <Button variant="ghost" size="sm" class="size-8 p-0" disabled={pagination.pageIndex >= pageCount - 1} onclick={() => onPageChange(pageCount - 1)}>
        <ChevronsRight class="size-3.5" />
      </Button>
    </div>
  </div>
</div>
