<script lang="ts">
  import { onMount } from 'svelte';
  import type { Slide, SlideElement, PresentationTheme } from '../slide-model.js';
  import { cn } from '@intinyagroup/grid-core/utils';

  let {
    slide,
    theme,
    aspectRatio,
    selectedElementId,
    onSelectElement,
    onUpdateElement,
    readonly = false,
  }: {
    slide: Slide;
    theme: PresentationTheme;
    aspectRatio: string;
    selectedElementId: string | null;
    onSelectElement: (id: string | null) => void;
    onUpdateElement: (id: string, updates: Partial<SlideElement>) => void;
    readonly?: boolean;
  } = $props();

  let canvasEl: HTMLDivElement | null = $state(null);
  let isDragging = $state(false);
  let dragStart = $state({ x: 0, y: 0 });
  let dragElement = $state<{ id: string; startX: number; startY: number } | null>(null);

  const [w, h] = aspectRatio.split(':').map(Number);
  const displayWidth = 960;
  const displayHeight = Math.round(displayWidth * (h / w));

  function handleElementClick(e: MouseEvent, elementId: string) {
    e.stopPropagation();
    if (!readonly) onSelectElement(elementId);
  }

  function handleCanvasClick() {
    if (!readonly) onSelectElement(null);
  }

  function handleMouseDown(e: MouseEvent, element: SlideElement) {
    if (readonly || element.locked) return;
    isDragging = true;
    dragStart = { x: e.clientX, y: e.clientY };
    dragElement = { id: element.id, startX: element.x, startY: element.y };
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging || !dragElement || !canvasEl) return;

    const rect = canvasEl.getBoundingClientRect();
    const scaleX = (100 / rect.width);
    const scaleY = (100 / rect.height);

    const dx = (e.clientX - dragStart.x) * scaleX;
    const dy = (e.clientY - dragStart.y) * scaleY;

    onUpdateElement(dragElement.id, {
      x: Math.max(0, Math.min(100 - 10, dragElement.startX + dx)),
      y: Math.max(0, Math.min(100 - 5, dragElement.startY + dy)),
    });
  }

  function handleMouseUp() {
    isDragging = false;
    dragElement = null;
  }

  function handleDoubleClick(element: SlideElement) {
    if (readonly || element.type !== 'text') return;
    const newContent = prompt('Edit text:', element.content);
    if (newContent !== null) {
      onUpdateElement(element.id, { content: newContent });
    }
  }

  function getSlideBackground(slide: Slide, theme: PresentationTheme): string {
    return slide.background || theme.background;
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={canvasEl}
  class="relative bg-white shadow-xl rounded-lg overflow-hidden cursor-crosshair"
  style="width: {displayWidth}px; height: {displayHeight}px; background-color: {getSlideBackground(slide, theme)};"
  onclick={handleCanvasClick}
  onmousemove={handleMouseMove}
  onmouseup={handleMouseUp}
  onmouseleave={handleMouseUp}
>
  {#each slide.elements as element (element.id)}
    {#if element.visible !== false}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="absolute cursor-move transition-shadow {selectedElementId === element.id ? 'ring-2 ring-[var(--ui-primary)] ring-offset-2' : ''} {!readonly && !element.locked ? 'hover:shadow-lg' : ''}"
        style="
          left: {element.x}%;
          top: {element.y}%;
          width: {element.width}%;
          height: {element.height}%;
          transform: rotate({element.rotation}deg);
          opacity: {element.style?.opacity ?? 1};
          background-color: {element.style?.backgroundColor || 'transparent'};
          border-radius: {element.style?.borderRadius || 0}px;
          border: {element.style?.borderWidth || 0}px solid {element.style?.borderColor || 'transparent'};
          {element.style?.shadow ? 'box-shadow: 0 4px 6px rgba(0,0,0,0.1);' : ''}
        "
        onclick={(e) => handleElementClick(e, element.id)}
        onmousedown={(e) => handleMouseDown(e, element)}
        ondblclick={() => handleDoubleClick(element)}
      >
        {#if element.type === 'text'}
          <div
            class="w-full h-full flex items-center overflow-hidden"
            style="
              font-size: {element.style?.fontSize ?? 16}px;
              font-family: {element.style?.fontFamily ?? theme.fontFamily};
              font-weight: {element.style?.fontWeight ?? 'normal'};
              font-style: {element.style?.fontStyle ?? 'normal'};
              text-align: {element.style?.textAlign ?? 'left'};
              color: {element.style?.color ?? theme.textColor};
              line-height: 1.4;
              padding: 4px 8px;
            "
          >
            {element.content}
          </div>

        {:else if element.type === 'image'}
          {#if element.content}
            <img
              src={element.content}
              alt="Slide image"
              class="w-full h-full object-cover rounded"
            />
          {:else}
            <div class="w-full h-full flex items-center justify-center bg-[var(--ui-secondary)]/30 rounded text-xs text-[var(--ui-muted-foreground)]">
              Click to add image
            </div>
          {/if}

        {:else if element.type === 'shape'}
          <div class="w-full h-full" style="background-color: {element.style?.backgroundColor || theme.accentColor}; border-radius: {element.style?.borderRadius || 0}px;"></div>

        {:else if element.type === 'chart'}
          <div class="w-full h-full flex items-center justify-center bg-[var(--ui-secondary)]/20 rounded text-xs text-[var(--ui-muted-foreground)] border border-dashed border-[var(--ui-border)]">
            Chart placeholder
          </div>

        {:else if element.type === 'code'}
          <pre class="w-full h-full p-3 bg-[#1e1e1e] text-[#d4d4d4] rounded text-xs overflow-auto font-mono">{element.content}</pre>
        {/if}
      </div>
    {/if}
  {/each}

  <!-- Selection handles -->
  {#if selectedElementId && !readonly}
    {@const selected = slide.elements.find((e) => e.id === selectedElementId)}
    {#if selected}
      <div
        class="absolute pointer-events-none"
        style="left: {selected.x}%; top: {selected.y}%; width: {selected.width}%; height: {selected.height}%;"
      >
        <div class="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[var(--ui-primary)] rounded-full cursor-nw-resize"></div>
        <div class="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[var(--ui-primary)] rounded-full cursor-ne-resize"></div>
        <div class="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[var(--ui-primary)] rounded-full cursor-sw-resize"></div>
        <div class="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[var(--ui-primary)] rounded-full cursor-se-resize"></div>
      </div>
    {/if}
  {/if}
</div>
