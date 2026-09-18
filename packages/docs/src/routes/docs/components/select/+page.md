# Select

A styled native-like select with custom trigger and dropdown.

## Preview

```svelte
<script>
  import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@intinyagroup/ui';
</script>

<Select>
  <SelectTrigger class="w-48">
    <SelectValue placeholder="Choose a framework" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="svelte">Svelte</SelectItem>
    <SelectItem value="react">React</SelectItem>
    <SelectItem value="vue">Vue</SelectItem>
  </SelectContent>
</Select>
```

## Structure

- `Select` — root with bindable `value`
- `SelectTrigger` — the visible control
- `SelectValue` — shows selected value or placeholder
- `SelectContent` — the dropdown panel
- `SelectItem` — an option

## Install

```bash
npx @intinyagroup/cli add select
```
