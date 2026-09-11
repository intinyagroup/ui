<script lang="ts">
  import { PanelLeftClose, PanelLeftOpen } from "lucide-svelte";
  import { cn } from "$lib/utils.js";
  import SidebarNavItem, {
    type SidebarNavItemData,
  } from "./SidebarNavItem.svelte";

  let {
    items = [],
    activeId,
    collapsed = $bindable(false),
    defaultExpanded = [],
    persistKey,
    title = "Navigation",
    onTitleClick,
    onNavigate,
    filterItem,
    class: className,
  }: {
    items?: SidebarNavItemData[];
    activeId?: string;
    collapsed?: boolean;
    defaultExpanded?: string[];
    persistKey?: string;
    title?: string;
    onTitleClick?: () => void;
    onNavigate?: (item: SidebarNavItemData) => void;
    filterItem?: (item: SidebarNavItemData) => boolean;
    class?: string;
  } = $props();
  function isItemVisible(item: SidebarNavItemData): boolean {
    const isHidden =
      typeof item.hidden === "function" ? item.hidden() : Boolean(item.hidden);
    if (isHidden) return false;
    if (filterItem && !filterItem(item)) return false;
    return true;
  }

  const visibleItems = $derived(items.filter(isItemVisible));

  let expandedIds = $state(new Set(defaultExpanded));

  $effect(() => {
    if (typeof window === "undefined" || !persistKey) return;
    const saved = window.localStorage.getItem(`intinya-sidebar:${persistKey}`);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as {
        collapsed?: boolean;
        expanded?: string[];
      };
      if (typeof parsed.collapsed === "boolean") collapsed = parsed.collapsed;
      if (Array.isArray(parsed.expanded))
        expandedIds = new Set(parsed.expanded);
    } catch {
      // Ignore malformed persisted navigation state.
    }
  });

  $effect(() => {
    if (typeof window === "undefined" || !persistKey) return;
    window.localStorage.setItem(
      `intinya-sidebar:${persistKey}`,
      JSON.stringify({ collapsed, expanded: [...expandedIds] }),
    );
  });

  function toggleExpanded(id: string) {
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    expandedIds = next;
  }
</script>

<aside
  data-slot="sidebar-nav"
  data-state={collapsed ? "collapsed" : "expanded"}
  class={cn(
    "flex h-full min-h-0 w-64 flex-col border-r border-border bg-card text-foreground transition-[width] duration-200 ease-out",
    collapsed && "w-14",
    className,
  )}
  aria-label={title}
>
  <div
    class={cn(
      "flex h-12 shrink-0 items-center border-b border-border px-3",
      collapsed ? "justify-center" : "justify-between",
    )}
  >
    {#if !collapsed}
      {#if onTitleClick}
        <button
          type="button"
          onclick={onTitleClick}
          class="min-w-0 flex-1 truncate text-left text-sm font-semibold hover:text-primary transition-colors"
          >{title}</button
        >
      {:else}
        <span class="min-w-0 flex-1 truncate text-sm font-semibold"
          >{title}</span
        >
      {/if}
    {/if}
    <button
      type="button"
      class="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      onclick={() => (collapsed = !collapsed)}
    >
      {#if collapsed}
        <PanelLeftOpen class="size-4" />
      {:else}
        <PanelLeftClose class="size-4" />
      {/if}
    </button>
  </div>

  <nav
    class="min-h-0 flex-1 space-y-0.5 overflow-y-auto p-2"
    aria-label={title}
  >
    {#each visibleItems as item (item.id)}
      <SidebarNavItem
        {item}
        {collapsed}
        {activeId}
        {expandedIds}
        onToggle={toggleExpanded}
        {onNavigate}
        {filterItem}
      />
    {/each}
  </nav>
</aside>
