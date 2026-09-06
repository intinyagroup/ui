---
title: Data Table
description: Enterprise data grid with sorting, pagination, selection, filtering, editing, and mobile card view.
---

# Data Table

Enterprise-grade data grid powered by TanStack Table Core, `@intinyagroup/grid-core`, and `@intinyagroup/tokens`.

## Install

```bash
pnpm add @intinyagroup/data-table @intinyagroup/ui @intinyagroup/tokens
```

## Basic Usage

```svelte
<script lang="ts">
  import { DataTable, type ColumnDef } from '@intinyagroup/data-table';

  interface User {
    id: string;
    name: string;
    role: string;
    status: string;
  }

  const columns: ColumnDef<User>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'role', header: 'Role' },
    { accessorKey: 'status', header: 'Status' }
  ];

  const data: User[] = [
    { id: '1', name: 'Joshua', role: 'Architect', status: 'Active' },
    { id: '2', name: 'Budi Santoso', role: 'Developer', status: 'Active' }
  ];
</script>

<DataTable
  {data}
  {columns}
  title="Users"
  searchable={true}
  exportable={true}
  selectable={true}
/>
```

---

## Enterprise Features

### 1. Floating Filter Row

Adds a persistent, direct filter input row right under the column headers:

```svelte
<DataTable
  {data}
  {columns}
  floatingFilter={true}
/>
```

### 2. In-Place Inline Cell Editing

Allows double-clicking or pressing `Enter` to edit cells directly in the table with keyboard commit handlers:

```svelte
<DataTable
  {data}
  {columns}
  editableColumns={['role', 'status']}
  onCellEdit={({ rowId, columnId, value }) => {
    console.log(`Updated row ${rowId} column ${columnId} to:`, value);
  }}
/>
```

### 3. Freeze Rows (Row Pinning)

Pin critical rows to the top with sticky elevation shadows:

```svelte
<DataTable
  {data}
  {columns}
  pinnedRowIds={['1']}
/>
```

### 4. Quick Filter Chips Bar

Instant clickable facet chips placed directly below the search bar:

```svelte
<DataTable
  {data}
  {columns}
  quickFilters={[
    { id: 'status', label: 'Active Only', value: 'Active' },
    { id: 'role', label: 'Developers', value: 'Developer' }
  ]}
/>
```

### 5. Mobile Card View (Zero Horizontal Overflow)

Transforms rows into stacked cards on mobile devices (`< 640px`):

```svelte
<DataTable
  {data}
  {columns}
  mobileCardView={true}
  expandable={true}
>
  {#snippet detail({ row })}
    <div class="p-3 bg-[var(--ui-secondary)]/30 rounded-lg text-xs">
      <p>Extended details for {row.name}</p>
    </div>
  {/snippet}
</DataTable>
```

### 6. Enterprise Right-Click Context Menu

Right-click anywhere on the table grid to copy matrix data (TSV) or export directly:

```svelte
<DataTable
  {data}
  {columns}
  contextMenu={true}
  exportable={true}
/>
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `TData[]` | `[]` | Array of row objects |
| `columns` | `ColumnDef[]` | `[]` | Column definitions array |
| `title` | `string` | — | Table header title |
| `description` | `string` | — | Subtitle / description |
| `searchable` | `boolean` | `true` | Enable global debounced search bar |
| `debounceMs` | `number` | `300` | Search debounce interval in milliseconds |
| `exportable` | `boolean` | `true` | Enable CSV and Excel (.xls) exports |
| `floatingFilter` | `boolean` | `false` | Enable floating per-column filter row |
| `mobileCardView` | `boolean` | `false` | Enable stacked card layout on mobile viewports |
| `expandable` | `boolean` | `false` | Enable expandable chevron buttons |
| `pinnedRowIds` | `string[]` | `[]` | Row IDs to freeze at the top with sticky elevation |
| `quickFilters` | `Array` | `[]` | Array of `{ id, label, value }` quick filter chips |
| `editableColumns`| `string[]` | `[]` | Column IDs that allow in-place editing |
| `contextMenu` | `boolean` | `true` | Enable enterprise right-click context menu |
| `serverSide` | `boolean` | `false` | Enable server-side pagination, sorting, and filtering |
| `rowCount` | `number` | `0` | Total records count on server (for server-side mode) |
