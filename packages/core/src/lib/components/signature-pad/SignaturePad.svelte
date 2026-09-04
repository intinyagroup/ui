<script lang="ts">
  import { cn } from '../../utils.js';
  import { Eraser, Download } from 'lucide-svelte';
  import { Button } from '../button/index.js';

  let {
    width = 400,
    height = 200,
    lineWidth = 2,
    lineColor = '#000000',
    disabled = false,
    class: className,
    onSign,
  }: {
    width?: number;
    height?: number;
    lineWidth?: number;
    lineColor?: string;
    disabled?: boolean;
    class?: string;
    onSign?: (dataUrl: string) => void;
  } = $props();

  let canvas: HTMLCanvasElement | null = null;
  let isDrawing = $state(false);
  let hasContent = $state(false);

  onMount(() => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  });

  import { onMount } from 'svelte';

  function getPos(e: MouseEvent | TouchEvent) {
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function startDrawing(e: MouseEvent | TouchEvent) {
    if (disabled) return;
    isDrawing = true;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e: MouseEvent | TouchEvent) {
    if (!isDrawing || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    hasContent = true;
  }

  function stopDrawing() { isDrawing = false; }

  function clear() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    hasContent = false;
  }

  function save() {
    if (!canvas) return;
    onSign?.(canvas.toDataURL('image/png'));
  }
</script>

<div class={cn('space-y-2', className)}>
  <canvas
    bind:this={canvas}
    {width}
    {height}
    class="rounded-lg border border-[var(--ui-border)] cursor-crosshair"
    onmousedown={startDrawing}
    onmousemove={draw}
    onmouseup={stopDrawing}
    onmouseleave={stopDrawing}
    ontouchstart={startDrawing}
    ontouchmove={draw}
    ontouchend={stopDrawing}
  ></canvas>

  <div class="flex items-center justify-between">
    <span class="text-xs text-[var(--ui-muted-foreground)]">
      {hasContent ? 'Sign above' : 'Click and drag to sign'}
    </span>
    <div class="flex gap-1">
      <Button variant="ghost" size="sm" onclick={clear} class="h-7 text-xs">
        <Eraser class="size-3 mr-1" /> Clear
      </Button>
      {#if hasContent}
        <Button size="sm" onclick={save} class="h-7 text-xs">
          <Download class="size-3 mr-1" /> Save
        </Button>
      {/if}
    </div>
  </div>
</div>
