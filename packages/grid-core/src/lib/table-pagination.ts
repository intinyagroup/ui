import type { PaginationState } from '@tanstack/table-core';

export const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100] as const;

export function normalizePageSize(pageSize: number, fallback = 10) {
  return Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : fallback;
}

export function getPageCount(rowCount: number, pageSize: number) {
  const safeRowCount = Math.max(0, rowCount);
  const safePageSize = normalizePageSize(pageSize);
  return Math.max(1, Math.ceil(safeRowCount / safePageSize));
}

export function clampPageIndex(pageIndex: number, pageCount: number) {
  const safePageCount = Math.max(1, pageCount);
  const safePageIndex = Number.isFinite(pageIndex) ? Math.floor(pageIndex) : 0;
  return Math.min(Math.max(0, safePageIndex), safePageCount - 1);
}

export function getVisibleRowRange(rowCount: number, pagination: PaginationState) {
  const safeRowCount = Math.max(0, rowCount);
  if (safeRowCount === 0) {
    return { from: 0, to: 0 };
  }

  const pageSize = normalizePageSize(pagination.pageSize);
  const pageIndex = clampPageIndex(pagination.pageIndex, getPageCount(safeRowCount, pageSize));
  const from = pageIndex * pageSize + 1;
  const to = Math.min(safeRowCount, from + pageSize - 1);

  return { from, to };
}

export function resolvePagination(
  pagination: PaginationState,
  rowCount: number,
  patch: Partial<PaginationState> = {}
): PaginationState {
  const pageSize = normalizePageSize(patch.pageSize ?? pagination.pageSize);
  const requestedPageIndex = patch.pageIndex ?? pagination.pageIndex;
  const pageIndex = clampPageIndex(requestedPageIndex, getPageCount(rowCount, pageSize));

  return { pageIndex, pageSize };
}
