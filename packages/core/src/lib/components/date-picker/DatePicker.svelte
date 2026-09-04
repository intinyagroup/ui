<script lang="ts">
  import { DatePicker as DatePickerPrimitive } from 'bits-ui';
  import {
    getLocalTimeZone,
    parseDate,
    type DateValue,
  } from '@internationalized/date';
  import { cn } from '$lib/utils.js';
  import { getLocale, t } from '$lib/i18n/index.js';

  let {
    value = $bindable(''),
    placeholder = t('datepicker.placeholder'),
    disabled = false,
    min,
    max,
    class: className,
    onValueChange,
  }: {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    min?: string;
    max?: string;
    class?: string;
    onValueChange?: (value: string) => void;
  } = $props();

  let open = $state(false);

  /** Convert ISO date string → DateValue | undefined */
  function toDateValue(iso: string | undefined): DateValue | undefined {
    if (!iso) return undefined;
    try {
      return parseDate(iso);
    } catch {
      return undefined;
    }
  }

  /** Convert DateValue → ISO date string */
  function toISOString(date: DateValue | undefined): string {
    if (!date) return '';
    return date.toString();
  }

  let dateValue = $derived(toDateValue(value));
  let minValue = $derived(toDateValue(min));
  let maxValue = $derived(toDateValue(max));

  function handleValueChange(newValue: DateValue | undefined) {
    const iso = toISOString(newValue);
    value = iso;
    onValueChange?.(iso);
  }

  /** Format the selected date for the trigger display */
  function formatDate(dv: DateValue | undefined): string {
    if (!dv) return '';
    try {
      return new Intl.DateTimeFormat(getLocale().locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(dv.toDate(getLocalTimeZone()));
    } catch {
      return '';
    }
  }

  let displayText = $derived(formatDate(dateValue));
</script>

<DatePickerPrimitive.Root
  bind:value={dateValue}
  {disabled}
  minValue={minValue}
  maxValue={maxValue}
  bind:open
  onValueChange={handleValueChange}
  class={cn('relative inline-flex flex-col', className)}
>
  <!-- Trigger button -->
  <DatePickerPrimitive.Trigger
    class="flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-[var(--ui-input)] bg-[var(--ui-background)] px-3 py-2 text-sm text-[var(--ui-foreground)] outline-none transition-colors
      focus:border-[var(--ui-primary)] focus:ring-2 focus:ring-[var(--ui-ring)]/20
      disabled:cursor-not-allowed disabled:opacity-50
      {open ? 'border-[var(--ui-primary)] ring-2 ring-[var(--ui-ring)]/20' : ''}"
  >
    {#if displayText}
      <span class="truncate">{displayText}</span>
    {:else}
      <span class="truncate text-[var(--ui-muted-foreground)]">{placeholder}</span>
    {/if}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="shrink-0 text-[var(--ui-muted-foreground)]"
    >
      <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
    </svg>
  </DatePickerPrimitive.Trigger>

  <!-- Calendar popover -->
  <DatePickerPrimitive.Portal>
    <DatePickerPrimitive.Content
      sideOffset={8}
      align="start"
      class="z-50 w-auto rounded-lg border border-[var(--ui-border)] bg-[var(--ui-popover)] p-3 shadow-lg outline-none
        data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
        data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
        data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95
        data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
    >
      <!--
        DatePicker.Calendar renders children with { months, weekdays } snippet.
        We iterate months → weeks → dates to build the grid.
      -->
      <DatePickerPrimitive.Calendar>
        {#snippet children({ months, weekdays })}
          {#each months as month}
            <div class="space-y-3">
              <!-- Header: prev/next buttons + heading -->
              <div class="flex items-center justify-between">
                <DatePickerPrimitive.PrevButton
                  class="flex size-8 items-center justify-center rounded-md border border-[var(--ui-border)] bg-[var(--ui-background)] text-[var(--ui-foreground)] transition-colors hover:bg-[var(--ui-accent)] hover:text-[var(--ui-accent-foreground)] disabled:opacity-50"
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                  </svg>
                </DatePickerPrimitive.PrevButton>

                <DatePickerPrimitive.Heading
                  class="text-sm font-medium text-[var(--ui-foreground)]"
                />

                <DatePickerPrimitive.NextButton
                  class="flex size-8 items-center justify-center rounded-md border border-[var(--ui-border)] bg-[var(--ui-background)] text-[var(--ui-foreground)] transition-colors hover:bg-[var(--ui-accent)] hover:text-[var(--ui-accent-foreground)] disabled:opacity-50"
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                  </svg>
                </DatePickerPrimitive.NextButton>
              </div>

              <!-- Weekday headers -->
              <DatePickerPrimitive.Grid class="w-full border-collapse">
                <DatePickerPrimitive.GridHead>
                  <DatePickerPrimitive.GridRow class="flex">
                    {#each weekdays as day}
                      <DatePickerPrimitive.HeadCell
                        class="flex w-9 items-center justify-center text-xs font-medium text-[var(--ui-muted-foreground)]"
                      >
                        {day}
                      </DatePickerPrimitive.HeadCell>
                    {/each}
                  </DatePickerPrimitive.GridRow>
                </DatePickerPrimitive.GridHead>

                <!-- Date grid rows -->
                <DatePickerPrimitive.GridBody>
                  {#each month.weeks as week}
                    <DatePickerPrimitive.GridRow class="flex w-full">
                      {#each week as date}
                        <DatePickerPrimitive.Cell
                          date={date}
                          month={month.value}
                          class="relative flex size-9 items-center justify-center rounded-md p-0 text-sm outline-none focus-within:relative focus-within:z-20"
                        >
                          <DatePickerPrimitive.Day
                            {date}
                            month={month.value}
                            class="inline-flex size-9 items-center justify-center rounded-md p-0 text-sm transition-colors
                              hover:bg-[var(--ui-accent)] hover:text-[var(--ui-accent-foreground)]
                              data-[selected]:bg-[var(--ui-primary)] data-[selected]:text-[var(--ui-primary-foreground)]
                              data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50
                              data-[outside-month]:pointer-events-none data-[outside-month]:text-[var(--ui-muted-foreground)]/40"
                          />
                        </DatePickerPrimitive.Cell>
                      {/each}
                    </DatePickerPrimitive.GridRow>
                  {/each}
                </DatePickerPrimitive.GridBody>
              </DatePickerPrimitive.Grid>
            </div>
          {/each}
        {/snippet}
      </DatePickerPrimitive.Calendar>
    </DatePickerPrimitive.Content>
  </DatePickerPrimitive.Portal>
</DatePickerPrimitive.Root>
