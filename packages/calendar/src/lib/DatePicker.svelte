<script lang="ts">
  import * as Popover from '@intinyagroup/ui';
  import { Button, Input } from '@intinyagroup/ui';
  import { Calendar, type CalendarDate } from '@intinyagroup/calendar';
  import { Calendar as CalendarIcon, X } from 'lucide-svelte';
  import { cn } from '@intinyagroup/grid-core/utils';

  let {
    value = $bindable(null),
    placeholder = 'Select date...',
    disabled = false,
    class: className,
    onSelect,
  }: {
    value?: CalendarDate | null;
    placeholder?: string;
    disabled?: boolean;
    class?: string;
    onSelect?: (date: CalendarDate) => void;
  } = $props();

  let open = $state(false);

  function formatDateDisplay(date: CalendarDate | null): string {
    if (!date) return '';
    const d = new Date(date.year, date.month, date.day);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function handleSelect(date: CalendarDate) {
    value = date;
    onSelect?.(date);
    open = false;
  }

  function clear() {
    value = null;
    onSelect?.(null as any);
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger>
    {#snippet child({ props })}
      <button
        {...props}
        class={cn(
          'flex h-10 w-full items-center justify-between rounded-lg border border-[var(--ui-input)] bg-[var(--ui-background)] px-3 py-2 text-sm text-[var(--ui-foreground)] transition-colors cursor-pointer',
          'hover:border-[var(--ui-primary)]/50 focus:border-[var(--ui-primary)] focus:ring-2 focus:ring-[var(--ui-ring)]/20',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {disabled}
      >
        <span class={cn(!value && 'text-[var(--ui-muted-foreground)]')}>
          {value ? formatDateDisplay(value) : placeholder}
        </span>
        <CalendarIcon class="size-4 text-[var(--ui-muted-foreground)]" />
      </button>
    {/snippet}
  </Popover.Trigger>

  <Popover.Content align="start" class="w-auto p-0">
    <Calendar {value} onSelect={handleSelect} />
    {#if value}
      <div class="flex justify-end p-2 border-t border-[var(--ui-border)]">
        <Button variant="ghost" size="sm" onclick={clear}>
          <X class="size-3.5 mr-1" /> Clear
        </Button>
      </div>
    {/if}
  </Popover.Content>
</Popover.Root>
