import type { Table } from '@tanstack/table-core';

export type KeyboardNavigationOptions = {
  table: Table<any>;
  onCellSelect?: (rowId: string, columnId: string) => void;
  onCellEdit?: (rowId: string, columnId: string) => void;
  onRowSelect?: (rowId: string) => void;
  onSelectAll?: () => void;
  onDelete?: (selectedRows: string[]) => void;
};

export type FocusedCell = {
  rowId: string;
  columnId: string;
};

export function createKeyboardNavigation(options: KeyboardNavigationOptions) {
  const { table, onCellSelect, onCellEdit, onRowSelect, onSelectAll, onDelete } = options;

  let focusedCell = $state<FocusedCell | null>(null);

  function getVisibleRows() {
    return table.getRowModel().rows;
  }

  function getVisibleColumns() {
    return table.getVisibleLeafColumns();
  }

  function findRowById(rowId: string) {
    return getVisibleRows().find((r) => r.id === rowId);
  }

  function findColumnById(columnId: string) {
    return getVisibleColumns().find((c) => c.id === columnId);
  }

  function moveFocus(rowDelta: number, columnDelta: number) {
    const rows = getVisibleRows();
    const columns = getVisibleColumns();
    if (!rows.length || !columns.length) return;

    let currentRowIndex = focusedCell ? rows.findIndex((r) => r.id === focusedCell.rowId) : 0;
    let currentColumnIndex = focusedCell ? columns.findIndex((c) => c.id === focusedCell.columnId) : 0;

    currentRowIndex = Math.max(0, Math.min(rows.length - 1, currentRowIndex + rowDelta));
    currentColumnIndex = Math.max(0, Math.min(columns.length - 1, currentColumnIndex + columnDelta));

    focusedCell = {
      rowId: rows[currentRowIndex].id,
      columnId: columns[currentColumnIndex].id,
    };

    onCellSelect?.(focusedCell.rowId, focusedCell.columnId);
  }

  function handleKeydown(e: KeyboardEvent) {
    // Ignore if typing in an input
    if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

    const { key, ctrlKey, metaKey, shiftKey } = e;
    const isCtrl = ctrlKey || metaKey;

    switch (key) {
      case 'ArrowDown':
        e.preventDefault();
        moveFocus(1, 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveFocus(-1, 0);
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveFocus(0, 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        moveFocus(0, -1);
        break;
      case 'Home':
        e.preventDefault();
        if (isCtrl) {
          focusedCell = { rowId: getVisibleRows()[0]?.id, columnId: getVisibleColumns()[0]?.id };
        } else {
          focusedCell = focusedCell ? { ...focusedCell, columnId: getVisibleColumns()[0]?.id } : null;
        }
        break;
      case 'End':
        e.preventDefault();
        if (isCtrl) {
          const rows = getVisibleRows();
          const cols = getVisibleColumns();
          focusedCell = { rowId: rows[rows.length - 1]?.id, columnId: cols[cols.length - 1]?.id };
        } else {
          const cols = getVisibleColumns();
          focusedCell = focusedCell ? { ...focusedCell, columnId: cols[cols.length - 1]?.id } : null;
        }
        break;
      case 'PageDown':
        e.preventDefault();
        moveFocus(10, 0);
        break;
      case 'PageUp':
        e.preventDefault();
        moveFocus(-10, 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedCell) {
          onCellEdit?.(focusedCell.rowId, focusedCell.columnId);
        }
        break;
      case ' ':
        e.preventDefault();
        if (focusedCell && isCtrl) {
          // Ctrl+Space: toggle row selection
          const row = findRowById(focusedCell.rowId);
          if (row) onRowSelect?.(row.id);
        } else if (focusedCell) {
          onRowSelect?.(focusedCell.rowId);
        }
        break;
      case 'a':
        if (isCtrl) {
          e.preventDefault();
          onSelectAll?.();
        }
        break;
      case 'Delete':
      case 'Backspace':
        if (isCtrl) {
          e.preventDefault();
          const selected = Object.keys(table.getState().rowSelection);
          if (selected.length) onDelete?.(selected);
        }
        break;
      case 'Escape':
        focusedCell = null;
        break;
    }
  }

  return {
    get focusedCell() { return focusedCell; },
    setFocusedCell(cell: FocusedCell | null) { focusedCell = cell; },
    handleKeydown,
    moveFocus,
  };
}
