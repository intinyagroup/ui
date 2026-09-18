<script lang="ts">
  import FileIcon from "./FileIcon.svelte";
  import {
    formatFileSize,
    formatDate,
    type FileItem,
    type SortConfig,
    type SortField,
  } from "../file-model.js";
  import { ArrowUp, ArrowDown } from "lucide-svelte";

  let {
    items = [],
    selectedIds = new Set<string>(),
    sort = { field: "name", direction: "asc" },
    onItemClick,
    onItemDoubleClick,
    onToggleSelect,
    onSelectAll,
    onSortChange,
  }: {
    items: FileItem[];
    selectedIds: Set<string>;
    sort: SortConfig;
    onItemClick: (item: FileItem) => void;
    onItemDoubleClick: (item: FileItem) => void;
    onToggleSelect: (id: string, e: MouseEvent) => void;
    onSelectAll: () => void;
    onSortChange: (field: SortField) => void;
  } = $props();

  const isAllSelected = $derived(
    items.length > 0 && items.every((i) => selectedIds.has(i.id)),
  );
  const isIndeterminate = $derived(
    !isAllSelected && items.some((i) => selectedIds.has(i.id)),
  );

  function formatDateDisplay(d?: string | Date): string {
    if (!d) return "-";
    const dateObj = typeof d === "string" ? new Date(d) : d;
    return isNaN(dateObj.getTime())
      ? String(d)
      : dateObj.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  }
</script>

<div class="w-full overflow-x-auto select-none" data-slot="file-view-list">
  <table class="w-full border-collapse text-left text-xs">
    <thead
      class="bg-[var(--ui-muted)]/50 border-b border-[var(--ui-border)] text-[var(--ui-muted-foreground)] font-semibold"
    >
      <tr>
        <th class="w-10 px-3 py-2.5 text-center">
          <input
            type="checkbox"
            class="rounded border-[var(--ui-border)] text-[var(--ui-primary)] size-3.5 cursor-pointer"
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onchange={onSelectAll}
            aria-label="Select all items"
          />
        </th>
        <th
          class="px-3.5 py-2.5 cursor-pointer hover:text-[var(--ui-foreground)] transition-colors"
          onclick={() => onSortChange("name")}
        >
          <div class="inline-flex items-center gap-1">
            <span>Name</span>
            {#if sort.field === "name"}
              {#if sort.direction === "asc"}
                <ArrowUp class="size-3" />
              {:else}
                <ArrowDown class="size-3" />
              {/if}
            {/if}
          </div>
        </th>
        <th
          class="w-28 px-3.5 py-2.5 cursor-pointer hover:text-[var(--ui-foreground)] transition-colors"
          onclick={() => onSortChange("size")}
        >
          <div class="inline-flex items-center gap-1">
            <span>Size</span>
            {#if sort.field === "size"}
              {#if sort.direction === "asc"}
                <ArrowUp class="size-3" />
              {:else}
                <ArrowDown class="size-3" />
              {/if}
            {/if}
          </div>
        </th>
        <th
          class="w-28 px-3.5 py-2.5 cursor-pointer hover:text-[var(--ui-foreground)] transition-colors"
          onclick={() => onSortChange("type")}
        >
          <div class="inline-flex items-center gap-1">
            <span>Type</span>
            {#if sort.field === "type"}
              {#if sort.direction === "asc"}
                <ArrowUp class="size-3" />
              {:else}
                <ArrowDown class="size-3" />
              {/if}
            {/if}
          </div>
        </th>
        <th
          class="w-36 px-3.5 py-2.5 cursor-pointer hover:text-[var(--ui-foreground)] transition-colors"
          onclick={() => onSortChange("updatedAt")}
        >
          <div class="inline-flex items-center gap-1">
            <span>Modified</span>
            {#if sort.field === "updatedAt"}
              {#if sort.direction === "asc"}
                <ArrowUp class="size-3" />
              {:else}
                <ArrowDown class="size-3" />
              {/if}
            {/if}
          </div>
        </th>
      </tr>
    </thead>

    <tbody
      class="divide-y divide-[var(--ui-border)]/50 bg-[var(--ui-background)]"
    >
      {#if items.length === 0}
        <tr>
          <td
            colspan={5}
            class="py-16 text-center text-xs text-[var(--ui-muted-foreground)]"
          >
            This folder is empty.
          </td>
        </tr>
      {:else}
        {#each items as item (item.id)}
          {@const isSelected = selectedIds.has(item.id)}

          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <tr
            class="group/row transition-colors cursor-pointer {isSelected
              ? 'bg-[var(--ui-primary)]/8'
              : 'hover:bg-[var(--ui-muted)]/40'}"
            onclick={() => onItemClick(item)}
            ondblclick={() => onItemDoubleClick(item)}
          >
            <td
              class="w-10 px-3 py-2 text-center"
              onclick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                class="rounded border-[var(--ui-border)] text-[var(--ui-primary)] size-3.5 cursor-pointer"
                checked={isSelected}
                onclick={(e) => onToggleSelect(item.id, e)}
                aria-label={`Select ${item.name}`}
              />
            </td>
            <td class="px-3.5 py-2">
              <div class="flex items-center gap-2">
                <FileIcon
                  type={item.type}
                  name={item.name}
                  mimeType={item.mimeType}
                  class="size-4 shrink-0"
                />
                <span
                  class="truncate font-medium text-[var(--ui-foreground)]"
                  title={item.name}>{item.name}</span
                >
              </div>
            </td>
            <td class="px-3.5 py-2 text-[var(--ui-muted-foreground)]">
              {item.type === "folder" ? "-" : formatFileSize(item.size)}
            </td>
            <td class="px-3.5 py-2 text-[var(--ui-muted-foreground)]">
              {item.type === "folder"
                ? "Folder"
                : item.extension
                  ? item.extension.toUpperCase() + " File"
                  : "File"}
            </td>
            <td class="px-3.5 py-2 text-[var(--ui-muted-foreground)]">
              {formatDateDisplay(item.updatedAt)}
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>
