# @intinyagroup/notion-database

Notion-style multi-view database component (Table, Board/Kanban, Calendar, Gallery) for Svelte 5.

## Features

- **Multi-View Switcher**: Seamlessly toggle between `Table`, `Board (Kanban)`, `Calendar`, and `Gallery (Cards)` views on the exact same dataset.
- **Unified Properties**: Define properties (title, select, status, date, number, text) once; all views adapt automatically.
- **Built-in Global Filter**: Search across any field with instant live filtering.
- **Full Svelte 5 Native**: Built on `@intinyagroup/data-table`, `@intinyagroup/kanban`, and `@intinyagroup/calendar`.

## Installation

```bash
pnpm add @intinyagroup/notion-database @intinyagroup/ui @intinyagroup/tokens
```

## Usage

```svelte
<script lang="ts">
  import { NotionDatabase, type DatabaseProperty } from '@intinyagroup/notion-database';

  interface Project {
    id: string;
    title: string;
    status: 'To Do' | 'In Progress' | 'Done';
    priority: 'Low' | 'Medium' | 'High';
    date: string;
    owner: string;
  }

  const properties: DatabaseProperty[] = [
    { key: 'title', label: 'Project Name', type: 'title' },
    {
      key: 'status',
      label: 'Status',
      type: 'status',
      options: [
        { value: 'To Do', label: 'To Do', color: '#64748b' },
        { value: 'In Progress', label: 'In Progress', color: '#2563eb' },
        { value: 'Done', label: 'Done', color: '#059669' }
      ]
    },
    { key: 'priority', label: 'Priority', type: 'select' },
    { key: 'date', label: 'Due Date', type: 'date' },
    { key: 'owner', label: 'Lead', type: 'text' }
  ];

  let items = $state<Project[]>([
    { id: '1', title: 'Q3 Mobile App Launch', status: 'In Progress', priority: 'High', date: '2026-09-15', owner: 'Joshua' },
    { id: '2', title: 'Design System Migration', status: 'Done', priority: 'Medium', date: '2026-09-02', owner: 'Budi' },
    { id: '3', title: 'Postgres Scale Tuning', status: 'To Do', priority: 'High', date: '2026-09-28', owner: 'Alex' }
  ]);
</script>

<NotionDatabase
  title="Engineering Roadmap"
  icon="🚀"
  {items}
  {properties}
  activeView="table"
  onItemClick={(item) => console.log('Open item:', item)}
/>
```
