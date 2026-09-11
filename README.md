# @intinyagroup/ui

**Multi-framework component ecosystem (Svelte 5 & React 19) — 150+ components, 9 design themes, calendar, data grid, kanban, charts, motion, and enterprise data tools.**

[![npm version](https://img.shields.io/npm/v/@intinyagroup/ui?style=flat-square&color=2563eb)](https://www.npmjs.com/package/@intinyagroup/ui)
[![npm downloads](https://img.shields.io/npm/dm/@intinyagroup/ui?style=flat-square&color=2563eb)](https://www.npmjs.com/package/@intinyagroup/ui)
[![CI](https://img.shields.io/github/actions/workflow/status/intinyagroup/ui/ci.yml?style=flat-square&color=2563eb)](https://github.com/intinyagroup/ui/actions)
[![Docs](https://img.shields.io/badge/docs-docs.intinyagroup.dev-2563eb?style=flat-square&labelColor=1a1a1a)](https://docs.intinyagroup.dev)
[![Storybook](https://img.shields.io/badge/storybook-storybook.intinyagroup.dev-ff4785?style=flat-square&labelColor=1a1a1a)](https://storybook.intinyagroup.dev)
[![License MIT](https://img.shields.io/npm/l/@intinyagroup/ui?style=flat-square&color=2563eb)](https://github.com/intinyagroup/ui/blob/main/LICENSE)

`@intinyagroup/ui` provides enterprise-grade UI components for Svelte 5 and React 19, with design tokens, calendar, data grids, charts, kanban boards, spreadsheets, motion frameworks, and CLI scaffolding.

---

## Packages

| Package                                                                                        | npm                             | Description                                                                          |
| ---------------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------ |
| [`@intinyagroup/ui`](https://www.npmjs.com/package/@intinyagroup/ui)                           | `@intinyagroup/ui`              | 150+ core components (web + mobile + device)                                         |
| [`@intinyagroup/react`](https://www.npmjs.com/package/@intinyagroup/react)                     | `@intinyagroup/react`           | React 19 component suite with DataTable, Button, Input, Dialog                       |
| [`@intinyagroup/tokens`](https://www.npmjs.com/package/@intinyagroup/tokens)                   | `@intinyagroup/tokens`          | 9 design themes (neutral, warm, dark, glass, brutalist, md3, flat, cyberpunk, retro) |
| [`@intinyagroup/data-table`](https://www.npmjs.com/package/@intinyagroup/data-table)           | `@intinyagroup/data-table`      | Enterprise data grid (sorting, filtering, virtualization, resize, export)            |
| [`@intinyagroup/calendar`](https://www.npmjs.com/package/@intinyagroup/calendar)               | `@intinyagroup/calendar`        | FullCalendar-equivalent (month/week/day, drag-reschedule, all-day slots, resize)     |
| [`@intinyagroup/kanban`](https://www.npmjs.com/package/@intinyagroup/kanban)                   | `@intinyagroup/kanban`          | Kanban board (drag-drop, swimlanes, WIP limits, labels, inline edit, detail modal)   |
| [`@intinyagroup/charts`](https://www.npmjs.com/package/@intinyagroup/charts)                   | `@intinyagroup/charts`          | Chart.js wrapper with design token integration and dark mode                         |
| [`@intinyagroup/spreadsheet`](https://www.npmjs.com/package/@intinyagroup/spreadsheet)         | `@intinyagroup/spreadsheet`     | Spreadsheet (cell editing, formatting toolbar, copy-paste, undo/redo, multi-sheet)   |
| [`@intinyagroup/grid-core`](https://www.npmjs.com/package/@intinyagroup/grid-core)             | `@intinyagroup/grid-core`       | Headless data grid engine (persistence, keyboard nav, clipboard)                     |
| [`@intinyagroup/motion`](https://www.npmjs.com/package/@intinyagroup/motion)                   | `@intinyagroup/motion`          | Remotion-like video and canvas motion framework                                      |
| [`@intinyagroup/rich-text`](https://www.npmjs.com/package/@intinyagroup/rich-text)             | `@intinyagroup/rich-text`       | TipTap rich-text editor wrapper                                                      |
| [`@intinyagroup/book-writer`](https://www.npmjs.com/package/@intinyagroup/book-writer)         | `@intinyagroup/book-writer`     | Book writer with multi-chapter editing, live preview, PDF/EPUB export                |
| [`@intinyagroup/slides`](https://www.npmjs.com/package/@intinyagroup/slides)                   | `@intinyagroup/slides`          | Presentation editor with slides, transitions, and export                             |
| [`@intinyagroup/notion-database`](https://www.npmjs.com/package/@intinyagroup/notion-database) | `@intinyagroup/notion-database` | Notion-style multi-view database (Table, Board, Calendar, Gallery)                   |
| [`@intinyagroup/pdf-viewer`](https://www.npmjs.com/package/@intinyagroup/pdf-viewer)           | `@intinyagroup/pdf-viewer`      | PDF viewer with annotations, form filling, and editing                               |
| [`@intinyagroup/cli`](https://www.npmjs.com/package/@intinyagroup/cli)                         | `@intinyagroup/cli`             | CLI component installer (`add`, `init`, `update`, `doctor`)                          |
| [`@intinyagroup/md3`](https://www.npmjs.com/package/@intinyagroup/md3)                         | `@intinyagroup/md3`             | Material Design 3 components                                                         |
| [`@intinyagroup/flat`](https://www.npmjs.com/package/@intinyagroup/flat)                       | `@intinyagroup/flat`            | Geometric / clip-path components                                                     |
| [`@intinyagroup/native`](https://www.npmjs.com/package/@intinyagroup/native)                   | `@intinyagroup/native`          | Capacitor plugin wrappers (camera, filesystem, etc.)                                 |
| [`@intinyagroup/editor-core`](https://www.npmjs.com/package/@intinyagroup/editor-core)         | `@intinyagroup/editor-core`     | Visual drag-and-drop editor engine                                                   |

---

## Quick Start

```bash
# Svelte 5
pnpm add @intinyagroup/ui @intinyagroup/tokens

# React 19
pnpm add @intinyagroup/react @intinyagroup/tokens

# CLI copy (shadcn model)
npx @intinyagroup/cli add button card data-table
```

### 1. Import Design Tokens

```css
@import "@intinyagroup/tokens/base";
```

### 2. Set Theme

```html
<html data-ui-theme="neutral"></html>
```

Themes: `neutral`, `warm`, `dark`, `glass`, `brutalist`, `md3`, `flat`, `cyberpunk`, `retro`.

---

## Usage

### Svelte 5

```svelte
<script lang="ts">
  import { Button, Card, CardHeader, CardTitle, CardContent } from '@intinyagroup/ui';
</script>

<Card>
  <CardHeader>
    <CardTitle>Welcome to Intinya</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="default">Get Started</Button>
  </CardContent>
</Card>
```

### React 19

```tsx
import { Button, DataTable, type ColumnDef } from "@intinyagroup/react";

const columns: ColumnDef<any, { id: string; name: string }, any>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
];

export function App() {
  return (
    <div className="p-6 space-y-4">
      <Button>Click Me</Button>
      <DataTable
        columns={columns}
        data={[{ id: "1", name: "Joshua" }]}
        searchKey="name"
      />
    </div>
  );
}
```

---

## Documentation

- **Docs**: [docs.intinyagroup.dev](https://docs.intinyagroup.dev)
- **Storybook**: [storybook.intinyagroup.dev](https://storybook.intinyagroup.dev)
- **GitHub**: [github.com/intinyagroup/ui](https://github.com/intinyagroup/ui)

---

## Development

```bash
pnpm install
pnpm dev              # Start Storybook component explorer
pnpm run build:all    # Build all packages
pnpm run check        # Typecheck across all packages
pnpm test             # Run test suite
```

## License

MIT © [intinyagroup](https://github.com/intinyagroup)
