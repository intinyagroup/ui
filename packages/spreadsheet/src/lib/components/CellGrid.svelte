<script lang="ts">
  import { createVirtualizer } from '@tanstack/svelte-virtual';
  import { colIndexToLabel, getCellId, parseCellId, clamp } from '../cell-utils.js';
  import { formatCellDisplay, coerceValue, type CellMap } from '../cell-model.js';
  import { isCellInRange, isCellInRanges, isCellActive, type CellRange } from '../selection-store.js';
  import CellEditor from './CellEditor.svelte';

  let {
    cells,
    rowCount = 100,
    colCount = 26,
    activeCell,
    selectionRanges,
    columnWidths = new Map(),
    rowHeights = new Map(),
    defaultColWidth = 100,
    defaultRowHeight = 32,
    onSelectCell,
    onEditCell,
    onStartSelection,
    onUpdateSelection,
    onEndSelection,
    editingCellId,
    onCommitEdit,
    onCancelEdit,
  }: {
    cells: CellMap;
    rowCount?: number;
    colCount?: number;
    activeCell: { row: number; col: number };
    selectionRanges: CellRange[];
    columnWidths?: Map<number, number>;
    rowHeights?: Map<number, number>;
    defaultColWidth?: number;
    defaultRowHeight?: number;
    onSelectCell: (row: number, col: number) => void;
    onEditCell: (row: number, col: number) => void;
    onStartSelection: (row: number, col: number) => void;
    onUpdateSelection: (row: number, col: number) => void;
    onEndSelection: () => void;
    editingCellId: string | null;
    onCommitEdit: (value: string) => void;
    onCancelEdit: () => void;
  } = $props();

  let scrollContainer: HTMLDivElement | null = $state(null);
  let isDragging = $state(false);

  function getColWidth(col: number): number {
    return columnWidths.get(col) ?? defaultColWidth;
  }

  function getRowHeight(row: number): number {
    return rowHeights.get(row) ?? defaultRowHeight;
  }

  const totalWidth = $derived(
    Array.from({ length: colCount }, (_, i) => getColWidth(i)).reduce((a, b) => a + b, 0)
  );

  const totalHeight = $derived(
    Array.from({ length: rowCount }, (_, i) => getRowHeight(i)).reduce((a, b) => a + b, 0)
  );

  const rowVirtualizer = $derived(
    scrollContainer
      ? createVirtualizer({
          count: rowCount,
          getScrollElement: () => scrollContainer,
          estimateSize: (index) => getRowHeight(index),
          overscan: 5,
        })
      : null
  );

  function handleMouseDown(row: number, col: number, e: MouseEvent) {
    e.preventDefault();
    if (e.shiftKey) {
      onUpdateSelection(row, col);
    } else {
      onSelectCell(row, col);
      onStartSelection(row, col);
    }
    isDragging = true;
  }

  function handleMouseOver(row: number, col: number) {
    if (isDragging) {
      onUpdateSelection(row, col);
    }
  }

  function handleMouseUp() {
    if (isDragging) {
      isDragging = false;
      onEndSelection();
    }
  }

  function handleDoubleClick(row: number, col: number) {
    onEditCell(row, col);
  }

  function handleKeydown(e: KeyboardEvent) {
    const { key, ctrlKey, metaKey } = e;
    const isCtrl = ctrlKey || metaKey;

    if (editingCellId) return;

    switch (key) {
      case 'ArrowDown': e.preventDefault(); onSelectCell(clamp(activeCell.row + 1, 0, rowCount - 1), activeCell.col); break;
      case 'ArrowUp': e.preventDefault(); onSelectCell(clamp(activeCell.row - 1, 0, rowCount - 1), activeCell.col); break;
      case 'ArrowRight': e.preventDefault(); onSelectCell(activeCell.row, clamp(activeCell.col + 1, 0, colCount - 1)); break;
      case 'ArrowLeft': e.preventDefault(); onSelectCell(activeCell.row, clamp(activeCell.col - 1, 0, colCount - 1)); break;
      case 'Tab':
        e.preventDefault();
        if (isCtrl) {
          onSelectCell(activeCell.row, clamp(activeCell.col - 1, 0, colCount - 1));
        } else {
          onSelectCell(activeCell.row, clamp(activeCell.col + 1, 0, colCount - 1));
        }
        break;
      case 'Enter':
        e.preventDefault();
        onEditCell(activeCell.row, activeCell.col);
        break;
      case 'F2':
        e.preventDefault();
        onEditCell(activeCell.row, activeCell.col);
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        onCommitEdit('');
        break;
      case 'Escape':
        onCancelEdit();
        break;
    }
  }
</script>

<svelte:window onmouseup={handleMouseUp} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="flex-1 overflow-auto outline-none"
  bind:this={scrollContainer}
  onkeydown={handleKeydown}
  tabindex={0}
  role="grid"
  aria-label="Spreadsheet"
>
  {#if rowVirtualizer}
    <div style="height: {totalHeight}px; width: {totalWidth}px;" class="relative">
      {#each rowVirtualizer.getVirtualItems() as virtualRow (virtualRow.key)}
        {@const row = virtualRow.index}
        <div
          class="absolute flex border-b border-[var(--ui-border)]/50"
          style="top: {virtualRow.start}px; height: {virtualRow.size}px; width: {totalWidth}px;"
        >
          <!-- Row header -->
          <div class="flex items-center justify-center border-r border-[var(--ui-border)] bg-[var(--ui-secondary)]/50 text-[10px] font-medium text-[var(--ui-muted-foreground)] shrink-0"
            style="width: 48px; height: {virtualRow.size}px;">
            {row + 1}
          </div>

          <!-- Cells -->
          {#each Array.from({ length: colCount }, (_, i) => i) as col (col)}
            {@const cellId = getCellId(row, col)}
            {@const cell = cells.get(cellId)}
            {@const isActive = isCellActive(row, col, activeCell)}
            {@const isSelected = isCellInRanges(row, col, selectionRanges)}
            {@const isEditing = editingCellId === cellId}
            {@const colWidth = getColWidth(col)}

            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="relative border-r border-[var(--ui-border)]/50 cursor-cell transition-colors
                {isActive ? 'ring-2 ring-[var(--ui-primary)] z-10' : ''}
                {isSelected && !isActive ? 'bg-[var(--ui-primary)]/8' : ''}
                {cell?.style?.bold ? 'font-bold' : ''}
                {cell?.style?.italic ? 'italic' : ''}
                {cell?.style?.align === 'right' ? 'text-right' : cell?.style?.align === 'center' ? 'text-center' : 'text-left'}"
              style="width: {colWidth}px; min-width: {colWidth}px; {cell?.style?.textColor ? `color: ${cell.style.textColor}` : ''} {cell?.style?.bgColor ? `background-color: ${cell.style.bgColor}` : ''}"
              onmousedown={(e) => handleMouseDown(row, col, e)}
              onmouseover={() => handleMouseOver(row, col)}
              ondblclick={() => handleDoubleClick(row, col)}
            >
              {#if isEditing}
                <CellEditor
                  value={cell?.formula ?? String(cell?.value ?? '')}
                  {onCommitEdit}
                  {onCancelEdit}
                />
              {:else}
                <div class="absolute inset-0 flex items-center px-1.5 text-sm truncate pointer-events-none">
                  {formatCellDisplay(cell?.value, cell?.style?.format)}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</div>
