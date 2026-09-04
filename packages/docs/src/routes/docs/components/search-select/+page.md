---
title: SearchSelect
description: Autocomplete with server-side search
---

# SearchSelect

Autocomplete component with server-side search support.

## Install

```bash
npx @intinyagroup/cli add search-select
```

## Usage

```html
<script>
  import { SearchSelect } from '@intinyagroup/ui';
</script>

<SearchSelect options={[{ value: 'a', label: 'Option A' }]} />
```

## Props

- `options` - Array of option objects
- `value` - Selected value
- `placeholder` - Input placeholder
- `remote` - Enable server-side search
- `loading` - Show loading state
- `disabled` - Disable interaction

## Features

- Local filtering
- Server-side search
- Multiple selection
- Keyboard navigation
