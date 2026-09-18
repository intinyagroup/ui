<script lang="ts">
  import FileIcon from "./FileIcon.svelte";
  import { formatFileSize, type FileItem } from "../file-model.js";

  let {
    items = [],
    selectedIds = new Set<string>(),
    onItemClick,
    onItemDoubleClick,
    onToggleSelect,
  }: {
    items: FileItem[];
    selectedIds: Set<string>;
    onItemClick: (item: FileItem) => void;
    onItemDoubleClick: (item: FileItem) => void;
    onToggleSelect: (id: string, e: MouseEvent) => void;
  } = $props();
</script>

<div
  class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-4 select-none overflow-y-auto"
  data-slot="file-view-grid"
>
  {#if items.length === 0}
    <div
      class="col-span-full py-16 text-center text-xs text-[var(--ui-muted-foreground)]"
    >
      This folder is empty.
    </div>
  {:else}
    {#each items as item (item.id)}
      {@const isSelected = selectedIds.has(item.id)}

      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="group/card relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer {isSelected
          ? 'border-[var(--ui-primary)] bg-[var(--ui-primary)]/8 ring-1 ring-[var(--ui-primary)]'
          : 'border-[var(--ui-border)]/70 bg-[var(--ui-card)] hover:border-[var(--ui-border)] hover:bg-[var(--ui-muted)]/40 hover:shadow-xs'}"
        onclick={() => onItemClick(item)}
        ondblclick={() => onItemDoubleClick(item)}
      >
        <!-- Selection Checkbox -->
        <input
          type="checkbox"
          class="absolute top-2.5 left-2.5 rounded border-[var(--ui-border)] text-[var(--ui-primary)] size-3.5 cursor-pointer opacity-0 group-hover/card:opacity-100 transition-opacity {isSelected
            ? 'opacity-100!'
            : ''}"
          checked={isSelected}
          onclick={(e) => onToggleSelect(item.id, e)}
          aria-label={`Select ${item.name}`}
        />

        <!-- Thumbnail or Big Icon -->
        <div class="size-14 flex items-center justify-center mb-2 mt-1">
          {#if item.thumbnail}
            <img
              src={item.thumbnail}
              alt={item.name}
              class="max-h-full max-w-full object-contain rounded-md shadow-2xs"
            />
          {:else}
            <FileIcon
              type={item.type}
              name={item.name}
              mimeType={item.mimeType}
              class="size-10"
            />
          {/if}
        </div>

        <!-- File / Folder Name -->
        <span
          class="text-xs font-medium text-center text-[var(--ui-foreground)] truncate max-w-full px-1"
          title={item.name}
        >
          {item.name}
        </span>

        <!-- Secondary Info -->
        <span class="text-[10px] text-[var(--ui-muted-foreground)] mt-0.5">
          {#if item.type === "folder"}
            Folder
          {:else}
            {formatFileSize(item.size)}
          {/if}
        </span>
      </div>
    {/each}
  {/if}
</div>
