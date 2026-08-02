<script lang="ts">
  import type { Header, HeaderGroup, Column, ColumnPinningState } from '@tanstack/table-core';
  import { ArrowUp, ArrowDown, ArrowUpDown, GripVertical } from 'lucide-svelte';
  import DataTableColumnMenu from './DataTableColumnMenu.svelte';
  import type { DataTableMeta } from '../../table/table-core.js';

  let {
    headerGroups,
    selectable,
    selectAllChecked,
    onToggleSelectAll,
    onSort,
    onPin,
    onHide,
    onFilter,
    onColumnReorder,
    density,
  }: {
    headerGroups: HeaderGroup<any>[];
    selectable: boolean;
    selectAllChecked: boolean;
    onToggleSelectAll: () => void;
    onSort: (columnId: string, direction: 'asc' | 'desc' | null) => void;
    onPin: (columnId: string, side: 'left' | 'right' | null) => void;
    onHide: (columnId: string) => void;
    onFilter: (columnId: string) => void;
    onColumnReorder: (fromId: string, toId: string) => void;
    density: 'compact' | 'spacious';
  } = $props();

  let dragColumnId = $state<string | null>(null);
  let dropTargetId = $state<string | null>(null);

  function columnAlign(columnDef: any) {
    return (columnDef.meta as DataTableMeta<any> | undefined)?.align;
  }

  function handleDragStart(e: DragEvent, columnId: string) {
    dragColumnId = columnId;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', columnId);
    }
  }

  function handleDragOver(e: DragEvent, columnId: string) {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    dropTargetId = columnId;
  }

  function handleDragLeave() {
    dropTargetId = null;
  }

  function handleDrop(e: DragEvent, columnId: string) {
    e.preventDefault();
    if (dragColumnId && dragColumnId !== columnId) {
      onColumnReorder(dragColumnId, columnId);
    }
    dragColumnId = null;
    dropTargetId = null;
  }

  function handleDragEnd() {
    dragColumnId = null;
    dropTargetId = null;
  }
</script>

<thead class="sticky top-0 z-20 bg-[var(--ui-secondary)]/80 text-left text-[11px] font-semibold text-[var(--ui-muted-foreground)] backdrop-blur-md">
  {#each headerGroups as headerGroup (headerGroup.id)}
    <tr>
      {#if selectable}
        <th class="w-12 px-4 py-3">
          <input
            type="checkbox"
            checked={selectAllChecked}
            onchange={onToggleSelectAll}
            class="size-4 rounded border-[var(--ui-input)] text-[var(--ui-primary)]"
            aria-label="Select all"
          />
        </th>
      {/if}
      {#each headerGroup.headers as header (header.id)}
        {@const column = header.column}
        {@const isPinnedLeft = column.getIsPinned() === 'left'}
        {@const isPinnedRight = column.getIsPinned() === 'right'}
        {@const canSort = column.getCanSort()}
        {@const currentSort = column.getIsSorted()}
        {@const meta = column.columnDef.meta as DataTableMeta<any> | undefined}

        <th
          class="px-4 py-3 transition-colors relative select-none
            {isPinnedLeft ? 'pinned-left bg-[var(--ui-card)] z-30 border-r border-[var(--ui-border)]' : ''}
            {isPinnedRight ? 'pinned-right bg-[var(--ui-card)] z-30 border-l border-[var(--ui-border)]' : ''}
            {canSort ? 'cursor-pointer hover:bg-[var(--ui-secondary)] hover:text-[var(--ui-foreground)]' : ''}
            {meta?.headerClassName ?? ''}
            {columnAlign(meta) === 'right' ? 'text-right' : ''}
            {dropTargetId === column.id ? 'bg-[var(--ui-primary)]/10' : ''}
            {density === 'compact' ? 'py-2' : 'py-3'}"
          style={column.getSize() !== 150 ? `width: ${column.getSize()}px; min-width: ${column.getSize()}px;` : ''}
          onclick={(e) => {
            if (canSort) {
              const direction = e.shiftKey ? (currentSort === 'asc' ? 'desc' : currentSort === 'desc' ? null : 'asc') : (currentSort === 'asc' ? 'desc' : currentSort === 'desc' ? null : 'asc');
              onSort(column.id, direction);
            }
          }}
          draggable="true"
          ondragstart={(e) => handleDragStart(e, column.id)}
          ondragover={(e) => handleDragOver(e, column.id)}
          ondragleave={handleDragLeave}
          ondrop={(e) => handleDrop(e, column.id)}
          ondragend={handleDragEnd}
        >
          {#if !header.isPlaceholder}
            <div class="flex items-center gap-2 {meta?.align === 'right' ? 'justify-end' : ''}">
              {#if canSort}
                <GripVertical class="size-3.5 opacity-30 cursor-grab active:cursor-grabbing shrink-0" />
              {/if}

              <span class="inline-flex items-center gap-1.5 min-w-0">
                {#if typeof column.columnDef.header === 'string'}
                  {column.columnDef.header}
                {/if}
                {#if canSort}
                  {#if currentSort === 'asc'}
                    <ArrowUp class="size-3 text-[var(--ui-primary)] shrink-0" />
                  {:else if currentSort === 'desc'}
                    <ArrowDown class="size-3 text-[var(--ui-primary)] shrink-0" />
                  {:else}
                    <ArrowUpDown class="size-3 opacity-20 shrink-0" />
                  {/if}
                {/if}
              </span>

              <div class="shrink-0">
                <DataTableColumnMenu
                  {column}
                  onSort={(dir) => onSort(column.id, dir)}
                  onPin={(side) => onPin(column.id, side)}
                  onHide={() => onHide(column.id)}
                  onFilter={() => onFilter(column.id)}
                  isFiltered={column.getIsFiltered()}
                />
              </div>
            </div>
          {/if}

          <!-- Resize handle -->
          {#if column.getCanResize()}
            <div
              class="absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none hover:bg-[var(--ui-primary)]/50 transition-colors
                {column.getIsResizing() ? 'bg-[var(--ui-primary)]' : ''}"
              onmousedown={column.getResizeHandler()}
              ontouchstart={column.getResizeHandler()}
            ></div>
          {/if}
        </th>
      {/each}
    </tr>
  {/each}
</thead>

<style>
  .pinned-left {
    position: sticky;
    left: 0;
  }
  .pinned-right {
    position: sticky;
    right: 0;
  }
</style>
