<script lang="ts" generics="TData">
  import type { Row } from '@tanstack/table-core';
  import type { Snippet } from 'svelte';
  import type { DataTableMeta } from '../../table/table-core.js';

  let {
    row,
    selectable,
    isSelected,
    onToggleSelect,
    onRowClick,
    cell,
    density,
  }: {
    row: Row<TData>;
    selectable: boolean;
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
    onRowClick?: (row: TData) => void;
    cell?: Snippet<[{ row: TData; columnId: string; value: unknown }]>;
    density: 'compact' | 'spacious';
  } = $props();

  function columnAlign(columnDef: any) {
    return (columnDef.meta as DataTableMeta<any> | undefined)?.align;
  }

  function getCellStyle(column: any) {
    const meta = column.columnDef.meta as DataTableMeta<any> | undefined;
    const width = column.getSize();
    const style: Record<string, string> = {};
    if (width !== 150) {
      style.width = `${width}px`;
      style.minWidth = `${width}px`;
    }
    return Object.entries(style).map(([k, v]) => `${k}:${v}`).join('; ');
  }
</script>

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

  {#each row.getVisibleCells() as tableCell (tableCell.id)}
    {@const meta = tableCell.column.columnDef.meta as DataTableMeta<any> | undefined}
    {@const isPinnedLeft = tableCell.column.getIsPinned() === 'left'}
    {@const isPinnedRight = tableCell.column.getIsPinned() === 'right'}

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
