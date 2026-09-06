import { describe, it, expect, vi } from 'vitest';
import { createClipboard } from './table-clipboard.js';

describe('table-clipboard', () => {
  const mockTable = {
    getState: () => ({ rowSelection: { '0': true } }),
    getRowModel: () => ({
      rows: [
        {
          id: '0',
          getValue: (colId: string) => `val-${colId}`
        },
        {
          id: '1',
          getValue: (colId: string) => `val-${colId}-1`
        }
      ]
    }),
    getVisibleLeafColumns: () => [
      { id: 'name', getIsVisible: () => true, columnDef: { header: 'Name' } },
      { id: 'role', getIsVisible: () => true, columnDef: { header: 'Role' } }
    ],
    getFilteredRowModel: () => ({
      rows: [
        { id: '0', getValue: (colId: string) => `val-${colId}` }
      ]
    })
  } as any;

  it('gets selected cell data matrix properly', () => {
    const clip = createClipboard({ table: mockTable });
    const data = clip.getSelectedCellData();
    expect(data).toEqual([['val-name', 'val-role']]);
  });
});
