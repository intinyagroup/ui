<script lang="ts">
  import { GripVertical, Plus, Trash2, Eye, EyeOff, Copy, Layout } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import type { Slide, SlideLayout } from '../slide-model.js';
  import { slideLayouts } from '../slide-model.js';

  let {
    slides,
    activeSlideId,
    onSelectSlide,
    onAddSlide,
    onDuplicateSlide,
    onDeleteSlide,
    onReorderSlides,
    onToggleHidden,
    aspectRatio,
  }: {
    slides: Slide[];
    activeSlideId: string;
    onSelectSlide: (id: string) => void;
    onAddSlide: (layout: SlideLayout) => void;
    onDuplicateSlide: (id: string) => void;
    onDeleteSlide: (id: string) => void;
    onReorderSlides: (from: number, to: number) => void;
    onToggleHidden: (id: string) => void;
    aspectRatio: string;
  } = $props();

  let dragIndex = $state(-1);
  let showAddMenu = $state(false);

  const [w, h] = aspectRatio.split(':').map(Number);
  const thumbRatio = w / h;

  function handleDragStart(e: DragEvent, index: number) {
    dragIndex = index;
    e.dataTransfer?.setData('text/plain', String(index));
  }

  function handleDragOver(e: DragEvent) { e.preventDefault(); }

  function handleDrop(e: DragEvent, toIndex: number) {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer?.getData('text/plain') ?? '-1');
    if (fromIndex >= 0 && fromIndex !== toIndex) {
      onReorderSlides(fromIndex, toIndex);
    }
    dragIndex = -1;
  }
</script>

<div class="w-48 border-r border-[var(--ui-border)] bg-[var(--ui-card)] flex flex-col shrink-0">
  <div class="px-3 py-2 border-b border-[var(--ui-border)]">
    <h3 class="text-xs font-semibold text-[var(--ui-foreground)]">Slides</h3>
    <p class="text-[10px] text-[var(--ui-muted-foreground)]">{slides.length} slide(s)</p>
  </div>

  <div class="flex-1 overflow-auto p-2 space-y-2">
    {#each slides as slide, index (slide.id)}
      {@const isActive = slide.id === activeSlideId}

      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        draggable="true"
        ondragstart={(e) => handleDragStart(e, index)}
        ondragover={handleDragOver}
        ondrop={(e) => handleDrop(e, index)}
        class={cn(
          "group relative cursor-pointer rounded-lg border-2 transition-all",
          isActive
            ? "border-[var(--ui-primary)] shadow-md"
            : "border-transparent hover:border-[var(--ui-border)]",
          slide.isHidden && "opacity-50",
          dragIndex === index ? "opacity-50" : ""
        )}
        onclick={() => onSelectSlide(slide.id)}
      >
        <!-- Slide thumbnail -->
        <div
          class="bg-white rounded-t-md overflow-hidden border-b border-[var(--ui-border)]"
          style="aspect-ratio: {thumbRatio};"
        >
          <div class="w-full h-full p-2 text-[6px] leading-tight text-[var(--ui-foreground)]">
            {#each slide.elements.filter((e) => e.type === 'text').slice(0, 3) as el}
              <div class:font-bold={el.style?.fontWeight === 'bold'} style="font-size: {Math.max(6, (el.style?.fontSize ?? 12) / 6)}px;">
                {el.content.slice(0, 30)}
              </div>
            {/each}
          </div>
        </div>

        <!-- Slide number + actions -->
        <div class="flex items-center justify-between px-2 py-1.5 bg-[var(--ui-card)] rounded-b-md">
          <span class="text-[10px] font-medium text-[var(--ui-muted-foreground)]">
            {index + 1}
          </span>
          <div class="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onclick|stopPropagation={() => onDuplicateSlide(slide.id)} class="p-0.5 rounded hover:bg-[var(--ui-secondary)] cursor-pointer" title="Duplicate">
              <Copy class="size-3" />
            </button>
            <button onclick|stopPropagation={() => onToggleHidden(slide.id)} class="p-0.5 rounded hover:bg-[var(--ui-secondary)] cursor-pointer" title={slide.isHidden ? 'Show' : 'Hide'}>
              {#if slide.isHidden}
                <EyeOff class="size-3" />
              {:else}
                <Eye class="size-3" />
              {/if}
            </button>
            {#if slides.length > 1}
              <button onclick|stopPropagation={() => onDeleteSlide(slide.id)} class="p-0.5 rounded hover:bg-[var(--ui-destructive)]/10 text-[var(--ui-destructive)] cursor-pointer" title="Delete">
                <Trash2 class="size-3" />
              </button>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Add slide -->
  <div class="p-2 border-t border-[var(--ui-border)]">
    <div class="relative">
      <Button variant="outline" size="sm" class="w-full text-xs" onclick={() => showAddMenu = !showAddMenu}>
        <Plus class="size-3.5 mr-1" /> Add Slide
      </Button>

      {#if showAddMenu}
        <div class="absolute bottom-full left-0 right-0 mb-1 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)] shadow-lg p-1 z-10 max-h-64 overflow-auto">
          {#each slideLayouts as layout}
            <button
              onclick={() => { onAddSlide(layout.value); showAddMenu = false; }}
              class="flex items-center gap-2 w-full px-3 py-2 rounded-md text-xs text-left hover:bg-[var(--ui-secondary)] cursor-pointer"
            >
              <Layout class="size-3.5 text-[var(--ui-muted-foreground)]" />
              <div>
                <div class="font-medium">{layout.label}</div>
                <div class="text-[10px] text-[var(--ui-muted-foreground)]">{layout.description}</div>
              </div>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
