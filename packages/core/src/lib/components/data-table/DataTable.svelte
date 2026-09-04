<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type ColumnDef = {
		id: string;
		header: string | Snippet<[]>;
		accessorKey?: string;
		accessorFn?: (row: any) => any;
		cell?: Snippet<[row: any]>;
		sortable?: boolean;
		class?: string;
	};

	export type DataTableProps = {
		data: any[];
		columns: ColumnDef[];
		class?: string;
		/** Number of rows per page. @default 10 */
		pageSize?: number;
		/** Whether row selection is enabled. @default false */
		selectable?: boolean;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';

	let {
		data = [],
		columns = [],
		class: className = '',
		pageSize = 10,
		selectable = false
	}: DataTableProps = $props();

	// ---- Sorting State ----
	let sorting = $state<Array<{ id: string; desc: boolean }>>([]);

	// ---- Pagination State ----
	let pageIndex = $state(0);

	// ---- Row Selection State ----
	let rowSelection = $state<Record<string, boolean>>({});

	// ---- Derived: Sorted Data ----
	let sortedData = $derived.by(() => {
		if (sorting.length === 0) return data;

		const sorted = [...data];
		for (const sort of sorting) {
			const col = columns.find((c) => c.id === sort.id);
			if (!col) continue;

			sorted.sort((a, b) => {
				let valA: any;
				let valB: any;

				if (col.accessorFn) {
					valA = col.accessorFn(a);
					valB = col.accessorFn(b);
				} else if (col.accessorKey) {
					valA = a[col.accessorKey];
					valB = b[col.accessorKey];
				} else {
					return 0;
				}

				if (valA === valB) return 0;
				if (valA === null || valA === undefined) return 1;
				if (valB === null || valB === undefined) return -1;

				const comparison = valA < valB ? -1 : 1;
				return sort.desc ? -comparison : comparison;
			});
		}
		return sorted;
	});

	// ---- Derived: Paginated Data ----
	let paginatedData = $derived.by(() => {
		const start = pageIndex * pageSize;
		return sortedData.slice(start, start + pageSize);
	});

	// ---- Derived: Page count ----
	let pageCount = $derived(Math.max(1, Math.ceil(sortedData.length / pageSize)));

	// ---- Derived: All rows on current page selected ----
	let isAllPageRowsSelected = $derived.by(() => {
		if (paginatedData.length === 0) return false;
		return paginatedData.every((_, i) => {
			const key = getRowKey(_, pageIndex * pageSize + i);
			return rowSelection[key] === true;
		});
	});

	// ---- Derived: Some rows on current page selected ----
	let isSomePageRowsSelected = $derived.by(() => {
		return paginatedData.some((_, i) => {
			const key = getRowKey(_, pageIndex * pageSize + i);
			return rowSelection[key] === true;
		});
	});

	// ---- Derived: Selected row count ----
	let selectedRowCount = $derived(Object.values(rowSelection).filter(Boolean).length);

	// ---- Helpers ----
	function getRowKey(row: any, index: number): string {
		return row.id ?? row._id ?? String(index);
	}

	function getCellValue(row: any, col: ColumnDef): any {
		if (col.accessorFn) return col.accessorFn(row);
		if (col.accessorKey) return row[col.accessorKey];
		return undefined;
	}

	function toggleSort(col: ColumnDef) {
		if (!col.sortable) return;

		const existing = sorting.find((s) => s.id === col.id);
		if (existing) {
			if (existing.desc) {
				// desc -> remove sort
				sorting = sorting.filter((s) => s.id !== col.id);
			} else {
				// asc -> desc
				sorting = sorting.map((s) => (s.id === col.id ? { ...s, desc: true } : s));
			}
		} else {
			sorting = [{ id: col.id, desc: false }];
		}
		pageIndex = 0;
	}

	function getSortDirection(col: ColumnDef): 'asc' | 'desc' | undefined {
		const sort = sorting.find((s) => s.id === col.id);
		if (!sort) return undefined;
		return sort.desc ? 'desc' : 'asc';
	}

	function toggleRowSelection(row: any, absoluteIndex: number) {
		const key = getRowKey(row, absoluteIndex);
		rowSelection = {
			...rowSelection,
			[key]: !rowSelection[key]
		};
	}

	function toggleAllRows() {
		const newSelection = { ...rowSelection };

		if (isAllPageRowsSelected) {
			// Deselect all on current page
			for (let i = 0; i < paginatedData.length; i++) {
				const key = getRowKey(paginatedData[i], pageIndex * pageSize + i);
				delete newSelection[key];
			}
		} else {
			// Select all on current page
			for (let i = 0; i < paginatedData.length; i++) {
				const key = getRowKey(paginatedData[i], pageIndex * pageSize + i);
				newSelection[key] = true;
			}
		}

		rowSelection = newSelection;
	}

	function goToPage(page: number) {
		pageIndex = Math.max(0, Math.min(page, pageCount - 1));
	}

	function nextPage() {
		goToPage(pageIndex + 1);
	}

	function prevPage() {
		goToPage(pageIndex - 1);
	}
</script>

<div
	data-slot="data-table"
	class={cn('w-full space-y-4', className)}
>
	<!-- Selected count indicator -->
	{#if selectable && selectedRowCount > 0}
		<div
			class="text-sm text-muted-foreground"
			role="status"
			aria-live="polite"
		>
			{selectedRowCount} row(s) selected
		</div>
	{/if}

	<!-- Table container -->
	<div class="relative w-full overflow-x-auto rounded-md border">
		<table
			data-slot="data-table-table"
			class="w-full caption-bottom text-sm"
			role="grid"
			aria-colcount={columns.length + (selectable ? 1 : 0)}
			aria-rowcount={sortedData.length}
		>
			<!-- Header -->
			<thead data-slot="data-table-header" class="[&_tr]:border-b">
				<tr>
					{#if selectable}
						<th
							scope="col"
							role="columnheader"
							class="h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 w-10"
						>
							<input
								type="checkbox"
								class="size-4 rounded border-primary accent-primary cursor-pointer"
								aria-checked={isAllPageRowsSelected}
								aria-label="Select all rows"
								onchange={toggleAllRows}
							/>
						</th>
					{/if}
					{#each columns as col, colIndex (col.id)}
						<th
							scope="col"
							role="columnheader"
							aria-colindex={colIndex + 1}
							aria-sort={getSortDirection(col) === 'asc'
								? 'ascending'
								: getSortDirection(col) === 'desc'
									? 'descending'
									: 'none'}
							class={cn(
								'h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground',
								col.sortable && 'cursor-pointer select-none hover:bg-muted/50',
								col.class
							)}
							onclick={() => toggleSort(col)}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									toggleSort(col);
								}
							}}
							tabindex={col.sortable ? 0 : undefined}
						>
							<div class="flex items-center gap-1">
								{#if typeof col.header === 'string'}
									{col.header}
								{:else}
									{@render col.header()}
								{/if}

								{#if col.sortable}
									<span class="inline-flex flex-col" aria-hidden="true">
										<svg
											class={cn(
												'size-3',
												getSortDirection(col) === 'asc' ? 'text-foreground' : 'text-muted-foreground/50'
											)}
											viewBox="0 0 16 16"
											fill="currentColor"
										>
											<path d="M8 3l5 5H3l5-5z" />
										</svg>
										<svg
											class={cn(
												'size-3 -mt-1.5',
												getSortDirection(col) === 'desc' ? 'text-foreground' : 'text-muted-foreground/50'
											)}
											viewBox="0 0 16 16"
											fill="currentColor"
										>
											<path d="M8 13l-5-5h10l-5 5z" />
										</svg>
									</span>
								{/if}
							</div>
						</th>
					{/each}
				</tr>
			</thead>

			<!-- Body -->
			<tbody data-slot="data-table-body" class="[&_tr:last-child]:border-0">
				{#each paginatedData as row, rowIndex (getRowKey(row, pageIndex * pageSize + rowIndex))}
					{@const absoluteIndex = pageIndex * pageSize + rowIndex}
					{@const isSelected = rowSelection[getRowKey(row, absoluteIndex)] === true}
					<tr
						data-slot="data-table-row"
						class={cn(
							'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
							isSelected && 'bg-muted'
						)}
						data-state={isSelected ? 'selected' : undefined}
					>
						{#if selectable}
							<td
								class="p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 w-10"
							>
								<input
									type="checkbox"
									class="size-4 rounded border-primary accent-primary cursor-pointer"
									aria-checked={isSelected}
									aria-label={`Select row ${rowIndex + 1}`}
									checked={isSelected}
									onchange={() => toggleRowSelection(row, absoluteIndex)}
								/>
							</td>
						{/if}
						{#each columns as col (col.id)}
							<td
								class={cn(
									'p-2 align-middle whitespace-nowrap',
									'[&:has([role=checkbox])]:pr-0',
									col.class
								)}
							>
								{#if col.cell}
									{@render col.cell(row)}
								{:else}
									{getCellValue(row, col) ?? ''}
								{/if}
							</td>
						{/each}
					</tr>
				{:else}
					<tr>
						<td
							colspan={columns.length + (selectable ? 1 : 0)}
							class="h-24 text-center text-muted-foreground"
						>
							No results.
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Pagination -->
	<div
		data-slot="data-table-pagination"
		class="flex items-center justify-between px-2 gap-4 flex-wrap"
	>
		<!-- Info -->
		<div class="text-sm text-muted-foreground" aria-live="polite">
			{#if selectable && selectedRowCount > 0}
				{selectedRowCount} of {sortedData.length} row(s) selected
			{:else}
				Showing {sortedData.length === 0 ? 0 : pageIndex * pageSize + 1} to {Math.min(
					(pageIndex + 1) * pageSize,
					sortedData.length
				)} of {sortedData.length} row(s)
			{/if}
		</div>

		<!-- Page controls -->
		<div class="flex items-center gap-2">
			<button
				type="button"
				class="inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium h-8 px-3 bg-transparent border border-input hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
				onclick={prevPage}
				disabled={pageIndex === 0}
				aria-label="Go to previous page"
			>
				<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="m15 18-6-6 6-6" />
				</svg>
				Previous
			</button>

			<div class="text-sm font-medium tabular-nums" aria-current="page">
				Page {pageIndex + 1} of {pageCount}
			</div>

			<button
				type="button"
				class="inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium h-8 px-3 bg-transparent border border-input hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
				onclick={nextPage}
				disabled={pageIndex >= pageCount - 1}
				aria-label="Go to next page"
			>
				Next
				<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="m9 18 6-6-6-6" />
				</svg>
			</button>
		</div>
	</div>
</div>
