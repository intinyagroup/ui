<script lang="ts">
  import {
    getChildrenInFolder,
    sortFileItems,
    filterFileItems,
    type FileItem,
    type ViewMode,
    type SortConfig,
    type SortField,
  } from "../file-model.js";
  import FolderTree from "./FolderTree.svelte";
  import FileManagerToolbar from "./FileManagerToolbar.svelte";
  import FileViewGrid from "./FileViewGrid.svelte";
  import FileViewList from "./FileViewList.svelte";
  import FilePreviewModal from "./FilePreviewModal.svelte";
  import { untrack } from "svelte";

  let {
    items = [],
    currentFolderId = $bindable(null),
    viewMode = "grid",
    allowUpload = true,
    allowDelete = true,
    allowCreateFolder = true,
    showSidebar = true,
    class: className = "",
    onNavigate,
    onSelect,
    onOpen,
    onDelete,
    onCreateFolder,
    onUpload,
    onDownload,
  }: {
    items: FileItem[];
    currentFolderId?: string | null;
    viewMode?: ViewMode;
    allowUpload?: boolean;
    allowDelete?: boolean;
    allowCreateFolder?: boolean;
    showSidebar?: boolean;
    class?: string;
    onNavigate?: (folderId: string | null) => void;
    onSelect?: (items: FileItem[]) => void;
    onOpen?: (item: FileItem) => void;
    onDelete?: (items: FileItem[]) => void;
    onCreateFolder?: (parentId: string | null, name: string) => void;
    onUpload?: (files: File[], targetFolderId: string | null) => void;
    onDownload?: (item: FileItem) => void;
  } = $props();

  let activeFolderId = $state<string | null>(untrack(() => currentFolderId));
  let lastFolderProp = $state<string | null>(untrack(() => currentFolderId));
  let currentViewMode = $state<ViewMode>(untrack(() => viewMode));
  let searchQuery = $state("");
  let selectedIds = $state<Set<string>>(new Set<string>());
  let sort = $state<SortConfig>({ field: "name", direction: "asc" });
  let previewItem = $state<FileItem | null>(null);
  let fileInputEl: HTMLInputElement | null = $state(null);

  // Sync external folder id
  $effect(() => {
    if (currentFolderId !== lastFolderProp) {
      lastFolderProp = currentFolderId;
      activeFolderId = currentFolderId;
    }
  });

  // Items within active folder
  const currentFolderItems = $derived.by<FileItem[]>(() => {
    const rawChildren = getChildrenInFolder(items, activeFolderId);
    const filtered = filterFileItems(rawChildren, searchQuery);
    return sortFileItems(filtered, sort);
  });

  function handleNavigate(folderId: string | null) {
    activeFolderId = folderId;
    currentFolderId = folderId;
    lastFolderProp = folderId;
    searchQuery = "";
    selectedIds = new Set();
    onNavigate?.(folderId);
  }

  function handleItemClick(item: FileItem) {
    // Single click selects item
    selectedIds = new Set([item.id]);
    onSelect?.([item]);
  }

  function handleItemDoubleClick(item: FileItem) {
    if (item.type === "folder") {
      handleNavigate(item.id);
    } else {
      previewItem = item;
      onOpen?.(item);
    }
  }

  function handleToggleSelect(id: string, e: MouseEvent) {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    selectedIds = next;

    const selectedItems = items.filter((i) => next.has(i.id));
    onSelect?.(selectedItems);
  }

  function handleSelectAll() {
    if (selectedIds.size === currentFolderItems.length) {
      selectedIds = new Set();
    } else {
      selectedIds = new Set(currentFolderItems.map((i) => i.id));
    }
    const selectedItems = items.filter((i) => selectedIds.has(i.id));
    onSelect?.(selectedItems);
  }

  function handleSortChange(field: SortField) {
    if (sort.field === field) {
      sort = { field, direction: sort.direction === "asc" ? "desc" : "asc" };
    } else {
      sort = { field, direction: "asc" };
    }
  }

  function handleCreateFolderPrompt() {
    const name = prompt("Enter new folder name:", "New Folder");
    if (name && name.trim()) {
      onCreateFolder?.(activeFolderId, name.trim());
    }
  }

  function handleUploadTrigger() {
    fileInputEl?.click();
  }

  function handleFilesSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const filesArray = Array.from(input.files);
      onUpload?.(filesArray, activeFolderId);
      input.value = "";
    }
  }

  function handleDeleteSelected() {
    const targets = items.filter((i) => selectedIds.has(i.id));
    if (targets.length === 0) return;
    onDelete?.(targets);
    selectedIds = new Set();
  }
</script>

<!-- Hidden File Input for Uploads -->
<input
  bind:this={fileInputEl}
  type="file"
  multiple
  class="hidden"
  onchange={handleFilesSelected}
  aria-hidden="true"
/>

<!-- Main File Manager Box -->
<div
  class="flex flex-col w-full h-[600px] rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-card)] shadow-sm overflow-hidden text-[var(--ui-foreground)] {className}"
  data-slot="file-manager"
>
  <!-- Top Action Toolbar & Breadcrumbs -->
  <FileManagerToolbar
    {items}
    currentFolderId={activeFolderId}
    viewMode={currentViewMode}
    {searchQuery}
    selectedCount={selectedIds.size}
    {allowUpload}
    {allowDelete}
    {allowCreateFolder}
    onNavigate={handleNavigate}
    onViewModeChange={(m) => (currentViewMode = m)}
    onSearchChange={(q) => (searchQuery = q)}
    onCreateFolder={handleCreateFolderPrompt}
    onUploadClick={handleUploadTrigger}
    onDeleteClick={handleDeleteSelected}
  />

  <!-- Main Body: Sidebar (FolderTree) + File View Content -->
  <div class="flex flex-1 min-h-0 overflow-hidden">
    {#if showSidebar}
      <FolderTree
        {items}
        currentFolderId={activeFolderId}
        onNavigate={handleNavigate}
      />
    {/if}

    <!-- Content Area -->
    <div
      class="flex-1 flex flex-col min-w-0 bg-[var(--ui-background)] overflow-y-auto"
    >
      {#if currentViewMode === "grid"}
        <FileViewGrid
          items={currentFolderItems}
          {selectedIds}
          onItemClick={handleItemClick}
          onItemDoubleClick={handleItemDoubleClick}
          onToggleSelect={handleToggleSelect}
        />
      {:else}
        <FileViewList
          items={currentFolderItems}
          {selectedIds}
          {sort}
          onItemClick={handleItemClick}
          onItemDoubleClick={handleItemDoubleClick}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onSortChange={handleSortChange}
        />
      {/if}
    </div>
  </div>
</div>

<!-- Quick Preview Modal -->
<FilePreviewModal
  item={previewItem}
  onClose={() => (previewItem = null)}
  {onDownload}
/>
