<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import { cn } from 'clsx';
  import { twMerge } from 'tailwind-merge';

  let {
    width = 1440,
    height = 900,
    zoom = 1,
    class: className,
    children,
    onCanvasClick
  }: {
    width?: number;
    height?: number;
    zoom?: number;
    class?: string;
    children?: Snippet;
    onCanvasClick?: (e: MouseEvent) => void;
  } = $props();

  let canvasRef = $state<HTMLDivElement>();
  let panX = $state(0);
  let panY = $state(0);
  let isPanning = $state(false);
  let startX = $state(0);
  let startY = $state(0);

  function handleWheel(e: WheelEvent) {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      // Zoom
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      zoom = Math.max(0.1, Math.min(3, zoom + delta));
    }
  }

  function handleMiddleClick(e: MouseEvent) {
    if (e.button === 1) {
      isPanning = true;
      startX = e.clientX - panX;
      startY = e.clientY - panY;
    }
  }

  function handleMouseMove(e: MouseEvent) {
    if (isPanning) {
      panX = e.clientX - startX;
      panY = e.clientY - startY;
    }
  }

  function handleMouseUp() {
    isPanning = false;
  }
</script>

<div
  bind:this={canvasRef}
  class={twMerge(
    'relative overflow-hidden bg-[var(--ui-background)]',
    isPanning && 'cursor-grabbing',
    className
  )}
  onwheel={handleWheel}
  onmousedown={handleMiddleClick}
  onmousemove={handleMouseMove}
  onmouseup={handleMouseUp}
  onclick={onCanvasClick}
  role="application"
  aria-label="Editor canvas"
>
  <div
    class="absolute origin-top-left"
    style="transform: translate({panX}px, {panY}px) scale({zoom})"
  >
    <div class="relative" style="width: {width}px; height: {height}px">
      {@render children?.()}
    </div>
  </div>
</div>
