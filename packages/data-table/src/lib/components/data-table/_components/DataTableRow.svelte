<script lang="ts" generics="TData">
  import type { Row } from '@tanstack/table-core';
  import type { Snippet } from 'svelte';
  import type { DataTableMeta } from '@intinyagroup/grid-core';
  import DataTableDetailRow from './DataTableDetailRow.svelte';
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
  class="group border-t border-[var(--ui-border)]/70 transition-colors hover:bg-[var(--ui-secondary)]/45 {selectable ? 'cursor-pointer' : ''} {isSelected ? 'bg-[var(--ui-primary)]/5' : ''}"
  onclick={selectable ? () => onToggleSelect(row.id) : onRowClick ? () => onRowClick(row.original) : undefined}
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
  {#if canExpand}
    <td class="w-10 px-2 align-middle {density === 'compact' ? 'py-2' : 'py-4'}">
      <button
        onclick={(e) => { e.stopPropagation(); onExpandToggle?.(row.id); }}
        class="flex items-center justify-center size-6 rounded-md text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)] transition-colors cursor-pointer"
        aria-label={expanded ? 'Collapse row' : 'Expand row'}
      >
        <ChevronRight class="size-4 transition-transform {expanded ? 'rotate-90' : ''}" />
      </button>
    </td>
  {/if}

  {#each row.getVisibleCells() as tableCell (tableCell.id)}
    {@const meta = tableCell.column.columnDef.meta as DataTableMeta<any> | undefined}
    {@const isPinnedLeft = tableCell.column.getIsPinned() === 'left'}
    {@const isPinnedRight = tableCell.column.getIsPinned() === 'right'}
    {@const isEditable = editableColumns.includes(tableCell.column.id) || meta?.editable}

    <td
      class="px-4 align-middle text-sm font-medium text-[var(--ui-foreground)]
        {isPinnedLeft ? 'pinned-left bg-[var(--ui-card)] z-10 border-r border-[var(--ui-border)]' : ''}
        {isPinnedRight ? 'pinned-right bg-[var(--ui-card)] z-10 border-l border-[var(--ui-border)]' : ''}
        {meta?.cellClassName ?? ''}
        {columnAlign(meta) === 'right' ? 'text-right' : ''}
        {density === 'compact' ? 'py-2' : 'py-4'}"
      style={getCellStyle(tableCell.column)}
    >
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
