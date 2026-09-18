---
title: Markdown Renderer
description: Render Markdown content as HTML.
---

# Markdown Renderer

Renders a Markdown string into styled HTML output.

## Install

```bash
npx @intinyagroup/cli add markdown-renderer
```

## Usage

```svelte
<script>
  import { MarkdownRenderer } from '@intinyagroup/ui';

  const content = `
## Hello World

This is **bold** and this is *italic*.

- Item one
- Item two
`;
</script>

<MarkdownRenderer {content} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| content | string | - | Markdown string to render |
| class | string | - | Additional CSS classes |

## Notes

- Supports standard Markdown: headings, bold, italic, links, lists, code blocks, blockquotes, and tables.
- Code blocks receive syntax-highlighted classes.
- HTML in source Markdown is sanitized for security.
