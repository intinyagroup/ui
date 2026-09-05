import { describe, it, expect } from 'vitest';
import {
  getPageCount,
  clampPageIndex,
  getVisibleRowRange,
  resolvePagination,
  normalizePageSize
} from './table-pagination.js';

describe('table-pagination', () => {
  describe('normalizePageSize', () => {
    it('returns valid page size', () => {
      expect(normalizePageSize(25)).toBe(25);
    });

    it('falls back on non-positive or non-finite values', () => {
      expect(normalizePageSize(0)).toBe(10);
      expect(normalizePageSize(-5, 20)).toBe(20);
      expect(normalizePageSize(NaN)).toBe(10);
    });
  });

  describe('getPageCount', () => {
    it('calculates page count correctly', () => {
      expect(getPageCount(100, 10)).toBe(10);
      expect(getPageCount(105, 10)).toBe(11);
      expect(getPageCount(0, 10)).toBe(1);
    });
  });

  describe('clampPageIndex', () => {
    it('clamps negative page index to 0', () => {
      expect(clampPageIndex(-1, 5)).toBe(0);
    });

    it('clamps overflow index to pageCount - 1', () => {
      expect(clampPageIndex(10, 5)).toBe(4);
    });

    it('preserves valid page index', () => {
      expect(clampPageIndex(2, 5)).toBe(2);
    });
  });

  describe('getVisibleRowRange', () => {
    it('returns 0-0 when rowCount is 0', () => {
      expect(getVisibleRowRange(0, { pageIndex: 0, pageSize: 10 })).toEqual({ from: 0, to: 0 });
    });

    it('calculates range on first page', () => {
      expect(getVisibleRowRange(45, { pageIndex: 0, pageSize: 10 })).toEqual({ from: 1, to: 10 });
    });

    it('calculates range on last partial page', () => {
      expect(getVisibleRowRange(45, { pageIndex: 4, pageSize: 10 })).toEqual({ from: 41, to: 45 });
    });
  });

  describe('resolvePagination', () => {
    it('updates page size and recalibrates index within bounds', () => {
      const initial = { pageIndex: 9, pageSize: 10 }; // on 100 rows, page 10
      const next = resolvePagination(initial, 50, { pageSize: 25 }); // 50 rows -> max page is 1
      expect(next).toEqual({ pageIndex: 1, pageSize: 25 });
    });
  });
});
