<script lang="ts">
  import { untrack } from 'svelte';
  import { getCellId, parseCellId, coerceValue } from '../cell-utils.js';
  import { setCellValue, createCell, type CellMap } from '../cell-model.js';
  import { createSelectionState, type CellRange, type SelectionState } from '../selection-store.js';
  import { createWorkbookState, getActiveSheet, addSheet, removeSheet, renameSheet, setActiveSheet, type WorkbookState, type Sheet } from '../sheet-store.js';
  import { createUndoRedoState, pushUndo, undo as undoAction, redo as redoAction, type UndoRedoState } from '../undo-redo.js';
  import CellGrid from './CellGrid.svelte';
  import FormulaBar from './FormulaBar.svelte';
  import SheetTabs from './SheetTabs.svelte';

  let {
    initialData,
    rowCount = 100,
    colCount = 26,
    class: className,
  }: {
    initialData?: { cells: CellMap; sheetName?: string }[];
    rowCount?: number;
    colCount?: number;
    class?: string;
  } = $props();

  // Workbook state
  let workbook = $state<WorkbookState>(
    initialData
      ? {
          sheets: initialData.map((d, i) => ({
            id: `sheet-${i + 1}`,
            name: d.sheetName ?? `Sheet ${i + 1}`,
            cells: d.cells,
            selection: createSelectionState(),
            columnWidths: new Map(),
            rowHeights: new Map(),
            frozenRows: 0,
            frozenCols: 0,
          })),
          activeSheetId: 'sheet-1',
        }
      : createWorkbookState(1)
  );

  let undoRedo = $state(createUndoRedoState());
  let editingCellId = $state<string | null>(null);

  const activeSheet = $derived(getActiveSheet(workbook));
  const activeSheetIndex = $derived(workbook.sheets.findIndex((s) => s.id === workbook.activeSheetId));
  const activeCellId = $derived(
    activeSheet ? getCellId(activeSheet.selection.active.row, activeSheet.selection.active.col) : 'A1'
  );
  const activeCellValue = $derived(
    activeSheet ? String(activeSheet.cells.get(activeCellId)?.value ?? '') : ''
  );

  function updateActiveSheet(fn: (sheet: Sheet) => Sheet) {
    workbook = {
      ...workbook,
      sheets: workbook.sheets.map((s) =>
        s.id === workbook.activeSheetId ? fn(s) : s
      ),
    };
  }

  function handleSelectCell(row: number, col: number) {
    if (editingCellId) commitEdit('');
    updateActiveSheet((s) => ({
      ...s,
      selection: { ...s.selection, active: { row, col }, ranges: [] },
    }));
  }

  function handleEditCell(row: number, col: number) {
    editingCellId = getCellId(row, col);
  }

  function handleStartSelection(row: number, col: number) {
    updateActiveSheet((s) => ({
      ...s,
      selection: { ...s.selection, anchor: { row, col }, ranges: [] },
    }));
  }

  function handleUpdateSelection(row: number, col: number) {
    if (!activeSheet?.selection.anchor) return;
    const anchor = activeSheet.selection.anchor;
    const range: CellRange = { start: anchor, end: { row, col } };
    updateActiveSheet((s) => ({
      ...s,
      selection: { ...s.selection, ranges: [range] },
    }));
  }

  function handleEndSelection() {
    updateActiveSheet((s) => ({
      ...s,
      selection: { ...s.selection, anchor: null },
    }));
  }

  function commitEdit(value: string) {
    if (!editingCellId || !activeSheet) return;
    const coerced = coerceValue(value);
    const prev = activeSheet.cells;
    updateActiveSheet((s) => ({
      ...s,
      cells: setCellValue(s.cells, editingCellId!, coerced),
      selection: { ...s.selection },
    }));
    undoRedo = pushUndo(undoRedo, { sheetId: workbook.activeSheetId, cellsSnapshot: prev, description: `Edit ${editingCellId}` });
    editingCellId = null;
  }

  function cancelEdit() {
    editingCellId = null;
  }

  function handleFormulaBarChange(value: string) {
    commitEdit(value);
  }

  // Sheet operations
  function handleSheetChange(id: string) {
    if (editingCellId) commitEdit('');
    workbook = setActiveSheet(workbook, id);
  }

  function handleAddSheet() {
    workbook = addSheet(workbook);
  }

  function handleRemoveSheet(id: string) {
    workbook = removeSheet(workbook, id);
  }

  function handleRenameSheet(id: string, name: string) {
    workbook = renameSheet(workbook, id, name);
  }

  // Undo/Redo
  function handleUndo() {
    const result = undoAction(undoRedo);
    if (result.entry) {
      undoRedo = result.state;
      updateActiveSheet((s) => ({
        ...s,
        cells: result.entry!.cellsSnapshot,
      }));
    }
  }

  function handleRedo() {
    const result = redoAction(undoRedo);
    if (result.entry) {
      undoRedo = result.state;
      updateActiveSheet((s) => ({
        ...s,
        cells: result.entry!.cellsSnapshot,
      }));
    }
  }

  // Keyboard shortcuts
  function handleGlobalKeydown(e: KeyboardEvent) {
    const isCtrl = e.ctrlKey || e.metaKey;
    if (isCtrl && e.key === 'z') { e.preventDefault(); handleUndo(); }
    if (isCtrl && e.key === 'y') { e.preventDefault(); handleRedo(); }
  }

  // Export data
  export function getData(): { sheetName: string; cells: CellMap }[] {
    return workbook.sheets.map((s) => ({ sheetName: s.name, cells: s.cells }));
  }

  export function getCellData(cellId: string): { value: string; formula?: string } | null {
    const cell = activeSheet?.cells.get(cellId);
    if (!cell) return null;
    return { value: String(cell.value ?? ''), formula: cell.formula };
  }
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<div class="flex flex-col h-full rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] shadow-sm overflow-hidden {className ?? ''}">
  <!-- Toolbar -->
  <div class="flex items-center gap-2 border-b border-[var(--ui-border)] bg-[var(--ui-card)] px-3 py-1.5">
    <span class="text-xs font-semibold text-[var(--ui-muted-foreground)]">
      Sheet {activeSheetIndex + 1}
    </span>
    <div class="h-4 w-px bg-[var(--ui-border)]"></div>
    <button onclick={handleUndo} class="px-2 py-1 rounded text-xs text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)] cursor-pointer" title="Undo (Ctrl+Z)">Undo</button>
    <button onclick={handleRedo} class="px-2 py-1 rounded text-xs text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)] cursor-pointer" title="Redo (Ctrl+Y)">Redo</button>
  </div>

  <!-- Formula Bar -->
  <FormulaBar
    cellId={activeCellId}
    value={activeCellValue}
    onValueChange={handleFormulaBarChange}
  />

  <!-- Grid -->
  {#if activeSheet}
    <CellGrid
      cells={activeSheet.cells}
      {rowCount}
      {colCount}
      activeCell={activeSheet.selection.active}
      selectionRanges={activeSheet.selection.ranges}
      columnWidths={activeSheet.columnWidths}
      rowHeights={activeSheet.rowHeights}
      {editingCellId}
      onSelectCell={handleSelectCell}
      onEditCell={handleEditCell}
      onStartSelection={handleStartSelection}
      onUpdateSelection={handleUpdateSelection}
      onEndSelection={handleEndSelection}
      onCommitEdit={commitEdit}
      onCancelEdit={cancelEdit}
    />
  {/if}

  <!-- Sheet Tabs -->
  <SheetTabs
    sheets={workbook.sheets}
    activeSheetId={workbook.activeSheetId}
    onSheetChange={handleSheetChange}
    onAddSheet={handleAddSheet}
    onRemoveSheet={handleRemoveSheet}
    onRenameSheet={handleRenameSheet}
  />
</div>
