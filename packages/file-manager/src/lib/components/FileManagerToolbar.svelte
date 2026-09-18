<script lang="ts">
  import {
    FolderPlus,
    Upload,
    Trash2,
    LayoutGrid,
    List,
    Search,
    ChevronRight,
    Home,
  } from "lucide-svelte";
  import {
    buildBreadcrumbs,
    type FileItem,
    type ViewMode,
  } from "../file-model.js";

  let {
    items = [],
    currentFolderId = null,
    viewMode = "grid",
    searchQuery = "",
    selectedCount = 0,
    allowUpload = true,
    allowDelete = true,
    allowCreateFolder = true,
    onNavigate,
    onViewModeChange,
    onSearchChange,
    onCreateFolder,
    onUploadClick,
    onDeleteClick,
  }: {
    items: FileItem[];
    currentFolderId: string | null;
    viewMode: ViewMode;
    searchQuery: string;
    selectedCount: number;
    allowUpload?: boolean;
    allowDelete?: boolean;
    allowCreateFolder?: boolean;
    onNavigate: (folderId: string | null) => void;
    onViewModeChange: (mode: ViewMode) => void;
    onSearchChange: (query: string) => void;
    onCreateFolder: () => void;
    onUploadClick: () => void;
    onDeleteClick: () => void;
  } = $props();

  const breadcrumbs = $derived(buildBreadcrumbs(items, currentFolderId));
</script>

<div
  class="flex flex-col gap-2.5 p-3 border-b border-[var(--ui-border)]/60 bg-[var(--ui-background)]"
  data-slot="file-manager-toolbar"
>
  <!-- Top Row: Actions and Controls -->
  <div class="flex flex-wrap items-center justify-between gap-3">
    <!-- Primary Actions (New Folder, Upload, Delete) -->
    <div class="flex items-center gap-1.5">
      {#if allowCreateFolder}
        <button
          type="button"
          class="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)] text-xs font-medium text-[var(--ui-foreground)] hover:bg-[var(--ui-muted)] transition-colors"
          onclick={onCreateFolder}
          aria-label="Create new folder"
        >
          <FolderPlus class="size-3.5 text-amber-500" />
          <span>New Folder</span>
        </button>
      {/if}

      {#if allowUpload}
        <button
          type="button"
          class="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-transparent bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)] text-xs font-medium hover:opacity-90 transition-opacity"
          onclick={onUploadClick}
          aria-label="Upload files"
        >
          <Upload class="size-3.5" />
          <span>Upload</span>
        </button>
      {/if}

      {#if allowDelete && selectedCount > 0}
        <button
          type="button"
          class="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-red-500/30 bg-red-500/10 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
          onclick={onDeleteClick}
          aria-label="Delete selected items"
        >
          <Trash2 class="size-3.5" />
          <span>Delete ({selectedCount})</span>
        </button>
      {/if}
    </div>

    <!-- Search and View Switcher -->
    <div class="flex items-center gap-2">
      <!-- Search Input -->
      <div class="relative w-56 max-w-full">
        <Search
          class="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[var(--ui-muted-foreground)] pointer-events-none"
        />
        <input
          type="search"
          placeholder="Search files..."
          class="h-8 w-full pl-8 pr-3 text-xs rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)] text-[var(--ui-foreground)] outline-none focus:ring-2 focus:ring-[var(--ui-primary)]/40 placeholder:text-[var(--ui-muted-foreground)]"
          value={searchQuery}
          oninput={(e) => onSearchChange(e.currentTarget.value)}
          aria-label="Search files"
        />
      </div>

      <!-- View Switcher (Grid vs List) -->
      <div
        class="inline-flex items-center p-0.5 rounded-lg border border-[var(--ui-border)]/60 bg-[var(--ui-muted)]/40 text-[var(--ui-muted-foreground)]"
      >
        <button
          type="button"
          class="p-1.5 rounded-md transition-colors {viewMode === 'grid'
            ? 'bg-[var(--ui-background)] text-[var(--ui-foreground)] shadow-xs font-semibold'
            : 'hover:text-[var(--ui-foreground)]'}"
          onclick={() => onViewModeChange("grid")}
          title="Grid view"
          aria-label="Switch to grid view"
        >
          <LayoutGrid class="size-3.5" />
        </button>
        <button
          type="button"
          class="p-1.5 rounded-md transition-colors {viewMode === 'list'
            ? 'bg-[var(--ui-background)] text-[var(--ui-foreground)] shadow-xs font-semibold'
            : 'hover:text-[var(--ui-foreground)]'}"
          onclick={() => onViewModeChange("list")}
          title="List view"
          aria-label="Switch to list view"
        >
          <List class="size-3.5" />
        </button>
      </div>
    </div>
  </div>

  <!-- Bottom Row: Breadcrumbs trail -->
  <nav
    class="flex items-center gap-1 text-xs overflow-x-auto py-0.5"
    aria-label="Breadcrumb"
  >
    {#each breadcrumbs as crumb, idx}
      {#if idx > 0}
        <ChevronRight
          class="size-3 text-[var(--ui-muted-foreground)] shrink-0"
        />
      {/if}

      {@const isLast = idx === breadcrumbs.length - 1}
      <button
        type="button"
        class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md transition-colors truncate max-w-[150px] {isLast
          ? 'font-semibold text-[var(--ui-foreground)] pointer-events-none'
          : 'text-[var(--ui-muted-foreground)] hover:text-[var(--ui-foreground)] hover:bg-[var(--ui-muted)]/60'}"
        onclick={() => onNavigate(crumb.id)}
      >
        {#if idx === 0}
          <Home class="size-3 shrink-0" />
        {/if}
        <span class="truncate">{crumb.name}</span>
      </button>
    {/each}
  </nav>
</div>
