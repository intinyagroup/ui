import { describe, it, expect, beforeEach } from 'vitest';
import {
  getTableSettings,
  saveTableSettings,
  clearTableSettings,
} from './table-persist.js';

const STORAGE_PREFIX = 'uitable:';

describe('table-persist', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveTableSettings / getTableSettings', () => {
    it('saves settings to localStorage with correct key', () => {
      const settings = {
        pageSize: 50,
        density: 'compact' as const,
      };

      saveTableSettings('my-table', settings);

      const stored = localStorage.getItem(`${STORAGE_PREFIX}my-table`);
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.pageSize).toBe(50);
      expect(parsed.density).toBe('compact');
    });

    it('retrieves saved settings round-trip', () => {
      const settings = {
        columnVisibility: { name: true, age: false },
        pageSize: 25,
        sorting: [{ id: 'name', desc: false }],
      };

      saveTableSettings('table-1', settings);
      const retrieved = getTableSettings('table-1');

      expect(retrieved).toEqual(settings);
    });

    it('returns null for non-existent table', () => {
      expect(getTableSettings('non-existent')).toBeNull();
    });

    it('merges new settings with existing ones', () => {
      saveTableSettings('table-2', { pageSize: 10, density: 'spacious' });
      saveTableSettings('table-2', { pageSize: 50 });

      const result = getTableSettings('table-2');
      expect(result?.pageSize).toBe(50);
      expect(result?.density).toBe('spacious');
    });

    it('handles multiple independent tables', () => {
      saveTableSettings('table-a', { pageSize: 10 });
      saveTableSettings('table-b', { pageSize: 100 });

      expect(getTableSettings('table-a')?.pageSize).toBe(10);
      expect(getTableSettings('table-b')?.pageSize).toBe(100);
    });
  });

  describe('clearTableSettings', () => {
    it('removes settings from localStorage', () => {
      saveTableSettings('table-3', { pageSize: 20 });
      expect(getTableSettings('table-3')).not.toBeNull();

      clearTableSettings('table-3');
      expect(getTableSettings('table-3')).toBeNull();
    });

    it('does not affect other tables', () => {
      saveTableSettings('table-x', { pageSize: 10 });
      saveTableSettings('table-y', { pageSize: 20 });

      clearTableSettings('table-x');

      expect(getTableSettings('table-x')).toBeNull();
      expect(getTableSettings('table-y')?.pageSize).toBe(20);
    });
  });

  describe('error handling', () => {
    it('returns null for corrupted JSON in localStorage', () => {
      localStorage.setItem(`${STORAGE_PREFIX}corrupt`, 'not-valid-json{{{');

      expect(getTableSettings('corrupt')).toBeNull();
    });
  });
});
