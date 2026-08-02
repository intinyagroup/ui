<script lang="ts">
  import {
    ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw,
    Search, Download, Printer, Pencil, Highlighter, StickyNote,
    Type, Square, Trash2, PanelLeftOpen, PanelRightOpen,
    FileText, Bookmark, Layers, Settings, Maximize, Minimize,
    Move, Image, Stamp, Circle, Minus, ArrowRight, MousePointer,
    Grid2x2, List, Columns2, Rows2, Play, Eye, Palette
  } from 'lucide-svelte';
  import { Button, Input } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import type { AnnotationTool, Annotation } from '../pdf-core.js';

  let {
    currentPage,
    totalPages,
    scale,
    tool,
    showSidebar,
    sidebarMode,
    onPrevPage,
    onNextPage,
    onZoomIn,
    onZoomOut,
    onZoomReset,
    onZoomFitWidth,
    onZoomFitHeight,
    onZoomFitPage,
    onZoomActual,
    onRotate,
    onToolChange,
    onToolColor,
    onSearch,
    onDownload,
    onPrint,
    onAnnotationDelete,
    onToggleSidebar,
    onSidebarMode,
    onTogglePageManipulation,
  }: {
    currentPage: number;
    totalPages: number;
    scale: number;
    tool: AnnotationTool;
    showSidebar: boolean;
    sidebarMode: string;
    onPrevPage: () => void;
    onNextPage: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoomReset: () => void;
    onZoomFitWidth: () => void;
    onZoomFitHeight: () => void;
    onZoomFitPage: () => void;
    onZoomActual: () => void;
    onRotate: () => void;
    onToolChange: (tool: AnnotationTool) => void;
    onToolColor: (color: string) => void;
    onSearch: () => void;
    onDownload: () => void;
    onPrint: () => void;
    onAnnotationDelete: () => void;
    onToggleSidebar: () => void;
    onSidebarMode: (mode: string) => void;
    onTogglePageManipulation: () => void;
  } = $props();

  let showColorPicker = $state(false);

  const colors = ['#ff0000', '#ff6600', '#ffcc00', '#00cc00', '#0066ff', '#cc00cc', '#000000', '#ffffff'];

  const tools: { id: AnnotationTool; icon: any; label: string; group: string }[] = [
    { id: 'select', icon: MousePointer, label: 'Select', group: 'navigation' },
    { id: 'highlight', icon: Highlighter, label: 'Highlight', group: 'markup' },
    { id: 'underline', icon: null, label: 'Underline', group: 'markup' },
    { id: 'strikethrough', icon: null, label: 'Strikethrough', group: 'markup' },
    { id: 'freehand', icon: Pencil, label: 'Draw', group: 'drawing' },
    { id: 'text-box', icon: Type, label: 'Text Box', group: 'drawing' },
    { id: 'note', icon: StickyNote, label: 'Note', group: 'drawing' },
    { id: 'rectangle', icon: Square, label: 'Rectangle', group: 'shapes' },
    { id: 'ellipse', icon: Circle, label: 'Ellipse', group: 'shapes' },
    { id: 'line', icon: Minus, label: 'Line', group: 'shapes' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow', group: 'shapes' },
    { id: 'stamp', icon: Stamp, label: 'Stamp', group: 'drawing' },
  ];
</script>

<div class="flex items-center gap-1 px-3 py-2 border-b border-[var(--ui-border)] bg-[var(--ui-card)]">
  <!-- Sidebar toggles -->
  <Button variant="ghost" size="sm" class="size-8 p-0" onclick={onToggleSidebar}>
    <PanelLeftOpen class="size-4" />
  </Button>

  <div class="h-6 w-px bg-[var(--ui-border)] mx-1"></div>

  <!-- Page navigation -->
  <Button variant="ghost" size="sm" class="size-8 p-0" onclick={onPrevPage} disabled={currentPage <= 1}>
    <ChevronLeft class="size-4" />
  </Button>
  <div class="flex items-center gap-1 text-sm min-w-[80px]">
    <input
      type="number"
      value={currentPage}
      min={1}
      max={totalPages}
      onchange={(e) => { const v = parseInt(e.currentTarget.value); if (v) onPrevPage(); }}
      class="w-12 h-7 px-1 text-center rounded border border-[var(--ui-input)] text-sm bg-transparent"
    />
    <span class="text-[var(--ui-muted-foreground)]">/ {totalPages}</span>
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
    class="px-2 py-1 text-sm font-medium text-[var(--ui-foreground)] hover:bg-[var(--ui-secondary)] rounded cursor-pointer min-w-[52px] text-center"
  >
    {Math.round(scale * 100)}%
  </button>
  <Button variant="ghost" size="sm" class="size-8 p-0" onclick={onZoomIn}>
    <ZoomIn class="size-4" />
  </Button>

  <!-- Zoom modes -->
  <div class="flex items-center gap-0.5 ml-1">
    <Button variant="ghost" size="sm" class="h-7 px-2 text-[10px]" onclick={onZoomFitWidth}>Fit Width</Button>
    <Button variant="ghost" size="sm" class="h-7 px-2 text-[10px]" onclick={onZoomFitPage}>Fit Page</Button>
    <Button variant="ghost" size="sm" class="h-7 px-2 text-[10px]" onclick={onZoomActual}>100%</Button>
  </div>

  <div class="h-6 w-px bg-[var(--ui-border)] mx-1"></div>

  <!-- Rotate -->
  <Button variant="ghost" size="sm" class="size-8 p-0" onclick={onRotate}>
    <RotateCw class="size-4" />
  </Button>

  <div class="h-6 w-px bg-[var(--ui-border)] mx-1"></div>

  <!-- Annotation tools -->
  {#each tools as t (t.id)}
    <div class="relative">
      <Button
        variant="ghost"
        size="sm"
        class={cn("size-8 p-0", tool === t.id && "bg-[var(--ui-primary)]/10 text-[var(--ui-primary)]")}
        onclick={() => onToolChange(t.id)}
        title={t.label}
      >
        {#if t.icon}
          <t.icon class="size-4" />
        {:else if t.id === 'underline'}
          <span class="text-xs font-bold underline">U</span>
        {:else if t.id === 'strikethrough'}
          <span class="text-xs font-bold line-through">S</span>
        {/if}
      </Button>
    </div>
  {/each}

  <!-- Color picker -->
  <div class="relative">
    <button
      onclick={() => showColorPicker = !showColorPicker}
      class="flex items-center gap-1 px-2 py-1 rounded text-xs text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)] cursor-pointer"
    >
      <div class="size-4 rounded border border-[var(--ui-border)]" style="background-color: {selectedAnnotationColor}"></div>
    </button>
    {#if showColorPicker}
      <div class="absolute top-full right-0 z-50 mt-1 p-2 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)] shadow-lg grid grid-cols-4 gap-1">
        {#each colors as color}
          <button
            onclick={() => { onToolColor(color); showColorPicker = false; }}
            class="size-7 rounded border-2 cursor-pointer hover:scale-110 transition-transform"
            style="background-color: {color}; border-color: {color === selectedAnnotationColor ? 'var(--ui-primary)' : 'var(--ui-border)'}"
          ></button>
        {/each}
      </div>
    {/if}
  </div>

  {#if tool !== 'select'}
    <Button variant="ghost" size="sm" class="size-8 p-0 text-[var(--ui-destructive)]" onclick={onAnnotationDelete}>
      <Trash2 class="size-4" />
    </Button>
  {/if}

  <div class="flex-1"></div>

  <!-- Right sidebar modes -->
  <div class="flex items-center gap-0.5">
    <Button variant="ghost" size="sm" class={cn("size-8 p-0", sidebarMode === 'thumbnails' && showSidebar && "bg-[var(--ui-secondary)]")} onclick={() => onSidebarMode('thumbnails')} title="Thumbnails">
      <Grid2x2 class="size-4" />
    </Button>
    <Button variant="ghost" size="sm" class={cn("size-8 p-0", sidebarMode === 'bookmarks' && showSidebar && "bg-[var(--ui-secondary)]")} onclick={() => onSidebarMode('bookmarks')} title="Bookmarks">
      <Bookmark class="size-4" />
    </Button>
    <Button variant="ghost" size="sm" class={cn("size-8 p-0", sidebarMode === 'annotations' && showSidebar && "bg-[var(--ui-secondary)]")} onclick={() => onSidebarMode('annotations')} title="Annotations">
      <Layers class="size-4" />
    </Button>
    <Button variant="ghost" size="sm" class={cn("size-8 p-0", sidebarMode === 'pages' && showSidebar && "bg-[var(--ui-secondary)]")} onclick={() => { onSidebarMode('pages'); onTogglePageManipulation(); }} title="Pages">
      <FileText class="size-4" />
    </Button>
  </div>

  <div class="h-6 w-px bg-[var(--ui-border)] mx-1"></div>

  <!-- Search -->
  <Button variant="ghost" size="sm" class="size-8 p-0" onclick={onSearch}>
    <Search class="size-4" />
  </Button>

  <Button variant="ghost" size="sm" class="size-8 p-0" onclick={onPrint}>
    <Printer class="size-4" />
  </Button>
  <Button variant="ghost" size="sm" class="size-8 p-0" onclick={onDownload}>
    <Download class="size-4" />
  </Button>
</div>
