<script lang="ts">
  import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/ui/utils';

  export type CalendarDate = { year: number; month: number; day: number };
  export type DateRange = {
    start: CalendarDate | null;
    end: CalendarDate | null;
  };

  let {
    value = $bindable({ start: null, end: null }),
    min = null,
    max = null,
    disabled = false,
    placeholder = 'Select date range...',
    class: className,
    onSelect,
  }: {
    value?: DateRange;
    min?: CalendarDate | null;
    max?: CalendarDate | null;
    disabled?: boolean;
    placeholder?: string;
    class?: string;
    onSelect?: (range: DateRange) => void;
  } = $props();

  let isOpen = $state(false);
  const today = new Date();

  let viewYear = $state(value?.start?.year ?? today.getFullYear());
  let viewMonth = $state(value?.start?.month ?? today.getMonth());
  let hoverDate = $state<CalendarDate | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const daysInMonth = $derived(new Date(viewYear, viewMonth + 1, 0).getDate());
  const firstDayOfMonth = $derived(new Date(viewYear, viewMonth, 1).getDay());

  function toDate(d: CalendarDate): Date {
    return new Date(d.year, d.month, d.day);
  }

  function compareDates(a: CalendarDate, b: CalendarDate): number {
    const da = toDate(a).getTime();
    const db = toDate(b).getTime();
    return da < db ? -1 : da > db ? 1 : 0;
  }

  function isSameDate(a: CalendarDate | null, b: CalendarDate | null): boolean {
    if (!a || !b) return false;
    return a.year === b.year && a.month === b.month && a.day === b.day;
  }

  function isInRange(target: CalendarDate, start: CalendarDate | null, end: CalendarDate | null): boolean {
    if (!start || !end) return false;
    const t = toDate(target).getTime();
    const s = toDate(start).getTime();
    const e = toDate(end).getTime();
    return t >= Math.min(s, e) && t <= Math.max(s, e);
  }

  const calendarDays = $derived.by(() => {
    const days: { day: number; currentMonth: boolean; date: CalendarDate }[] = [];
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const month = viewMonth === 0 ? 11 : viewMonth - 1;
      const year = viewMonth === 0 ? viewYear - 1 : viewYear;
      days.push({ day, currentMonth: false, date: { year, month, day } });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, currentMonth: true, date: { year: viewYear, month: viewMonth, day } });
    }

    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      const month = viewMonth === 11 ? 0 : viewMonth + 1;
      const year = viewMonth === 11 ? viewYear + 1 : viewYear;
      days.push({ day, currentMonth: false, date: { year, month, day } });
    }

    return days;
  });

  function handleDateClick(date: CalendarDate) {
    if (disabled) return;

    if (!value.start || (value.start && value.end)) {
      // Start a new range selection
      value = { start: date, end: null };
    } else if (value.start && !value.end) {
      // Complete the range
      if (compareDates(date, value.start) < 0) {
        value = { start: date, end: value.start };
      } else {
        value = { start: value.start, end: date };
      }
      onSelect?.(value);
      isOpen = false;
    }
  }

  function prevMonth() {
    if (viewMonth === 0) {
      viewMonth = 11;
      viewYear--;
    } else {
      viewMonth--;
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      viewMonth = 0;
      viewYear++;
    } else {
      viewMonth++;
    }
  }

  function formatDisplayDate(date: CalendarDate | null): string {
    if (!date) return '';
    const d = String(date.day).padStart(2, '0');
    const m = String(date.month + 1).padStart(2, '0');
    return `${d}/${m}/${date.year}`;
  }

  const label = $derived.by(() => {
    if (value.start && value.end) {
      return `${formatDisplayDate(value.start)} - ${formatDisplayDate(value.end)}`;
    }
    if (value.start) {
      return `${formatDisplayDate(value.start)} - Select end`;
    }
    return placeholder;
  });

  function clearRange(e: MouseEvent) {
    e.stopPropagation();
    value = { start: null, end: null };
    onSelect?.(value);
  }
</script>

<div class={cn('relative inline-block w-full max-w-sm', className)}>
  <button
    type="button"
    {disabled}
    onclick={() => (isOpen = !isOpen)}
    class={cn(
      'flex h-10 w-full items-center justify-between rounded-lg border border-[var(--ui-input)] bg-[var(--ui-background)] px-3 text-sm transition-colors text-left',
      'hover:border-[var(--ui-border)] focus:outline-none focus:ring-2 focus:ring-[var(--ui-ring)]/20 focus:border-[var(--ui-primary)]',
      disabled && 'opacity-50 cursor-not-allowed',
      value.start ? 'text-[var(--ui-foreground)]' : 'text-[var(--ui-muted-foreground)]'
    )}
  >
    <div class="flex items-center gap-2 truncate">
      <CalendarIcon class="size-4 shrink-0 text-[var(--ui-muted-foreground)]" />
      <span class="truncate">{label}</span>
    </div>

    {#if value.start && !disabled}
      <button
        type="button"
        onclick={clearRange}
        class="p-1 rounded-full hover:bg-[var(--ui-secondary)] text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)]"
        aria-label="Clear date range"
      >
        <X class="size-3.5" />
      </button>
    {/if}
  </button>

  {#if isOpen}
    <!-- Backdrop for click outside -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="fixed inset-0 z-40" onclick={() => (isOpen = false)}></div>

    <div
      class="absolute left-0 top-full z-50 mt-1.5 w-72 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] p-3 shadow-xl animate-in fade-in-50 zoom-in-95 select-none"
    >
      <!-- Header controls -->
      <div class="flex items-center justify-between mb-3">
        <Button variant="ghost" size="sm" class="size-7 p-0" onclick={prevMonth}>
          <ChevronLeft class="size-4" />
        </Button>
        <span class="text-xs font-semibold text-[var(--ui-foreground)]">
          {monthNames[viewMonth]} {viewYear}
        </span>
        <Button variant="ghost" size="sm" class="size-7 p-0" onclick={nextMonth}>
          <ChevronRight class="size-4" />
        </Button>
      </div>

      <!-- Day names -->
      <div class="grid grid-cols-7 mb-1 text-center">
        {#each dayNames as day}
          <span class="text-[11px] font-medium text-[var(--ui-muted-foreground)] py-1">
            {day}
          </span>
        {/each}
      </div>

      <!-- Calendar grid -->
      <div class="grid grid-cols-7 gap-y-1">
        {#each calendarDays as { day, currentMonth, date }}
          {@const isStart = isSameDate(value.start, date)}
          {@const isEnd = isSameDate(value.end, date)}
          {@const activeRangeEnd = value.end || hoverDate}
          {@const inRange = isInRange(date, value.start, activeRangeEnd)}
          {@const isEdge = isStart || isEnd}

          <div
            class={cn(
              'relative py-0.5 flex items-center justify-center',
              inRange && !isEdge && 'bg-[var(--ui-primary)]/10',
              isStart && activeRangeEnd && !isSameDate(value.start, activeRangeEnd) && 'rounded-l-md bg-[var(--ui-primary)]/10',
              isEnd && value.start && !isSameDate(value.start, value.end) && 'rounded-r-md bg-[var(--ui-primary)]/10'
            )}
            onmouseenter={() => {
              if (value.start && !value.end) hoverDate = date;
            }}
          >
            <button
              type="button"
              disabled={!currentMonth}
              onclick={() => handleDateClick(date)}
              class={cn(
                'size-8 rounded-md text-xs font-medium transition-colors flex items-center justify-center cursor-pointer',
                !currentMonth && 'opacity-20 cursor-default',
                currentMonth && !isEdge && !inRange && 'hover:bg-[var(--ui-secondary)] text-[var(--ui-foreground)]',
                inRange && !isEdge && 'text-[var(--ui-primary)] font-semibold',
                isEdge && 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-bold shadow-xs'
              )}
            >
              {day}
            </button>
          </div>
        {/each}
      </div>

      <!-- Presets quick buttons -->
      <div class="flex items-center justify-between border-t border-[var(--ui-border)] mt-3 pt-2 text-xs">
        <button
          type="button"
          onclick={() => {
            const t = { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() };
            value = { start: t, end: t };
            onSelect?.(value);
            isOpen = false;
          }}
          class="text-[11px] font-medium text-[var(--ui-primary)] hover:underline cursor-pointer"
        >
          Today
        </button>

        <button
          type="button"
          onclick={() => {
            const start = { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() };
            const endD = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            const end = { year: endD.getFullYear(), month: endD.getMonth(), day: endD.getDate() };
            value = { start, end };
            onSelect?.(value);
            isOpen = false;
          }}
          class="text-[11px] font-medium text-[var(--ui-primary)] hover:underline cursor-pointer"
        >
          Next 7 Days
        </button>

        <button
          type="button"
          onclick={() => {
            const start = { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() };
            const endD = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
            const end = { year: endD.getFullYear(), month: endD.getMonth(), day: endD.getDate() };
            value = { start, end };
            onSelect?.(value);
            isOpen = false;
          }}
          class="text-[11px] font-medium text-[var(--ui-primary)] hover:underline cursor-pointer"
        >
          Next 30 Days
        </button>
      </div>
    </div>
  {/if}
</div>
