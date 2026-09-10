<script lang="ts">
  import { ChevronRight } from "lucide-svelte";
  import { cn } from "$lib/utils.js";
  import type { Component } from "svelte";

  export type SidebarNavItemData = {
    id: string;
    label: string;
    href?: string;
    icon?: Component;
    badge?: string | number;
    disabled?: boolean;
    children?: SidebarNavItemData[];
  };

  let {
    item,
    depth = 0,
    collapsed = false,
    activeId,
    expandedIds,
    onToggle,
    onNavigate,
  }: {
    item: SidebarNavItemData;
    depth?: number;
    collapsed?: boolean;
    activeId?: string;
    expandedIds: Set<string>;
    onToggle: (id: string) => void;
    onNavigate?: (item: SidebarNavItemData) => void;
  } = $props();

  const hasChildren = $derived(Boolean(item.children?.length));
  const expanded = $derived(expandedIds.has(item.id));
  const active = $derived(activeId === item.id);
  const Icon = item.icon;

  function handleClick() {
    if (item.disabled) return;
    if (hasChildren) onToggle(item.id);
    onNavigate?.(item);
  }
</script>

<div class="relative">
  <button
    type="button"
    disabled={item.disabled}
    aria-current={active ? "page" : undefined}
    aria-expanded={hasChildren ? expanded : undefined}
    aria-controls={hasChildren ? `sidebar-children-${item.id}` : undefined}
    title={collapsed ? item.label : undefined}
    onclick={handleClick}
    class={cn(
      "group/sidebar-item flex min-h-9 w-full items-center gap-2 rounded-lg text-left text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-45",
      active
        ? "bg-primary/12 font-medium text-primary"
        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
      collapsed ? "justify-center px-2" : "px-2.5",
    )}
    style:padding-left={!collapsed ? `${0.625 + depth * 0.875}rem` : undefined}
  >
    {#if hasChildren && !collapsed}
      <ChevronRight
        class={cn(
          "size-3.5 shrink-0 transition-transform duration-150",
          expanded && "rotate-90",
        )}
      />
    {:else if Icon}
      <Icon class="size-4 shrink-0" />
    {:else if hasChildren}
      <span class="size-1.5 shrink-0 rounded-full bg-current opacity-50"></span>
    {/if}

    {#if !collapsed}
      <span class="min-w-0 flex-1 truncate">{item.label}</span>
      {#if item.badge !== undefined}
        <span
          class={cn(
            "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
            active
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground",
          )}
        >
          {item.badge}
        </span>
      {/if}
    {/if}

    {#if active}
      <span class="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-primary"
      ></span>
    {/if}
  </button>

  {#if hasChildren && expanded && !collapsed}
    <div id={`sidebar-children-${item.id}`} class="mt-0.5 space-y-0.5">
      {#each item.children ?? [] as child (child.id)}
        <svelte:self
          item={child}
          depth={depth + 1}
          {collapsed}
          {activeId}
          {expandedIds}
          {onToggle}
          {onNavigate}
        />
      {/each}
    </div>
  {/if}
</div>
