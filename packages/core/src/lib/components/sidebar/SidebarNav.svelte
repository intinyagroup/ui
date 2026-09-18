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
    expanded = $bindable<string[] | undefined>(undefined),
    defaultExpanded = [],
    persistKey,
    title = "Navigation",
    onTitleClick,
    onNavigate,
    filterItem,
    onExpandedChange,
    class: className,
  }: {
    items?: SidebarNavItemData[];
    activeId?: string;
    collapsed?: boolean;
    expanded?: string[];
    defaultExpanded?: string[];
    persistKey?: string;
    title?: string;
    onTitleClick?: () => void;
    onNavigate?: (item: SidebarNavItemData) => void;
    filterItem?: (item: SidebarNavItemData) => boolean;
    onExpandedChange?: (ids: string[]) => void;
    class?: string;
  } = $props();
  function isItemVisible(item: SidebarNavItemData): boolean {
    const isHidden =
      typeof item.hidden === "function" ? item.hidden() : Boolean(item.hidden);
    if (isHidden) return false;
    const childVisible = item.children?.some(isItemVisible) ?? false;
    if (filterItem?.(item) === false && !childVisible) return false;
    return true;
  }

  const visibleItems = $derived(items.filter(isItemVisible));

  let expandedIds = $state(new Set<string>());
  let hasInitializedExpanded = false;
  $effect(() => {
    if (hasInitializedExpanded) return;
    hasInitializedExpanded = true;
    expandedIds = new Set(expanded ?? defaultExpanded);
  });
  $effect(() => {
    if (expanded !== undefined) expandedIds = new Set(expanded);
  });

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
    const ids = [...next];
    expandedIds = next;
    if (expanded !== undefined) expanded = ids;
    onExpandedChange?.(ids);
  }

  function ancestorIdsForActive(): string[] {
    if (!activeId) return [];
    const ancestors: string[] = [];
    function visit(candidates: SidebarNavItemData[], path: string[]): boolean {
      for (const candidate of candidates) {
        if (candidate.id === activeId) {
          ancestors.push(...path);
          return true;
        }
        if (
          candidate.children &&
          visit(candidate.children, [...path, candidate.id])
        )
          return true;
      }
      return false;
    }
    visit(items, []);
    return ancestors;
  }

  $effect(() => {
    const ancestors = ancestorIdsForActive();
    if (!ancestors.length) return;
    const next = new Set(expandedIds);
    ancestors.forEach((id) => next.add(id));
    if (next.size === expandedIds.size) return;
    const ids = [...next];
    expandedIds = next;
    if (expanded !== undefined) expanded = ids;
    onExpandedChange?.(ids);
  });

  function handleNavKeydown(event: KeyboardEvent) {
    if (!(event.target instanceof HTMLElement)) return;
    const current = event.target.closest<HTMLButtonElement>(
      '[data-sidebar-nav-item="true"]',
    );
    const nav = event.currentTarget as HTMLElement;
    if (!current || !nav.contains(current)) return;
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const navItems = [
      ...nav.querySelectorAll<HTMLButtonElement>(
        '[data-sidebar-nav-item="true"]:not(:disabled)',
      ),
    ];
    const index = navItems.indexOf(current);
    if (index < 0 || navItems.length < 2) return;
    const nextIndex =
      event.key === "ArrowDown"
        ? (index + 1) % navItems.length
        : event.key === "ArrowUp"
          ? (index - 1 + navItems.length) % navItems.length
          : event.key === "Home"
            ? 0
            : navItems.length - 1;
    event.preventDefault();
    navItems[nextIndex]?.focus();
  }
</script>

<aside
  data-slot="sidebar-nav"
  data-state={collapsed ? "collapsed" : "expanded"}
  class={cn(
    "flex h-full min-h-0 w-[17rem] flex-col border-r border-border/70 bg-background text-foreground transition-[width] duration-200 ease-out motion-reduce:transition-none",
    collapsed && "w-14",
    className,
  )}
  aria-label={title}
>
  <div
    class={cn(
      "flex h-16 shrink-0 items-center border-b border-border/65 px-3.5",
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

  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <nav
    class="min-h-0 flex-1 space-y-1 overflow-y-auto px-2.5 py-3 [scrollbar-gutter:stable]"
    aria-label={title}
    onkeydown={handleNavKeydown}
  >
    {#each visibleItems as item, itemIndex (item.id)}
      <SidebarNavItem
        {item}
        {collapsed}
        {activeId}
        {expandedIds}
        onToggle={toggleExpanded}
        {onNavigate}
        {filterItem}
        showSection={itemIndex === 0 ||
          item.section !== visibleItems[itemIndex - 1]?.section}
      />
    {/each}
  </nav>
</aside>
