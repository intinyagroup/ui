---
title: Date Range Picker
description: Popover date range picker with live hover interval highlight and business presets.
---

# Date Range Picker

A responsive date range picker powered by `date-fns` v4 and `@intinyagroup/tokens`.

## Install

```bash
pnpm add @intinyagroup/calendar @intinyagroup/ui @intinyagroup/tokens
```

## Basic Usage

```svelte
<script lang="ts">
  import { DateRangePicker, type DateRange } from '@intinyagroup/calendar';

  let range = $state<DateRange>({ start: null, end: null });
</script>

<DateRangePicker
  bind:value={range}
  placeholder="Select vacation dates..."
  onSelect={(selected) => console.log('Range selected:', selected)}
/>
```

---

## Localization & Week Start

Support Indonesian (`id-ID`) or English with configurable week start day (`0` = Sunday, `1` = Monday):

```svelte
<DateRangePicker
  bind:value={range}
  locale="id-ID"
  firstDayOfWeek={1}
  placeholder="Pilih rentang tanggal..."
/>
```

---

## Custom Business Presets

Inject custom quarter or fiscal ranges into the bottom preset bar:

```svelte
<DateRangePicker
  bind:value={range}
  presets={[
    {
      label: 'Q1 (Jan - Mar)',
      range: {
        start: { year: 2026, month: 0, day: 1 },
        end: { year: 2026, month: 2, day: 31 }
      }
    },
    {
      label: 'Q2 (Apr - Jun)',
      range: {
        start: { year: 2026, month: 3, day: 1 },
        end: { year: 2026, month: 5, day: 30 }
      }
    }
  ]}
/>
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `DateRange` | `{ start: null, end: null }` | Selected start and end date (bindable) |
| `locale` | `string` | `'en-US'` | Locale string for month and day labels (`'id-ID'`, `'en-US'`) |
| `firstDayOfWeek` | `number` | `0` | First day of week column (`0` = Sunday, `1` = Monday) |
| `presets` | `DateRangePreset[]` | default presets | Array of custom quick preset buttons |
| `placeholder` | `string` | `'Select date range...'` | Placeholder text when empty |
| `disabled` | `boolean` | `false` | Disable interactions |
| `onSelect` | `(range: DateRange) => void` | — | Callback fired when complete range is selected |
