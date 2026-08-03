<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { ChevronLeft, ChevronRight, X, Maximize, Minimize } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import type { Slide, PresentationTheme } from '../slide-model.js';
  import { cn } from '@intinyagroup/grid-core/utils';

  let {
    slides,
    theme,
    aspectRatio,
    onClose,
  }: {
    slides: Slide[];
    theme: PresentationTheme;
    aspectRatio: string;
    onClose: () => void;
  } = $props();

  let currentSlide = $state(0);
  let isFullscreen = $state(false);
  let showControls = $state(true);
  let controlsTimer: ReturnType<typeof setTimeout> | null = null;

  const visibleSlides = $derived(slides.filter((s) => !s.isHidden));
  const [w, h] = aspectRatio.split(':').map(Number);
  const displayWidth = $state(typeof window !== 'undefined' ? window.innerWidth : 1920);
  const displayHeight = $derived(Math.round(displayWidth * (h / w)));

  function nextSlide() {
    if (currentSlide < visibleSlides.length - 1) {
      currentSlide++;
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      currentSlide--;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'Escape':
        onClose();
        break;
      case 'f':
        toggleFullscreen();
        break;
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      isFullscreen = true;
    } else {
      document.exitFullscreen();
      isFullscreen = false;
    }
  }

  function resetControlsTimer() {
    showControls = true;
    if (controlsTimer) clearTimeout(controlsTimer);
    controlsTimer = setTimeout(() => {
      showControls = false;
    }, 3000);
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    resetControlsTimer();
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeydown);
    if (controlsTimer) clearTimeout(controlsTimer);
  });

  function getTransitionClass(transition: string): string {
    switch (transition) {
      case 'fade': return 'animate-fade';
      case 'slide-left': return 'animate-slide-left';
      case 'slide-right': return 'animate-slide-right';
      case 'zoom': return 'animate-zoom';
      default: return '';
    }
  }
</script>

<!-- svelte-ignore a11y_no_no_noninteractive_element_interactions -->
<div
  class="fixed inset-0 z-[100] bg-black flex items-center justify-center"
  onmousemove={resetControlsTimer}
  onclick={resetControlsTimer}
>
  <!-- Current slide -->
  <div
    class="relative flex items-center justify-center"
    style="width: {displayWidth}px; height: {displayHeight}px; max-width: 100vw; max-height: 100vh;"
  >
    {#if visibleSlides[currentSlide]}
      {@const slide = visibleSlides[currentSlide]}
      {@const slideDuration = slide.transitionDuration ?? 500}

      <div
        class="w-full h-full {getTransitionClass(slide.transition)}"
        style="animation-duration: {slideDuration}ms; background-color: {slide.background || theme.background};"
      >
        {#each slide.elements as element (element.id)}
          {#if element.visible !== false}
            <div
              class="absolute"
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
              "
            >
              {#if element.type === 'text'}
                <div
                  class="w-full h-full flex items-center overflow-hidden"
                  style="
                    font-size: {element.style?.fontSize ?? 16}px;
                    font-family: {element.style?.fontFamily ?? theme.fontFamily};
                    font-weight: {element.style?.fontWeight ?? 'normal'};
                    text-align: {element.style?.textAlign ?? 'left'};
                    color: {element.style?.color ?? theme.textColor};
                    line-height: 1.4;
                    padding: 4px 8px;
                  "
                >
                  {element.content}
                </div>
              {:else if element.type === 'image' && element.content}
                <img src={element.content} alt="" class="w-full h-full object-cover rounded" />
              {:else if element.type === 'code'}
                <pre class="w-full h-full p-3 bg-[#1e1e1e] text-[#d4d4d4] rounded text-xs overflow-auto font-mono">{element.content}</pre>
              {/if}
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  </div>

  <!-- Controls overlay -->
  {#if showControls}
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-opacity">
      <div class="flex items-center justify-between max-w-4xl mx-auto">
        <div class="text-white text-sm">
          {currentSlide + 1} / {visibleSlides.length}
        </div>

        <div class="flex items-center gap-4">
          <button
            onclick={prevSlide}
            disabled={currentSlide === 0}
            class="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 disabled:opacity-30 transition-colors cursor-pointer"
          >
            <ChevronLeft class="size-6" />
          </button>

          <button
            onclick={nextSlide}
            disabled={currentSlide >= visibleSlides.length - 1}
            class="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 disabled:opacity-30 transition-colors cursor-pointer"
          >
            <ChevronRight class="size-6" />
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button
            onclick={toggleFullscreen}
            class="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
          >
            {#if isFullscreen}
              <Minimize class="size-5" />
            {:else}
              <Maximize class="size-5" />
            {/if}
          </button>
          <button
            onclick={onClose}
            class="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
          >
            <X class="size-5" />
          </button>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="mt-4 h-1 bg-white/20 rounded-full overflow-hidden max-w-4xl mx-auto">
        <div
          class="h-full bg-[var(--ui-primary)] transition-all duration-300"
          style="width: {((currentSlide + 1) / visibleSlides.length) * 100}%"
        ></div>
      </div>

      <!-- Slide thumbnails -->
      <div class="mt-4 flex justify-center gap-2 overflow-x-auto max-w-4xl mx-auto">
        {#each visibleSlides as slide, i}
          <button
            onclick={() => currentSlide = i}
            class={cn(
              "w-16 h-10 rounded border-2 flex-shrink-0 transition-all cursor-pointer overflow-hidden",
              i === currentSlide
                ? "border-[var(--ui-primary)] shadow-md"
                : "border-white/20 hover:border-white/50"
            )}
          >
            <div class="w-full h-full bg-white p-0.5 text-[5px] leading-tight">
              {#each slide.elements.filter((e) => e.type === 'text').slice(0, 2) as el}
                <div class="truncate">{el.content.slice(0, 15)}</div>
              {/each}
            </div>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  @keyframes fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slide-left {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slide-right {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes zoom {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  .animate-fade { animation: fade 0.5s ease-out; }
  .animate-slide-left { animation: slide-left 0.5s ease-out; }
  .animate-slide-right { animation: slide-right 0.5s ease-out; }
  .animate-zoom { animation: zoom 0.5s ease-out; }
</style>
