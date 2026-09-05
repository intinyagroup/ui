<script lang="ts">
  import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, X } from 'lucide-svelte';
  import { Button, Input } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/ui/utils';

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
  } = $props();

  // Resolved timezone (fallback to browser timezone)
  const activeTimeZone = $derived(
    timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  );

  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Day names localized and rotated according to firstDayOfWeek
  const dayNames = $derived.by(() => {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    const days: string[] = [];
    const baseSunday = new Date(2026, 7, 30); // Known Sunday
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseSunday);
      d.setDate(baseSunday.getDate() + ((i + firstDayOfWeek) % 7));
      days.push(formatter.format(d));
    }
    return days;
  });

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

  // Month view calendar matrix (42 cells) respecting firstDayOfWeek
  const monthDays = $derived.by(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const rawFirstDay = new Date(year, month, 1).getDay();
    const firstDay = (rawFirstDay - firstDayOfWeek + 7) % 7;
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: { date: Date; currentMonth: boolean }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        currentMonth: false
      });
    }

    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        currentMonth: true
      });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        currentMonth: false
      });
    }

    return days;
  });

  // Week view days respecting firstDayOfWeek
  const weekDays = $derived.by(() => {
    const dayOfWeek = currentDate.getDay();
    const offset = (dayOfWeek - firstDayOfWeek + 7) % 7;
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - offset);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  });

  function getEventsForDay(d: Date): CalendarEvent[] {
    return events.filter((ev) => isSameDay(new Date(ev.start), d));
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
    const y = currentDate.getFullYear();
    const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'long' });
    const monthShortFormatter = new Intl.DateTimeFormat(locale, { month: 'short' });

    if (view === 'month') return `${monthFormatter.format(currentDate)} ${y}`;
    if (view === 'week') {
      const start = weekDays[0];
      const end = weekDays[6];
      return `${start.getDate()} ${monthShortFormatter.format(start)} - ${end.getDate()} ${monthShortFormatter.format(end)} ${y}`;
    }
    return `${currentDate.getDate()} ${monthFormatter.format(currentDate)} ${y}`;
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
  <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--ui-border)] p-4 sm:px-6">
    <div class="flex items-center gap-2">
      <h2 class="text-base font-bold text-[var(--ui-foreground)] capitalize">{titleHeader}</h2>
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
      <span class="inline-flex items-center rounded-md bg-[var(--ui-secondary)]/50 px-2 py-0.5 text-[10px] font-medium text-[var(--ui-muted-foreground)]">
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

      {#if enableEventModal}
        <Button size="sm" class="gap-1.5 h-8 text-xs" onclick={() => openCreateModal(currentDate)}>
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
                  'truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium transition-opacity hover:opacity-85 text-white shadow-2xs',
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
      {#each weekDays as d, idx}
        <div class="col-span-1 flex flex-col items-center">
          <span class="capitalize">{dayNames[idx]}</span>
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
        {@const isCurrentDay = isToday(d)}
        {@const nowTime = getTimeInZone(new Date())}
        {@const nowMinutes = nowTime.hours * 60 + nowTime.minutes}
        {@const currentTimeTop = (nowMinutes / 60) * 56}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
          onclick={() => openCreateModal(d)}
          class="col-span-1 divide-y divide-[var(--ui-border)]/50 relative hover:bg-[var(--ui-secondary)]/10 cursor-pointer"
        >
          {#each hours as _}
            <div class="h-14"></div>
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

          <!-- Render Event Boxes -->
          {#each dayEvents as ev (ev.id)}
            {@const evTime = getTimeInZone(new Date(ev.start))}
            {@const topPos = (evTime.hours + evTime.minutes / 60) * 56}
            <button
              type="button"
              onclick={(e) => {
                e.stopPropagation();
                onEventClick?.(ev);
              }}
              class="absolute inset-x-1 rounded p-1 text-left text-[11px] text-white shadow-xs transition-opacity hover:opacity-90 overflow-hidden z-10"
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

      {@const isCurrentDay = isToday(currentDate)}
      {@const nowTime = getTimeInZone(new Date())}
      {@const nowMinutes = nowTime.hours * 60 + nowTime.minutes}
      {@const currentTimeTop = (nowMinutes / 60) * 64}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div
        onclick={() => openCreateModal(currentDate)}
        class="col-span-10 divide-y divide-[var(--ui-border)]/50 relative p-1 hover:bg-[var(--ui-secondary)]/10 cursor-pointer"
      >
        {#each hours as _}
          <div class="h-16"></div>
        {/each}

        <!-- Google Calendar style Current Time Red Line -->
        {#if isCurrentDay}
          <div
            class="absolute inset-x-0 z-30 pointer-events-none flex items-center"
            style="top: {currentTimeTop}px;"
          >
            <div class="size-2.5 rounded-full bg-red-500 -ml-1"></div>
            <div class="h-0.5 w-full bg-red-500"></div>
          </div>
        {/if}

        {#each getEventsForDay(currentDate) as ev (ev.id)}
          {@const evTime = getTimeInZone(new Date(ev.start))}
          {@const topPos = (evTime.hours + evTime.minutes / 60) * 64}
          <button
            type="button"
            onclick={(e) => {
              e.stopPropagation();
              onEventClick?.(ev);
            }}
            class="absolute inset-x-4 rounded-lg p-2 text-left text-white shadow-sm transition-opacity hover:opacity-90 flex flex-col justify-center z-10"
            style="top: {topPos}px; height: 56px; background-color: {ev.color || 'var(--ui-primary)'};"
          >
            <div class="font-bold text-xs">{ev.title}</div>
            <div class="text-[10px] opacity-80">{formatTime(ev.start)} - {formatTime(ev.end)} {#if ev.description}• {ev.description}{/if}</div>
          </button>
        {/each}
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
            <label class="block mb-1 font-semibold text-[var(--ui-muted-foreground)]">Title</label>
            <input
              type="text"
              bind:value={newEventTitle}
              placeholder="Event title (e.g. Sprint Review)..."
              class="h-9 w-full rounded-lg border border-[var(--ui-input)] bg-[var(--ui-background)] px-3 text-xs outline-none focus:border-[var(--ui-primary)]"
              autofocus
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block mb-1 font-semibold text-[var(--ui-muted-foreground)]">Start Time</label>
              <input
                type="time"
                bind:value={newEventStartTime}
                class="h-9 w-full rounded-lg border border-[var(--ui-input)] bg-[var(--ui-background)] px-2.5 text-xs outline-none focus:border-[var(--ui-primary)]"
              />
            </div>
            <div>
              <label class="block mb-1 font-semibold text-[var(--ui-muted-foreground)]">End Time</label>
              <input
                type="time"
                bind:value={newEventEndTime}
                class="h-9 w-full rounded-lg border border-[var(--ui-input)] bg-[var(--ui-background)] px-2.5 text-xs outline-none focus:border-[var(--ui-primary)]"
              />
            </div>
          </div>

          <div>
            <label class="block mb-1.5 font-semibold text-[var(--ui-muted-foreground)]">Tag Color</label>
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
            <label class="block mb-1 font-semibold text-[var(--ui-muted-foreground)]">Description (optional)</label>
            <textarea
              bind:value={newEventDescription}
              rows={2}
              placeholder="Notes, agenda, or link..."
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
