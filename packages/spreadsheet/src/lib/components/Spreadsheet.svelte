<script lang="ts">
  import { untrack } from "svelte";
  import {
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
  } from "lucide-svelte";
  import { Button } from "@intinyagroup/ui";
  import { cn } from "@intinyagroup/grid-core/utils";
  import { getCellId, parseCellId, coerceValue } from "../cell-utils.js";
  import {
    setCellValue,
    setCellValues,
    setCellStyles,
    createCell,
    type CellMap,
    type CellStyle,
  } from "../cell-model.js";
  import {
    createSelectionState,
    normalizeRange,
    getCellsInRange,
    type CellRange,
    type SelectionState,
  } from "../selection-store.js";
  import {
    createWorkbookState,
    getActiveSheet,
    addSheet,
    removeSheet,
    renameSheet,
    setActiveSheet,
    type WorkbookState,
    type Sheet,
  } from "../sheet-store.js";
  import {
    createUndoRedoState,
    pushUndo,
    undo as undoAction,
    redo as redoAction,
    type UndoRedoState,
  } from "../undo-redo.js";
  import CellGrid from "./CellGrid.svelte";
  import FormulaBar from "./FormulaBar.svelte";
  import SheetTabs from "./SheetTabs.svelte";

  let {
    initialData,
    rowCount = 100,
    colCount = 26,
    class: className,
    onCellStyleChange,
  }: {
    initialData?: { cells: CellMap; sheetName?: string }[];
    rowCount?: number;
    colCount?: number;
    class?: string;
    onCellStyleChange?: (cells: string[], style: Partial<CellStyle>) => void;
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
          activeSheetId: "sheet-1",
        }
      : createWorkbookState(1),
  );

  let undoRedo = $state(createUndoRedoState());
  let editingCellId = $state<string | null>(null);

  const activeSheet = $derived(getActiveSheet(workbook));
  const activeSheetIndex = $derived(
    workbook.sheets.findIndex((s) => s.id === workbook.activeSheetId),
  );
  const activeCellId = $derived(
    activeSheet
      ? getCellId(
          activeSheet.selection.active.row,
          activeSheet.selection.active.col,
        )
      : "A1",
  );
  const activeCellValue = $derived(
    activeSheet ? String(activeSheet.cells.get(activeCellId)?.value ?? "") : "",
  );

  function updateActiveSheet(fn: (sheet: Sheet) => Sheet) {
    workbook = {
      ...workbook,
      sheets: workbook.sheets.map((s) =>
        s.id === workbook.activeSheetId ? fn(s) : s,
      ),
    };
  }

  function handleSelectCell(row: number, col: number) {
    if (editingCellId) commitEdit("");
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

  // ---- Selection helpers ----
  function getSelectedCellIds(): string[] {
    if (!activeSheet) return [activeCellId];
    const ranges = activeSheet.selection.ranges;
    if (ranges.length === 0) return [activeCellId];
    const ids = new Set<string>();
    for (const range of ranges) {
      for (const { row, col } of getCellsInRange(range)) {
        ids.add(getCellId(row, col));
      }
    }
    return Array.from(ids);
  }

  function getSelectedBounds(): {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
  } {
    if (!activeSheet) return { startRow: 0, startCol: 0, endRow: 0, endCol: 0 };
    const ranges = activeSheet.selection.ranges;
    if (ranges.length === 0) {
      const { row, col } = activeSheet.selection.active;
      return { startRow: row, startCol: col, endRow: row, endCol: col };
    }
    let minRow = Infinity,
      minCol = Infinity,
      maxRow = -Infinity,
      maxCol = -Infinity;
    for (const range of ranges) {
      const n = normalizeRange(range);
      minRow = Math.min(minRow, n.start.row);
      minCol = Math.min(minCol, n.start.col);
      maxRow = Math.max(maxRow, n.end.row);
      maxCol = Math.max(maxCol, n.end.col);
    }
    return {
      startRow: minRow,
      startCol: minCol,
      endRow: maxRow,
      endCol: maxCol,
    };
  }

  // ---- Formatting ----
  function applyStyleToSelection(style: Partial<CellStyle>) {
    if (!activeSheet) return;
    const cellIds = getSelectedCellIds();
    const prev = activeSheet.cells;
    const nextCells = setCellStyles(
      prev,
      cellIds.map((id) => [id, style] as const),
    );
    updateActiveSheet((s) => ({
      ...s,
      cells: nextCells,
      selection: { ...s.selection },
    }));
    undoRedo = pushUndo(undoRedo, {
      sheetId: workbook.activeSheetId,
      cellsSnapshot: prev,
      description: "Format cells",
    });
    onCellStyleChange?.(cellIds, style);
  }

  function isStyleActive(key: keyof CellStyle, value: unknown): boolean {
    if (!activeSheet) return false;
    const cell = activeSheet.cells.get(activeCellId);
    return cell?.style?.[key] === value;
  }

  // ---- Clipboard ----
  function handleCopy() {
    if (!activeSheet) return;
    const { startRow, startCol, endRow, endCol } = getSelectedBounds();
    const rows: string[] = [];
    for (let r = startRow; r <= endRow; r++) {
      const cols: string[] = [];
      for (let c = startCol; c <= endCol; c++) {
        const cell = activeSheet.cells.get(getCellId(r, c));
        cols.push(cell?.value != null ? String(cell.value) : "");
      }
      rows.push(cols.join("\t"));
    }
    const tsv = rows.join("\n");
    navigator.clipboard?.writeText(tsv).catch(() => {});
    return tsv;
  }

  async function handlePaste() {
    if (!activeSheet) return;
    let text = "";
    try {
      text = await navigator.clipboard.readText();
    } catch {
      return;
    }
    if (!text) return;
    const lines = text.split("\n");
    const { row: startRow, col: startCol } = activeSheet.selection.active;
    const prev = activeSheet.cells;
    const updates: [string, ReturnType<typeof coerceValue>][] = [];
    for (let r = 0; r < lines.length; r++) {
      const cols = lines[r].split("\t");
      for (let c = 0; c < cols.length; c++) {
        const targetRow = startRow + r;
        const targetCol = startCol + c;
        if (targetRow >= rowCount || targetCol >= colCount) continue;
        updates.push([getCellId(targetRow, targetCol), coerceValue(cols[c])]);
      }
    }
    if (updates.length === 0) return;
    const nextCells = setCellValues(prev, updates);
    updateActiveSheet((s) => ({
      ...s,
      cells: nextCells,
      selection: { ...s.selection },
    }));
    undoRedo = pushUndo(undoRedo, {
      sheetId: workbook.activeSheetId,
      cellsSnapshot: prev,
      description: "Paste cells",
    });
  }

  function handleCut() {
    const tsv = handleCopy();
    if (!activeSheet) return;
    const { startRow, startCol, endRow, endCol } = getSelectedBounds();
    const prev = activeSheet.cells;
    const updates: [string, null][] = [];
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        updates.push([getCellId(r, c), null]);
      }
    }
    const nextCells = setCellValues(prev, updates);
    updateActiveSheet((s) => ({
      ...s,
      cells: nextCells,
      selection: { ...s.selection },
    }));
    undoRedo = pushUndo(undoRedo, {
      sheetId: workbook.activeSheetId,
      cellsSnapshot: prev,
      description: "Cut cells",
    });
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
    undoRedo = pushUndo(undoRedo, {
      sheetId: workbook.activeSheetId,
      cellsSnapshot: prev,
      description: `Edit ${editingCellId}`,
    });
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
    if (editingCellId) commitEdit("");
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
    if (isCtrl && e.key === "z") {
      e.preventDefault();
      handleUndo();
    }
    if (isCtrl && e.key === "y") {
      e.preventDefault();
      handleRedo();
    }
    if (isCtrl && e.key === "c" && !editingCellId) {
      e.preventDefault();
      handleCopy();
    }
    if (isCtrl && e.key === "v" && !editingCellId) {
      e.preventDefault();
      handlePaste();
    }
    if (isCtrl && e.key === "x" && !editingCellId) {
      e.preventDefault();
      handleCut();
    }
  }

  // Export data
  export function getData(): { sheetName: string; cells: CellMap }[] {
    return workbook.sheets.map((s) => ({ sheetName: s.name, cells: s.cells }));
  }

  export function getCellData(
    cellId: string,
  ): { value: string; formula?: string } | null {
    const cell = activeSheet?.cells.get(cellId);
    if (!cell) return null;
    return { value: String(cell.value ?? ""), formula: cell.formula };
  }
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<div
  class="flex flex-col h-full rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] shadow-sm overflow-hidden {className ??
    ''}"
>
  <!-- Toolbar -->
  <div
    class="flex items-center gap-2 border-b border-[var(--ui-border)] bg-[var(--ui-card)] px-3 py-1.5"
  >
    <span class="text-xs font-semibold text-[var(--ui-muted-foreground)]">
      Sheet {activeSheetIndex + 1}
    </span>
    <div class="h-4 w-px bg-[var(--ui-border)]"></div>
    <button
      onclick={handleUndo}
      class="px-2 py-1 rounded text-xs text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)] cursor-pointer"
      title="Undo (Ctrl+Z)">Undo</button
    >
    <button
      onclick={handleRedo}
      class="px-2 py-1 rounded text-xs text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)] cursor-pointer"
      title="Redo (Ctrl+Y)">Redo</button
    >
  </div>

  <!-- Formula Bar -->
  <FormulaBar
    cellId={activeCellId}
    value={activeCellValue}
    onValueChange={handleFormulaBarChange}
  />

  <!-- Formatting Toolbar -->
  <div
    class="flex items-center gap-1 border-b border-[var(--ui-border)] bg-[var(--ui-card)] px-3 py-1"
  >
    <Button
      variant="ghost"
      size="sm"
      class={cn(
        "size-7 p-0",
        isStyleActive("bold", true) &&
          "bg-[var(--ui-secondary)] text-[var(--ui-foreground)]",
      )}
      onclick={() =>
        applyStyleToSelection({ bold: !isStyleActive("bold", true) })}
      title="Bold (Ctrl+B)"
    >
      <Bold class="size-3.5" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      class={cn(
        "size-7 p-0",
        isStyleActive("italic", true) &&
          "bg-[var(--ui-secondary)] text-[var(--ui-foreground)]",
      )}
      onclick={() =>
        applyStyleToSelection({ italic: !isStyleActive("italic", true) })}
      title="Italic (Ctrl+I)"
    >
      <Italic class="size-3.5" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      class={cn(
        "size-7 p-0",
        isStyleActive("underline", true) &&
          "bg-[var(--ui-secondary)] text-[var(--ui-foreground)]",
      )}
      onclick={() =>
        applyStyleToSelection({ underline: !isStyleActive("underline", true) })}
      title="Underline (Ctrl+U)"
    >
      <Underline class="size-3.5" />
    </Button>

    <div class="h-4 w-px bg-[var(--ui-border)] mx-1"></div>

    <Button
      variant="ghost"
      size="sm"
      class={cn(
        "size-7 p-0",
        isStyleActive("align", "left") &&
          "bg-[var(--ui-secondary)] text-[var(--ui-foreground)]",
      )}
      onclick={() => applyStyleToSelection({ align: "left" })}
      title="Align Left"
    >
      <AlignLeft class="size-3.5" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      class={cn(
        "size-7 p-0",
        isStyleActive("align", "center") &&
          "bg-[var(--ui-secondary)] text-[var(--ui-foreground)]",
      )}
      onclick={() => applyStyleToSelection({ align: "center" })}
      title="Align Center"
    >
      <AlignCenter class="size-3.5" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      class={cn(
        "size-7 p-0",
        isStyleActive("align", "right") &&
          "bg-[var(--ui-secondary)] text-[var(--ui-foreground)]",
      )}
      onclick={() => applyStyleToSelection({ align: "right" })}
      title="Align Right"
    >
      <AlignRight class="size-3.5" />
    </Button>
  </div>

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
