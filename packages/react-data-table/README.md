# @intinyagroup/react-data-table

Enterprise React data table component powered by TanStack Table Core, Ark UI, and `@intinyagroup/tokens`.

## Features

- Sorting & Multi-column sorting (Shift+Click)
- Server-side sorting, pagination, and filtering
- Debounced search input
- CSV & Excel (.xls) export out of the box
- Loading skeleton placeholders
- Design token integration matching `@intinyagroup/ui`

## Installation

```bash
pnpm add @intinyagroup/react-data-table @intinyagroup/react @intinyagroup/tokens
```

## Usage

```tsx
import React from 'react';
import { DataTable, type ColumnDef } from '@intinyagroup/react-data-table';

interface User {
  id: string;
  name: string;
  role: string;
}

const columns: ColumnDef<User>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Role' },
];

export function UserList() {
  return (
    <DataTable
      columns={columns}
      data={[{ id: '1', name: 'Joshua', role: 'Admin' }]}
      searchKey="name"
      exportable={true}
    />
  );
}
```
