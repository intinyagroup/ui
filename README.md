# @intinyagroup/ui

**Multi-framework component ecosystem (Svelte 5 & React 19) — 150+ components, 9 design themes, mobile, motion, and enterprise data grid.**

[![npm version](https://img.shields.io/npm/v/@intinyagroup/ui?style=flat-square&color=2563eb)](https://www.npmjs.com/package/@intinyagroup/ui)
[![npm downloads](https://img.shields.io/npm/dm/@intinyagroup/ui?style=flat-square&color=2563eb)](https://www.npmjs.com/package/@intinyagroup/ui)
[![CI](https://img.shields.io/github/actions/workflow/status/intinyagroup/ui/ci.yml?style=flat-square&color=2563eb)](https://github.com/intinyagroup/ui/actions)
[![License MIT](https://img.shields.io/npm/l/@intinyagroup/ui?style=flat-square&color=2563eb)](https://github.com/intinyagroup/ui/blob/main/LICENSE)

`@intinyagroup/ui` provides enterprise-grade UI components for Svelte 5 and React 19 powered by Ark UI and TanStack Table, with design tokens, motion frameworks, and CLI scaffolding.

---

## Packages

| Package | Framework | Description |
|---------|-----------|-------------|
| [`@intinyagroup/ui`](https://www.npmjs.com/package/@intinyagroup/ui) | Svelte 5 | 150+ core components (web + mobile + device) |
| [`@intinyagroup/react`](https://www.npmjs.com/package/@intinyagroup/react) | React 19 | React component suite with DataTable, Button, Input, Dialog |
| [`@intinyagroup/tokens`](https://www.npmjs.com/package/@intinyagroup/tokens) | CSS | 9 design themes (neutral, warm, dark, glass, brutalist, md3, flat, cyberpunk, retro) |
| [`@intinyagroup/cli`](https://www.npmjs.com/package/@intinyagroup/cli) | Node.js | CLI component installer (`add`, `init`, `update`, `doctor`) |
| [`@intinyagroup/data-table`](https://www.npmjs.com/package/@intinyagroup/data-table) | Svelte 5 | Enterprise data grid (sorting, filtering, pagination, virtualization, export) |
| [`@intinyagroup/grid-core`](https://www.npmjs.com/package/@intinyagroup/grid-core) | Agnostic | Headless data grid engine (persistence, keyboard nav, clipboard) |
| [`@intinyagroup/md3`](https://www.npmjs.com/package/@intinyagroup/md3) | Svelte 5 | Material Design 3 components |
| [`@intinyagroup/flat`](https://www.npmjs.com/package/@intinyagroup/flat) | Svelte 5 | Geometric / clip-path components |
| [`@intinyagroup/motion`](https://www.npmjs.com/package/@intinyagroup/motion) | Svelte 5 | Remotion-like video and canvas motion framework |
| [`@intinyagroup/editor-core`](https://www.npmjs.com/package/@intinyagroup/editor-core) | Svelte 5 | Visual drag-and-drop editor engine |
| [`@intinyagroup/rich-text`](https://www.npmjs.com/package/@intinyagroup/rich-text) | Svelte 5 | Tiptap rich-text editor wrapper |
| [`@intinyagroup/native`](https://www.npmjs.com/package/@intinyagroup/native) | Svelte 5 | Native device APIs (Capacitor wrapper) |

---

## Installation

### Option A — Svelte 5 (Library Model)

```bash
pnpm add @intinyagroup/ui @intinyagroup/tokens
```

### Option B — React 19

```bash
pnpm add @intinyagroup/react @intinyagroup/tokens
```

### Option C — CLI Copy (shadcn model)

```bash
npx @intinyagroup/cli add button card data-table
```

---

## Quick Setup

### 1. Import Design Tokens

In your main stylesheet (`src/app.css` or `src/index.css`):

```css
@import "@intinyagroup/tokens/base";
```

### 2. Set Theme

Set the theme attribute on your root `<html>` element:

```html
<html data-ui-theme="neutral">
```

Themes available: `neutral`, `warm`, `dark`, `glass`, `brutalist`, `md3`, `flat`, `cyberpunk`, `retro`, `neumorphism`.

---

## Usage Examples

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
import React from 'react';
import { Button, DataTable, type ColumnDef } from '@intinyagroup/react';

const columns: ColumnDef<{ id: string; name: string }>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' }
];

export function App() {
  return (
    <div className="p-6 space-y-4">
      <Button>Click Me</Button>
      <DataTable
        columns={columns}
        data={[{ id: '1', name: 'Joshua' }]}
        searchKey="name"
      />
    </div>
  );
}
```

---

## Development

```bash
pnpm install
pnpm dev              # Start Storybook component explorer
pnpm run build:all    # Build all 29 packages via Turborepo
pnpm run check        # Run workspace typecheck across all packages
pnpm test             # Run test suite
```

## License

MIT © [intinyagroup](https://github.com/intinyagroup)
