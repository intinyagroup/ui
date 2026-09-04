---
title: Data Table
description: Data table with sorting and pagination
---

# Data Table

A full-featured data table with sorting, pagination, and selection.

## Install

```bash
npx @intinyagroup/cli add data-table
```

## Usage

```html
<script>
  import { DataTable } from '@intinyagroup/ui';
</script>

<DataTable columns={columns} data={data} />
```

## Props

- `columns` - Column definitions array
- `data` - Row data array
- `sortable` - Enable column sorting
- `pagination` - Enable pagination
- `pageSize` - Rows per page
- `selectable` - Enable row selection
- `class` - Additional CSS classes

## Features

- Column sorting
- Client-side pagination
- Row selection
- Custom cell renderers
