import type { CalendarEvent } from "./EventCalendar";

/** Supported recurrence frequencies. This is intentionally smaller than RFC 5545 RRULE. */
export type CalendarRecurrenceFrequency =
  "daily" | "weekly" | "monthly" | "yearly";

/**
 * Minimal RRULE-like recurrence model.
 *
 * Only frequency, interval, until, and count are supported. BYDAY, BYMONTHDAY,
 * EXDATE, timezone transition rules, and other RFC 5545 semantics are not
 * implemented. `until` is inclusive and `count` counts generated occurrences.
 */
export type CalendarRecurrence = {
  frequency: CalendarRecurrenceFrequency;
  interval?: number;
  until?: Date;
  count?: number;
};

/** Resource displayed as a row in `resourceTimeline` view. */
export type CalendarResource = {
  id: string;
  label: string;
  description?: string;
  color?: string;
};

export type RecurringCalendarEvent = CalendarEvent & {
  recurrence?: CalendarRecurrence;
  resourceId?: string;
};

function addOccurrence(date: Date, recurrence: CalendarRecurrence): Date {
  const result = new Date(date);
  const interval = Math.max(1, Math.floor(recurrence.interval ?? 1));

  if (recurrence.frequency === "daily")
    result.setDate(result.getDate() + interval);
  else if (recurrence.frequency === "weekly")
    result.setDate(result.getDate() + interval * 7);
  else if (recurrence.frequency === "monthly")
    result.setMonth(result.getMonth() + interval);
  else result.setFullYear(result.getFullYear() + interval);

  return result;
}

/** Expand one event into occurrences intersecting inclusive range. */
export function expandRecurringEvent(
  event: RecurringCalendarEvent,
  rangeStart: Date,
  rangeEnd: Date,
): CalendarEvent[] {
  if (!event.recurrence) return [event];

  const recurrence = event.recurrence;
  const duration =
    new Date(event.end).getTime() - new Date(event.start).getTime();
  const until = recurrence.until
    ? new Date(recurrence.until).getTime()
    : Infinity;
  const maxCount =
    recurrence.count === undefined
      ? Infinity
      : Math.max(0, Math.floor(recurrence.count));
  const occurrences: CalendarEvent[] = [];
  let occurrenceStart = new Date(event.start);
  let index = 0;

  // Guard malformed input while keeping expansion deterministic for UI rendering.
  while (index < maxCount && occurrenceStart.getTime() <= until) {
    const occurrenceEnd = new Date(occurrenceStart.getTime() + duration);
    if (
      occurrenceEnd.getTime() >= rangeStart.getTime() &&
      occurrenceStart.getTime() <= rangeEnd.getTime()
    ) {
      occurrences.push({
        ...event,
        id:
          index === 0 ? event.id : `${event.id}::${occurrenceStart.getTime()}`,
        start: occurrenceStart,
        end: occurrenceEnd,
      });
    }

    index += 1;
    const nextStart = addOccurrence(occurrenceStart, recurrence);
    if (nextStart.getTime() <= occurrenceStart.getTime()) break;
    occurrenceStart = nextStart;

    // No need to iterate unbounded future occurrences after range end.
    if (
      occurrenceStart.getTime() > rangeEnd.getTime() &&
      !recurrence.until &&
      recurrence.count === undefined
    )
      break;
  }

  return occurrences;
}

/** Expand recurring events for a calendar viewport. Non-recurring events pass through. */
export function expandRecurringEvents(
  events: RecurringCalendarEvent[],
  rangeStart: Date,
  rangeEnd: Date,
): CalendarEvent[] {
  return events.flatMap((event) =>
    expandRecurringEvent(event, rangeStart, rangeEnd),
  );
}
