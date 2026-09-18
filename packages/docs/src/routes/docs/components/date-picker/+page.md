# Date Picker

A calendar-based date selection widget. Built on bits-ui date picker primitives with `@internationalized/date`.

## Install

```bash
npx @intinyagroup/cli add date-picker
```

## Usage

```svelte
<script>
  import { DatePicker } from '@intinyagroup/ui';
</script>

<DatePicker />
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `value` | `DateValue \| undefined` | `undefined` |
| `placeholder` | `string` | `"Pick a date"` |
| `disabled` | `boolean` | `false` |

The `DatePicker` is a self-contained component that renders a trigger button, calendar popover, and handles date selection internally.
