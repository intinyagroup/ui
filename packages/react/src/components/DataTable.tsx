import * as React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
  type OnChangeFn
} from '@tanstack/react-table';
import { cn } from '../utils.js';
import { Button } from './Button.js';
import { Input } from './Input.js';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export interface ServerSideConfig {
  rowCount: number;
  pageIndex?: number;
  pageSize?: number;
  sorting?: SortingState;
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  onSortingChange?: (sorting: { id: string; desc: boolean }[]) => void;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  className?: string;
  serverSide?: ServerSideConfig;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  className,
  serverSide
}: DataTableProps<TData, TValue>) {
  // Client-side fallback state
  const [clientSorting, setClientSorting] = React.useState<SortingState>([]);
  const [clientPagination, setClientPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const isServerSide = !!serverSide;

  // Sorting state resolution
  const sorting = isServerSide && serverSide.sorting ? serverSide.sorting : clientSorting;
  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    const next = typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;
    if (isServerSide) {
      serverSide.onSortingChange?.(next.map((s) => ({ id: s.id, desc: s.desc })));
    } else {
      setClientSorting(next);
    }
  };

  // Pagination state resolution
  const pagination: PaginationState = isServerSide
    ? {
        pageIndex: serverSide.pageIndex ?? 0,
        pageSize: serverSide.pageSize ?? 10
      }
    : clientPagination;

  const handlePaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
    const next = typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue;
    if (isServerSide) {
      serverSide.onPaginationChange?.({ pageIndex: next.pageIndex, pageSize: next.pageSize });
    } else {
      setClientPagination(next);
    }
  };

  const table = useReactTable({
    data,
    columns,
    pageCount: isServerSide ? Math.ceil(serverSide.rowCount / pagination.pageSize) : undefined,
    manualPagination: isServerSide,
    manualSorting: isServerSide,
    manualFiltering: isServerSide,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: isServerSide ? undefined : getPaginationRowModel(),
    onSortingChange: handleSortingChange,
    getSortedRowModel: isServerSide ? undefined : getSortedRowModel(),
    onPaginationChange: handlePaginationChange,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: isServerSide ? undefined : getFilteredRowModel(),
    state: {
      sorting,
      pagination,
      columnFilters
    }
  });

  return (
    <div className={cn('space-y-4', className)}>
      {searchKey && (
        <div className="flex items-center py-2">
          <Input
            placeholder={searchPlaceholder}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
        </div>
      )}

      <div className="rounded-md border border-[var(--ui-border)] overflow-hidden">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b border-[var(--ui-border)] bg-[var(--ui-muted)]/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-[var(--ui-border)] transition-colors">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDirection = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      className="h-10 px-4 text-left align-middle font-medium text-[var(--ui-muted-foreground)]"
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex items-center gap-1.5 font-medium hover:text-[var(--ui-foreground)] cursor-pointer select-none transition-colors"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sortDirection === 'asc' ? (
                            <ArrowUp className="size-3.5 text-[var(--ui-primary)]" />
                          ) : sortDirection === 'desc' ? (
                            <ArrowDown className="size-3.5 text-[var(--ui-primary)]" />
                          ) : (
                            <ArrowUpDown className="size-3.5 opacity-40 hover:opacity-100" />
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="[&_tr:last-child]:border-0 divide-y divide-[var(--ui-border)]">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-[var(--ui-muted)]/50 data-[state=selected]:bg-[var(--ui-muted)]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center text-[var(--ui-muted-foreground)]">
                  No rows found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-[var(--ui-muted-foreground)]">
          <span>
            {isServerSide
              ? `${serverSide.rowCount} total row(s)`
              : `${table.getFilteredRowModel().rows.length} total row(s)`}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm font-medium px-2">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
