<script lang="ts">
  import {
    Folder,
    FolderOpen,
    ChevronRight,
    ChevronDown,
    HardDrive,
  } from "lucide-svelte";
  import { getChildrenInFolder, type FileItem } from "../file-model.js";

  let {
    items = [],
    currentFolderId = null,
    onNavigate,
  }: {
    items: FileItem[];
    currentFolderId: string | null;
    onNavigate: (folderId: string | null) => void;
  } = $props();

  let expandedFolders = $state<Set<string>>(new Set<string>());

  function toggleFolder(id: string, e: MouseEvent) {
    e.stopPropagation();
    const next = new Set(expandedFolders);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    expandedFolders = next;
  }

  function handleSelect(id: string | null) {
    onNavigate(id);
    if (id) {
      const next = new Set(expandedFolders);
      next.add(id);
      expandedFolders = next;
    }
  }

  const rootFolders = $derived(
    getChildrenInFolder(items, null).filter((i) => i.type === "folder"),
  );
</script>

{#snippet renderFolderNode(folder: FileItem, level = 0)}
  {@const childFolders = getChildrenInFolder(items, folder.id).filter(
    (i) => i.type === "folder",
  )}
  {@const hasChildren = childFolders.length > 0}
  {@const isExpanded = expandedFolders.has(folder.id)}
  {@const isSelected = currentFolderId === folder.id}

  <div class="flex flex-col">
    <!-- Folder Row -->
    <div
      class="group/item flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors {isSelected
        ? 'bg-[var(--ui-primary)]/12 text-[var(--ui-primary)] font-medium'
        : 'text-[var(--ui-foreground)] hover:bg-[var(--ui-muted)]/60'}"
      style="padding-left: {level * 1 + 0.5}rem"
      onclick={() => handleSelect(folder.id)}
      onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelect(folder.id);
        }
      }}
      role="treeitem"
      tabindex="0"
      aria-selected={isSelected}
      aria-expanded={hasChildren ? isExpanded : undefined}
    >
      <!-- Expand chevron -->
      {#if hasChildren}
        <button
          type="button"
          class="p-0.5 rounded text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] transition-colors"
          onclick={(e) => toggleFolder(folder.id, e)}
          aria-label={isExpanded ? "Collapse folder" : "Expand folder"}
        >
          {#if isExpanded}
            <ChevronDown class="size-3.5" />
          {:else}
            <ChevronRight class="size-3.5" />
          {/if}
        </button>
      {:else}
        <span class="size-4 shrink-0"></span>
      {/if}

      <!-- Folder Icon -->
      {#if isExpanded}
        <FolderOpen class="size-4 shrink-0 text-amber-500 fill-amber-500/20" />
      {:else}
        <Folder class="size-4 shrink-0 text-amber-500 fill-amber-500/20" />
      {/if}

      <!-- Folder Name -->
      <span class="truncate flex-1">{folder.name}</span>
    </div>

    <!-- Children -->
    {#if hasChildren && isExpanded}
      <div class="flex flex-col">
        {#each childFolders as child (child.id)}
          {@render renderFolderNode(child, level + 1)}
        {/each}
      </div>
    {/if}
  </div>
{/snippet}

<div
  class="flex flex-col w-56 shrink-0 border-r border-[var(--ui-border)]/60 bg-[var(--ui-card)] p-2 select-none overflow-y-auto"
  role="tree"
  aria-label="Folder Navigation Tree"
>
  <!-- Root Drive / Home -->
  <div
    class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors mb-1 {currentFolderId ===
    null
      ? 'bg-[var(--ui-primary)]/12 text-[var(--ui-primary)] font-semibold'
      : 'text-[var(--ui-foreground)] hover:bg-[var(--ui-muted)]/60'}"
    onclick={() => handleSelect(null)}
    onkeydown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect(null);
      }
    }}
    role="treeitem"
    tabindex="0"
    aria-selected={currentFolderId === null}
  >
    <HardDrive class="size-4 shrink-0 text-[var(--ui-primary)]" />
    <span class="truncate font-medium">All Files</span>
  </div>

  {#each rootFolders as folder (folder.id)}
    {@render renderFolderNode(folder, 0)}
  {/each}
</div>
