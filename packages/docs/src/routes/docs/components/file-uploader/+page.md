---
title: File Uploader
description: Drag-and-drop file upload area with progress.
---

# File Uploader

A file upload area supporting drag-and-drop, click-to-browse, and upload progress display.

## Install

```bash
npx @intinyagroup/cli add file-uploader
```

## Usage

```svelte
<script>
  import { FileUploader } from '@intinyagroup/ui';

  function handleUpload(files) {
    console.log('Uploading:', files);
  }
</script>

<FileUploader accept="image/*" onUpload={handleUpload} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| accept | string | - | Accepted file types (e.g. `"image/*"`) |
| multiple | boolean | false | Allow multiple files |
| maxSize | number | - | Max file size in bytes |
| disabled | boolean | false | Disable upload |
| class | string | - | Additional CSS classes |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| upload | File[] | Fires with accepted files |
| error | string | Fires on validation error |

## Slots

| Slot | Description |
|------|-------------|
| default | Custom drop zone content |
| uploading | Content shown during upload |

## Notes

- Shows file type and size validation errors inline.
- Drag-over state highlights the drop zone.
