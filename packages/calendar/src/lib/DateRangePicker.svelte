<script lang="ts">
  import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/ui/utils';
  import {
    addMonths,
    subMonths,
    addDays,
    subDays,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameDay,
    isSameMonth,
    isWithinInterval,
    isBefore,
    format
  } from 'date-fns';
  import { id as localeId, enUS as localeEn } from 'date-fns/locale';

  export type CalendarDate = { year: number; month: number; day: number };
  export type DateRange = {
    start: CalendarDate | null;
    end: CalendarDate | null;
  };

  export type DateRangePreset = {
    label: string;
    range: DateRange;
  };

  let {
    value = $bindable({ start: null, end: null }),
    min = null,
    max = null,
    disabled = false,
    placeholder = 'Select date range...',
    locale = 'en-US',
    firstDayOfWeek = 0, // 0 = Sunday, 1 = Monday
    presets,
    class: className,
    onSelect,
  }: {
    value?: DateRange;
    min?: CalendarDate | null;
    max?: CalendarDate | null;
    disabled?: boolean;
    placeholder?: string;
    locale?: string;
    firstDayOfWeek?: number;
    presets?: DateRangePreset[];
    class?: string;
    onSelect?: (range: DateRange) => void;
  } = $props();

  let isOpen = $state(false);
  const today = new Date();

  let viewDate = $state(
    value?.start ? new Date(value.start.year, value.start.month, value.start.day) : today
  );
  let hoverDate = $state<Date | null>(null);

  const activeDateFnsLocale = $derived(locale.startsWith('id') ? localeId : localeEn);
  const weekStartsOn = $derived(firstDayOfWeek as 0 | 1 | 2 | 3 | 4 | 5 | 6);

  function toDate(d: CalendarDate | null): Date | null {
    if (!d) return null;
    return new Date(d.year, d.month, d.day);
  }

  function toCalendarDate(date: Date): CalendarDate {
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate()
    };
  }

  // Generate day names for header using date-fns
  const dayNames = $derived.by(() => {
    const start = startOfWeek(viewDate, { weekStartsOn });
    return Array.from({ length: 7 }, (_, i) => {
      return format(addDays(start, i), 'EEE', { locale: activeDateFnsLocale });
    });
  });

  // Generate full calendar grid (days from start of week of month-start to end of week of month-end)
  const calendarDays = $derived.by(() => {
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(viewDate);
    const gridStart = startOfWeek(monthStart, { weekStartsOn });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn });

    const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
    return days.map((d) => ({
      date: d,
      calendarDate: toCalendarDate(d),
      currentMonth: isSameMonth(d, viewDate)
    }));
  });

  const startDateObj = $derived(toDate(value.start));
  const endDateObj = $derived(toDate(value.end));

  function handleDateClick(date: Date) {
    if (disabled) return;

    if (!startDateObj || (startDateObj && endDateObj)) {
      value = { start: toCalendarDate(date), end: null };
    } else if (startDateObj && !endDateObj) {
      if (isBefore(date, startDateObj)) {
        value = { start: toCalendarDate(date), end: toCalendarDate(startDateObj) };
      } else {
        value = { start: toCalendarDate(startDateObj), end: toCalendarDate(date) };
      }
      onSelect?.(value);
      isOpen = false;
    }
  }

  function prevMonth() {
    viewDate = subMonths(viewDate, 1);
  }

  function nextMonth() {
    viewDate = addMonths(viewDate, 1);
  }

  function formatDisplayDate(date: CalendarDate | null): string {
    const d = toDate(date);
    if (!d) return '';
    return format(d, 'dd/MM/yyyy', { locale: activeDateFnsLocale });
  }

  const label = $derived.by(() => {
    if (value.start && value.end) {
      return `${formatDisplayDate(value.start)} - ${formatDisplayDate(value.end)}`;
    }
    if (value.start) {
      return `${formatDisplayDate(value.start)} - ...`;
    }
    return placeholder;
  });

  function clearRange(e: MouseEvent) {
    e.stopPropagation();
    value = { start: null, end: null };
    onSelect?.(value);
  }

  // Rich presets using date-fns intervals
  const activePresets = $derived.by<DateRangePreset[]>(() => {
    if (presets) return presets;

    const y = today.getFullYear();

    return [
      {
        label: 'Today',
        range: { start: toCalendarDate(today), end: toCalendarDate(today) }
      },
      {
        label: 'Next 7D',
        range: { start: toCalendarDate(today), end: toCalendarDate(addDays(today, 7)) }
      },
      {
        label: 'This Month',
        range: { start: toCalendarDate(startOfMonth(today)), end: toCalendarDate(endOfMonth(today)) }
      },
      {
        label: 'Last Month',
        range: {
          start: toCalendarDate(startOfMonth(subMonths(today, 1))),
          end: toCalendarDate(endOfMonth(subMonths(today, 1)))
        }
      },
      {
        label: 'YTD',
        range: { start: { year: y, month: 0, day: 1 }, end: toCalendarDate(today) }
      }
    ];
  });
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
      class="absolute left-0 top-full z-50 mt-1.5 w-80 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] p-3.5 shadow-xl animate-in fade-in-50 zoom-in-95 select-none"
    >
      <!-- Header controls -->
      <div class="flex items-center justify-between mb-3">
        <Button variant="ghost" size="sm" class="size-7 p-0" onclick={prevMonth}>
          <ChevronLeft class="size-4" />
        </Button>
        <span class="text-xs font-semibold text-[var(--ui-foreground)] capitalize">
          {format(viewDate, 'MMMM yyyy', { locale: activeDateFnsLocale })}
        </span>
        <Button variant="ghost" size="sm" class="size-7 p-0" onclick={nextMonth}>
          <ChevronRight class="size-4" />
        </Button>
      </div>

      <!-- Day names -->
      <div class="grid grid-cols-7 mb-1 text-center">
        {#each dayNames as day}
          <span class="text-[11px] font-semibold text-[var(--ui-muted-foreground)] py-1 capitalize">
            {day}
          </span>
        {/each}
      </div>

      <!-- Calendar grid -->
      <div class="grid grid-cols-7 gap-y-1">
        {#each calendarDays as { date, calendarDate, currentMonth }}
          {@const isStart = startDateObj ? isSameDay(startDateObj, date) : false}
          {@const isEnd = endDateObj ? isSameDay(endDateObj, date) : false}
          {@const activeRangeEnd = endDateObj || hoverDate}
          {@const inRange =
            startDateObj && activeRangeEnd
              ? isWithinInterval(date, {
                  start: isBefore(startDateObj, activeRangeEnd) ? startDateObj : activeRangeEnd,
                  end: isBefore(startDateObj, activeRangeEnd) ? activeRangeEnd : startDateObj
                })
              : false}
          {@const isEdge = isStart || isEnd}

          <div
            class={cn(
              'relative py-0.5 flex items-center justify-center',
              inRange && !isEdge && 'bg-[var(--ui-primary)]/10',
              isStart && activeRangeEnd && !isSameDay(startDateObj, activeRangeEnd) && 'rounded-l-md bg-[var(--ui-primary)]/10',
              isEnd && startDateObj && !isSameDay(startDateObj, endDateObj) && 'rounded-r-md bg-[var(--ui-primary)]/10'
            )}
            onmouseenter={() => {
              if (startDateObj && !endDateObj) hoverDate = date;
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
              {date.getDate()}
            </button>
          </div>
        {/each}
      </div>

      <!-- Presets quick buttons bar -->
      <div class="flex flex-wrap items-center gap-1.5 border-t border-[var(--ui-border)] mt-3 pt-2.5">
        {#each activePresets as preset}
          <button
            type="button"
            onclick={() => {
              value = preset.range;
              onSelect?.(value);
              isOpen = false;
            }}
            class="rounded-md border border-[var(--ui-border)] bg-[var(--ui-secondary)]/30 px-2 py-1 text-[10px] font-medium text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)] transition-colors cursor-pointer"
          >
            {preset.label}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
