<script lang="ts" generics="TData extends Record<string, any>">
  import {
    flatToTree,
    treeToFlat,
    filterTree,
    sortTree,
    cascadeSelect,
    type TreeNode,
    type FlatTreeRow,
  } from "@intinyagroup/grid-core";
  import {
    ChevronRight,
    Loader2,
    Search,
    ChevronDown,
    Folder,
    FolderOpen,
    FileText,
  } from "lucide-svelte";
  import type { Snippet } from "svelte";
  import { untrack } from "svelte";

  export interface TreeGridColumn<T> {
    id: string;
    header: string;
    accessorKey?: keyof T;
    width?: string | number;
    cell?: (row: T) => string | number | unknown;
    align?: "left" | "center" | "right";
    treeColumn?: boolean;
  }

  let {
    data = [],
    columns = [],
    idKey = "id",
    parentKey = "parentId",
    childrenKey = "children",
    title = "",
    searchable = true,
    selectable = false,
    defaultExpanded = false,
    density = "spacious",
    class: className = "",
    selectedIds = new Set<string>(),
    loadChildren,
    onRowClick,
    onSelectionChange,
    onExpandedChange,
    cell: customCellSnippet,
  }: {
    data: TData[];
    columns: TreeGridColumn<TData>[];
    idKey?: string;
    parentKey?: string;
    childrenKey?: string;
    title?: string;
    searchable?: boolean;
    selectable?: boolean;
    defaultExpanded?: boolean | string[];
    density?: "compact" | "spacious";
    class?: string;
    selectedIds?: Set<string>;
    loadChildren?: (row: TData) => Promise<TData[]>;
    onRowClick?: (row: TData) => void;
    onSelectionChange?: (
      selected: Set<string>,
      meta: { indeterminate: Set<string> },
    ) => void;
    onExpandedChange?: (expanded: Set<string>) => void;
    cell?: Snippet<
      [{ row: TData; column: TreeGridColumn<TData>; value: unknown }]
    >;
  } = $props();

  // Internal expansion and loading state
  const initialExpanded = untrack(() => {
    if (Array.isArray(defaultExpanded)) return new Set(defaultExpanded);
    if (defaultExpanded === true) {
      return new Set(data.map((d) => String(d[idKey])));
    }
    return new Set<string>();
  });

  let expanded = $state<Set<string>>(initialExpanded);
  let loadingNodes = $state<Set<string>>(new Set<string>());
  let searchQuery = $state("");
  let internalSelected = $state<Set<string>>(new Set(selectedIds));
  let indeterminateSet = $state<Set<string>>(new Set<string>());

  // Sync external selectedIds if provided
  $effect(() => {
    internalSelected = new Set(selectedIds);
  });

  // Convert incoming flat or hierarchical data to canonical TreeNode structure
  const rawTree = $derived.by<TreeNode<TData>[]>(() => {
    if (!data || data.length === 0) return [];
    // If first item has explicit children array, treat as pre-structured tree
    const isHierarchical =
      childrenKey in data[0] && Array.isArray(data[0][childrenKey]);
    if (isHierarchical) {
      function normalize(nodes: TData[], level = 0): TreeNode<TData>[] {
        return nodes.map((n) => {
          const children = (n[childrenKey] as TData[] | undefined) ?? [];
          return {
            ...n,
            id: String(n[idKey]),
            parentId: n[parentKey] ? String(n[parentKey]) : null,
            level,
            hasChildren: children.length > 0 || Boolean(n.hasChildren),
            children: normalize(children, level + 1),
          };
        });
      }
      return normalize(data);
    }
    // Otherwise, treat as flat self-referencing list
    return flatToTree(data, { idKey, parentKey });
  });

  // Filter tree when search query exists
  const processedTree = $derived.by<TreeNode<TData>[]>(() => {
    if (!searchQuery.trim()) return rawTree;
    const q = searchQuery.toLowerCase();
    return filterTree(rawTree, (node) => {
      return Object.values(node).some(
        (v) => typeof v === "string" && v.toLowerCase().includes(q),
      );
    });
  });

  // Visible rows flattened according to expansion state
  const visibleRows = $derived(
    treeToFlat(processedTree, expanded, loadingNodes),
  );

  async function toggleExpand(node: FlatTreeRow<TData>, e: MouseEvent) {
    e.stopPropagation();
    const next = new Set(expanded);
    const nodeId = node.id;

    if (next.has(nodeId)) {
      next.delete(nodeId);
      expanded = next;
      onExpandedChange?.(next);
      return;
    }

    // Expanding
    next.add(nodeId);
    expanded = next;
    onExpandedChange?.(next);

    // If lazy loading is enabled and children aren't populated yet
    if (
      loadChildren &&
      node.hasChildren &&
      (!node.children || node.children.length === 0)
    ) {
      const nextLoading = new Set(loadingNodes);
      nextLoading.add(nodeId);
      loadingNodes = nextLoading;

      try {
        const loadedChildren = await loadChildren(node);
        if (loadedChildren && loadedChildren.length > 0) {
          // Attach children directly to node
          node.children = loadedChildren.map((c) => ({
            ...c,
            id: String(c[idKey]),
            parentId: nodeId,
            level: node.level + 1,
            hasChildren:
              Array.isArray(c[childrenKey]) && c[childrenKey].length > 0,
            children: [],
          }));
        }
      } catch (err) {
        console.error(`Failed to load child nodes for ${nodeId}`, err);
      } finally {
        const finishedLoading = new Set(loadingNodes);
        finishedLoading.delete(nodeId);
        loadingNodes = finishedLoading;
      }
    }
  }

  function handleSelectToggle(node: FlatTreeRow<TData>, e: MouseEvent) {
    e.stopPropagation();
    const isCurrentlyChecked = internalSelected.has(node.id);
    const targetState = !isCurrentlyChecked;

    const res = cascadeSelect(
      processedTree,
      internalSelected,
      node.id,
      targetState,
    );
    internalSelected = res.selected;
    indeterminateSet = res.indeterminate;
    onSelectionChange?.(res.selected, { indeterminate: res.indeterminate });
  }

  function handleSelectAll() {
    const allIds = visibleRows.map((r) => r.id);
    const isAllSelected = allIds.every((id) => internalSelected.has(id));

    if (isAllSelected) {
      internalSelected = new Set();
      indeterminateSet = new Set();
    } else {
      internalSelected = new Set(allIds);
      indeterminateSet = new Set();
    }

    onSelectionChange?.(internalSelected, { indeterminate: indeterminateSet });
  }

  const isAllChecked = $derived(
    visibleRows.length > 0 &&
      visibleRows.every((r) => internalSelected.has(r.id)),
  );
  const isAllIndeterminate = $derived(
    !isAllChecked &&
      visibleRows.some(
        (r) => internalSelected.has(r.id) || indeterminateSet.has(r.id),
      ),
  );
</script>

<div
  class="flex flex-col w-full rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-card)] shadow-xs overflow-hidden {className}"
  data-slot="tree-grid"
>
  <!-- Toolbar Header -->
  {#if title || searchable}
    <div
      class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[var(--ui-border)]/60 bg-[var(--ui-background)]"
    >
      <div class="flex items-center gap-2.5">
        {#if title}
          <h3 class="text-sm font-semibold text-[var(--ui-foreground)]">
            {title}
          </h3>
        {/if}
        <span class="text-xs text-[var(--ui-muted-foreground)]">
          ({visibleRows.length}
          {visibleRows.length === 1 ? "row" : "rows"})
        </span>
      </div>

      {#if searchable}
        <div class="relative w-64 max-w-full">
          <Search
            class="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[var(--ui-muted-foreground)] pointer-events-none"
          />
          <input
            type="search"
            class="h-8 w-full pl-8 pr-3 text-xs rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)] text-[var(--ui-foreground)] outline-none focus:ring-2 focus:ring-[var(--ui-primary)]/40 placeholder:text-[var(--ui-muted-foreground)]"
            placeholder="Search hierarchy..."
            bind:value={searchQuery}
            aria-label="Search tree grid"
          />
        </div>
      {/if}
    </div>
  {/if}

  <!-- Grid Table Scroll Container -->
  <div class="w-full overflow-x-auto">
    <table
      class="w-full border-collapse text-left text-xs"
      aria-label={title || "Tree grid"}
    >
      <!-- Table Header -->
      <thead
        class="bg-[var(--ui-muted)]/50 border-b border-[var(--ui-border)] text-[var(--ui-muted-foreground)] uppercase tracking-wider font-semibold"
      >
        <tr>
          {#if selectable}
            <th class="w-10 px-3 py-2.5 text-center">
              <input
                type="checkbox"
                class="rounded border-[var(--ui-border)] text-[var(--ui-primary)] focus:ring-[var(--ui-primary)]/40 size-3.5 cursor-pointer"
                checked={isAllChecked}
                indeterminate={isAllIndeterminate}
                onchange={handleSelectAll}
                aria-label="Select all rows"
              />
            </th>
          {/if}

          {#each columns as col, idx}
            <th
              class="px-3.5 py-2.5 select-none"
              style={col.width
                ? `width: ${typeof col.width === "number" ? col.width + "px" : col.width}`
                : undefined}
            >
              {col.header}
            </th>
          {/each}
        </tr>
      </thead>

      <!-- Table Body -->
      <tbody
        class="divide-y divide-[var(--ui-border)]/50 bg-[var(--ui-background)]"
      >
        {#if visibleRows.length === 0}
          <tr>
            <td
              colspan={columns.length + (selectable ? 1 : 0)}
              class="py-10 text-center text-[var(--ui-muted-foreground)]"
            >
              No items match your criteria.
            </td>
          </tr>
        {:else}
          {#each visibleRows as row, rowIndex (row.id)}
            {@const isSelected = internalSelected.has(row.id)}
            {@const isIndeterminate = indeterminateSet.has(row.id)}

            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <tr
              class="group/row transition-colors cursor-pointer {isSelected
                ? 'bg-[var(--ui-primary)]/8'
                : 'hover:bg-[var(--ui-muted)]/40'} {density === 'compact'
                ? 'h-9'
                : 'h-11'}"
              aria-level={row.level + 1}
              aria-expanded={row.hasChildren ? row.isExpanded : undefined}
              onclick={() => onRowClick?.(row)}
            >
              <!-- Selectable Checkbox -->
              {#if selectable}
                <td
                  class="w-10 px-3 text-center"
                  onclick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    class="rounded border-[var(--ui-border)] text-[var(--ui-primary)] focus:ring-[var(--ui-primary)]/40 size-3.5 cursor-pointer"
                    checked={isSelected}
                    indeterminate={isIndeterminate}
                    onclick={(e) => handleSelectToggle(row, e)}
                    aria-label={`Select ${row[columns[0]?.accessorKey ?? "id"] || row.id}`}
                  />
                </td>
              {/if}

              <!-- Data Cells -->
              {#each columns as col, colIdx}
                {@const isTreeColumn = col.treeColumn ?? colIdx === 0}
                {@const rawValue = col.cell
                  ? col.cell(row)
                  : col.accessorKey
                    ? row[col.accessorKey]
                    : ""}

                <td
                  class="px-3.5 py-1.5 text-[var(--ui-foreground)]"
                  style={col.align ? `text-align: ${col.align}` : undefined}
                >
                  {#if isTreeColumn}
                    <div
                      class="flex items-center gap-1.5"
                      style="padding-left: {row.level * 1.5}rem"
                    >
                      <!-- Expand / Collapse chevron or leaf bullet -->
                      {#if row.hasChildren}
                        <button
                          type="button"
                          class="p-1 rounded-md text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-muted)] transition-all shrink-0"
                          onclick={(e) => toggleExpand(row, e)}
                          aria-label={row.isExpanded
                            ? "Collapse branch"
                            : "Expand branch"}
                        >
                          {#if row.isLoading}
                            <Loader2
                              class="size-3.5 animate-spin text-[var(--ui-primary)]"
                            />
                          {:else if row.isExpanded}
                            <ChevronDown class="size-3.5" />
                          {:else}
                            <ChevronRight class="size-3.5" />
                          {/if}
                        </button>
                      {:else}
                        <span
                          class="size-5.5 inline-flex items-center justify-center shrink-0"
                        >
                          <span
                            class="size-1 rounded-full bg-[var(--ui-muted-foreground)]/40"
                          ></span>
                        </span>
                      {/if}

                      <!-- Content -->
                      <div class="truncate">
                        {#if customCellSnippet}
                          {@render customCellSnippet({
                            row,
                            column: col,
                            value: rawValue,
                          })}
                        {:else}
                          {String(rawValue ?? "")}
                        {/if}
                      </div>
                    </div>
                  {:else}
                    <div class="truncate">
                      {#if customCellSnippet}
                        {@render customCellSnippet({
                          row,
                          column: col,
                          value: rawValue,
                        })}
                      {:else}
                        {String(rawValue ?? "")}
                      {/if}
                    </div>
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>
