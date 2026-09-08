<script lang="ts">
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CalendarDays, Clock, Plus, X } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/ui/utils';
  import {
    addMonths,
    subMonths,
    addWeeks,
    subWeeks,
    addDays,
    subDays,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameDay,
    isSameMonth,
    format
  } from 'date-fns';
  import { id as localeId, enUS as localeEn } from 'date-fns/locale';

  export type CalendarView = 'month' | 'week' | 'day';

  export type CalendarEvent = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    color?: string;
    description?: string;
    allDay?: boolean;
  };

  let {
    events = $bindable([]),
    view = $bindable('month' as CalendarView),
    currentDate = $bindable(new Date()),
    locale = 'en-US',
    timeZone,
    firstDayOfWeek = 0, // 0 = Sunday, 1 = Monday
    enableEventModal = true,
    class: className,
    onEventClick,
    onDateClick,
    onAddEvent,
    onDragCreate,
    onEventReschedule,
  }: {
    events?: CalendarEvent[];
    view?: CalendarView;
    currentDate?: Date;
    locale?: string;
    timeZone?: string;
    firstDayOfWeek?: number;
    enableEventModal?: boolean;
    class?: string;
    onEventClick?: (event: CalendarEvent) => void;
    onDateClick?: (date: Date) => void;
    onAddEvent?: (newEvent: CalendarEvent) => void;
    onEventReschedule?: (detail: { event: CalendarEvent; newStart: Date; newEnd: Date }) => void;
    onEventResize?: (detail: { event: CalendarEvent; newStart: Date; newEnd: Date }) => void;
    onDragCreate?: (detail: { start: Date; end: Date }) => void;
  } = $props();

  let draggedEventId = $state<string | null>(null);
  let resizingEventId = $state<string | null>(null);
  let resizeStartY = $state<number>(0);
  let resizeStartDuration = $state<number>(0);
  // Drag-to-create state
  let dragCreateStart = $state<{ date: Date; hour: number; minute: number } | null>(null);
  let dragCreateEnd = $state<{ date: Date; hour: number; minute: number } | null>(null);
  let isDragCreating = $state(false);
  let dragCreateColumn = $state<Date | null>(null);
  // Mobile detection
  let isMobile = $state(typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false);
  $effect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    isMobile = mq.matches;
    const handler = (e: MediaQueryListEvent) => { isMobile = e.matches; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  });

  // Mobile week: show only current day ± 1
  const mobileWeekDays = $derived([
    subDays(currentDate, 1),
    currentDate,
    addDays(currentDate, 1)
  ]);

  function isMultiDayOrAllDay(ev: CalendarEvent): boolean {
    if (ev.allDay) return true;
    const s = new Date(ev.start);
    const e = new Date(ev.end);
    return !isSameDay(s, e) || (e.getTime() - s.getTime() >= 24 * 60 * 60 * 1000);
  }

  function handleEventDrop(targetDate: Date, targetHour?: number) {
    if (!draggedEventId) return;
    const ev = events.find((e) => e.id === draggedEventId);
    if (!ev) return;

    const origDurationMs = new Date(ev.end).getTime() - new Date(ev.start).getTime();
    const newStart = new Date(targetDate);
    if (targetHour !== undefined) {
      newStart.setHours(targetHour, 0, 0, 0);
    } else {
      newStart.setHours(new Date(ev.start).getHours(), new Date(ev.start).getMinutes(), 0, 0);
    }
    const newEnd = new Date(newStart.getTime() + origDurationMs);

    events = events.map((e) =>
      e.id === draggedEventId ? { ...e, start: newStart, end: newEnd } : e
    );

    onEventReschedule?.({ event: ev, newStart, newEnd });
    draggedEventId = null;
  }

  function handleResizeStart(e: MouseEvent, ev: CalendarEvent) {
    e.stopPropagation();
    e.preventDefault();
    resizingEventId = ev.id;
    resizeStartY = e.clientY;
    resizeStartDuration = new Date(ev.end).getTime() - new Date(ev.start).getTime();

    function onMouseMove(moveEvent: MouseEvent) {
      if (!resizingEventId) return;
      const deltaY = moveEvent.clientY - resizeStartY;
      // 56px per hour => deltaY / 56 hours
      const deltaHours = deltaY / 56;
      // Snap to 15 minute increments (0.25h = 15 * 60 * 1000 ms)
      const snapIntervalMs = 15 * 60 * 1000;
      const rawDeltaMs = deltaHours * 60 * 60 * 1000;
      const snappedDeltaMs = Math.round(rawDeltaMs / snapIntervalMs) * snapIntervalMs;
      const newDurationMs = Math.max(15 * 60 * 1000, resizeStartDuration + snappedDeltaMs);

      events = events.map((item) => {
        if (item.id === resizingEventId) {
          const s = new Date(item.start);
          return { ...item, end: new Date(s.getTime() + newDurationMs) };
        }
        return item;
      });
    }

    function onMouseUp() {
      if (resizingEventId) {
        const finished = events.find((item) => item.id === resizingEventId);
        if (finished) {
          onEventResize?.({ event: finished, newStart: new Date(finished.start), newEnd: new Date(finished.end) });
        }
      }
      resizingEventId = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }
  // Drag-to-create: snap to 15-minute increments
  function snapTo15Minutes(minutes: number): number {
    return Math.round(minutes / 15) * 15;
  }

  function handleDragCreateMouseDown(e: MouseEvent, date: Date, hour: number, containerEl: HTMLElement) {
    // Only left click
    if (e.button !== 0) return;
    // Don't start drag-create if already dragging an event or resizing
    if (draggedEventId || resizingEventId) return;
    // Don't start if clicking on an event element
    const target = e.target as HTMLElement;
    if (target.closest('[role="button"]') || target.closest('.group\\/event')) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = containerEl.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const hourHeight = containerEl.id === 'week-day-col' ? 56 : 64;
    const minutesInHour = (y / hourHeight) * 60;
    const minute = snapTo15Minutes(minutesInHour);
    const clampedMinute = Math.min(45, Math.max(0, minute));

    dragCreateStart = { date, hour, minute: clampedMinute };
    dragCreateEnd = { date, hour, minute: clampedMinute + 15 };
    dragCreateColumn = date;
    isDragCreating = true;

    function onMouseMove(moveEvent: MouseEvent) {
      if (!isDragCreating || !dragCreateStart) return;
      const moveY = moveEvent.clientY - rect.top;
      const moveMinutesInHour = (moveY / hourHeight) * 60;
      const snappedMinutes = snapTo15Minutes(moveMinutesInHour);
      const clampedMinutes = Math.min(24 * 60, Math.max(0, snappedMinutes));

      const totalStartMinutes = dragCreateStart.hour * 60 + dragCreateStart.minute;
      let totalEndMinutes = Math.max(totalStartMinutes + 15, clampedMinutes);
      totalEndMinutes = Math.min(24 * 60, totalEndMinutes);

      const endHour = Math.floor(totalEndMinutes / 60);
      const endMinute = totalEndMinutes % 60;
      dragCreateEnd = { date, hour: endHour, minute: endMinute };
    }

    function onMouseUp() {
      if (isDragCreating && dragCreateStart && dragCreateEnd) {
        const startMinutes = dragCreateStart.hour * 60 + dragCreateStart.minute;
        const endMinutes = dragCreateEnd.hour * 60 + dragCreateEnd.minute;

        if (endMinutes - startMinutes >= 15) {
          const startDate = new Date(date);
          startDate.setHours(dragCreateStart.hour, dragCreateStart.minute, 0, 0);
          const endDate = new Date(date);
          endDate.setHours(dragCreateEnd.hour, dragCreateEnd.minute, 0, 0);

          onDragCreate?.({ start: startDate, end: endDate });

          if (enableEventModal) {
            newEventDate = new Date(date);
            newEventStartTime = `${String(dragCreateStart.hour).padStart(2, '0')}:${String(dragCreateStart.minute).padStart(2, '0')}`;
            newEventEndTime = `${String(dragCreateEnd.hour).padStart(2, '0')}:${String(dragCreateEnd.minute).padStart(2, '0')}`;
            modalOpen = true;
          }
        }
      }

      isDragCreating = false;
      dragCreateStart = null;
      dragCreateEnd = null;
      dragCreateColumn = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  type LayoutEvent = CalendarEvent & {
    colIndex: number;
    colTotal: number;
  };

  function computeOverlappingLayout(dayEvs: CalendarEvent[]): LayoutEvent[] {
    // Sort events by start time, then longer events first
    const sorted = [...dayEvs].sort((a, b) => {
      const diff = new Date(a.start).getTime() - new Date(b.start).getTime();
      if (diff !== 0) return diff;
      return (new Date(b.end).getTime() - new Date(b.start).getTime()) - (new Date(a.end).getTime() - new Date(a.start).getTime());
    });

    const columns: CalendarEvent[][] = [];
    const layoutMap = new Map<string, { colIndex: number }>();

    for (const ev of sorted) {
      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        const lastInCol = columns[i][columns[i].length - 1];
        if (new Date(lastInCol.end).getTime() <= new Date(ev.start).getTime()) {
          columns[i].push(ev);
          layoutMap.set(ev.id, { colIndex: i });
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([ev]);
        layoutMap.set(ev.id, { colIndex: columns.length - 1 });
      }
    }

    // Determine overlapping groups
    return sorted.map((ev) => {
      const colInfo = layoutMap.get(ev.id) || { colIndex: 0 };
      // Count how many columns overlap with this event
      let overlappingCols = 1;
      for (let c = 0; c < columns.length; c++) {
        const hasOverlap = columns[c].some(
          (other) =>
            new Date(other.start).getTime() < new Date(ev.end).getTime() &&
            new Date(other.end).getTime() > new Date(ev.start).getTime()
        );
        if (hasOverlap && c + 1 > overlappingCols) {
          overlappingCols = c + 1;
        }
      }

      return {
        ...ev,
        colIndex: colInfo.colIndex,
        colTotal: Math.max(1, overlappingCols),
      };
    });
  }

  const activeTimeZone = $derived(
    timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  );

  const activeDateFnsLocale = $derived(locale.startsWith('id') ? localeId : localeEn);
  const weekStartsOn = $derived(firstDayOfWeek as 0 | 1 | 2 | 3 | 4 | 5 | 6);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  // Day names localized and rotated according to firstDayOfWeek via date-fns
  const dayNames = $derived.by(() => {
    const start = startOfWeek(currentDate, { weekStartsOn });
    return Array.from({ length: 7 }, (_, i) => {
      return format(addDays(start, i), 'EEE', { locale: activeDateFnsLocale });
    });
  });

  function isToday(d: Date): boolean {
    return isSameDay(d, new Date());
  }

  function goPrev() {
    if (view === 'month') currentDate = subMonths(currentDate, 1);
    else if (view === 'week') currentDate = subWeeks(currentDate, 1);
    else currentDate = subDays(currentDate, 1);
  }

  function goNext() {
    if (view === 'month') currentDate = addMonths(currentDate, 1);
    else if (view === 'week') currentDate = addWeeks(currentDate, 1);
    else currentDate = addDays(currentDate, 1);
  }

  function goToday() {
    currentDate = new Date();
  }

  // Month view calendar matrix using date-fns intervals
  const monthDays = $derived.by(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const gridStart = startOfWeek(monthStart, { weekStartsOn });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn });

    const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
    return days.map((d) => ({
      date: d,
      currentMonth: isSameMonth(d, currentDate)
    }));
  });

  // Week view 7 days using date-fns
  const weekDays = $derived.by(() => {
    const start = startOfWeek(currentDate, { weekStartsOn });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  });

  function getEventsForDay(d: Date): CalendarEvent[] {
    return events.filter((ev) => {
      if (isSameDay(new Date(ev.start), d)) return true;
      // Multi-day spanning: check if date falls between start and end
      const s = new Date(ev.start);
      const e = new Date(ev.end);
      return d >= s && d <= e;
    });
  }

  function getTimedEventsForDay(d: Date): CalendarEvent[] {
    return events.filter((ev) => !isMultiDayOrAllDay(ev) && isSameDay(new Date(ev.start), d));
  }

  function getAllDayEventsForWeek(days: Date[]): CalendarEvent[] {
    return events.filter((ev) => {
      if (!isMultiDayOrAllDay(ev)) return false;
      const s = new Date(ev.start);
      const e = new Date(ev.end);
      return days.some((d) => isSameDay(d, s) || isSameDay(d, e) || (d > s && d < e));
    });
  }

  function getTimeInZone(date: Date): { hours: number; minutes: number } {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: activeTimeZone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }).formatToParts(date);

    let hours = 0;
    let minutes = 0;
    for (const p of parts) {
      if (p.type === 'hour') hours = Number(p.value) % 24;
      if (p.type === 'minute') minutes = Number(p.value);
    }
    return { hours, minutes };
  }

  function formatTime(date: Date): string {
    return new Intl.DateTimeFormat(locale, {
      timeZone: activeTimeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  }

  const titleHeader = $derived.by(() => {
    if (view === 'month') {
      return format(currentDate, 'MMMM yyyy', { locale: activeDateFnsLocale });
    }
    if (view === 'week') {
      const displayDays = isMobile ? mobileWeekDays : weekDays;
      const start = displayDays[0];
      const end = displayDays[displayDays.length - 1];
      const sStr = format(start, 'dd MMM', { locale: activeDateFnsLocale });
      const eStr = format(end, 'dd MMM yyyy', { locale: activeDateFnsLocale });
      return `${sStr} - ${eStr}`;
    }
    return format(currentDate, 'dd MMMM yyyy', { locale: activeDateFnsLocale });
  });

  // Event modal state
  let modalOpen = $state(false);
  let newEventTitle = $state('');
  let newEventDate = $state(new Date());
  let newEventStartTime = $state('09:00');
  let newEventEndTime = $state('10:00');
  let newEventColor = $state('#2563eb');
  let newEventDescription = $state('');

  const presetColors = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2', '#4b5563'];

  function openCreateModal(date: Date) {
    if (!enableEventModal) return;
    newEventDate = new Date(date);
    newEventTitle = '';
    newEventStartTime = '09:00';
    newEventEndTime = '10:00';
    newEventColor = '#2563eb';
    newEventDescription = '';
    modalOpen = true;
  }

  function handleSaveEvent() {
    if (!newEventTitle.trim()) return;

    const [startH, startM] = newEventStartTime.split(':').map(Number);
    const [endH, endM] = newEventEndTime.split(':').map(Number);

    const startDate = new Date(newEventDate);
    startDate.setHours(startH || 0, startM || 0, 0, 0);

    const endDate = new Date(newEventDate);
    endDate.setHours(endH || 0, endM || 0, 0, 0);

    const newEv: CalendarEvent = {
      id: `ev-${Date.now()}`,
      title: newEventTitle.trim(),
      start: startDate,
      end: endDate,
      color: newEventColor,
      description: newEventDescription.trim() || undefined
    };

    events = [...events, newEv];
    onAddEvent?.(newEv);
    modalOpen = false;
  }
</script>

<div class={cn('relative flex flex-col rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] shadow-xs overflow-hidden', className)}>
  <!-- Toolbar Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--ui-border)] p-4 sm:px-6">
    <div class="flex flex-col sm:flex-row sm:items-center gap-2">
      <h2 class="text-base font-bold text-[var(--ui-foreground)] capitalize">{titleHeader}</h2>
      <div class="flex items-center gap-1">
        <Button variant="outline" size="sm" class="size-8 p-0" onclick={goPrev}>
          <ChevronLeft class="size-4" />
        </Button>
        <Button variant="outline" size="sm" class="px-2.5 h-8 text-xs font-semibold" onclick={goToday}>
          Today
        </Button>
        <Button variant="outline" size="sm" class="size-8 p-0" onclick={goNext}>
          <ChevronRight class="size-4" />
        </Button>
      </div>
      <span class="hidden sm:inline-flex items-center rounded-md bg-[var(--ui-secondary)]/50 px-2 py-0.5 text-[10px] font-medium text-[var(--ui-muted-foreground)]">
        {activeTimeZone}
      </span>
    </div>

    <div class="flex items-center gap-2">
      <!-- View selector tabs -->
      <div class="inline-flex rounded-lg border border-[var(--ui-border)] bg-[var(--ui-secondary)]/30 p-1">
        <button
          type="button"
          onclick={() => (view = 'month')}
          class={cn(
            'rounded-md px-2 sm:px-3 py-1 text-xs font-semibold transition-colors cursor-pointer',
            view === 'month' ? 'bg-[var(--ui-card)] text-[var(--ui-foreground)] shadow-xs' : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)]'
          )}
        >
          <CalendarDays class="size-4 sm:hidden" />
          <span class="hidden sm:inline">Month</span>
        </button>
        <button
          type="button"
          onclick={() => (view = 'week')}
          class={cn(
            'rounded-md px-2 sm:px-3 py-1 text-xs font-semibold transition-colors cursor-pointer',
            view === 'week' ? 'bg-[var(--ui-card)] text-[var(--ui-foreground)] shadow-xs' : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)]'
          )}
        >
          <CalendarIcon class="size-4 sm:hidden" />
          <span class="hidden sm:inline">Week</span>
        </button>
        <button
          type="button"
          onclick={() => (view = 'day')}
          class={cn(
            'rounded-md px-2 sm:px-3 py-1 text-xs font-semibold transition-colors cursor-pointer',
            view === 'day' ? 'bg-[var(--ui-card)] text-[var(--ui-foreground)] shadow-xs' : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)]'
          )}
        >
          <Clock class="size-4 sm:hidden" />
          <span class="hidden sm:inline">Day</span>
        </button>
      </div>

      {#if enableEventModal}
        <Button size="sm" class="gap-1.5 h-8 text-xs" onclick={() => openCreateModal(currentDate)}>
          <Plus class="size-3.5" /> <span class="hidden sm:inline">Add Event</span>
        </Button>
      {/if}
    </div>
  </div>

  <!-- Calendar Content -->
  {#if view === 'month'}
    <!-- MONTH VIEW -->
    <div class="grid grid-cols-7 border-b border-[var(--ui-border)] bg-[var(--ui-secondary)]/20 text-center text-xs font-semibold text-[var(--ui-muted-foreground)] py-2">
      {#each dayNames as day}
        <div class="capitalize">{day}</div>
      {/each}
    </div>

    <div class="grid grid-cols-7 divide-x divide-y divide-[var(--ui-border)]">
      {#each monthDays as { date, currentMonth }}
        {@const dayEvents = getEventsForDay(date)}
        {@const todayActive = isToday(date)}

        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
          onclick={() => {
            onDateClick?.(date);
            openCreateModal(date);
          }}
          ondragover={(e) => e.preventDefault()}
          ondrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleEventDrop(date);
          }}
          class={cn(
            'min-h-[80px] md:min-h-[110px] p-1 md:p-1.5 flex flex-col gap-1 transition-colors hover:bg-[var(--ui-secondary)]/25 cursor-pointer select-none',
            !currentMonth && 'bg-[var(--ui-muted)]/15 opacity-50'
          )}
        >
          <div class="flex items-center justify-between mb-0.5 px-1">
            <span
              class={cn(
                'text-xs font-semibold size-6 flex items-center justify-center rounded-full',
                todayActive ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)]' : 'text-[var(--ui-foreground)]'
              )}
            >
              {date.getDate()}
            </span>
            {#if dayEvents.length > 0}
              <span class="text-[10px] text-[var(--ui-muted-foreground)] font-medium">
                {dayEvents.length} ev
              </span>
            {/if}
          </div>

          <!-- Event pills with spanning indicator -->
          <div class="flex flex-col gap-1 overflow-hidden">
            {#each dayEvents.slice(0, isMobile ? 2 : 3) as ev (ev.id)}
              {@const isSpanning = isMultiDayOrAllDay(ev)}
              {@const isStartDay = isSameDay(new Date(ev.start), date)}
              {@const isEndDay = isSameDay(new Date(ev.end), date)}

              <button
                type="button"
                draggable="true"
                ondragstart={(e) => {
                  e.stopPropagation();
                  draggedEventId = ev.id;
                  e.dataTransfer?.setData('text/plain', ev.id);
                }}
                onclick={(e) => {
                  e.stopPropagation();
                  onEventClick?.(ev);
                }}
                class={cn(
                  'truncate px-1.5 py-0.5 text-left text-[10px] md:text-[11px] font-medium transition-opacity hover:opacity-85 text-white shadow-2xs cursor-grab active:cursor-grabbing',
                  isSpanning ? 'rounded-none' : 'rounded',
                  isSpanning && isStartDay && 'rounded-l-md',
                  isSpanning && isEndDay && 'rounded-r-md',
                  draggedEventId === ev.id ? 'opacity-40 ring-2 ring-white' : ''
                )}
                style="background-color: {ev.color || 'var(--ui-primary)'};"
              >
                {#if isSpanning}
                  <span class="font-semibold">{ev.title}</span>
                {:else}
                  <span class="opacity-80 font-normal">{formatTime(ev.start)}</span> {ev.title}
                {/if}
              </button>
            {/each}

            {#if dayEvents.length > (isMobile ? 2 : 3)}
              <span class="text-[10px] font-semibold text-[var(--ui-muted-foreground)] px-1">
                +{dayEvents.length - (isMobile ? 2 : 3)} more
              </span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {:else if view === 'week'}
    <!-- WEEK VIEW -->
    <div class="grid grid-cols-4 md:grid-cols-8 border-b border-[var(--ui-border)] bg-[var(--ui-secondary)]/20 text-center text-xs font-semibold text-[var(--ui-muted-foreground)] py-2">
      <div class="col-span-1">Time</div>
      {#each (isMobile ? mobileWeekDays : weekDays) as d}
        <div class="col-span-1 flex flex-col items-center">
          <span class="capitalize">{format(d, 'EEE', { locale: activeDateFnsLocale })}</span>
          <span class={cn('size-6 flex items-center justify-center rounded-full text-xs mt-0.5', isToday(d) ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)]' : '')}>
            {d.getDate()}
          </span>
        </div>
      {/each}
    </div>

    <!-- All-day header slot (FullCalendar 1:1) -->
    {@const allDayEvents = getAllDayEventsForWeek(isMobile ? mobileWeekDays : weekDays)}
    {#if allDayEvents.length > 0}
      <div class="grid grid-cols-4 md:grid-cols-8 border-b border-[var(--ui-border)] bg-[var(--ui-secondary)]/10 text-xs divide-x divide-[var(--ui-border)] py-1.5">
        <div class="col-span-1 text-right pr-2 text-[10px] uppercase tracking-wider font-semibold text-[var(--ui-muted-foreground)] flex items-center justify-end">
          all-day
        </div>
        <div class="col-span-3 md:col-span-7 px-2 flex flex-col gap-1">
          {#each allDayEvents as ev (ev.id)}
            <button
              type="button"
              onclick={(e) => {
                e.stopPropagation();
                onEventClick?.(ev);
              }}
              class="w-full truncate rounded px-2 py-0.5 text-left text-[11px] font-semibold text-white shadow-2xs hover:opacity-90"
              style="background-color: {ev.color || 'var(--ui-primary)'};"
            >
              {ev.title} {#if ev.description}• {ev.description}{/if}
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <div class="grid grid-cols-4 md:grid-cols-8 divide-x divide-[var(--ui-border)] max-h-[600px] overflow-y-auto">
      <!-- Hours Column -->
      <div class="col-span-1 divide-y divide-[var(--ui-border)]/50 text-right pr-2 text-[11px] font-medium text-[var(--ui-muted-foreground)]">
        {#each hours as hour}
          <div class="h-14 pt-1">{String(hour).padStart(2, '0')}:00</div>
        {/each}
      </div>

      <!-- Day Grid Columns -->
      {#each (isMobile ? mobileWeekDays : weekDays) as d}
        {@const dayEvents = getTimedEventsForDay(d)}
        {@const layoutEvents = computeOverlappingLayout(dayEvents)}
        {@const isCurrentDay = isToday(d)}
        {@const nowTime = getTimeInZone(new Date())}
        {@const nowMinutes = nowTime.hours * 60 + nowTime.minutes}
        {@const currentTimeTop = (nowMinutes / 60) * 56}

        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div id="week-day-col"
          onclick={() => openCreateModal(d)}
          class="col-span-1 divide-y divide-[var(--ui-border)]/50 relative hover:bg-[var(--ui-secondary)]/10 cursor-pointer select-none"
        >
          {#each hours as hour}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="h-14 transition-colors hover:bg-[var(--ui-primary)]/10 pointer-events-auto"
              onmousedown={(e) => handleDragCreateMouseDown(e, d, hour, e.currentTarget.closest('[id="week-day-col"]')!)}
              ondragover={(e) => e.preventDefault()}
              ondrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleEventDrop(d, hour);
              }}
            ></div>
          {/each}

          <!-- Google Calendar style Current Time Red Line -->
          {#if isCurrentDay}
            <div
              class="absolute inset-x-0 z-30 pointer-events-none flex items-center"
              style="top: {currentTimeTop}px;"
            >
              <div class="size-2 rounded-full bg-red-500 -ml-1"></div>
              <div class="h-0.5 w-full bg-red-500"></div>
            </div>
          {/if}

          <!-- Render Event Boxes with Collision Overlap Calculation & Resizing -->
          {#each layoutEvents as ev (ev.id)}
            {@const evStartTime = getTimeInZone(new Date(ev.start))}
            {@const evEndTime = getTimeInZone(new Date(ev.end))}
            {@const startMinutes = evStartTime.hours * 60 + evStartTime.minutes}
            {@const endMinutes = evEndTime.hours * 60 + evEndTime.minutes}
            {@const durationMinutes = Math.max(15, endMinutes > startMinutes ? endMinutes - startMinutes : 60)}
            {@const topPos = (startMinutes / 60) * 56}
            {@const heightPos = Math.max(26, (durationMinutes / 60) * 56)}
            {@const widthPercent = 100 / ev.colTotal}
            {@const leftPercent = ev.colIndex * widthPercent}

            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <div
              role="button"
              tabindex="0"
              draggable="true"
              ondragstart={(e) => {
                draggedEventId = ev.id;
                e.dataTransfer?.setData('text/plain', ev.id);
              }}
              onclick={(e) => {
                e.stopPropagation();
                onEventClick?.(ev);
              }}
              onkeydown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onEventClick?.(ev);
                }
              }}
              class="group/event absolute rounded p-1 text-left text-[11px] text-white shadow-xs transition-opacity hover:opacity-95 overflow-hidden z-10 cursor-grab active:cursor-grabbing {draggedEventId === ev.id ? 'opacity-40 ring-2 ring-white' : ''}"
              style="top: {topPos}px; height: {heightPos}px; left: calc({leftPercent}% + 2px); width: calc({widthPercent}% - 4px); background-color: {ev.color || 'var(--ui-primary)'};"
            >
              <div class="font-bold truncate leading-tight">{ev.title}</div>
              <div class="text-[9px] opacity-85 leading-tight">{formatTime(ev.start)} - {formatTime(ev.end)}</div>

              <!-- Bottom edge resize handle (FullCalendar 1:1) -->
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="absolute inset-x-0 bottom-0 h-2 cursor-s-resize opacity-0 group-hover/event:opacity-100 bg-white/20 hover:bg-white/40 transition-opacity z-20"
                onmousedown={(e) => handleResizeStart(e, ev)}
              ></div>
            </div>
          {/each}
          <!-- Drag-to-create preview -->
          {#if isDragCreating && dragCreateStart && dragCreateEnd && dragCreateColumn && isSameDay(dragCreateColumn, d)}
            {@const startTotalMin = dragCreateStart.hour * 60 + dragCreateStart.minute}
            {@const endTotalMin = dragCreateEnd.hour * 60 + dragCreateEnd.minute}
            {@const previewTop = (startTotalMin / 60) * 56}
            {@const previewHeight = Math.max(14, ((endTotalMin - startTotalMin) / 60) * 56)}
            <div
              class="absolute inset-x-0.5 z-20 rounded bg-blue-500/30 border border-blue-400/50 pointer-events-none flex items-start justify-center pt-0.5"
              style="top: {previewTop}px; height: {previewHeight}px;"
            >
              <span class="text-[9px] font-semibold text-blue-700 select-none">
                {String(dragCreateStart.hour).padStart(2, '0')}:{String(dragCreateStart.minute).padStart(2, '0')} - {String(dragCreateEnd.hour).padStart(2, '0')}:{String(dragCreateEnd.minute).padStart(2, '0')}
              </span>
            </div>
          {/if}
        </div>
      {/each}
    </div>
    <!-- Mobile swipe hint -->
    {#if isMobile}
      <div class="px-4 py-2 text-center text-[11px] text-[var(--ui-muted-foreground)] border-t border-[var(--ui-border)]">
        Swipe to see more days
      </div>
    {/if}
  {:else}
    <!-- DAY VIEW -->
    <div class="p-3 border-b border-[var(--ui-border)] bg-[var(--ui-secondary)]/20 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Clock class="size-4 text-[var(--ui-muted-foreground)]" />
        <span class="text-sm font-semibold capitalize">{titleHeader}</span>
      </div>
      <span class="text-xs text-[var(--ui-muted-foreground)] font-medium">
        {getEventsForDay(currentDate).length} event(s)
      </span>
    </div>

    <div class="grid grid-cols-12 divide-x divide-[var(--ui-border)] max-h-[600px] overflow-y-auto">
      <div class="col-span-2 divide-y divide-[var(--ui-border)]/50 text-right pr-3 text-xs font-medium text-[var(--ui-muted-foreground)]">
        {#each hours as hour}
          <div class="h-16 pt-2">{String(hour).padStart(2, '0')}:00</div>
        {/each}
      </div>

      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div id="day-view-col"
        onclick={() => openCreateModal(currentDate)}
        class="col-span-10 divide-y divide-[var(--ui-border)]/50 relative p-1 hover:bg-[var(--ui-secondary)]/10 cursor-pointer select-none"
      >
        {#each hours as hour}
          <div class="h-16 pointer-events-auto"
            onmousedown={(e) => handleDragCreateMouseDown(e, currentDate, hour, e.currentTarget.closest('[id="day-view-col"]')!)}
          ></div>
        {/each}

        <!-- Google Calendar style Current Time Red Line -->
        {#if isToday(currentDate)}
          {@const nowTime = getTimeInZone(new Date())}
          {@const currentTimeTop = ((nowTime.hours * 60 + nowTime.minutes) / 60) * 64}
          <div
            class="absolute inset-x-0 z-30 pointer-events-none flex items-center"
            style="top: {currentTimeTop}px;"
          >
            <div class="size-2.5 rounded-full bg-red-500 -ml-1"></div>
            <div class="h-0.5 w-full bg-red-500"></div>
          </div>
        {/if}

        {#each computeOverlappingLayout(getTimedEventsForDay(currentDate)) as ev (ev.id)}
          {@const evStartTime = getTimeInZone(new Date(ev.start))}
          {@const evEndTime = getTimeInZone(new Date(ev.end))}
          {@const startMinutes = evStartTime.hours * 60 + evStartTime.minutes}
          {@const endMinutes = evEndTime.hours * 60 + evEndTime.minutes}
          {@const durationMinutes = Math.max(15, endMinutes > startMinutes ? endMinutes - startMinutes : 60)}
          {@const topPos = (startMinutes / 60) * 64}
          {@const heightPos = Math.max(32, (durationMinutes / 60) * 64)}
          {@const widthPercent = 100 / ev.colTotal}
          {@const leftPercent = ev.colIndex * widthPercent}

          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <div
            role="button"
            tabindex="0"
            draggable="true"
            ondragstart={(e) => {
              draggedEventId = ev.id;
              e.dataTransfer?.setData('text/plain', ev.id);
            }}
            onclick={(e) => {
              e.stopPropagation();
              onEventClick?.(ev);
            }}
            onkeydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onEventClick?.(ev);
              }
            }}
            class="group/event absolute rounded-lg p-2 text-left text-white shadow-sm transition-opacity hover:opacity-95 overflow-hidden z-10 cursor-grab active:cursor-grabbing {draggedEventId === ev.id ? 'opacity-40 ring-2 ring-white' : ''}"
            style="top: {topPos}px; height: {heightPos}px; left: calc({leftPercent}% + 4px); width: calc({widthPercent}% - 8px); background-color: {ev.color || 'var(--ui-primary)'};"
          >
            <div class="font-bold text-xs truncate leading-tight">{ev.title}</div>
            <div class="text-[10px] opacity-85 leading-tight">{formatTime(ev.start)} - {formatTime(ev.end)} {#if ev.description}• {ev.description}{/if}</div>

            <!-- Bottom resize handle -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="absolute inset-x-0 bottom-0 h-2.5 cursor-s-resize opacity-0 group-hover/event:opacity-100 bg-white/20 hover:bg-white/40 transition-opacity z-20"
              onmousedown={(e) => handleResizeStart(e, ev)}
            ></div>
          </div>
        {/each}
        <!-- Drag-to-create preview -->
        {#if isDragCreating && dragCreateStart && dragCreateEnd && isSameDay(dragCreateColumn!, currentDate)}
          {@const startTotalMin = dragCreateStart.hour * 60 + dragCreateStart.minute}
          {@const endTotalMin = dragCreateEnd.hour * 60 + dragCreateEnd.minute}
          {@const previewTop = (startTotalMin / 60) * 64}
          {@const previewHeight = Math.max(16, ((endTotalMin - startTotalMin) / 60) * 64)}
          <div
            class="absolute inset-x-1 z-20 rounded-lg bg-blue-500/30 border border-blue-400/50 pointer-events-none flex items-start justify-center pt-1"
            style="top: {previewTop}px; height: {previewHeight}px;"
          >
            <span class="text-[10px] font-semibold text-blue-700 select-none">
              {String(dragCreateStart.hour).padStart(2, '0')}:{String(dragCreateStart.minute).padStart(2, '0')} - {String(dragCreateEnd.hour).padStart(2, '0')}:{String(dragCreateEnd.minute).padStart(2, '0')}
            </span>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Quick Event Creation Modal -->
  {#if modalOpen}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div
        onclick={(e) => e.stopPropagation()}
        class="w-full max-w-md rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] p-5 shadow-2xl animate-in fade-in-50 zoom-in-95"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-[var(--ui-foreground)]">Add New Event</h3>
          <button
            type="button"
            onclick={() => (modalOpen = false)}
            class="rounded-full p-1 text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)] hover:text-[var(--ui-foreground)]"
          >
            <X class="size-4" />
          </button>
        </div>

        <div class="space-y-3.5 text-xs">
          <div>
            <label for="event-cal-title" class="block mb-1 font-semibold text-[var(--ui-muted-foreground)]">Title</label>
            <input
              id="event-cal-title"
              type="text"
              bind:value={newEventTitle}
              placeholder="Event title (e.g. Sprint Review)..."
              class="h-9 w-full rounded-lg border border-[var(--ui-input)] bg-[var(--ui-background)] px-3 text-xs outline-none focus:border-[var(--ui-primary)]"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="event-cal-start-time" class="block mb-1 font-semibold text-[var(--ui-muted-foreground)]">Start Time</label>
              <input
                id="event-cal-start-time"
                type="time"
                bind:value={newEventStartTime}
                class="h-9 w-full rounded-lg border border-[var(--ui-input)] bg-[var(--ui-background)] px-2.5 text-xs outline-none focus:border-[var(--ui-primary)]"
              />
            </div>
            <div>
              <label for="event-cal-end-time" class="block mb-1 font-semibold text-[var(--ui-muted-foreground)]">End Time</label>
              <input
                id="event-cal-end-time"
                type="time"
                bind:value={newEventEndTime}
                class="h-9 w-full rounded-lg border border-[var(--ui-input)] bg-[var(--ui-background)] px-2.5 text-xs outline-none focus:border-[var(--ui-primary)]"
              />
            </div>
          </div>

          <div>
            <span class="block mb-1.5 font-semibold text-[var(--ui-muted-foreground)]">Tag Color</span>
            <div class="flex items-center gap-2">
              {#each presetColors as col}
                <button
                  type="button"
                  onclick={() => (newEventColor = col)}
                  class={cn(
                    'size-6 rounded-full transition-transform hover:scale-110 cursor-pointer',
                    newEventColor === col && 'ring-2 ring-offset-2 ring-[var(--ui-primary)]'
                  )}
                  style="background-color: {col};"
                  aria-label="Select color {col}"
                ></button>
              {/each}
            </div>
          </div>

          <div>
            <label for="event-cal-desc" class="block mb-1 font-semibold text-[var(--ui-muted-foreground)]">Description (optional)</label>
            <textarea
              id="event-cal-desc"
              bind:value={newEventDescription}
              class="w-full rounded-lg border border-[var(--ui-input)] bg-[var(--ui-background)] p-2.5 text-xs outline-none focus:border-[var(--ui-primary)]"
            ></textarea>
          </div>
        </div>

        <div class="mt-5 flex items-center justify-end gap-2 border-t border-[var(--ui-border)] pt-3">
          <Button variant="outline" size="sm" onclick={() => (modalOpen = false)}>Cancel</Button>
          <Button size="sm" onclick={handleSaveEvent}>Save Event</Button>
        </div>
      </div>
    </div>
  {/if}
</div>
