<script lang="ts">
  import { cn } from "$lib/utils.js";
  import type { Snippet } from "svelte";
  import {
    setCommandContext,
    computeCommandScore,
    type CommandContext,
    type CommandFilteredState,
    type CommandGroupData,
    type CommandItemData,
  } from "./command-context.svelte.js";
  import { SvelteMap, SvelteSet } from "svelte/reactivity";

  export type CommandRootApi = {
    setValue: (v: string) => void;
    getValidItems: () => HTMLElement[];
    filter: (value: string, search: string, keywords?: string[]) => number;
  };

  let {
    api = $bindable(null),
    ref = $bindable(null),
    value = $bindable(""),
    class: className,
    label,
    shouldFilter = true,
    filter = computeCommandScore,
    loop = true,
    vimBindings = true,
    disablePointerSelection = false,
    children,
    ...restProps
  }: {
    api?: CommandRootApi | null;
    ref?: HTMLElement | null;
    value?: string;
    class?: string;
    label?: string;
    shouldFilter?: boolean;
    filter?: (value: string, search: string, keywords?: string[]) => number;
    loop?: boolean;
    vimBindings?: boolean;
    disablePointerSelection?: boolean;
    children?: Snippet;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- restProps bag spread onto the root element; arbitrary HTML attributes pass through unchanged
    [key: string]: any;
  } = $props();

  let search = $state("");
  let selectedIndex = $state(0);
  let key = $state(0);

  const items = new SvelteMap<string, CommandItemData>();
  const groups = new SvelteMap<string, CommandGroupData>();
  const groupItems = new SvelteMap<string, Set<string>>();
  let inputNode: HTMLElement | null = $state(null);
  let viewportNode: HTMLElement | null = $state(null);

  function recomputeFiltered(): CommandFilteredState {
    const filteredItems = new SvelteMap<string, number>();
    const visibleGroups = new SvelteSet<string>();

    if (!shouldFilter || search === "") {
      for (const [val] of items) filteredItems.set(val, 1);
      for (const [val] of groups) visibleGroups.add(val);
    } else {
      for (const [val, data] of items) {
        if (data.forceMount) {
          filteredItems.set(val, 1);
          continue;
        }
        const score = filter(val, search, data.keywords);
        if (score > 0) filteredItems.set(val, score);
      }
      for (const [groupVal, members] of groupItems) {
        let hasVisible = false;
        for (const memberVal of members) {
          if (filteredItems.has(memberVal)) {
            hasVisible = true;
            break;
          }
        }
        if (hasVisible || groups.get(groupVal)?.forceMount) {
          visibleGroups.add(groupVal);
        }
      }
    }

    return {
      count: filteredItems.size,
      items: filteredItems,
      groups: visibleGroups,
    };
  }

  let filtered = $derived(recomputeFiltered());

  $effect(() => {
    const _ = [search, items.size, groups.size, key];
    filtered = recomputeFiltered();
  });

  const ctx: CommandContext = $derived({
    search,
    setSearch: (v: string) => {
      search = v;
    },
    value,
    setValue: (v: string) => {
      value = v;
    },
    shouldFilter,
    filter,
    loop,
    inputNode,
    setInputNode: (el: HTMLElement | null) => {
      inputNode = el;
    },
    viewportNode,
    setViewportNode: (el: HTMLElement | null) => {
      viewportNode = el;
    },
    items,
    groups,
    groupItems,
    registerItem: (data) => {
      items.set(data.value, data);
      key++;
    },
    unregisterItem: (v: string) => {
      items.delete(v);
      for (const [, members] of groupItems) members.delete(v);
      key++;
    },
    registerGroup: (data) => {
      groups.set(data.value, data);
      if (!groupItems.has(data.value)) groupItems.set(data.value, new Set());
      key++;
    },
    unregisterGroup: (v: string) => {
      groups.delete(v);
      groupItems.delete(v);
      key++;
    },
    addItemToGroup: (groupVal, itemVal) => {
      const members = groupItems.get(groupVal);
      if (members) members.add(itemVal);
    },
    removeItemFromGroup: (groupVal, itemVal) => {
      const members = groupItems.get(groupVal);
      if (members) members.delete(itemVal);
    },
    getValidItems: () => {
      const result: HTMLElement[] = [];
      for (const [, data] of items) {
        if (data.disabled) continue;
        if (filtered.items.has(data.value)) result.push(data.el);
      }
      return result;
    },
    moveSelection: (dir: 1 | -1) => {
      const valid = ctx.getValidItems();
      if (valid.length === 0) return;
      let next = selectedIndex + dir;
      if (next < 0) next = loop ? valid.length - 1 : 0;
      if (next >= valid.length) next = loop ? 0 : valid.length - 1;
      selectedIndex = next;
      const el = valid[next];
      if (el) {
        el.scrollIntoView({ block: "nearest" });
        el.focus();
      }
    },
    setSelectedIndex: (i: number) => {
      selectedIndex = i;
    },
    selectedIndex,
    filtered,
    key,
  });

  setCommandContext(ctx);

  api = {
    setValue: (v: string) => {
      value = v;
    },
    getValidItems: () => ctx.getValidItems(),
    filter,
  };

  function handleKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        ctx.moveSelection(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        ctx.moveSelection(-1);
        break;
      case "Enter":
        e.preventDefault();
        {
          const valid = ctx.getValidItems();
          const item = valid[selectedIndex];
          if (item) {
            const itemValue = item.getAttribute("data-value") ?? "";
            const itemData = items.get(itemValue);
            if (itemData?.onSelect) itemData.onSelect();
            value = itemValue;
          }
        }
        break;
      case "Home":
        if (e.isComposing) break;
        e.preventDefault();
        ctx.moveSelection(1);
        break;
      case "End":
        if (e.isComposing) break;
        e.preventDefault();
        ctx.moveSelection(-1);
        break;
      case "j":
        if (vimBindings && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          ctx.moveSelection(1);
        }
        break;
      case "k":
        if (vimBindings && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          ctx.moveSelection(-1);
        }
        break;
    }
  }
</script>

<div
  bind:this={ref}
  data-slot="command"
  role="listbox"
  aria-label={label}
  data-filtered={filtered.count > 0}
  class={cn(
    "rounded-xl! bg-popover p-1 text-popover-foreground flex size-full flex-col overflow-hidden",
    className,
  )}
  onkeydown={handleKeydown}
  {...restProps}
>
  {@render children?.()}
</div>
