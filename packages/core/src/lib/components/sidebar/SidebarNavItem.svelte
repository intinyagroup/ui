<script lang="ts">
  import { ChevronRight, ExternalLink } from "lucide-svelte";
  import { cn } from "$lib/utils.js";
  import type { Component } from "svelte";
  import SidebarNavItem from "./SidebarNavItem.svelte";

  export type SidebarNavBadgeTone =
    "neutral" | "info" | "success" | "warning" | "danger";

  export type SidebarNavItemData = {
    id: string;
    label: string;
    href?: string;
    icon?: Component;
    badge?: string | number;
    badgeTone?: SidebarNavBadgeTone;
    shortcut?: string;
    external?: boolean;
    section?: string;
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
    showSection = true,
  }: {
    item: SidebarNavItemData;
    depth?: number;
    collapsed?: boolean;
    activeId?: string;
    expandedIds: Set<string>;
    onToggle: (id: string) => void;
    onNavigate?: (item: SidebarNavItemData) => void;
    filterItem?: (item: SidebarNavItemData) => boolean;
    showSection?: boolean;
  } = $props();

  const hasChildren = $derived(Boolean(item.children?.length));
  const expanded = $derived(expandedIds.has(item.id));
  const visibleChildren = $derived(item.children?.filter(isVisible) ?? []);
  const active = $derived(activeId === item.id);
  const Icon = $derived(item.icon);

  function isVisible(candidate: SidebarNavItemData): boolean {
    const hidden =
      typeof candidate.hidden === "function"
        ? candidate.hidden()
        : Boolean(candidate.hidden);
    if (hidden) return false;
    const childVisible = candidate.children?.some(isVisible) ?? false;
    return filterItem?.(candidate) !== false || childVisible;
  }

  function handleClick() {
    if (item.disabled) return;
    if (hasChildren) onToggle(item.id);
    onNavigate?.(item);
  }

  function badgeToneClass(tone?: SidebarNavBadgeTone): string {
    switch (tone) {
      case "info":
        return "bg-blue-500/12 text-blue-700 dark:text-blue-300";
      case "success":
        return "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300";
      case "warning":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-300";
      case "danger":
        return "bg-red-500/12 text-red-700 dark:text-red-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  }

  const collapsedLabel = $derived(
    [item.label, item.shortcut].filter(Boolean).join(" — "),
  );
</script>

<div class="relative">
  {#if item.section && showSection && !collapsed}
    <div
      class="mb-1 mt-3 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/65 first:mt-0"
      aria-hidden="true"
    >
      {item.section}
    </div>
  {/if}

  <button
    type="button"
    disabled={item.disabled}
    aria-label={collapsed ? collapsedLabel : undefined}
    aria-current={active ? "page" : undefined}
    aria-expanded={hasChildren ? expanded : undefined}
    aria-controls={hasChildren ? `sidebar-children-${item.id}` : undefined}
    aria-haspopup={hasChildren ? "menu" : undefined}
    title={collapsed ? collapsedLabel : undefined}
    onclick={handleClick}
    class={cn(
      "group/sidebar-item relative flex min-h-10 w-full items-center gap-2.5 rounded-lg text-left text-[13px] leading-5 transition-[background-color,color,box-shadow] duration-150 motion-reduce:transition-none outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-45",
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
        aria-hidden="true"
      />
    {:else if Icon}
      <Icon
        class={cn(
          "size-4 shrink-0",
          active ? "text-primary" : "text-muted-foreground/80",
        )}
        aria-hidden="true"
      />
    {:else if hasChildren}
      <span
        class="size-1.5 shrink-0 rounded-full bg-current opacity-50"
        aria-hidden="true"
      ></span>
    {/if}

    {#if !collapsed}
      <span class="min-w-0 flex-1 truncate">{item.label}</span>
      {#if item.shortcut}
        <kbd class="shrink-0 text-[10px] font-normal text-muted-foreground/65"
          >{item.shortcut}</kbd
        >
      {/if}
      {#if item.badge !== undefined}
        <span
          class={cn(
            "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium tabular-nums",
            badgeToneClass(item.badgeTone),
          )}
        >
          {item.badge}
        </span>
      {/if}
      {#if item.external}
        <ExternalLink
          class="size-3 shrink-0 text-muted-foreground/65"
          aria-hidden="true"
        />
      {/if}
    {/if}

    {#if active}
      <span
        class="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-primary"
        aria-hidden="true"
      ></span>
    {/if}
  </button>

  {#if hasChildren && expanded && !collapsed}
    <div
      id={`sidebar-children-${item.id}`}
      role="group"
      aria-label={`${item.label} submenu`}
      class="mt-1 space-y-0.5 border-l border-border/70 pl-2"
    >
      {#each visibleChildren as child, childIndex (child.id)}
        <SidebarNavItem
          item={child}
          depth={depth + 1}
          {collapsed}
          {activeId}
          {expandedIds}
          {onToggle}
          {onNavigate}
          {filterItem}
          showSection={childIndex === 0 ||
            child.section !== visibleChildren[childIndex - 1]?.section}
        />
      {/each}
    </div>
  {/if}
</div>
