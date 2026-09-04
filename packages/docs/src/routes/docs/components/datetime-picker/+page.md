---
title: Datetime Picker
description: Date and time picker with calendar and time selection.
---

# Datetime Picker

A combined date and time picker with a calendar view and time selector.

## Install

```bash
npx @intinyagroup/cli add datetime-picker
```

## Usage

```svelte
<script>
  import { DatetimePicker } from '@intinyagroup/ui';

  let selected = $state(new Date());
</script>

<DatetimePicker bind:value={selected} />
<p>Selected: {selected.toLocaleString()}</p>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | Date | - | Selected date/time |
| showTime | boolean | true | Show time picker |
| showSeconds | boolean | false | Show seconds selector |
| min | Date | - | Minimum selectable date |
| max | Date | - | Maximum selectable date |
| disabled | boolean | false | Disable interaction |
| class | string | - | Additional CSS classes |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| change | Date | Fires when date/time changes |

## Notes

- Calendar navigates months with chevron buttons.
- Time picker uses a 12/24-hour clock.
