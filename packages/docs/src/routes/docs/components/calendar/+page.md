# Calendar

A single-date month calendar with month navigation, min/max date constraints, and full keyboard support. Displays a stable 6-week grid with dimmed days from adjacent months.

## Usage

```svelte
<script>
  import { Calendar } from '@intinyagroup/ui';

  let date = $state('2026-08-07');
</script>

<Calendar bind:value={date} />
```

## Options

```svelte
<!-- Restrict the selectable range -->
<Calendar min="2026-01-01" max="2026-12-31" onDayClick={(iso) => console.log(iso)} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| null` | `null` | Selected date as `YYYY-MM-DD` (bindable) |
| `month` | `number` | current month | Visible month, 0-based (bindable) |
| `year` | `number` | current year | Visible year (bindable) |
| `min` | `string` | — | Earliest selectable date (`YYYY-MM-DD`) |
| `max` | `string` | — | Latest selectable date (`YYYY-MM-DD`) |
| `onDayClick` | `(date: string) => void` | — | Called with the `YYYY-MM-DD` when a day is selected |
| `class` | `string` | — | Additional classes |

All other props are forwarded to the root `<div>` (`aria-label`, `id`, etc.).

## Keyboard navigation

| Key | Action |
|-----|--------|
| `ArrowLeft` / `ArrowRight` | Move focus one day |
| `ArrowUp` / `ArrowDown` | Move focus one week |
| `Enter` / `Space` | Select the focused day |
| `Escape` | Reset focus to the selected day (or today) |

## Features

- Month grid with prev/next navigation
- Min/max date constraints (out-of-range days are disabled)
- Full keyboard navigation with focus ring
- Today highlighted, days outside the month dimmed
- Stable 6-week grid so the calendar doesn't jump in height

## Install

```bash
npx @intinyagroup/cli add calendar
```
