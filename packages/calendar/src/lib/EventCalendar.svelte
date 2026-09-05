<script lang="ts">
  import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/ui/utils';

  export type CalendarView = 'month' | 'week' | 'day';

  export type CalendarEvent = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    color?: string; // Hex or CSS color
    description?: string;
    allDay?: boolean;
  };

  let {
    events = [],
    view = $bindable('month' as CalendarView),
    currentDate = $bindable(new Date()),
    class: className,
    onEventClick,
    onDateClick,
    onAddEventClick,
  }: {
    events?: CalendarEvent[];
    view?: CalendarView;
    currentDate?: Date;
    class?: string;
    onEventClick?: (event: CalendarEvent) => void;
    onDateClick?: (date: Date) => void;
    onAddEventClick?: (date: Date) => void;
  } = $props();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  function isSameDay(d1: Date, d2: Date): boolean {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  function isToday(d: Date): boolean {
    return isSameDay(d, new Date());
  }

  // Navigation handlers
  function goPrev() {
    const next = new Date(currentDate);
    if (view === 'month') next.setMonth(next.getMonth() - 1);
    else if (view === 'week') next.setDate(next.getDate() - 7);
    else next.setDate(next.getDate() - 1);
    currentDate = next;
  }

  function goNext() {
    const next = new Date(currentDate);
    if (view === 'month') next.setMonth(next.getMonth() + 1);
    else if (view === 'week') next.setDate(next.getDate() + 7);
    else next.setDate(next.getDate() + 1);
    currentDate = next;
  }

  function goToday() {
    currentDate = new Date();
  }

  // Month view calendar matrix (42 cells)
  const monthDays = $derived.by(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: { date: Date; currentMonth: boolean }[] = [];

    // Prev month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        currentMonth: false
      });
    }

    // Current month days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        currentMonth: true
      });
    }

    // Next month padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        currentMonth: false
      });
    }

    return days;
  });

  // Week view days (7 days Sunday to Saturday)
  const weekDays = $derived.by(() => {
    const dayOfWeek = currentDate.getDay();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - dayOfWeek);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  });

  // Find events for a given day
  function getEventsForDay(d: Date): CalendarEvent[] {
    return events.filter((ev) => isSameDay(new Date(ev.start), d));
  }

  function formatTime(date: Date): string {
    const d = new Date(date);
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }

  const titleHeader = $derived.by(() => {
    const y = currentDate.getFullYear();
    const m = monthNames[currentDate.getMonth()];
    if (view === 'month') return `${m} ${y}`;
    if (view === 'week') {
      const start = weekDays[0];
      const end = weekDays[6];
      return `${start.getDate()} ${monthNames[start.getMonth()].slice(0, 3)} - ${end.getDate()} ${monthNames[end.getMonth()].slice(0, 3)} ${y}`;
    }
    return `${currentDate.getDate()} ${m} ${y}`;
  });
</script>

<div class={cn('flex flex-col rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] shadow-xs overflow-hidden', className)}>
  <!-- Toolbar Header -->
  <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--ui-border)] p-4 sm:px-6">
    <div class="flex items-center gap-2">
      <h2 class="text-base font-bold text-[var(--ui-foreground)]">{titleHeader}</h2>
      <div class="flex items-center gap-1 ml-2">
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
    </div>

    <div class="flex items-center gap-2">
      <!-- View selector tabs -->
      <div class="inline-flex rounded-lg border border-[var(--ui-border)] bg-[var(--ui-secondary)]/30 p-1">
        <button
          type="button"
          onclick={() => (view = 'month')}
          class={cn(
            'rounded-md px-3 py-1 text-xs font-semibold transition-colors cursor-pointer',
            view === 'month' ? 'bg-[var(--ui-card)] text-[var(--ui-foreground)] shadow-xs' : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)]'
          )}
        >
          Month
        </button>
        <button
          type="button"
          onclick={() => (view = 'week')}
          class={cn(
            'rounded-md px-3 py-1 text-xs font-semibold transition-colors cursor-pointer',
            view === 'week' ? 'bg-[var(--ui-card)] text-[var(--ui-foreground)] shadow-xs' : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)]'
          )}
        >
          Week
        </button>
        <button
          type="button"
          onclick={() => (view = 'day')}
          class={cn(
            'rounded-md px-3 py-1 text-xs font-semibold transition-colors cursor-pointer',
            view === 'day' ? 'bg-[var(--ui-card)] text-[var(--ui-foreground)] shadow-xs' : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)]'
          )}
        >
          Day
        </button>
      </div>

      {#if onAddEventClick}
        <Button size="sm" class="gap-1.5 h-8 text-xs" onclick={() => onAddEventClick?.(currentDate)}>
          <Plus class="size-3.5" /> Add Event
        </Button>
      {/if}
    </div>
  </div>

  <!-- Calendar Content -->
  {#if view === 'month'}
    <!-- MONTH VIEW -->
    <div class="grid grid-cols-7 border-b border-[var(--ui-border)] bg-[var(--ui-secondary)]/20 text-center text-xs font-semibold text-[var(--ui-muted-foreground)] py-2">
      {#each dayNames as day}
        <div>{day}</div>
      {/each}
    </div>

    <div class="grid grid-cols-7 divide-x divide-y divide-[var(--ui-border)]">
      {#each monthDays as { date, currentMonth }}
        {@const dayEvents = getEventsForDay(date)}
        {@const todayActive = isToday(date)}

        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
          onclick={() => onDateClick?.(date)}
          class={cn(
            'min-h-[100px] p-2 flex flex-col gap-1 transition-colors hover:bg-[var(--ui-secondary)]/25 cursor-pointer',
            !currentMonth && 'bg-[var(--ui-muted)]/15 opacity-50'
          )}
        >
          <div class="flex items-center justify-between mb-1">
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

          <!-- Event pills -->
          <div class="flex flex-col gap-1 overflow-hidden">
            {#each dayEvents.slice(0, 3) as ev (ev.id)}
              <button
                type="button"
                onclick={(e) => {
                  e.stopPropagation();
                  onEventClick?.(ev);
                }}
                class={cn(
                  'truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium transition-opacity hover:opacity-85 text-white',
                  ev.color ? '' : 'bg-[var(--ui-primary)]'
                )}
                style={ev.color ? `background-color: ${ev.color};` : undefined}
              >
                {formatTime(ev.start)} {ev.title}
              </button>
            {/each}

            {#if dayEvents.length > 3}
              <span class="text-[10px] font-semibold text-[var(--ui-muted-foreground)] pl-1">
                +{dayEvents.length - 3} more
              </span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {:else if view === 'week'}
    <!-- WEEK VIEW -->
    <div class="grid grid-cols-8 border-b border-[var(--ui-border)] bg-[var(--ui-secondary)]/20 text-center text-xs font-semibold text-[var(--ui-muted-foreground)] py-2">
      <div class="col-span-1">Time</div>
      {#each weekDays as d}
        <div class="col-span-1 flex flex-col items-center">
          <span>{dayNames[d.getDay()]}</span>
          <span class={cn('size-6 flex items-center justify-center rounded-full text-xs mt-0.5', isToday(d) ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)]' : '')}>
            {d.getDate()}
          </span>
        </div>
      {/each}
    </div>

    <div class="grid grid-cols-8 divide-x divide-[var(--ui-border)] max-h-[600px] overflow-y-auto">
      <!-- Hours Column -->
      <div class="col-span-1 divide-y divide-[var(--ui-border)]/50 text-right pr-2 text-[11px] font-medium text-[var(--ui-muted-foreground)]">
        {#each hours as hour}
          <div class="h-14 pt-1">{String(hour).padStart(2, '0')}:00</div>
        {/each}
      </div>

      <!-- 7 Days Grid Columns -->
      {#each weekDays as d}
        {@const dayEvents = getEventsForDay(d)}
        <div class="col-span-1 divide-y divide-[var(--ui-border)]/50 relative">
          {#each hours as _}
            <div class="h-14"></div>
          {/each}

          <!-- Render Event Boxes -->
          {#each dayEvents as ev (ev.id)}
            {@const startH = new Date(ev.start).getHours()}
            {@const startM = new Date(ev.start).getMinutes()}
            {@const topPos = (startH + startM / 60) * 56}
            <button
              type="button"
              onclick={() => onEventClick?.(ev)}
              class="absolute inset-x-1 rounded p-1 text-left text-[11px] text-white shadow-xs transition-opacity hover:opacity-90 overflow-hidden"
              style="top: {topPos}px; height: 50px; background-color: {ev.color || 'var(--ui-primary)'};"
            >
              <div class="font-bold truncate">{ev.title}</div>
              <div class="text-[9px] opacity-80">{formatTime(ev.start)} - {formatTime(ev.end)}</div>
            </button>
          {/each}
        </div>
      {/each}
    </div>
  {:else}
    <!-- DAY VIEW -->
    <div class="p-3 border-b border-[var(--ui-border)] bg-[var(--ui-secondary)]/20 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Clock class="size-4 text-[var(--ui-muted-foreground)]" />
        <span class="text-sm font-semibold">{dayNames[currentDate.getDay()]}, {titleHeader}</span>
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

      <div class="col-span-10 divide-y divide-[var(--ui-border)]/50 relative p-1">
        {#each hours as _}
          <div class="h-16"></div>
        {/each}

        {#each getEventsForDay(currentDate) as ev (ev.id)}
          {@const startH = new Date(ev.start).getHours()}
          {@const startM = new Date(ev.start).getMinutes()}
          {@const topPos = (startH + startM / 60) * 64}
          <button
            type="button"
            onclick={() => onEventClick?.(ev)}
            class="absolute inset-x-4 rounded-lg p-2 text-left text-white shadow-sm transition-opacity hover:opacity-90 flex flex-col justify-center"
            style="top: {topPos}px; height: 56px; background-color: {ev.color || 'var(--ui-primary)'};"
          >
            <div class="font-bold text-xs">{ev.title}</div>
            <div class="text-[10px] opacity-80">{formatTime(ev.start)} - {formatTime(ev.end)} {#if ev.description}• {ev.description}{/if}</div>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
