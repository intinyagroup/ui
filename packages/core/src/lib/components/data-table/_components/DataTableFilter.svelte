<script lang="ts">
  import * as Popover from '../../popover/index.js';
  import * as DropdownMenu from '../../dropdown-menu/index.js';
  import { Filter, X } from 'lucide-svelte';
  import type { Column } from '@tanstack/table-core';
  import { Input } from '../../input/index.js';
  import { Button } from '../../button/index.js';
  import { Checkbox } from '../../checkbox/index.js';

  let {
    column,
    onFilterChange,
  }: {
    column: Column<any, unknown>;
    onFilterChange: (filterValue: unknown) => void;
  } = $props();

  const filterValue = $derived(column.getFilterValue());
  const isFiltered = $derived(column.getIsFiltered());
  const facetedValues = $derived(Array.from(column.getFacetedUniqueValues().keys()));
  const headerLabel = $derived(
    typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id
  );

  let open = $state(false);
  let textInput = $state(typeof filterValue === 'string' ? filterValue : '');

  function applyTextFilter() {
    onFilterChange(textInput || undefined);
    open = false;
  }

  function clearFilter() {
    textInput = '';
    onFilterChange(undefined);
    open = false;
  }

  function toggleFaceted(value: string) {
    const current = Array.isArray(filterValue) ? filterValue : [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onFilterChange(next.length > 0 ? next : undefined);
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger>
    {#snippet child({ props })}
      <button
        {...props}
        class="flex items-center justify-center size-6 rounded-md transition-colors cursor-pointer
          {isFiltered ? 'bg-[var(--ui-primary)]/10 text-[var(--ui-primary)]' : 'text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)] hover:text-[var(--ui-foreground)]'}"
        aria-label={`Filter ${headerLabel}`}
      >
        <Filter class="size-3" />
      </button>
    {/snippet}
  </Popover.Trigger>

  <Popover.Content align="start" class="w-64 p-3">
    <div class="grid gap-3">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-[var(--ui-foreground)]">{headerLabel}</span>
        {#if isFiltered}
          <button
            onclick={clearFilter}
            class="text-xs text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] cursor-pointer"
          >
            Clear
          </button>
        {/if}
      </div>

      <!-- Text filter -->
      <div class="grid gap-2">
        <Input
          placeholder="Filter..."
          value={textInput}
          oninput={(e) => { textInput = e.currentTarget.value; }}
          onkeydown={(e) => { if (e.key === 'Enter') applyTextFilter(); }}
        />
      </div>

      <!-- Faceted values (select) -->
      {#if facetedValues.length > 0 && facetedValues.length <= 20}
        <div class="grid gap-1.5 max-h-48 overflow-auto">
          <span class="text-xs font-medium text-[var(--ui-muted-foreground)]">Options</span>
          {#each facetedValues as value (String(value))}
            <label class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)] cursor-pointer">
              <Checkbox
                checked={Array.isArray(filterValue) && filterValue.includes(value)}
                onCheckedChange={() => toggleFaceted(String(value))}
              />
              <span class="truncate">{value}</span>
              <span class="ml-auto text-xs text-[var(--ui-muted-foreground)]">
                {column.getFacetedMinMaxValues?.() ? '' : column.getFacetedUniqueValues().get(value)}
              </span>
            </label>
          {/each}
        </div>
      {/if}

      <Button size="sm" onclick={applyTextFilter}>Apply</Button>
    </div>
  </Popover.Content>
</Popover.Root>
