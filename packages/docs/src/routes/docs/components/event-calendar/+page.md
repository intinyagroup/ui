---
title: Event Calendar
description: FullCalendar-style responsive agenda scheduler with Month, Week, and Day views.
---

# Event Calendar

A Google Calendar / FullCalendar equivalent for Svelte 5 with responsive views, timezone support, and built-in event creation modal.

## Install

```bash
pnpm add @intinyagroup/calendar @intinyagroup/ui @intinyagroup/tokens
```

## Basic Usage

```svelte
<script lang="ts">
  import { EventCalendar, type CalendarEvent, type CalendarView } from '@intinyagroup/calendar';

  let currentView = $state<CalendarView>('week');
  let currentDate = $state(new Date());

  let events = $state<CalendarEvent[]>([
    {
      id: '1',
      title: 'Sprint Planning',
      start: new Date(2026, 8, 7, 9, 30),
      end: new Date(2026, 8, 7, 11, 0),
      color: '#2563eb'
    },
    {
      id: '2',
      title: 'Design Review',
      start: new Date(2026, 8, 7, 14, 0),
      end: new Date(2026, 8, 7, 15, 30),
      color: '#7c3aed'
    }
  ]);
</script>

<div class="h-[750px] w-full p-4">
  <EventCalendar
    bind:events
    bind:view={currentView}
    bind:currentDate
    onEventClick={(ev) => console.log('Event clicked:', ev)}
  />
</div>
```

---

## Views Available

- **Month View (`view = 'month'`)**: 42-day calendar matrix with color event pills and overflow badges (`+N more`).
- **Week View (`view = 'week'`)**: 7-day multi-column agenda with 24-hour vertical timeline and Google Calendar red current time indicator line.
- **Day View (`view = 'day'`)**: Single-day detailed timeline showing event descriptions and exact start/end duration.

---

## Timezone Support

Render events and current time line according to a specific IANA timezone:

```svelte
<EventCalendar
  bind:events
  timeZone="Asia/Jakarta" <!-- Automatic WIB conversion and alignment -->
  locale="id-ID"
  firstDayOfWeek={1}      <!-- Monday start -->
/>
```

---

## Quick Event Creation Modal

Clicking any day or time slot automatically opens a quick creation popover with title autofocus, time selectors, color swatches, and description:

```svelte
<EventCalendar
  bind:events
  enableEventModal={true}
  onAddEvent={(newEvent) => {
    console.log('New event created:', newEvent);
  }}
/>
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `events` | `CalendarEvent[]` | `[]` | Reactive array of events (bindable) |
| `view` | `'month' \| 'week' \| 'day'` | `'month'` | Active calendar view mode (bindable) |
| `currentDate` | `Date` | `new Date()` | Currently viewed date anchor (bindable) |
| `timeZone` | `string` | browser timezone | IANA timezone identifier (`'Asia/Jakarta'`, `'UTC'`, `'Asia/Tokyo'`) |
| `locale` | `string` | `'en-US'` | Locale string for day and month names |
| `firstDayOfWeek` | `number` | `0` | Week start day index (`0` = Sunday, `1` = Monday) |
| `enableEventModal` | `boolean` | `true` | Open built-in event creation modal on slot click |
| `onEventClick` | `(event: CalendarEvent) => void` | — | Callback fired when an event pill is clicked |
| `onDateClick` | `(date: Date) => void` | — | Callback fired when a day cell is clicked |
| `onAddEvent` | `(event: CalendarEvent) => void` | — | Callback fired when an event is saved via modal |
