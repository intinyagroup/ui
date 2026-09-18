---
title: Code Block
description: Code display with syntax highlighting and copy button.
---

# Code Block

Displays source code with optional syntax highlighting, line numbers, and a copy-to-clipboard button.

## Install

```bash
npx @intinyagroup/cli add code-block
```

## Usage

```svelte
<script>
  import { CodeBlock } from '@intinyagroup/ui';
</script>

<CodeBlock language="svelte" code={`<script>
  let count = $state(0);
</script>

<button onclick={() => count++}>
  Clicks: {count}
</button>`} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| code | string | - | Source code string to display |
| language | string | - | Language identifier for highlighting |
| showLineNumbers | boolean | false | Display line numbers |
| showCopyButton | boolean | true | Show copy-to-clipboard button |
| class | string | - | Additional CSS classes |

## Notes

- Supports any language with a highlighting provider.
- Copy button uses the Clipboard API.
