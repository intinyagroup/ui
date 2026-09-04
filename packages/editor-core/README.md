# @intinyagroup/editor-core

[![npm version](https://img.shields.io/npm/v/@intinyagroup/editor-core?style=flat-square&color=7c3aed)](https://www.npmjs.com/package/@intinyagroup/editor-core)
[![Docs](https://img.shields.io/badge/docs-ui.intinya.id-7c3aed?style=flat-square&labelColor=1a1a1a)](https://ui.intinya.id)
[![License MIT](https://img.shields.io/npm/l/@intinyagroup/editor-core?style=flat-square&color=7c3aed)](https://github.com/intinyagroup/ui/blob/main/LICENSE)


Visual editor engine for Intinya UI — drag-drop, canvas, and state management primitives for building block-based editors.

## Install

```bash
npm install @intinyagroup/editor-core
```

## Usage

```svelte
<script>
  import { EditorCanvas, EditorBlock } from '@intinyagroup/editor-core';
</script>

<EditorCanvas>
  <EditorBlock type="text" />
</EditorCanvas>
```

## License

MIT
