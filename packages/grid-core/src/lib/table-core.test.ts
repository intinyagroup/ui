import { describe, it, expect } from 'vitest';
import type { ColumnDef } from '@tanstack/table-core';
import { createCoreTableModel } from './table-core.js';

type Person = { id: number; name: string; age: number };

const columns: ColumnDef<Person, unknown>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
];

describe('table-core', () => {
  describe('createCoreTableModel', () => {
    it('creates a table with default state', () => {
      const data: Person[] = [
        { id: 1, name: 'Alice', age: 30 },
        { id: 2, name: 'Bob', age: 25 },
      ];

      const table = createCoreTableModel({ data, columns });

      expect(table).toBeDefined();
      expect(table.getState().pagination).toEqual({ pageIndex: 0, pageSize: 20 });
      expect(table.getState().sorting).toEqual([]);
      expect(table.getState().globalFilter).toBe('');
      expect(table.getState().columnFilters).toEqual([]);
      expect(table.getState().columnVisibility).toEqual({});
      expect(table.getState().rowSelection).toEqual({});
      expect(table.getState().columnPinning).toEqual({ left: [], right: [] });
      expect(table.getState().grouping).toEqual([]);
      expect(table.getState().expanded).toEqual({});
      expect(table.getState().columnSizing).toEqual({});
    });

    it('uses provided state overrides', () => {
      const data: Person[] = [
        { id: 1, name: 'Alice', age: 30 },
        { id: 2, name: 'Bob', age: 25 },
      ];

      const table = createCoreTableModel({
        data,
        columns,
        state: {
          pagination: { pageIndex: 2, pageSize: 5 },
          sorting: [{ id: 'name', desc: true }],
          globalFilter: 'search-term',
          rowSelection: { '0': true },
        },
      });

      expect(table.getState().pagination).toEqual({ pageIndex: 2, pageSize: 5 });
      expect(table.getState().sorting).toEqual([{ id: 'name', desc: true }]);
      expect(table.getState().globalFilter).toBe('search-term');
      expect(table.getState().rowSelection).toEqual({ '0': true });
    });

    it('returns correct row count', () => {
      const data: Person[] = [
        { id: 1, name: 'Alice', age: 30 },
        { id: 2, name: 'Bob', age: 25 },
        { id: 3, name: 'Charlie', age: 35 },
      ];

      const table = createCoreTableModel({ data, columns });

      expect(table.getRowModel().rows.length).toBe(3);
    });

    it('returns visible leaf columns', () => {
      const data: Person[] = [{ id: 1, name: 'Alice', age: 30 }];

      const table = createCoreTableModel({ data, columns });

      const leafColumns = table.getVisibleLeafColumns();
      expect(leafColumns.length).toBe(3);
    });

    it('respects meta property', () => {
      const data: Person[] = [{ id: 1, name: 'Alice', age: 30 }];
      const meta = { editable: true, align: 'center' as const };

      const table = createCoreTableModel({ data, columns, meta });

      expect(table.options.meta).toEqual(meta);
    });

    it('handles empty data', () => {
      const table = createCoreTableModel({ data: [], columns });

      expect(table.getRowModel().rows.length).toBe(0);
      expect(table.getRowCount()).toBe(0);
    });

    it('configures server-side pagination when specified', () => {
      const data: Person[] = [
        { id: 1, name: 'Alice', age: 30 },
        { id: 2, name: 'Bob', age: 25 },
      ];

      const table = createCoreTableModel({
        data,
        columns,
        serverSide: {
          rowCount: 100,
          manualPagination: true,
        },
      });

      // Server-side pagination calculates pageCount from rowCount and pageSize
      expect(table.getPageCount()).toBe(5); // 100 / 20 = 5
    });
  });
});
