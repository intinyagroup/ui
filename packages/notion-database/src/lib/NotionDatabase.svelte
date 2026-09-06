<script lang="ts" generics="TItem extends Record<string, any>">
  import {
    Table as TableIcon,
    Kanban as BoardIcon,
    Calendar as CalendarIcon,
    LayoutGrid as GalleryIcon,
    Plus,
    Search,
    Filter,
    ArrowUpDown
  } from 'lucide-svelte';
  import { Button, Badge } from '@intinyagroup/ui';
  import { DataTable, type ColumnDef } from '@intinyagroup/data-table';
  import { Kanban } from '@intinyagroup/kanban';
  import { EventCalendar, type CalendarEvent } from '@intinyagroup/calendar';
  import { cn } from '@intinyagroup/ui/utils';
  import type { Snippet } from 'svelte';

  export type DatabaseViewType = 'table' | 'board' | 'calendar' | 'gallery';

  export type DatabaseProperty = {
    key: string;
    label: string;
    type: 'title' | 'text' | 'select' | 'status' | 'date' | 'number';
    options?: { value: string; label: string; color?: string }[];
  };

  let {
    title = 'Database',
    icon = '🗂️',
    items = $bindable([]),
    properties = [],
    activeView = $bindable('table' as DatabaseViewType),
    views = ['table', 'board', 'calendar', 'gallery'] as DatabaseViewType[],
    groupPropertyKey = 'status',
    datePropertyKey = 'date',
    titlePropertyKey = 'title',
    class: className,
    onItemClick,
    onAddItem,
  }: {
    title?: string;
    icon?: string;
    items?: TItem[];
    properties?: DatabaseProperty[];
    activeView?: DatabaseViewType;
    views?: DatabaseViewType[];
    groupPropertyKey?: string;
    datePropertyKey?: string;
    titlePropertyKey?: string;
    class?: string;
    onItemClick?: (item: TItem) => void;
    onAddItem?: () => void;
  } = $props();

  let searchQuery = $state('');

  // Filtered items based on search
  const filteredItems = $derived.by(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((item) => {
      return Object.values(item).some((val) =>
        val !== undefined && val !== null && String(val).toLowerCase().includes(q)
      );
    });
  });

  // ---------------------------------------------------------------------------
  // 1. Table View Configuration
  // ---------------------------------------------------------------------------
  const tableColumns = $derived.by<ColumnDef<TItem, any>[]>(() => {
    return properties.map((prop) => ({
      accessorKey: prop.key,
      header: prop.label,
      cell: ({ getValue }) => {
        const val = getValue();
        if (prop.type === 'select' || prop.type === 'status') {
          const opt = prop.options?.find((o) => o.value === val);
          return opt?.label || val || '-';
        }
        return val !== undefined && val !== null ? String(val) : '-';
      }
    }));
  });

  // ---------------------------------------------------------------------------
  // 2. Board (Kanban) View Configuration
  // ---------------------------------------------------------------------------
  const groupProp = $derived(properties.find((p) => p.key === groupPropertyKey));
  const boardColumns = $derived.by(() => {
    const rawOptions = groupProp?.options ?? [
      { value: 'To Do', label: 'To Do' },
      { value: 'In Progress', label: 'In Progress' },
      { value: 'Done', label: 'Done' }
    ];

    return rawOptions.map((opt) => {
      const colCards = filteredItems
        .filter((item) => item[groupPropertyKey] === opt.value)
        .map((item) => ({
          id: String(item.id || item._id || Math.random()),
          title: String(item[titlePropertyKey] || 'Untitled'),
          description: properties
            .filter((p) => p.key !== titlePropertyKey && p.key !== groupPropertyKey)
            .map((p) => `${p.label}: ${item[p.key] || '-'}`)
            .join(' • ')
        }));

      return {
        id: opt.value,
        title: opt.label,
        cards: colCards
      };
    });
  });

  // ---------------------------------------------------------------------------
  // 3. Calendar View Configuration
  // ---------------------------------------------------------------------------
  const calendarEvents = $derived.by<CalendarEvent[]>(() => {
    return filteredItems
      .filter((item) => item[datePropertyKey])
      .map((item) => {
        const d = new Date(item[datePropertyKey]);
        const endD = new Date(d.getTime() + 60 * 60 * 1000);
        return {
          id: String(item.id || item._id || Math.random()),
          title: String(item[titlePropertyKey] || 'Untitled'),
          start: d,
          end: endD,
          color: '#2563eb',
          description: String(item[groupPropertyKey] || '')
        };
      });
  });

  function getPropertyColor(propKey: string, val: string): string | undefined {
    const prop = properties.find((p) => p.key === propKey);
    return prop?.options?.find((o) => o.value === val)?.color;
  }
</script>

<div class={cn('flex flex-col rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-card)] shadow-xs overflow-hidden', className)}>
  <!-- Database Title and View Switcher Header -->
  <div class="border-b border-[var(--ui-border)] p-4 sm:px-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2.5">
        <span class="text-2xl select-none">{icon}</span>
        <h1 class="text-xl font-bold text-[var(--ui-foreground)]">{title}</h1>
        <Badge variant="secondary" class="ml-1 text-xs">
          {items.length} items
        </Badge>
      </div>

      <div class="flex items-center gap-2">
        <div class="relative w-48 sm:w-60">
          <Search class="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[var(--ui-muted-foreground)]" />
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Filter database..."
            class="h-8 w-full rounded-lg border border-[var(--ui-input)] bg-[var(--ui-background)] pl-8 pr-3 text-xs outline-none focus:border-[var(--ui-primary)]"
          />
        </div>

        {#if onAddItem}
          <Button size="sm" class="h-8 text-xs gap-1.5 font-semibold" onclick={onAddItem}>
            <Plus class="size-3.5" /> New
          </Button>
        {/if}
      </div>
    </div>

    <!-- View Switcher Tabs -->
    <div class="flex items-center gap-1 border-b border-transparent -mb-4">
      {#if views.includes('table')}
        <button
          type="button"
          onclick={() => (activeView = 'table')}
          class={cn(
            'flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer',
            activeView === 'table'
              ? 'border-[var(--ui-primary)] text-[var(--ui-primary)]'
              : 'border-transparent text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)]'
          )}
        >
          <TableIcon class="size-3.5" /> Table
        </button>
      {/if}

      {#if views.includes('board')}
        <button
          type="button"
          onclick={() => (activeView = 'board')}
          class={cn(
            'flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer',
            activeView === 'board'
              ? 'border-[var(--ui-primary)] text-[var(--ui-primary)]'
              : 'border-transparent text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)]'
          )}
        >
          <BoardIcon class="size-3.5" /> Board
        </button>
      {/if}

      {#if views.includes('calendar')}
        <button
          type="button"
          onclick={() => (activeView = 'calendar')}
          class={cn(
            'flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer',
            activeView === 'calendar'
              ? 'border-[var(--ui-primary)] text-[var(--ui-primary)]'
              : 'border-transparent text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)]'
          )}
        >
          <CalendarIcon class="size-3.5" /> Calendar
        </button>
      {/if}

      {#if views.includes('gallery')}
        <button
          type="button"
          onclick={() => (activeView = 'gallery')}
          class={cn(
            'flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer',
            activeView === 'gallery'
              ? 'border-[var(--ui-primary)] text-[var(--ui-primary)]'
              : 'border-transparent text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)]'
          )}
        >
          <GalleryIcon class="size-3.5" /> Gallery
        </button>
      {/if}
    </div>
  </div>

  <!-- View Content Display -->
  <div class="p-0">
    {#if activeView === 'table'}
      <!-- 1. TABLE VIEW -->
      <DataTable
        data={filteredItems}
        columns={tableColumns}
        searchable={false}
        exportable={true}
        densityToggle={true}
        columnToggle={true}
        floatingFilter={true}
        onRowClick={(row) => onItemClick?.(row)}
      />
    {:else if activeView === 'board'}
      <!-- 2. BOARD (KANBAN) VIEW -->
      <div class="p-4 sm:p-6 overflow-x-auto">
        <Kanban
          columns={boardColumns}
          onCardMove={({ cardId, toColumnId }) => {
            const item = items.find((it) => String(it.id || it._id) === cardId);
            if (item) item[groupPropertyKey] = toColumnId;
          }}
        />
      </div>
    {:else if activeView === 'calendar'}
      <!-- 3. CALENDAR VIEW -->
      <div class="p-4 sm:p-6">
        <EventCalendar
          events={calendarEvents}
          view="month"
          onEventClick={(ev) => {
            const item = items.find((it) => String(it.id || it._id) === ev.id);
            if (item) onItemClick?.(item);
          }}
        />
      </div>
    {:else if activeView === 'gallery'}
      <!-- 4. GALLERY (CARDS) VIEW -->
      <div class="p-4 sm:p-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {#each filteredItems as item (item.id || item._id)}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <div
            onclick={() => onItemClick?.(item)}
            class="group flex flex-col justify-between rounded-xl border border-[var(--ui-border)] bg-[var(--ui-card)] p-4 shadow-xs transition-all hover:border-[var(--ui-primary)] hover:shadow-md cursor-pointer"
          >
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-base select-none">{item.icon || '📄'}</span>
                <h3 class="text-sm font-bold text-[var(--ui-foreground)] group-hover:text-[var(--ui-primary)] transition-colors truncate">
                  {item[titlePropertyKey] || 'Untitled'}
                </h3>
              </div>

              <div class="space-y-1.5 mt-3 text-xs">
                {#each properties.filter((p) => p.key !== titlePropertyKey) as prop}
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="text-[var(--ui-muted-foreground)]">{prop.label}</span>
                    <span class="font-medium text-[var(--ui-foreground)] truncate max-w-[140px]">
                      {item[prop.key] ?? '-'}
                    </span>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
