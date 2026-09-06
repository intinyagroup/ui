import type { Table } from '@tanstack/table-core';

export type ClipboardOptions = {
  table: Table<any>;
  onPaste?: (data: string[][]) => void;
};

export function createClipboard(options: ClipboardOptions) {
  const { table, onPaste } = options;

  function getSelectedCellData(): string[][] {
    const selectedKeys = Object.keys(table.getState().rowSelection);
    if (!selectedKeys.length) return [];

    const rows = table.getRowModel().rows.filter((r) => selectedKeys.includes(r.id));
    const columns = table.getVisibleLeafColumns().filter((c) => c.getIsVisible());

    return rows.map((row) =>
      columns.map((col) => {
        const value = row.getValue(col.id);
        return value !== undefined && value !== null ? String(value) : '';
      })
    );
  }

  function getSingleCellData(rowId: string, columnId: string): string {
    const row = table.getRowModel().rows.find((r) => r.id === rowId);
    if (!row) return '';
    const value = row.getValue(columnId);
    return value !== undefined && value !== null ? String(value) : '';
  }

  async function copyToClipboard(data: string[][]): Promise<boolean> {
    try {
      const text = data.map((row) => row.join('\t')).join('\n');
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback: create textarea
      try {
        const textarea = document.createElement('textarea');
        textarea.value = data.map((row) => row.join('\t')).join('\n');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
      } catch {
        return false;
      }
    }
  }

  function copySelectedRows(): Promise<boolean> {
    const data = getSelectedCellData();
    return copyToClipboard(data);
  }
  function copySingleCell(rowId: string, columnId: string): Promise<boolean> {
    const value = getSingleCellData(rowId, columnId);
    return copyToClipboard([[value]]);
  }

  function copyCellRange(
    startRowIndex: number,
    endRowIndex: number,
    startColIndex: number,
    endColIndex: number
  ): Promise<boolean> {
    const allRows = table.getRowModel().rows;
    const allCols = table.getVisibleLeafColumns().filter((c) => c.getIsVisible());

    const minRow = Math.max(0, Math.min(startRowIndex, endRowIndex));
    const maxRow = Math.min(allRows.length - 1, Math.max(startRowIndex, endRowIndex));
    const minCol = Math.max(0, Math.min(startColIndex, endColIndex));
    const maxCol = Math.min(allCols.length - 1, Math.max(startColIndex, endColIndex));

    const selectedRows = allRows.slice(minRow, maxRow + 1);
    const selectedCols = allCols.slice(minCol, maxCol + 1);

    const data = selectedRows.map((row) =>
      selectedCols.map((col) => {
        const val = row.getValue(col.id);
        return val !== undefined && val !== null ? String(val) : '';
      })
    );

    return copyToClipboard(data);
  }

  async function pasteFromClipboard(): Promise<string[][] | null> {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return null;
      const rows = text.split('\n').filter(Boolean).map((row) => row.split('\t'));
      onPaste?.(rows);
      return rows;
    } catch {
      return null;
    }
  }

  function downloadCSV(filename?: string) {
    const rows = table.getFilteredRowModel().rows;
    const columns = table.getVisibleLeafColumns().filter((c) => c.getIsVisible());

    const headerRow = columns
      .map((col) => `"${typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id}"`)
      .join(',');

    const dataRows = rows.map((row) =>
      columns.map((col) => {
        const value = row.getValue(col.id);
        const cellText = value !== undefined && value !== null ? String(value) : '';
        return `"${cellText.replaceAll('"', '""')}"`;
      }).join(',')
    );

    const csvContent = [headerRow, ...dataRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename || 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return {
    copySelectedRows,
    copySingleCell,
    copyCellRange,
    pasteFromClipboard,
    downloadCSV,
    getSelectedCellData,
  };
}
