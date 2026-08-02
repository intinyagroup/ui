<script lang="ts">
  import {
    ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw,
    Search, Download, Printer, Pencil, Highlighter, StickyNote,
    Type, Square, Trash2, Undo, Redo, PanelLeftOpen
  } from 'lucide-svelte';
  import { Button, Input } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';

  let {
    currentPage,
    totalPages,
    scale,
    tool,
    onPrevPage,
    onNextPage,
    onZoomIn,
    onZoomOut,
    onZoomReset,
    onRotate,
    onToolChange,
    onSearch,
    onDownload,
    onPrint,
    onAnnotationDelete,
    showSidebar,
    onToggleSidebar,
  }: {
    currentPage: number;
    totalPages: number;
    scale: number;
    tool: string;
    onPrevPage: () => void;
    onNextPage: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoomReset: () => void;
    onRotate: () => void;
    onToolChange: (tool: string) => void;
    onSearch: (query: string) => void;
    onDownload: () => void;
    onPrint: () => void;
    onAnnotationDelete?: () => void;
    showSidebar: boolean;
    onToggleSidebar: () => void;
  } = $props();

  let searchQuery = $state('');
  let showSearch = $state(false);

  const tools = [
    { id: 'select', icon: null, label: 'Select' },
    { id: 'highlight', icon: Highlighter, label: 'Highlight' },
    { id: 'underline', icon: null, label: 'Underline' },
    { id: 'freehand', icon: Pencil, label: 'Draw' },
    { id: 'text', icon: Type, label: 'Add Text' },
    { id: 'note', icon: StickyNote, label: 'Add Note' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
  ];

  function handleSearch() {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  }
</script>

<div class="flex items-center gap-1 px-3 py-2 border-b border-[var(--ui-border)] bg-[var(--ui-card)]">
  <!-- Sidebar toggle -->
  <Button variant="ghost" size="sm" class="size-8 p-0" onclick={onToggleSidebar}>
    <PanelLeftOpen class="size-4" />
  </Button>

  <div class="h-6 w-px bg-[var(--ui-border)] mx-1"></div>

  <!-- Page navigation -->
  <Button variant="ghost" size="sm" class="size-8 p-0" onclick={onPrevPage} disabled={currentPage <= 1}>
    <ChevronLeft class="size-4" />
  </Button>
  <div class="flex items-center gap-1 text-sm">
    <span class="font-medium text-[var(--ui-foreground)]">{currentPage}</span>
    <span class="text-[var(--ui-muted-foreground)]">/</span>
    <span class="text-[var(--ui-muted-foreground)]">{totalPages}</span>
  </div>
  <Button variant="ghost" size="sm" class="size-8 p-0" onclick={onNextPage} disabled={currentPage >= totalPages}>
    <ChevronRight class="size-4" />
  </Button>

  <div class="h-6 w-px bg-[var(--ui-border)] mx-1"></div>

  <!-- Zoom -->
  <Button variant="ghost" size="sm" class="size-8 p-0" onclick={onZoomOut}>
    <ZoomOut class="size-4" />
  </Button>
  <button
    onclick={onZoomReset}
    class="px-2 py-1 text-sm font-medium text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)] rounded cursor-pointer"
  >
    {Math.round(scale * 100)}%
  </button>
  <Button variant="ghost" size="sm" class="size-8 p-0" onclick={onZoomIn}>
    <ZoomIn class="size-4" />
  </Button>
  <Button variant="ghost" size="sm" class="size-8 p-0" onclick={onRotate}>
    <RotateCw class="size-4" />
  </Button>

  <div class="h-6 w-px bg-[var(--ui-border)] mx-1"></div>

  <!-- Annotation tools -->
  {#each tools as t (t.id)}
    <Button
      variant="ghost"
      size="sm"
      class={cn("size-8 p-0", tool === t.id && "bg-[var(--ui-primary)]/10 text-[var(--ui-primary)]")}
      onclick={() => onToolChange(t.id)}
      title={t.label}
    >
      {#if t.icon}
        <t.icon class="size-4" />
      {:else}
        <span class="text-xs">{t.id === 'select' ? '↖' : t.id === 'underline' ? 'U' : ''}</span>
      {/if}
    </Button>
  {/each}

  {#if tool !== 'select'}
    <Button variant="ghost" size="sm" class="size-8 p-0 text-[var(--ui-destructive)]" onclick={onAnnotationDelete}>
      <Trash2 class="size-4" />
    </Button>
  {/if}

  <div class="flex-1"></div>

  <!-- Search -->
  {#if showSearch}
    <div class="flex items-center gap-1">
      <Input
        type="text"
        bind:value={searchQuery}
        placeholder="Search..."
        class="h-8 w-48 text-sm"
        onkeydown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <Button variant="ghost" size="sm" class="size-8 p-0" onclick={handleSearch}>
        <Search class="size-4" />
      </Button>
    </div>
  {:else}
    <Button variant="ghost" size="sm" class="size-8 p-0" onclick={() => showSearch = true}>
      <Search class="size-4" />
    </Button>
  {/if}

  <Button variant="ghost" size="sm" class="size-8 p-0" onclick={onPrint}>
    <Printer class="size-4" />
  </Button>
  <Button variant="ghost" size="sm" class="size-8 p-0" onclick={onDownload}>
    <Download class="size-4" />
  </Button>
</div>
