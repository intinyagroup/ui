<script lang="ts" generics="TData">
  import { ArrowDown, ArrowUp, ArrowUpDown, ChevronsLeft, ChevronsRight, Search, ChevronDown, ChevronLeft, ChevronRight, Download, Plus } from 'lucide-svelte';
  import type { ColumnDef, PaginationState, SortingState, RowSelectionState } from '@tanstack/table-core';
  import type { Snippet } from 'svelte';
  import { untrack } from 'svelte';
  import { Button } from '../components/button/index.js';
  import { Skeleton } from '../components/skeleton/index.js';
  import { createCoreTableModel, type ServerSideConfig } from './table-core.js';
  import {
    DEFAULT_PAGE_SIZE_OPTIONS,
    getPageCount,
    getVisibleRowRange,
    resolvePagination
  } from './table-pagination.js';

  type PaginationChangeDetail = { pageIndex: number; pageSize: number };
  type SortingChangeDetail = { id: string; desc: boolean }[];
  type FilterChangeDetail = { globalFilter: string };

  let {
    data,
    columns,
    title,
    description,
    searchable = true,
    searchPlaceholder = 'Search...',
    emptyMessage = 'No rows found.',
    emptyDescription,
    pageSize = 10,
    pageSizeOptions = [...DEFAULT_PAGE_SIZE_OPTIONS],
    cell,
    rowClass,
    loading = false,
    selectable = false,
    selectedIds,
    emptyAction,
    bulkActions,
    actions,
    exportable = true,
    densityToggle = true,
    columnToggle = true,
    // Server-side props
    serverSide = false,
    rowCount = 0,
    manualPagination = false,
    manualSorting = false,
    manualFiltering = false,
    // Callbacks for server-side
    onPaginationChange,
    onSortingChange,
    onFilterChange,
    // External state control (for server-side)
    externalSorting,
    externalPagination,
    externalFilter,
  }: {
    data: TData[];
    columns: ColumnDef<TData, unknown>[];
    title?: string;
    description?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    emptyMessage?: string;
    emptyDescription?: string;
    pageSize?: number;
    pageSizeOptions?: number[];
    cell?: Snippet<[{ row: TData; columnId: string; value: unknown }]>;
    rowClass?: (row: TData) => string;
    loading?: boolean;
    selectable?: boolean;
    selectedIds?: string[];
    emptyAction?: { label: string; href?: string; onclick?: () => void };
    bulkActions?: Snippet<[{ selectedIds: string[] }]>;
    actions?: Snippet;
    exportable?: boolean;
    densityToggle?: boolean;
    columnToggle?: boolean;
    // Server-side
    serverSide?: boolean;
    rowCount?: number;
    manualPagination?: boolean;
    manualSorting?: boolean;
    manualFiltering?: boolean;
    onPaginationChange?: (detail: PaginationChangeDetail) => void;
    onSortingChange?: (detail: SortingChangeDetail) => void;
    onFilterChange?: (detail: FilterChangeDetail) => void;
    // External state
    externalSorting?: SortingState;
    externalPagination?: PaginationState;
    externalFilter?: string;
  } = $props();

  // Internal state (used when not in server-side mode)
  let sorting = $state<SortingState>(externalSorting ?? []);
  let pagination = $state<PaginationState>(externalPagination ?? { pageIndex: 0, pageSize: untrack(() => pageSize) });
  let globalFilter = $state(externalFilter ?? '');
  let lastPageSizeProp = $state(untrack(() => pageSize));
  let density = $state<'compact' | 'spacious'>('spacious');
  let columnVisibility = $state<Record<string, boolean>>({});
  let showColumnsDropdown = $state(false);

  // Sync external state
  $effect(() => {
    if (externalSorting) sorting = externalSorting;
  });
  $effect(() => {
    if (externalPagination) pagination = externalPagination;
  });
  $effect(() => {
    if (externalFilter !== undefined) globalFilter = externalFilter;
  });

  const serverSideConfig = $derived<ServerSideConfig | undefined>(
    serverSide ? { rowCount, manualPagination, manualSorting, manualFiltering } : undefined
  );

  // Compute effective row count
  const effectiveRowCount = $derived(serverSide ? rowCount : undefined);

  function toggleColumnVisibility(columnId: string, visible: boolean) {
    columnVisibility = { ...columnVisibility, [columnId]: visible };
  }

  function exportToCSV() {
    const rows = table.getFilteredRowModel().rows;
    if (!rows.length) return;

    const activeHeaders = table.getAllLeafColumns()
      .filter(col => col.getIsVisible() && typeof col.columnDef.header === 'string');

    const headerRow = activeHeaders.map(col => `"${col.columnDef.header}"`).join(',');
    const dataRows = rows.map(row => {
      return activeHeaders.map(col => {
        const value = row.getValue(col.id);
        const cellText = value !== undefined && value !== null ? String(value) : '';
        return `"${cellText.replaceAll('"', '""')}"`;
      }).join(',');
    });

    const csvContent = [headerRow, ...dataRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${title?.toLowerCase().replaceAll(' ', '_') || 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const table = $derived.by(() =>
    createCoreTableModel({
      data,
      columns,
      state: { sorting, pagination, globalFilter, columnVisibility },
      serverSide: serverSideConfig
    })
  );

  const headerGroups = $derived(table.getHeaderGroups());
  const rowModel = $derived(table.getRowModel());
  const filteredRowCount = $derived(serverSide ? rowCount : table.getFilteredRowModel().rows.length);
  const pageCount = $derived(getPageCount(filteredRowCount, pagination.pageSize));
  const visibleRange = $derived(getVisibleRowRange(filteredRowCount, pagination));
  const safePageSizeOptions = $derived(
    Array.from(new Set([...pageSizeOptions, pageSize, pagination.pageSize]))
      .filter((option) => Number.isFinite(option) && option > 0)
      .map((option) => Math.floor(option))
      .sort((a, b) => a - b)
  );

  let rowSelection = $state<RowSelectionState>({});
  let selectAllChecked = $state(false);
  const selectedCount = $derived(Object.keys(rowSelection).length);

  $effect(() => {
    selectAllChecked = rowModel.rows.length > 0 && Object.keys(rowSelection).length === rowModel.rows.length;
  });

  function toggleSelectAll() {
    if (selectAllChecked) {
      rowSelection = {};
    } else {
      const all: RowSelectionState = {};
      for (const row of rowModel.rows) all[row.id] = true;
      rowSelection = all;
    }
  }

  function toggleRow(id: string) {
    if (rowSelection[id]) {
      const next = { ...rowSelection };
      delete next[id];
      rowSelection = next;
    } else {
      rowSelection = { ...rowSelection, [id]: true };
    }
  }

  $effect(() => {
    if (pageSize !== lastPageSizeProp) {
      lastPageSizeProp = pageSize;
      pagination = resolvePagination(pagination, filteredRowCount, { pageIndex: 0, pageSize });
    }
  });

  $effect(() => {
    if (!serverSide) {
      const next = resolvePagination(pagination, filteredRowCount);
      if (next.pageIndex !== pagination.pageIndex || next.pageSize !== pagination.pageSize) {
        pagination = next;
      }
    }
  });

  function setGlobalFilter(value: string) {
    globalFilter = value;
    if (serverSide) {
      onFilterChange?.({ globalFilter: value });
    } else {
      pagination = resolvePagination(pagination, filteredRowCount, { pageIndex: 0 });
    }
  }

  function toggleSorting(columnId: string) {
    const current = sorting.find((item) => item.id === columnId);
    let nextSorting: SortingState;
    if (!current) {
      nextSorting = [{ id: columnId, desc: false }];
    } else if (!current.desc) {
      nextSorting = [{ id: columnId, desc: true }];
    } else {
      nextSorting = [];
    }

    sorting = nextSorting;

    if (serverSide) {
      onSortingChange?.(nextSorting);
    } else {
      pagination = resolvePagination(pagination, filteredRowCount, { pageIndex: 0 });
    }
  }

  function goToPage(pageIndex: number) {
    const next = resolvePagination(pagination, filteredRowCount, { pageIndex });
    pagination = next;
    if (serverSide) {
      onPaginationChange?.(next);
    }
  }

  function setPageSize(value: string) {
    const next = resolvePagination(pagination, filteredRowCount, {
      pageIndex: 0,
      pageSize: Number(value)
    });
    pagination = next;
    if (serverSide) {
      onPaginationChange?.(next);
    }
  }

  function columnAlign(columnDef: ColumnDef<TData, unknown>) {
    return (columnDef.meta as { align?: 'left' | 'right' } | undefined)?.align;
  }
</script>

<div class="min-w-0 max-w-full overflow-hidden rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] shadow-sm">
  <!-- Header -->
  {#if title || description || searchable}
    <div class="flex min-w-0 flex-col gap-4 border-b border-[var(--ui-border)] bg-[var(--ui-card)] p-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between">
      <div class="min-w-0 space-y-1">
        {#if title}
          <h3 class="break-words text-lg font-bold tracking-tight text-[var(--ui-foreground)]">{title}</h3>
        {/if}
        {#if description}
          <p class="break-words text-sm text-[var(--ui-muted-foreground)]">{description}</p>
        {/if}
      </div>

      <div class="flex flex-wrap items-center gap-3">
        {#if searchable}
          <label class="relative block min-w-0 max-w-full sm:w-64">
            <Search class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--ui-muted-foreground)]" />
            <input
              value={globalFilter}
              placeholder={searchPlaceholder}
              class="h-10 w-full rounded-lg border border-[var(--ui-input)] bg-[var(--ui-background)] pl-10 pr-4 text-sm text-[var(--ui-foreground)] outline-none transition-colors placeholder:text-[var(--ui-muted-foreground)]/60 focus:border-[var(--ui-primary)]/40 focus:ring-2 focus:ring-[var(--ui-ring)]/20"
              oninput={(event) => setGlobalFilter((event.currentTarget as HTMLInputElement).value)}
            />
          </label>
        {/if}

        {#if columnToggle}
          <div class="relative">
            <button
              type="button"
              onclick={() => showColumnsDropdown = !showColumnsDropdown}
              class="flex h-10 items-center gap-2 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)] px-3 text-xs font-medium text-[var(--ui-muted-foreground)] transition-colors hover:bg-[var(--ui-secondary)] hover:text-[var(--ui-foreground)]"
            >
              Columns <ChevronDown class="size-3.5" />
            </button>

            {#if showColumnsDropdown}
              <button type="button" class="fixed inset-0 z-40 bg-transparent" onclick={() => showColumnsDropdown = false} aria-label="Close"></button>
              <div class="absolute right-0 z-50 mt-1.5 w-48 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] p-2 shadow-lg">
                {#each table.getAllLeafColumns() as column (column.id)}
                  {#if typeof column.columnDef.header === 'string'}
                    <label class="flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)] hover:text-[var(--ui-foreground)]">
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onchange={(e) => toggleColumnVisibility(column.id, e.currentTarget.checked)}
                        class="size-3.5 rounded border-[var(--ui-input)] text-[var(--ui-primary)]"
                      />
                      <span>{column.columnDef.header}</span>
                    </label>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
        {/if}

        {#if densityToggle}
          <div class="flex items-center rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)] p-1">
            <button
              type="button"
              onclick={() => density = 'compact'}
              class="rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors {density === 'compact' ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] shadow-sm' : 'text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)] hover:text-[var(--ui-foreground)]'}"
            >
              Compact
            </button>
            <button
              type="button"
              onclick={() => density = 'spacious'}
              class="rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors {density === 'spacious' ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] shadow-sm' : 'text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)] hover:text-[var(--ui-foreground)]'}"
            >
              Normal
            </button>
          </div>
        {/if}

        {#if exportable}
          <Button variant="outline" size="sm" onclick={exportToCSV}>
            <Download class="size-3.5" /> Export
          </Button>
        {/if}

        {#if actions}
          {@render actions()}
        {/if}
      </div>
    </div>
  {/if}

  <!-- Bulk Actions Bar -->
  {#if selectedCount > 0}
    <div class="flex items-center gap-3 border-b border-[var(--ui-primary)]/20 bg-[var(--ui-primary)]/5 px-6 py-3 text-sm font-medium text-[var(--ui-primary)]">
      <span>{selectedCount} selected</span>
      <div class="ml-auto flex items-center gap-2">
        {#if bulkActions}
          {@render bulkActions({ selectedIds: Object.keys(rowSelection) })}
        {/if}
        <button onclick={() => rowSelection = {}} type="button" class="text-xs font-semibold text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] transition-colors">Clear</button>
      </div>
    </div>
  {/if}

  <!-- Table -->
  <div class="max-w-full overflow-x-auto">
    <table class="min-w-full text-sm tabular-nums">
      <thead class="sticky top-0 z-20 bg-[var(--ui-secondary)]/80 text-left text-[11px] font-semibold text-[var(--ui-muted-foreground)] backdrop-blur-md">
        {#each headerGroups as headerGroup (headerGroup.id)}
          <tr>
            {#if selectable}
              <th class="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectAllChecked}
                  onchange={toggleSelectAll}
                  class="size-4 rounded border-[var(--ui-input)] text-[var(--ui-primary)]"
                  aria-label="Select all"
                />
              </th>
            {/if}
            {#each headerGroup.headers as header (header.id)}
              <th
                class="px-6 py-3 transition-colors {header.column.getCanSort() ? 'cursor-pointer select-none hover:bg-[var(--ui-secondary)] hover:text-[var(--ui-foreground)]' : ''} {columnAlign(header.column.columnDef) === 'right' ? 'text-right' : ''}"
                onclick={() => header.column.getCanSort() && toggleSorting(header.column.id)}
              >
                {#if !header.isPlaceholder}
                  <span class="inline-flex items-center gap-2">
                    {#if typeof header.column.columnDef.header === 'string'}
                      {header.column.columnDef.header}
                    {/if}
                    {#if header.column.getCanSort()}
                      {#if header.column.getIsSorted() === 'asc'}
                        <ArrowUp class="size-3 text-[var(--ui-primary)]" />
                      {:else if header.column.getIsSorted() === 'desc'}
                        <ArrowDown class="size-3 text-[var(--ui-primary)]" />
                      {:else}
                        <ArrowUpDown class="size-3 opacity-20" />
                      {/if}
                    {/if}
                  </span>
                {/if}
              </th>
            {/each}
          </tr>
        {/each}
      </thead>
      <tbody>
        {#each rowModel.rows as row (row.id)}
          <tr
            class="group border-t border-[var(--ui-border)]/70 transition-colors hover:bg-[var(--ui-secondary)]/45 {rowClass ? rowClass(row.original) : ''} {selectable ? 'cursor-pointer' : ''}"
            onclick={selectable ? () => toggleRow(row.id) : undefined}
          >
            {#if selectable}
              <td class="w-12 px-4 align-middle {density === 'compact' ? 'py-2.5' : 'py-4'}">
                <input
                  type="checkbox"
                  checked={!!rowSelection[row.id]}
                  onchange={() => toggleRow(row.id)}
                  onclick={(e) => e.stopPropagation()}
                  class="size-4 rounded border-[var(--ui-input)] text-[var(--ui-primary)]"
                  aria-label="Select row"
                />
              </td>
            {/if}
            {#each row.getVisibleCells() as tableCell (tableCell.id)}
              <td class="px-6 align-middle text-sm font-medium text-[var(--ui-foreground)] {density === 'compact' ? 'py-2.5' : 'py-4'} {columnAlign(tableCell.column.columnDef) === 'right' ? 'text-right' : ''}">
                {#if cell}
                  {@render cell({
                    row: row.original,
                    columnId: tableCell.column.id,
                    value: tableCell.getValue()
                  })}
                {:else}
                  {tableCell.getValue() ?? '-'}
                {/if}
              </td>
            {/each}
          </tr>
        {/each}

        {#if loading}
          {#each [1, 2, 3, 4, 5] as rowIndex (rowIndex)}
            <tr>
              <td colspan={columns.length + (selectable ? 1 : 0)} class="px-6 py-3">
                <Skeleton class="h-8 w-full" />
              </td>
            </tr>
          {/each}
        {:else if filteredRowCount === 0}
          <tr>
            <td colspan={columns.length + (selectable ? 1 : 0)} class="px-6 py-12 text-center">
              <div class="flex flex-col items-center gap-3">
                <p class="text-sm font-medium text-[var(--ui-foreground)]">{emptyMessage}</p>
                {#if emptyDescription}
                  <p class="text-sm text-[var(--ui-muted-foreground)]">{emptyDescription}</p>
                {/if}
                {#if emptyAction}
                  {#if emptyAction.href}
                    <a href={emptyAction.href} class="inline-flex items-center gap-2 rounded-lg bg-[var(--ui-primary)] px-4 py-2 text-sm font-medium text-[var(--ui-primary-foreground)] transition-colors hover:bg-[var(--ui-primary)]/90">
                      <Plus class="size-4" /> {emptyAction.label}
                    </a>
                  {:else}
                    <button onclick={emptyAction.onclick} type="button" class="inline-flex items-center gap-2 rounded-lg bg-[var(--ui-primary)] px-4 py-2 text-sm font-medium text-[var(--ui-primary-foreground)] transition-colors hover:bg-[var(--ui-primary)]/90">
                      <Plus class="size-4" /> {emptyAction.label}
                    </button>
                  {/if}
                {/if}
              </div>
            </td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>

  <!-- Footer -->
  <div class="flex flex-col gap-4 border-t border-[var(--ui-border)] bg-[var(--ui-secondary)]/35 px-5 py-4 text-xs font-medium text-[var(--ui-muted-foreground)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
    <div class="flex items-center gap-3">
      <span class="inline-flex h-6 items-center rounded-md bg-[var(--ui-card)] px-2.5 text-[11px] font-semibold text-[var(--ui-foreground)] shadow-sm">
        {#if filteredRowCount === 0}
          0 rows
        {:else}
          {visibleRange.from}-{visibleRange.to} of {filteredRowCount.toLocaleString()}
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
          onchange={(event) => setPageSize((event.currentTarget as HTMLSelectElement).value)}
        >
          {#each safePageSizeOptions as option (option)}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </label>

      <div class="flex items-center gap-1 rounded-lg bg-[var(--ui-card)] p-1 shadow-sm">
        <Button type="button" variant="ghost" size="sm" class="size-8 p-0" disabled={pagination.pageIndex === 0} onclick={() => goToPage(0)}>
          <ChevronsLeft class="size-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="sm" class="size-8 p-0" disabled={pagination.pageIndex === 0} onclick={() => goToPage(pagination.pageIndex - 1)}>
          <ChevronLeft class="size-3.5" />
        </Button>

        <div class="h-4 w-px bg-[var(--ui-border)]"></div>

        <span class="px-3 text-[11px] font-bold tracking-wider text-[var(--ui-foreground)]">
          {pagination.pageIndex + 1} / {pageCount}
        </span>

        <div class="h-4 w-px bg-[var(--ui-border)]"></div>

        <Button type="button" variant="ghost" size="sm" class="size-8 p-0" disabled={pagination.pageIndex >= pageCount - 1} onclick={() => goToPage(pagination.pageIndex + 1)}>
          <ChevronRight class="size-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="sm" class="size-8 p-0" disabled={pagination.pageIndex >= pageCount - 1} onclick={() => goToPage(pageCount - 1)}>
          <ChevronsRight class="size-3.5" />
        </Button>
      </div>
    </div>
  </div>
</div>
