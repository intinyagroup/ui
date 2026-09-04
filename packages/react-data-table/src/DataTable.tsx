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
import {
  Button,
  Input,
  Skeleton,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPositioner,
  DropdownMenuContent,
  DropdownMenuItem,
  cn
} from '@intinyagroup/react';
import { Portal } from '@ark-ui/react/portal';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  FileSpreadsheet,
  FileText
} from 'lucide-react';

export interface ServerSideConfig {
  rowCount: number;
  pageIndex?: number;
  pageSize?: number;
  sorting?: SortingState;
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  onSortingChange?: (sorting: { id: string; desc: boolean }[]) => void;
  onSearchChange?: (search: string) => void;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  searchKey?: string;
  searchPlaceholder?: string;
  debounceMs?: number;
  loading?: boolean;
  exportable?: boolean;
  enableMultiSort?: boolean;
  emptyMessage?: string;
  className?: string;
  serverSide?: ServerSideConfig;
  onExport?: (format: 'csv' | 'xlsx', data: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  searchKey,
  searchPlaceholder = 'Search...',
  debounceMs = 300,
  loading = false,
  exportable = true,
  enableMultiSort = true,
  emptyMessage = 'No rows found.',
  className,
  serverSide,
  onExport
}: DataTableProps<TData, TValue>) {
  // Client-side fallback state
  const [clientSorting, setClientSorting] = React.useState<SortingState>([]);
  const [clientPagination, setClientPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [searchValue, setSearchValue] = React.useState('');

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

  // Debounced search handling
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (isServerSide) {
        serverSide.onSearchChange?.(searchValue);
      } else if (searchKey) {
        table.getColumn(searchKey)?.setFilterValue(searchValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, debounceMs, isServerSide, searchKey]);

  const table = useReactTable({
    data,
    columns,
    enableMultiSort,
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

  const exportToCSV = React.useCallback(() => {
    const rows = table.getFilteredRowModel().rows;
    if (!rows.length) return;

    const activeHeaders = table
      .getAllLeafColumns()
      .filter((col) => col.getIsVisible() && typeof col.columnDef.header === 'string');

    const headerRow = activeHeaders.map((col) => `"${col.columnDef.header}"`).join(',');
    const dataRows = rows.map((row) =>
      activeHeaders
        .map((col) => {
          const value = row.getValue(col.id);
          return `"${value !== undefined && value !== null ? String(value).replaceAll('"', '""') : ''}"`;
        })
        .join(',')
    );

    const csvContent = [headerRow, ...dataRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `${title?.toLowerCase().replaceAll(' ', '_') || 'export'}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onExport?.('csv', rows.map((r) => r.original));
  }, [table, title, onExport]);

  const exportToExcel = React.useCallback(() => {
    const rows = table.getFilteredRowModel().rows;
    if (!rows.length) return;

    const activeHeaders = table
      .getAllLeafColumns()
      .filter((col) => col.getIsVisible() && typeof col.columnDef.header === 'string');

    const headerCells = activeHeaders
      .map(
        (col) =>
          `<th style="font-weight:bold;background:#f0f0f0;padding:6px 8px;border:1px solid #ccc;">${col.columnDef.header}</th>`
      )
      .join('');

    const dataRows = rows
      .map((row) => {
        const cells = activeHeaders
          .map((col) => {
            const value = row.getValue(col.id);
            return `<td style="padding:6px 8px;border:1px solid #ccc;">${value !== undefined && value !== null ? String(value) : ''}</td>`;
          })
          .join('');
        return `<tr>${cells}</tr>`;
      })
      .join('');

    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="UTF-8"></head>
      <body><table border="1" cellpadding="0" cellspacing="0">
        <thead><tr>${headerCells}</tr></thead>
        <tbody>${dataRows}</tbody>
      </table></body></html>`;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `${title?.toLowerCase().replaceAll(' ', '_') || 'export'}.xls`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onExport?.('xlsx', rows.map((r) => r.original));
  }, [table, title, onExport]);

  return (
    <div className={cn('space-y-4', className)}>
      {(searchKey || exportable) && (
        <div className="flex items-center justify-between py-2 gap-4">
          {searchKey ? (
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="max-w-sm"
            />
          ) : <div />}

          {exportable && (
            <DropdownMenuRoot positioning={{ placement: 'bottom-end' }}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="size-3.5" /> Export
                </Button>
              </DropdownMenuTrigger>
              <Portal>
                <DropdownMenuPositioner>
                  <DropdownMenuContent className="w-40">
                    <DropdownMenuItem value="csv" onClick={exportToCSV} className="gap-2 cursor-pointer">
                      <FileText className="size-4" /> CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem value="xlsx" onClick={exportToExcel} className="gap-2 cursor-pointer">
                      <FileSpreadsheet className="size-4" /> Excel (.xls)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenuPositioner>
              </Portal>
            </DropdownMenuRoot>
          )}
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
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="border-b border-[var(--ui-border)]">
                  {columns.map((_, colIdx) => (
                    <td key={`col-${colIdx}`} className="p-4 align-middle">
                      <Skeleton className="h-5 w-full max-w-[140px]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows?.length ? (
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
                  {emptyMessage}
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
