<script lang="ts">
  import * as DropdownMenu from '../../dropdown-menu/index.js';
  import { ArrowUp, ArrowDown, ArrowUpDown, Pin, PinOff, EyeOff, ArrowLeftFromLine, ArrowRightFromLine, Filter, Expand, Shrink } from 'lucide-svelte';
  import type { Column } from '@tanstack/table-core';

  let {
    column,
    onSort,
    onPin,
    onHide,
    onFilter,
    isFiltered = false,
    isExpanded = false,
    canExpand = false,
    onExpand,
  }: {
    column: Column<any, unknown>;
    onSort: (direction: 'asc' | 'desc' | null) => void;
    onPin: (side: 'left' | 'right' | null) => void;
    onHide: () => void;
    onFilter: () => void;
    isFiltered?: boolean;
    isExpanded?: boolean;
    canExpand?: boolean;
    onExpand?: () => void;
  } = $props();

  const canSort = $derived(column.getCanSort());
  const canPin = $derived(column.getIsPinnable());
  const currentSort = $derived(column.getIsSorted());
  const isPinned = $derived(column.getIsPinned());
  const canHide = $derived(column.getCanHide());
  const headerLabel = $derived(
    typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id
  );
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <button
        {...props}
        class="flex items-center justify-center size-7 rounded-md text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)] hover:text-[var(--ui-foreground)] transition-colors cursor-pointer"
        aria-label={`Column menu for ${headerLabel}`}
      >
        <svg class="size-3.5" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>
    {/snippet}
  </DropdownMenu.Trigger>

  <DropdownMenu.Content align="start" class="w-52">
    {#if canSort}
      <DropdownMenu.Label class="text-[0.65rem] uppercase tracking-wider text-[var(--ui-muted-foreground)]">Sort</DropdownMenu.Label>
      <DropdownMenu.Item onclick={() => onSort('asc')}>
        <ArrowUp class="size-4 mr-2" />
        Sort ascending
        {#if currentSort === 'asc'}
          <span class="ml-auto text-[var(--ui-primary)] text-xs">✓</span>
        {/if}
      </DropdownMenu.Item>
      <DropdownMenu.Item onclick={() => onSort('desc')}>
        <ArrowDown class="size-4 mr-2" />
        Sort descending
        {#if currentSort === 'desc'}
          <span class="ml-auto text-[var(--ui-primary)] text-xs">✓</span>
        {/if}
      </DropdownMenu.Item>
      <DropdownMenu.Item onclick={() => onSort(null)}>
        <ArrowUpDown class="size-4 mr-2" />
        Clear sort
      </DropdownMenu.Item>
    {/if}

    {#if canSort}
      <DropdownMenu.Separator />
    {/if}

    {#if canPin}
      <DropdownMenu.Label class="text-[0.65rem] uppercase tracking-wider text-[var(--ui-muted-foreground)]">Pin</DropdownMenu.Label>
      <DropdownMenu.Item onclick={() => onPin(isPinned === 'left' ? null : 'left')}>
        <ArrowLeftFromLine class="size-4 mr-2" />
        Pin left
        {#if isPinned === 'left'}
          <span class="ml-auto text-[var(--ui-primary)] text-xs">✓</span>
        {/if}
      </DropdownMenu.Item>
      <DropdownMenu.Item onclick={() => onPin(isPinned === 'right' ? null : 'right')}>
        <ArrowRightFromLine class="size-4 mr-2" />
        Pin right
        {#if isPinned === 'right'}
          <span class="ml-auto text-[var(--ui-primary)] text-xs">✓</span>
        {/if}
      </DropdownMenu.Item>
      <DropdownMenu.Item onclick={() => onPin(null)}>
        <PinOff class="size-4 mr-2" />
        Unpin
      </DropdownMenu.Item>
    {/if}

    {#if canPin}
      <DropdownMenu.Separator />
    {/if}

    <DropdownMenu.Item onclick={onFilter}>
      <Filter class="size-4 mr-2" />
      Filter
      {#if isFiltered}
        <span class="ml-auto text-[var(--ui-primary)] text-xs">✓</span>
      {/if}
    </DropdownMenu.Item>

    {#if canExpand}
      <DropdownMenu.Item onclick={onExpand}>
        {#if isExpanded}
          <Shrink class="size-4 mr-2" />
          Collapse
        {:else}
          <Expand class="size-4 mr-2" />
          Expand
        {/if}
      </DropdownMenu.Item>
    {/if}

    <DropdownMenu.Separator />

    {#if canHide}
      <DropdownMenu.Item onclick={onHide}>
        <EyeOff class="size-4 mr-2" />
        Hide column
      </DropdownMenu.Item>
    {/if}
  </DropdownMenu.Content>
</DropdownMenu.Root>
