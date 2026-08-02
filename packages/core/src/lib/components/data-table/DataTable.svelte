<script lang="ts" generics="TData">
  import { Search, ChevronDown, Download, Plus } from 'lucide-svelte';
  import type { ColumnDef, PaginationState, SortingState, RowSelectionState, ColumnPinningState, ColumnOrderState, ExpandedState, ColumnFiltersState } from '@tanstack/table-core';
  import type { Snippet } from 'svelte';
  import { untrack } from 'svelte';
  import { Button } from '../../button/index.js';
  import { Skeleton } from '../../skeleton/index.js';
  import { createCoreTableModel, type ServerSideConfig } from '../../../table/table-core.js';
  import { resolvePagination, getPageCount, DEFAULT_PAGE_SIZE_OPTIONS } from '../../../table/table-pagination.js';
  import DataTableHeader from './_components/DataTableHeader.svelte';
  import DataTableRow from './_components/DataTableRow.svelte';
  import DataTablePagination from './_components/DataTablePagination.svelte';

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
    columnReorder = true,
    // Expand/detail
    expandable = false,
    detail,
    // Editable
    editableColumns = [],
    // Server-side
    serverSide = false,
    rowCount = 0,
    manualPagination = false,
    manualSorting = false,
    manualFiltering = false,
    // Callbacks
    onPaginationChange,
    onSortingChange,
    onFilterChange,
    onColumnFilterChange,
    onColumnReorder,
    onColumnPinningChange,
    onExpandedChange,
    onCellEdit,
    // External state
    externalSorting,
    externalPagination,
    externalFilter,
    externalColumnPinning,
    externalColumnOrder,
    externalExpanded,
    externalColumnFilters,
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
    columnReorder?: boolean;
    expandable?: boolean;
    detail?: Snippet<[{ row: TData; rowIndex: number }]>;
    editableColumns?: string[];
    // Server-side
    serverSide?: boolean;
    rowCount?: number;
    manualPagination?: boolean;
    manualSorting?: boolean;
    manualFiltering?: boolean;
    // Callbacks
    onPaginationChange?: (detail: PaginationChangeDetail) => void;
    onSortingChange?: (detail: SortingChangeDetail) => void;
    onFilterChange?: (detail: FilterChangeDetail) => void;
    onColumnFilterChange?: (detail: { columnId: string; filterValue: unknown }) => void;
    onColumnReorder?: (detail: { fromId: string; toId: string }) => void;
    onColumnPinningChange?: (detail: ColumnPinningState) => void;
    onExpandedChange?: (detail: ExpandedState) => void;
    onCellEdit?: (detail: { rowId: string; columnId: string; value: unknown }) => void;
    // External state
    externalSorting?: SortingState;
    externalPagination?: PaginationState;
    externalFilter?: string;
    externalColumnPinning?: ColumnPinningState;
    externalColumnOrder?: ColumnOrderState;
    externalExpanded?: ExpandedState;
    externalColumnFilters?: ColumnFiltersState;
  } = $props();

  // Internal state
  let sorting = $state<SortingState>(externalSorting ?? []);
  let pagination = $state<PaginationState>(externalPagination ?? { pageIndex: 0, pageSize: untrack(() => pageSize) });
  let globalFilter = $state(externalFilter ?? '');
  let lastPageSizeProp = $state(untrack(() => pageSize));
  let density = $state<'compact' | 'spacious'>('spacious');
  let columnVisibility = $state<Record<string, boolean>>({});
  let columnPinning = $state<ColumnPinningState>(externalColumnPinning ?? { left: [], right: [] });
  let columnOrder = $state<ColumnOrderState>(externalColumnOrder ?? []);
  let expanded = $state<ExpandedState>(externalExpanded ?? {});
  let columnFilters = $state<ColumnFiltersState>(externalColumnFilters ?? []);
  let showColumnsDropdown = $state(false);
  let rowSelection = $state<RowSelectionState>({});
  let selectAllChecked = $state(false);
  let activeFilterColumnId = $state<string | null>(null);

  // Sync external state
  $effect(() => { if (externalSorting) sorting = externalSorting; });
  $effect(() => { if (externalPagination) pagination = externalPagination; });
  $effect(() => { if (externalFilter !== undefined) globalFilter = externalFilter; });
  $effect(() => { if (externalColumnPinning) columnPinning = externalColumnPinning; });
  $effect(() => { if (externalColumnOrder) columnOrder = externalColumnOrder; });
  $effect(() => { if (externalExpanded) expanded = externalExpanded; });
  $effect(() => { if (externalColumnFilters) columnFilters = externalColumnFilters; });

  const serverSideConfig = $derived<ServerSideConfig | undefined>(
    serverSide ? { rowCount, manualPagination, manualSorting, manualFiltering } : undefined
  );

  const table = $derived.by(() =>
    createCoreTableModel({
      data,
      columns,
      state: { sorting, pagination, globalFilter, columnVisibility, columnPinning, columnOrder, expanded, columnFilters },
      serverSide: serverSideConfig,
    })
  );

  const headerGroups = $derived(table.getHeaderGroups());
  const rowModel = $derived(table.getRowModel());
  const filteredRowCount = $derived(serverSide ? rowCount : table.getFilteredRowModel().rows.length);
  const pageCount = $derived(getPageCount(filteredRowCount, pagination.pageSize));
  const selectedCount = $derived(Object.keys(rowSelection).length);

  $effect(() => {
    selectAllChecked = rowModel.rows.length > 0 && Object.keys(rowSelection).length === rowModel.rows.length;
  });

  function toggleColumnVisibility(columnId: string, visible: boolean) {
    columnVisibility = { ...columnVisibility, [columnId]: visible };
  }

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
      const next = { ...rowSelection }; delete next[id]; rowSelection = next;
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

  function handleSort(columnId: string, direction: 'asc' | 'desc' | null) {
    const nextSorting = direction === null ? [] : [{ id: columnId, desc: direction === 'desc' }];
    sorting = nextSorting;
    if (serverSide) onSortingChange?.(nextSorting);
    else pagination = resolvePagination(pagination, filteredRowCount, { pageIndex: 0 });
  }

  function handlePin(columnId: string, side: 'left' | 'right' | null) {
    const next = { left: [...columnPinning.left], right: [...columnPinning.right] };
    next.left = next.left.filter((id) => id !== columnId);
    next.right = next.right.filter((id) => id !== columnId);
    if (side === 'left') next.left.push(columnId);
    else if (side === 'right') next.right.push(columnId);
    columnPinning = next;
    onColumnPinningChange?.(next);
  }

  function handleHide(columnId: string) {
    const col = table.getColumn(columnId);
    if (col) col.toggleVisibility(false);
  }

  function handleColumnReorder(fromId: string, toId: string) {
    const currentOrder = columnOrder.length > 0
      ? columnOrder
      : columns.map((_, i) => String(i));
    const fromIdx = currentOrder.indexOf(fromId);
    const toIdx = currentOrder.indexOf(toId);
    if (fromIdx === -1 || toIdx === -1) return;
    const next = [...currentOrder];
    next.splice(fromIdx, 1);
    next.splice(toIdx, 0, fromId);
    columnOrder = next;
    onColumnReorder?.({ fromId, toId });
  }

  function handleColumnFilter(columnId: string, filterValue: unknown) {
    const col = table.getColumn(columnId);
    if (col) {
      col.setFilterValue(filterValue);
      const nextFilters = col.getFilterValue() !== undefined
        ? [...columnFilters.filter((f) => f.id !== columnId), { id: columnId, value: filterValue }]
        : columnFilters.filter((f) => f.id !== columnId);
      columnFilters = nextFilters;
      onColumnFilterChange?.({ columnId, filterValue });
    }
  }

  function toggleExpand(rowId: string) {
    const next = { ...expanded };
    if (next[rowId]) delete next[rowId]; else next[rowId] = true;
    expanded = next;
    onExpandedChange?.(next);
  }

  function goToPage(pageIndex: number) {
    const next = resolvePagination(pagination, filteredRowCount, { pageIndex });
    pagination = next;
    if (serverSide) onPaginationChange?.(next);
  }

  function setPageSize(value: string) {
    const next = resolvePagination(pagination, filteredRowCount, { pageIndex: 0, pageSize: Number(value) });
    pagination = next;
    if (serverSide) onPaginationChange?.(next);
  }

  function exportToCSV() {
    const rows = table.getFilteredRowModel().rows;
    if (!rows.length) return;
    const activeHeaders = table.getAllLeafColumns()
      .filter((col) => col.getIsVisible() && typeof col.columnDef.header === 'string');
    const headerRow = activeHeaders.map((col) => `"${col.columnDef.header}"`).join(',');
    const dataRows = rows.map((row) =>
      activeHeaders.map((col) => {
        const value = row.getValue(col.id);
        return `"${value !== undefined && value !== null ? String(value).replaceAll('"', '""') : ''}"`;
      }).join(',')
    );
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
              oninput={(e) => setGlobalFilter((e.currentTarget as HTMLInputElement).value)}
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
              <div class="absolute right-0 z-50 mt-1.5 w-52 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] p-2 shadow-lg">
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
            <button type="button" onclick={() => density = 'compact'} class="rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors {density === 'compact' ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] shadow-sm' : 'text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)] hover:text-[var(--ui-foreground)]'}">Compact</button>
            <button type="button" onclick={() => density = 'spacious'} class="rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors {density === 'spacious' ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] shadow-sm' : 'text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)] hover:text-[var(--ui-foreground)]'}">Normal</button>
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
      <DataTableHeader
        {headerGroups}
        {selectable}
        {selectAllChecked}
        {density}
        onToggleSelectAll={toggleSelectAll}
        onSort={handleSort}
        onPin={handlePin}
        onHide={handleHide}
        onFilter={() => {}}
        onColumnReorder={handleColumnReorder}
      />

      <tbody>
        {#each rowModel.rows as row (row.id)}
          <DataTableRow
            {row}
            {selectable}
            isSelected={!!rowSelection[row.id]}
            onToggleSelect={toggleRow}
            {cell}
            {density}
            expanded={!!expanded[row.id]}
            onExpandToggle={toggleExpand}
            {detail}
            canExpand={expandable}
            {editableColumns}
            columnCount={table.getAllLeafColumns().length}
          />
        {/each}

        {#if loading}
          {#each [1, 2, 3, 4, 5] as idx (idx)}
            <tr>
              <td colspan={table.getAllLeafColumns().length + (selectable ? 1 : 0) + (expandable ? 1 : 0)} class="px-6 py-3">
                <Skeleton class="h-8 w-full" />
              </td>
            </tr>
          {/each}
        {:else if filteredRowCount === 0}
          <tr>
            <td colspan={table.getAllLeafColumns().length + (selectable ? 1 : 0) + (expandable ? 1 : 0)} class="px-6 py-12 text-center">
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

  <!-- Pagination -->
  <DataTablePagination
    {pagination}
    rowCount={filteredRowCount}
    {pageSizeOptions}
    onPageChange={goToPage}
    onPageSizeChange={(size) => setPageSize(String(size))}
  />
</div>
