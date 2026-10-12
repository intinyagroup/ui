<script lang="ts">
  import { DatePicker as ArkDatePicker } from "@ark-ui/svelte/date-picker";
  import {
    getLocalTimeZone,
    parseDate,
    type DateValue,
  } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { getLocale, t } from "$lib/i18n/index.js";

  let {
    value = $bindable(""),
    placeholder = t("datepicker.placeholder"),
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
    if (!date) return "";
    return date.toString();
  }

  let dateValue = $derived(toDateValue(value));
  let minValue = $derived(toDateValue(min));
  let maxValue = $derived(toDateValue(max));

  function handleValueChange(details: { value: DateValue[] }) {
    const first = details.value?.[0];
    const iso = toISOString(first);
    value = iso;
    onValueChange?.(iso);
  }

  function handleOpenChange(details: { open: boolean }) {
    open = details.open;
  }

  /** Format the selected date for the trigger display */
  function formatDate(dv: DateValue | undefined): string {
    if (!dv) return "";
    try {
      return new Intl.DateTimeFormat(getLocale().locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(dv.toDate(getLocalTimeZone()));
    } catch {
      return "";
    }
  }

  let displayText = $derived(formatDate(dateValue));
</script>

<div class={cn("relative inline-flex flex-col", className)}>
  <ArkDatePicker.Root
    value={dateValue ? [dateValue] : []}
    onValueChange={handleValueChange}
    {disabled}
    {open}
    onOpenChange={handleOpenChange}
    min={minValue}
    max={maxValue}
  >
    <!-- Trigger button -->
    <ArkDatePicker.Control>
      <ArkDatePicker.Trigger
        class="flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-[var(--ui-input)] bg-[var(--ui-background)] px-3 py-2 text-sm text-[var(--ui-foreground)] outline-none transition-colors
        focus:border-[var(--ui-primary)] focus:ring-2 focus:ring-[var(--ui-ring)]/20
        disabled:cursor-not-allowed disabled:opacity-50
        {open
          ? 'border-[var(--ui-primary)] ring-2 ring-[var(--ui-ring)]/20'
          : ''}"
      >
        <ArkDatePicker.Input
          class="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-[var(--ui-muted-foreground)]"
          {placeholder}
        />
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
          <path d="M8 2v4" /><path d="M16 2v4" /><rect
            width="18"
            height="18"
            x="3"
            y="4"
            rx="2"
          /><path d="M3 10h18" />
        </svg>
      </ArkDatePicker.Trigger>
    </ArkDatePicker.Control>

    <!-- Calendar popover -->
    <ArkDatePicker.Positioner>
      <ArkDatePicker.Content
        class="z-50 w-auto rounded-lg border border-[var(--ui-border)] bg-[var(--ui-popover)] p-3 shadow-lg outline-none
        data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
        data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
      >
        <ArkDatePicker.Context>
          {#snippet render(api)}
            <ArkDatePicker.View view="day">
              <ArkDatePicker.ViewControl
                class="flex items-center justify-between"
              >
                <ArkDatePicker.PrevTrigger
                  class="flex size-8 items-center justify-center rounded-md border border-[var(--ui-border)] bg-[var(--ui-background)] text-[var(--ui-foreground)] transition-colors hover:bg-[var(--ui-accent)] hover:text-[var(--ui-accent-foreground)] disabled:opacity-50"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </ArkDatePicker.PrevTrigger>

                <ArkDatePicker.ViewTrigger
                  class="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-[var(--ui-foreground)] hover:bg-[var(--ui-accent)]"
                >
                  <ArkDatePicker.RangeText />
                </ArkDatePicker.ViewTrigger>

                <ArkDatePicker.NextTrigger
                  class="flex size-8 items-center justify-center rounded-md border border-[var(--ui-border)] bg-[var(--ui-background)] text-[var(--ui-foreground)] transition-colors hover:bg-[var(--ui-accent)] hover:text-[var(--ui-accent-foreground)] disabled:opacity-50"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </ArkDatePicker.NextTrigger>
              </ArkDatePicker.ViewControl>

              <ArkDatePicker.Table class="w-full border-collapse">
                <ArkDatePicker.TableHead>
                  <ArkDatePicker.TableRow class="flex">
                    {#each api().weekDays as weekDay}
                      <ArkDatePicker.TableHeader
                        class="flex w-9 items-center justify-center text-xs font-medium text-[var(--ui-muted-foreground)]"
                      >
                        {weekDay.narrow}
                      </ArkDatePicker.TableHeader>
                    {/each}
                  </ArkDatePicker.TableRow>
                </ArkDatePicker.TableHead>

                <ArkDatePicker.TableBody>
                  {#each api().weeks as week}
                    <ArkDatePicker.TableRow class="flex w-full">
                      {#each week as day}
                        <ArkDatePicker.TableCell
                          value={day}
                          class="relative flex size-9 items-center justify-center rounded-md p-0 text-sm outline-none focus-within:relative focus-within:z-20"
                        >
                          <ArkDatePicker.TableCellTrigger
                            class="inline-flex size-9 items-center justify-center rounded-md p-0 text-sm transition-colors
                            hover:bg-[var(--ui-accent)] hover:text-[var(--ui-accent-foreground)]
                            data-[selected]:bg-[var(--ui-primary)] data-[selected]:text-[var(--ui-primary-foreground)]
                            data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50
                            data-[outside-range]:pointer-events-none data-[outside-range]:text-[var(--ui-muted-foreground)]/40"
                          >
                            {day.day}
                          </ArkDatePicker.TableCellTrigger>
                        </ArkDatePicker.TableCell>
                      {/each}
                    </ArkDatePicker.TableRow>
                  {/each}
                </ArkDatePicker.TableBody>
              </ArkDatePicker.Table>
            </ArkDatePicker.View>
          {/snippet}
        </ArkDatePicker.Context>
      </ArkDatePicker.Content>
    </ArkDatePicker.Positioner>
  </ArkDatePicker.Root>
</div>
