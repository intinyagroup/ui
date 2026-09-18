<script lang="ts" module>
  export type DropdownTreeNode = {
    value: string;
    label: string;
    children?: DropdownTreeNode[];
    disabled?: boolean;
    hidden?: boolean;
    expanded?: boolean;
  };
</script>

<script lang="ts">
  import { tick } from "svelte";
  import { cn } from "$lib/utils.js";

  type Props = {
    options?: DropdownTreeNode[];
    data?: DropdownTreeNode[];
    value?: string | string[];
    multiple?: boolean;
    disabled?: boolean;
    placeholder?: string;
    class?: string;
    ariaLabel?: string;
    onChange?: (value: string | string[]) => void;
    onSelect?: (node: DropdownTreeNode, path: DropdownTreeNode[]) => void;
    onExpand?: (node: DropdownTreeNode, expanded: boolean) => void;
    children?: import("svelte").Snippet<[node: DropdownTreeNode]>;
  };

  let {
    options,
    data,
    value = $bindable(""),
    multiple = false,
    disabled = false,
    placeholder = "Select...",
    class: className,
    ariaLabel = "Dropdown tree",
    onChange,
    onSelect,
    onExpand,
    children,
  }: Props = $props();

  let open = $state(false);
  let activeIndex = $state(-1);
  let expandedValues = $state(new Set<string>());
  let query = $state("");
  let queryTimer: ReturnType<typeof setTimeout> | undefined;
  let rootRef = $state<HTMLDivElement | null>(null);

  let roots = $derived(options ?? data ?? []);
  let selectedValues = $derived(
    new Set(
      multiple
        ? Array.isArray(value)
          ? value
          : []
        : typeof value === "string" && value
          ? [value]
          : [],
    ),
  );

  function findNodePath(
    nodes: DropdownTreeNode[],
    targetValue: string,
    currentPath: DropdownTreeNode[] = [],
  ): DropdownTreeNode[] | null {
    for (const node of nodes) {
      const nextPath = [...currentPath, node];
      if (node.value === targetValue) return nextPath;
      if (node.children?.length) {
        const found = findNodePath(node.children, targetValue, nextPath);
        if (found) return found;
      }
    }
    return null;
  }

  let flatNodes = $derived.by(() => {
    const result: {
      node: DropdownTreeNode;
      parent?: DropdownTreeNode;
      path: DropdownTreeNode[];
      level: number;
    }[] = [];

    function visit(
      nodes: DropdownTreeNode[],
      path: DropdownTreeNode[],
      level: number,
      parent?: DropdownTreeNode,
    ) {
      for (const node of nodes) {
        if (node.hidden) continue;
        const nextPath = [...path, node];
        result.push({ node, parent, path: nextPath, level });
        if (node.children?.length && expandedValues.has(node.value)) {
          visit(node.children, nextPath, level + 1, node);
        }
      }
    }

    visit(roots, [], 1);
    return result;
  });

  let activeEntry = $derived(
    activeIndex >= 0 ? flatNodes[activeIndex] : undefined,
  );

  let selectedLabel = $derived.by(() => {
    if (multiple) {
      const count = selectedValues.size;
      return count > 0 ? `${count} selected` : "";
    }
    const val = typeof value === "string" ? value : "";
    if (!val) return "";
    const path = findNodePath(roots, val);
    return path ? path.map((node) => node.label).join(" / ") : "";
  });

  function initializeExpanded(nodes: DropdownTreeNode[]) {
    const next = new Set<string>();
    function visit(items: DropdownTreeNode[]) {
      for (const node of items) {
        if (node.expanded) next.add(node.value);
        if (node.children) visit(node.children);
      }
    }
    visit(nodes);
    expandedValues = next;
  }

  $effect(() => {
    initializeExpanded(roots);
  });

  $effect(() => {
    if (activeIndex >= flatNodes.length) {
      activeIndex = flatNodes.length ? 0 : -1;
    }
  });

  function handleClickOutside(event: MouseEvent) {
    if (rootRef && !rootRef.contains(event.target as Node)) {
      open = false;
      query = "";
    }
  }

  $effect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  });

  function isSelected(node: DropdownTreeNode) {
    return selectedValues.has(node.value);
  }

  function isExpanded(node: DropdownTreeNode) {
    return expandedValues.has(node.value);
  }

  function toggleExpanded(node: DropdownTreeNode, force?: boolean) {
    if (!node.children?.length) return;
    const expanded = force ?? !isExpanded(node);
    const next = new Set(expandedValues);
    if (expanded) next.add(node.value);
    else next.delete(node.value);
    expandedValues = next;
    onExpand?.(node, expanded);
  }

  function selectEntry(entry: (typeof flatNodes)[number]) {
    if (disabled || entry.node.disabled) return;
    let next: string | string[];
    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      next = isSelected(entry.node)
        ? current.filter((item) => item !== entry.node.value)
        : [...current, entry.node.value];
    } else {
      next = entry.node.value;
    }
    value = next;
    onChange?.(next);
    onSelect?.(entry.node, entry.path);
    if (!multiple) {
      open = false;
    }
  }

  function setActive(index: number) {
    if (
      index < 0 ||
      index >= flatNodes.length ||
      flatNodes[index].node.disabled
    ) {
      return;
    }
    activeIndex = index;
    tick().then(() =>
      rootRef
        ?.querySelector(`[data-index="${index}"]`)
        ?.scrollIntoView?.({ block: "nearest" }),
    );
  }

  function moveActive(direction: number) {
    if (!flatNodes.length) return;
    let index =
      activeIndex < 0
        ? direction > 0
          ? 0
          : flatNodes.length - 1
        : activeIndex + direction;

    for (let count = 0; count < flatNodes.length; count++) {
      index = (index + flatNodes.length) % flatNodes.length;
      if (!flatNodes[index].node.disabled) return setActive(index);
      index += direction;
    }
  }

  function openMenu() {
    if (disabled) return;
    open = true;
    if (activeIndex < 0) {
      const selectedIndex = flatNodes.findIndex(
        (entry) => isSelected(entry.node) && !entry.node.disabled,
      );
      if (selectedIndex >= 0) {
        setActive(selectedIndex);
      } else {
        const firstEnabledIndex = flatNodes.findIndex(
          (entry) => !entry.node.disabled,
        );
        if (firstEnabledIndex >= 0) setActive(firstEnabledIndex);
      }
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (disabled) return;
    if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      openMenu();
      return;
    }
    if (!open) return;

    const entry = activeEntry;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveActive(-1);
        break;
      case "Home":
        event.preventDefault();
        setActive(flatNodes.findIndex((item) => !item.node.disabled));
        break;
      case "End":
        event.preventDefault();
        for (let index = flatNodes.length - 1; index >= 0; index--) {
          if (!flatNodes[index].node.disabled) {
            setActive(index);
            break;
          }
        }
        break;
      case "ArrowRight":
        event.preventDefault();
        if (entry?.node.children?.length && !isExpanded(entry.node)) {
          toggleExpanded(entry.node, true);
        } else if (entry?.node.children?.length) {
          moveActive(1);
        }
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (entry?.node.children?.length && isExpanded(entry.node)) {
          toggleExpanded(entry.node, false);
        } else if (entry?.parent) {
          const parentIndex = flatNodes.findIndex(
            (item) => item.node.value === entry.parent?.value,
          );
          if (parentIndex >= 0) setActive(parentIndex);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (entry) selectEntry(entry);
        break;
      case "Escape":
        event.preventDefault();
        open = false;
        query = "";
        break;
      case "Tab":
        open = false;
        query = "";
        break;
      default:
        if (
          event.key.length !== 1 ||
          event.ctrlKey ||
          event.metaKey ||
          event.altKey
        ) {
          return;
        }
        query += event.key.toLocaleLowerCase();
        clearTimeout(queryTimer);
        queryTimer = setTimeout(() => (query = ""), 500);
        const start = activeIndex < 0 ? 0 : activeIndex + 1;
        const match = [
          ...flatNodes.slice(start),
          ...flatNodes.slice(0, start),
        ].findIndex(
          (item) =>
            !item.node.disabled &&
            item.node.label.toLocaleLowerCase().startsWith(query),
        );
        if (match >= 0) setActive((start + match) % flatNodes.length);
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={cn("relative w-full", className)}
  bind:this={rootRef}
  onkeydown={handleKeydown}
>
  <button
    type="button"
    class="flex min-h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-left text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    aria-haspopup="tree"
    aria-expanded={open}
    aria-label={ariaLabel}
    {disabled}
    onclick={() => (open ? (open = false) : openMenu())}
  >
    <span class={cn("truncate", !selectedLabel && "text-muted-foreground")}>
      {selectedLabel || placeholder}
    </span>
    <span aria-hidden="true" class="text-xs text-muted-foreground">▾</span>
  </button>

  {#if open}
    <div
      class="absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
      role="tree"
      aria-label={ariaLabel}
      aria-multiselectable={multiple}
    >
      {#if !flatNodes.length}
        <div class="px-2 py-6 text-center text-sm text-muted-foreground">
          No options
        </div>
      {/if}
      {#each flatNodes as entry, index (entry.node.value)}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
          role="treeitem"
          data-index={index}
          aria-level={entry.level}
          aria-selected={isSelected(entry.node)}
          aria-disabled={entry.node.disabled}
          aria-expanded={entry.node.children?.length
            ? isExpanded(entry.node)
            : undefined}
          tabindex={-1}
          class={cn(
            "flex cursor-pointer items-center gap-1 rounded-sm py-1.5 pr-2 text-sm outline-none select-none transition-colors",
            activeIndex === index && "bg-accent text-accent-foreground",
            entry.node.disabled && "pointer-events-none opacity-50",
            isSelected(entry.node) && "font-medium",
          )}
          style={`padding-left: ${0.5 + (entry.level - 1) * 1.25}rem`}
          onclick={() => selectEntry(entry)}
          ondblclick={() => toggleExpanded(entry.node)}
          onmouseenter={() => !entry.node.disabled && setActive(index)}
        >
          {#if entry.node.children?.length}
            <button
              type="button"
              tabindex={-1}
              class="mr-1 flex size-4 shrink-0 items-center justify-center rounded-sm text-xs hover:bg-muted"
              aria-label={isExpanded(entry.node)
                ? `Collapse ${entry.node.label}`
                : `Expand ${entry.node.label}`}
              onclick={(event) => {
                event.stopPropagation();
                toggleExpanded(entry.node);
              }}
            >
              {isExpanded(entry.node) ? "▾" : "▸"}
            </button>
          {:else}
            <span class="mr-1 size-4 shrink-0" aria-hidden="true"></span>
          {/if}
          <span class="min-w-0 flex-1 truncate">
            {#if children}
              {@render children(entry.node)}
            {:else}
              {entry.node.label}
            {/if}
          </span>
          {#if isSelected(entry.node)}
            <span aria-hidden="true" class="text-xs text-primary font-bold"
              >✓</span
            >
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
