---
title: Combobox
description: Searchable select with autocomplete
---

# Combobox

A searchable select input that filters options as you type.

## Install

```bash
npx @intinyagroup/cli add combobox
```

## Usage

Use the Combobox component for searchable dropdowns:

```html
<script>
  import { Combobox } from '@intinyagroup/ui';
</script>

<Combobox options={[{ value: 'a', label: 'Option A' }]} />
```

## Props

- `options` - Array of option objects
- `value` - Selected value
- `placeholder` - Input placeholder
- `disabled` - Disable interaction
- `class` - Additional CSS classes

## Features

- Search filtering
- Keyboard navigation
- Clear button
