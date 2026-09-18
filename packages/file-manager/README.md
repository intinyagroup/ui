# @intinyagroup/file-manager

Enterprise File Manager component for Svelte 5 with folder tree navigation, breadcrumbs, grid & list views, file preview, search, and file operations.

## Installation

```bash
pnpm add @intinyagroup/file-manager @intinyagroup/ui @intinyagroup/grid-core
```

## Features

- **Navigation**: Collapsible folder tree sidebar and interactive path breadcrumbs.
- **Views**: Grid cards and tabular list view with sortable columns.
- **Preview**: Modal preview for images, audio, video, and file metadata.
- **Operations**: Create folder, upload files, delete selection, and navigation callbacks.
- **Svelte 5**: Native runes (`$state`, `$derived`, `$props`).

## Basic Usage

```svelte
<script lang="ts">
  import { FileManager, type FileItem } from "@intinyagroup/file-manager";

  let files = $state<FileItem[]>([
    { id: "1", name: "Documents", type: "folder", parentId: null },
    {
      id: "2",
      name: "Report.pdf",
      type: "file",
      parentId: "1",
      size: 1048576,
      extension: "pdf",
    },
  ]);
</script>

<FileManager items={files} />
```
