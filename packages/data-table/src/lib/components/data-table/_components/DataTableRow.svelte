<script lang="ts" generics="TData">
  import type { Row } from '@tanstack/table-core';
  import type { Snippet } from 'svelte';
  import type { DataTableMeta } from '@intinyagroup/grid-core';
  import DataTableDetailRow from './DataTableDetailRow.svelte';
  import DataTableCellEdit from './DataTableCellEdit.svelte';
  import { ChevronRight } from 'lucide-svelte';

  let {
    row,
    selectable,
    isSelected,
    onToggleSelect,
    onRowClick,
    cell,
    density,
    expanded = false,
    onExpandToggle,
    detail,
    canExpand = false,
    editableColumns = [],
    onCellEdit,
    columnCount,
    isPinned = false,
    pinnedOffset = 0,
    focusedCell = null,
  }: {
    row: Row<TData>;
    selectable: boolean;
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
    onRowClick?: (row: TData) => void;
    cell?: Snippet<[{ row: TData; columnId: string; value: unknown }]>;
    density: 'compact' | 'spacious';
    expanded?: boolean;
    onExpandToggle?: (id: string) => void;
    detail?: Snippet<[{ row: TData; rowIndex: number }]>;
    canExpand?: boolean;
    editableColumns?: string[];
    onCellEdit?: (rowId: string, columnId: string, value: unknown) => void;
    columnCount: number;
    isPinned?: boolean;
    pinnedOffset?: number;
    focusedCell?: { rowId: string; columnId: string } | null;
  } = $props();

  function columnAlign(columnDef: any) {
    return (columnDef.meta as DataTableMeta<any> | undefined)?.align;
  }

  function getCellStyle(column: any) {
    const width = column.getSize();
    const style: Record<string, string> = {};
    if (width !== 150) {
      style.width = `${width}px`;
      style.minWidth = `${width}px`;
    }
    return Object.entries(style).map(([k, v]) => `${k}:${v}`).join('; ');
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<tr
  class="group border-t border-[var(--ui-border)]/70 transition-colors hover:bg-[var(--ui-secondary)]/45 {row.getIsGrouped() ? 'bg-[var(--ui-secondary)]/30 font-semibold cursor-pointer' : ''} {selectable ? 'cursor-pointer' : ''} {isSelected ? 'bg-[var(--ui-primary)]/5' : ''} {isPinned ? 'sticky z-20 bg-[var(--ui-card)] shadow-[0_2px_4px_-1px_rgba(0,0,0,0.06)]' : ''}"
  style={isPinned ? `top: ${pinnedOffset}px;` : undefined}
  onclick={row.getIsGrouped() ? row.getToggleExpandedHandler() : selectable ? () => onToggleSelect(row.id) : onRowClick ? () => onRowClick(row.original) : undefined}
>
  {#if selectable}
    <td class="w-12 px-4 align-middle {density === 'compact' ? 'py-2' : 'py-4'}">
      <input
        type="checkbox"
        checked={isSelected}
        onchange={() => onToggleSelect(row.id)}
        onclick={(e) => e.stopPropagation()}
        class="size-4 rounded border-[var(--ui-input)] text-[var(--ui-primary)]"
        aria-label="Select row"
      />
    </td>
  {/if}

  <!-- Expand toggle cell -->
  {#if canExpand || row.getIsGrouped()}
    <td class="w-10 px-2 align-middle {density === 'compact' ? 'py-2' : 'py-4'}">
      <button
        onclick={(e) => {
          e.stopPropagation();
          if (row.getIsGrouped()) row.toggleExpanded();
          else onExpandToggle?.(row.id);
        }}
        class="flex items-center justify-center size-6 rounded-md text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)] transition-colors cursor-pointer"
        aria-label={row.getIsExpanded() || expanded ? 'Collapse row' : 'Expand row'}
      >
        <ChevronRight class="size-4 transition-transform {row.getIsExpanded() || expanded ? 'rotate-90' : ''}" />
      </button>
    </td>
  {/if}

  {#each row.getVisibleCells() as tableCell (tableCell.id)}
    {@const meta = tableCell.column.columnDef.meta as DataTableMeta<any> | undefined}
    {@const isPinnedLeft = tableCell.column.getIsPinned() === 'left'}
    {@const isPinnedRight = tableCell.column.getIsPinned() === 'right'}
    {@const isEditable = editableColumns.includes(tableCell.column.id) || meta?.editable}

    {@const isFocused = focusedCell?.rowId === row.id && focusedCell?.columnId === tableCell.column.id}

    <td
      class="px-4 align-middle text-sm font-medium text-[var(--ui-foreground)] transition-shadow
        {isFocused ? 'ring-2 ring-inset ring-[var(--ui-primary)] bg-[var(--ui-primary)]/5 z-10' : ''}
        {isPinnedLeft ? 'pinned-left bg-[var(--ui-card)] z-10 border-r border-[var(--ui-border)]' : ''}
        {isPinnedRight ? 'pinned-right bg-[var(--ui-card)] z-10 border-l border-[var(--ui-border)]' : ''}
        {meta?.cellClassName ?? ''}
        {columnAlign(meta) === 'right' ? 'text-right' : ''}
        {density === 'compact' ? 'py-2' : 'py-4'}"
    >
      {#if row.getIsGrouped() && tableCell.getIsGrouped()}
        <div class="flex items-center gap-2">
          <span>{tableCell.getValue() ?? '-'}</span>
          <span class="inline-flex items-center rounded-full bg-[var(--ui-primary)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--ui-primary)]">
            {row.subRows.length} items
          </span>
        </div>
      {:else if isEditable}
        <DataTableCellEdit
          value={tableCell.getValue()}
          editable={true}
          onCommit={(newVal) => onCellEdit?.(row.id, tableCell.column.id, newVal)}
          onCancel={() => {}}
        />
      {:else if cell}
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

{#if canExpand && expanded}
  <DataTableDetailRow
    {row}
    {detail}
    colSpan={row.getVisibleCells().length + (selectable ? 1 : 0) + (canExpand ? 1 : 0)}
  />
{/if}

<style>
  .pinned-left {
    position: sticky;
    left: 0;
    box-shadow: 2px 0 5px -2px rgba(0, 0, 0, 0.06);
  }
  .pinned-right {
    position: sticky;
    right: 0;
    box-shadow: -2px 0 5px -2px rgba(0, 0, 0, 0.06);
  }
</style>
