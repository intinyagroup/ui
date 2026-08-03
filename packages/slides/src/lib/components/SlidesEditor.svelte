<script lang="ts">
  import { Presentation as PresentationIcon, Plus, Download, Play, Settings, Palette } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import {
    createPresentation, addSlide, duplicateSlide, deleteSlide, reorderSlides,
    type Presentation, type Slide, type SlideLayout, type PresentationTheme,
    defaultThemes, aspectRatios
  } from '../slide-model.js';
  import SlideSidebar from './SlideSidebar.svelte';
  import SlideCanvas from './SlideCanvas.svelte';
  import SlideShow from './SlideShow.svelte';
  import { exportSlidesToPdf } from '../pdf-export.js';

  let {
    initialPresentation,
    class: className,
    onSave,
    onExport,
  }: {
    initialPresentation?: Presentation;
    class?: string;
    onSave?: (presentation: Presentation) => void;
    onExport?: (blob: Blob) => void;
  } = $props();

  let presentation = $state(initialPresentation ?? createPresentation());
  let activeSlideId = $state(presentation.slides[0]?.id ?? '');
  let selectedElementId = $state<string | null>(null);
  let showSlideshow = $state(false);
  let showSettings = $state(false);
  let showThemePicker = $state(false);
  let exporting = $state(false);

  const activeSlide = $derived(presentation.slides.find((s) => s.id === activeSlideId));

  function handleSelectSlide(id: string) {
    activeSlideId = id;
    selectedElementId = null;
  }

  function handleAddSlide(layout: SlideLayout) {
    presentation = addSlide(presentation, layout);
    activeSlideId = presentation.slides[presentation.slides.length - 1].id;
  }

  function handleDuplicateSlide(id: string) {
    presentation = duplicateSlide(presentation, id);
  }

  function handleDeleteSlide(id: string) {
    if (presentation.slides.length <= 1) return;
    presentation = deleteSlide(presentation, id);
    if (activeSlideId === id) {
      activeSlideId = presentation.slides[0]?.id ?? '';
    }
  }

  function handleReorderSlides(from: number, to: number) {
    presentation = reorderSlides(presentation, from, to);
  }

  function handleToggleHidden(id: string) {
    presentation = {
      ...presentation,
      slides: presentation.slides.map((s) =>
        s.id === id ? { ...s, isHidden: !s.isHidden } : s
      ),
    };
  }

  function handleSelectElement(id: string | null) {
    selectedElementId = id;
  }

  function handleUpdateElement(id: string, updates: Partial<Slide['elements'][0]>) {
    if (!activeSlide) return;
    presentation = {
      ...presentation,
      slides: presentation.slides.map((s) =>
        s.id === activeSlideId
          ? {
              ...s,
              elements: s.elements.map((el) =>
                el.id === id ? { ...el, ...updates } : el
              ),
            }
          : s
      ),
    };
  }

  function handleThemeChange(theme: PresentationTheme) {
    presentation = { ...presentation, theme, updatedAt: new Date().toISOString() };
    showThemePicker = false;
  }

  async function handleExportPdf() {
    exporting = true;
    try {
      const blob = await exportSlidesToPdf(presentation);
      onExport?.(blob);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${presentation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      link.click();
    } finally {
      exporting = false;
    }
  }

  function handleSave() {
    onSave?.(presentation);
  }
</script>

<div class="flex flex-col h-full {className ?? ''}">
  <!-- Top bar -->
  <div class="flex items-center justify-between px-4 py-2 border-b border-[var(--ui-border)] bg-[var(--ui-card)]">
    <div class="flex items-center gap-3">
      <PresentationIcon class="size-5 text-[var(--ui-primary)]" />
      <input
        type="text"
        bind:value={presentation.title}
        class="text-sm font-semibold text-[var(--ui-foreground)] bg-transparent border-none outline-none max-w-xs"
      />
    </div>

    <div class="flex items-center gap-2">
      <Button variant="outline" size="sm" onclick={() => showThemePicker = !showThemePicker}>
        <Palette class="size-3.5 mr-1" /> Theme
      </Button>
      <Button variant="outline" size="sm" onclick={handleSave}>Save</Button>
      <Button variant="outline" size="sm" onclick={handleExportPdf} disabled={exporting}>
        <Download class="size-3.5 mr-1" /> {exporting ? 'Exporting...' : 'PDF'}
      </Button>
      <Button size="sm" onclick={() => showSlideshow = true}>
        <Play class="size-3.5 mr-1" /> Present
      </Button>
    </div>
  </div>

  <!-- Theme picker -->
  {#if showThemePicker}
    <div class="px-4 py-3 border-b border-[var(--ui-border)] bg-[var(--ui-secondary)]/20">
      <div class="flex items-center gap-3">
        <span class="text-xs text-[var(--ui-muted-foreground)]">Theme:</span>
        {#each defaultThemes as theme}
          <button
            onclick={() => handleThemeChange(theme)}
            class={cn(
              "w-24 h-16 rounded-lg border-2 flex flex-col items-center justify-center transition-all cursor-pointer",
              presentation.theme.id === theme.id
                ? "border-[var(--ui-primary)] shadow-md"
                : "border-[var(--ui-border)] hover:border-[var(--ui-primary)]/50"
            )}
            style="background-color: {theme.background};"
          >
            <div class="text-lg font-bold" style="color: {theme.textColor};">Aa</div>
            <div class="text-[8px]" style="color: {theme.accentColor};">{theme.name}</div>
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Main content -->
  <div class="flex flex-1 overflow-hidden">
    <!-- Slide sidebar -->
    <SlideSidebar
      slides={presentation.slides}
      activeSlideId={activeSlideId}
      aspectRatio={presentation.aspectRatio}
      onSelectSlide={handleSelectSlide}
      onAddSlide={handleAddSlide}
      onDuplicateSlide={handleDuplicateSlide}
      onDeleteSlide={handleDeleteSlide}
      onReorderSlides={handleReorderSlides}
      onToggleHidden={handleToggleHidden}
    />

    <!-- Slide canvas -->
    <div class="flex-1 overflow-auto flex items-center justify-center p-8 bg-[var(--ui-muted)]/30">
      {#if activeSlide}
        <SlideCanvas
          slide={activeSlide}
          theme={presentation.theme}
          aspectRatio={presentation.aspectRatio}
          {selectedElementId}
          onSelectElement={handleSelectElement}
          onUpdateElement={handleUpdateElement}
        />
      {:else}
        <div class="text-[var(--ui-muted-foreground)]">Select a slide</div>
      {/if}
    </div>

    <!-- Properties panel -->
    {#if selectedElementId && activeSlide}
      {@const element = activeSlide.elements.find((e) => e.id === selectedElementId)}
      {#if element}
        <div class="w-64 border-l border-[var(--ui-border)] bg-[var(--ui-card)] p-4 overflow-auto shrink-0">
          <h3 class="text-xs font-semibold text-[var(--ui-foreground)] mb-3">Properties</h3>
          <div class="space-y-3">
            <label class="block text-[10px] text-[var(--ui-muted-foreground)]">
              X Position
              <input type="number" value={element.x} class="w-full mt-1 px-2 py-1 rounded border border-[var(--ui-input)] text-xs"
                onchange={(e) => handleUpdateElement(element.id, { x: Number(e.currentTarget.value) })} />
            </label>
            <label class="block text-[10px] text-[var(--ui-muted-foreground)]">
              Y Position
              <input type="number" value={element.y} class="w-full mt-1 px-2 py-1 rounded border border-[var(--ui-input)] text-xs"
                onchange={(e) => handleUpdateElement(element.id, { y: Number(e.currentTarget.value) })} />
            </label>
            <label class="block text-[10px] text-[var(--ui-muted-foreground)]">
              Width
              <input type="number" value={element.width} class="w-full mt-1 px-2 py-1 rounded border border-[var(--ui-input)] text-xs"
                onchange={(e) => handleUpdateElement(element.id, { width: Number(e.currentTarget.value) })} />
            </label>
            <label class="block text-[10px] text-[var(--ui-muted-foreground)]">
              Height
              <input type="number" value={element.height} class="w-full mt-1 px-2 py-1 rounded border border-[var(--ui-input)] text-xs"
                onchange={(e) => handleUpdateElement(element.id, { height: Number(e.currentTarget.value) })} />
            </label>
            <label class="block text-[10px] text-[var(--ui-muted-foreground)]">
              Rotation
              <input type="number" value={element.rotation} class="w-full mt-1 px-2 py-1 rounded border border-[var(--ui-input)] text-xs"
                onchange={(e) => handleUpdateElement(element.id, { rotation: Number(e.currentTarget.value) })} />
            </label>
            {#if element.type === 'text'}
              <label class="block text-[10px] text-[var(--ui-muted-foreground)]">
                Font Size
                <input type="number" value={element.style?.fontSize ?? 16} class="w-full mt-1 px-2 py-1 rounded border border-[var(--ui-input)] text-xs"
                  onchange={(e) => handleUpdateElement(element.id, { style: { ...element.style, fontSize: Number(e.currentTarget.value) } })} />
              </label>
              <label class="block text-[10px] text-[var(--ui-muted-foreground)]">
                Color
                <input type="color" value={element.style?.color ?? '#000000'} class="w-full mt-1 h-7 rounded cursor-pointer"
                  onchange={(e) => handleUpdateElement(element.id, { style: { ...element.style, color: e.currentTarget.value } })} />
              </label>
            {/if}
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>

<!-- Slideshow -->
{#if showSlideshow}
  <SlideShow
    slides={presentation.slides}
    theme={presentation.theme}
    aspectRatio={presentation.aspectRatio}
    onClose={() => showSlideshow = false}
  />
{/if}
