<script lang="ts">
  import { ChevronRight } from "lucide-svelte";
  import { cn } from "$lib/utils.js";
  import type { Component } from "svelte";
  import SidebarNavItem from "./SidebarNavItem.svelte";

  export type SidebarNavItemData = {
    id: string;
    label: string;
    href?: string;
    icon?: Component;
    badge?: string | number;
    disabled?: boolean;
    hidden?: boolean | (() => boolean);
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
    filterItem,
  }: {
    item: SidebarNavItemData;
    depth?: number;
    collapsed?: boolean;
    activeId?: string;
    expandedIds: Set<string>;
    onToggle: (id: string) => void;
    onNavigate?: (item: SidebarNavItemData) => void;
    filterItem?: (item: SidebarNavItemData) => boolean;
  } = $props();

  const hasChildren = $derived(Boolean(item.children?.length));
  const expanded = $derived(expandedIds.has(item.id));
  const active = $derived(activeId === item.id);
  const Icon = $derived(item.icon);

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
      "group/sidebar-item relative flex min-h-10 w-full items-center gap-2.5 rounded-lg text-left text-[13px] leading-5 transition-[background-color,color,box-shadow] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-45",
      active
        ? "bg-primary/[0.08] font-semibold text-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--ui-primary)_12%,transparent)]"
        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      collapsed ? "justify-center px-2" : "px-3",
    )}
    style:padding-left={!collapsed ? `${0.75 + depth * 0.875}rem` : undefined}
  >
    {#if hasChildren && !collapsed}
      <ChevronRight
        class={cn(
          "size-3.5 shrink-0 text-muted-foreground/70 transition-transform duration-150",
          expanded && "rotate-90 text-foreground",
        )}
      />
    {:else if Icon}
      <Icon
        class={cn(
          "size-4 shrink-0",
          active ? "text-primary" : "text-muted-foreground/80",
        )}
      />
    {:else if hasChildren}
      <span class="size-1.5 shrink-0 rounded-full bg-current opacity-50"></span>
    {/if}

    {#if !collapsed}
      <span class="min-w-0 flex-1 truncate">{item.label}</span>
      {#if item.badge !== undefined}
        <span
          class="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground"
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
    <div
      id={`sidebar-children-${item.id}`}
      class="mt-1 space-y-0.5 border-l border-border/70 pl-2"
    >
      {#each item.children?.filter((child) => !filterItem || filterItem(child)) ?? [] as child (child.id)}
        <SidebarNavItem
          item={child}
          depth={depth + 1}
          {collapsed}
          {activeId}
          {expandedIds}
          {onToggle}
          {onNavigate}
          {filterItem}
        />
      {/each}
    </div>
  {/if}
</div>
