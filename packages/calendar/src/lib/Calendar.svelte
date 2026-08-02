<script lang="ts">
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/ui/utils';

  export type CalendarDate = { year: number; month: number; day: number };

  let {
    value = $bindable(null),
    min = null,
    max = null,
    disabled = false,
    class: className,
    onSelect,
  }: {
    value?: CalendarDate | null;
    min?: CalendarDate | null;
    max?: CalendarDate | null;
    disabled?: boolean;
    class?: string;
    onSelect?: (date: CalendarDate) => void;
  } = $props();

  const today = new Date();
  let viewYear = $state(value?.year ?? today.getFullYear());
  let viewMonth = $state(value?.month ?? today.getMonth());

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  const daysInMonth = $derived(new Date(viewYear, viewMonth + 1, 0).getDate());
  const firstDayOfMonth = $derived(new Date(viewYear, viewMonth, 1).getDay());

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

  function isSameDate(a: CalendarDate | null, b: CalendarDate) {
    return a?.year === b.year && a?.month === b.month && a?.day === b.day;
  }
  function isToday(date: CalendarDate) {
    return date.year === today.getFullYear() && date.month === today.getMonth() && date.day === today.getDate();
  }
  function isDisabled(date: CalendarDate) {
    if (min && (date.year < min.year || (date.year === min.year && date.month < min.month) || (date.year === min.year && date.month === min.month && date.day < min.day))) return true;
    if (max && (date.year > max.year || (date.year === max.year && date.month > max.month) || (date.year === max.year && date.month === max.month && date.day > max.day))) return true;
    return false;
  }
  function prevMonth() { if (viewMonth === 0) { viewMonth = 11; viewYear--; } else { viewMonth--; } }
  function nextMonth() { if (viewMonth === 11) { viewMonth = 0; viewYear++; } else { viewMonth++; } }
  function selectDate(date: CalendarDate) { if (disabled || isDisabled(date)) return; value = date; onSelect?.(date); }
  function goToday() { viewYear = today.getFullYear(); viewMonth = today.getMonth(); selectDate({ year: today.getFullYear(), month: today.getMonth(), day: today.getDate() }); }
</script>

<div class={cn('inline-flex flex-col rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] p-4 shadow-sm', className)}>
  <div class="flex items-center justify-between mb-4">
    <Button variant="ghost" size="sm" onclick={prevMonth} {disabled}><ChevronLeft class="size-4" /></Button>
    <div class="flex items-center gap-2">
      <span class="text-sm font-semibold text-[var(--ui-foreground)]">{monthNames[viewMonth]} {viewYear}</span>
      <Button variant="ghost" size="sm" onclick={goToday} {disabled} class="text-xs h-6 px-2">Today</Button>
    </div>
    <Button variant="ghost" size="sm" onclick={nextMonth} {disabled}><ChevronRight class="size-4" /></Button>
  </div>

  <div class="grid grid-cols-7 gap-1 mb-2">
    {#each dayNames as d}<div class="text-center text-[11px] font-medium text-[var(--ui-muted-foreground)] py-1">{d}</div>{/each}
  </div>

  <div class="grid grid-cols-7 gap-1">
    {#each calendarDays as { day, currentMonth, date } (date.year + '-' + date.month + '-' + date.day)}
      {@const isSelected = isSameDate(value, date)}
      {@const isTodayDate = isToday(date)}
      {@const isDisabledDate = isDisabled(date)}
      <button
        onclick={() => selectDate(date)}
        disabled={disabled || isDisabledDate}
        class="flex items-center justify-center size-9 rounded-lg text-sm transition-colors cursor-pointer
          {isSelected ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] font-semibold' : ''}
          {!isSelected && currentMonth ? 'text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)]' : ''}
          {!isSelected && !currentMonth ? 'text-[var(--ui-muted-foreground)]/40' : ''}
          {isTodayDate && !isSelected ? 'ring-2 ring-[var(--ui-primary)]/30 font-medium' : ''}
          {isDisabledDate || disabled ? 'opacity-40 cursor-not-allowed' : ''}"
      >{day}</button>
    {/each}
  </div>
</div>
