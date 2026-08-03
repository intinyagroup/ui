<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Minimize, Settings } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import { getFilterString, getTransformString } from '../effects/effects.js';
  import { getTransitionStyles } from '../transitions/transitions.js';
  import type { Composition, Sequence, Transition } from '../core.js';
  import { interpolateKeyframes } from '../core.js';

  let {
    composition,
    onTimeUpdate,
    onComplete,
  }: {
    composition: Composition;
    onTimeUpdate?: (frame: number) => void;
    onComplete?: () => void;
  } = $props();

  let currentFrame = $state(0);
  let isPlaying = $state(false);
  let isMuted = $state(false);
  let volume = $state(1);
  let playbackRate = $state(1);
  let showControls = $state(true);
  let controlsTimer: ReturnType<typeof setTimeout> | null = null;
  let canvas: HTMLCanvasElement | null = $state(null);
  let animationFrame: number | null = $state(null);
  let lastTimestamp = 0;

  const totalDuration = $derived(composition.durationMs);
  const progress = $derived(currentFrame / composition.durationInFrames);
  const currentTimecode = $derived(formatTimecode(currentFrame, composition.fps));

  function formatTimecode(frame: number, fps: number): string {
    const ms = (frame / fps) * 1000;
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const frames = frame % fps;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  }

  function render() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = composition;

    // Clear
    ctx.fillStyle = composition.background;
    ctx.fillRect(0, 0, width, height);

    // Render sequences
    for (const seq of composition.sequences) {
      if (currentFrame < seq.from || currentFrame >= seq.from + seq.durationInFrames) continue;

      const relativeFrame = currentFrame - seq.from;
      renderSequence(ctx, seq, relativeFrame, width, height);
    }
  }

  function renderSequence(
    ctx: CanvasRenderingContext2D,
    seq: Sequence,
    relativeFrame: number,
    canvasWidth: number,
    canvasHeight: number
  ) {
    ctx.save();

    // Apply style transforms
    const x = (seq.style.x ?? 0) * (canvasWidth / 100);
    const y = (seq.style.y ?? 0) * (canvasHeight / 100);
    const w = (seq.style.width ?? 100) * (canvasWidth / 100);
    const h = (seq.style.height ?? 100) * (canvasHeight / 100);
    const rotation = seq.style.rotation ?? 0;
    const scale = seq.style.scale ?? 1;
    const opacity = seq.style.opacity ?? 1;

    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.globalAlpha = opacity;

    // Apply effects
    const filterStr = getFilterString(seq.effects, relativeFrame);
    if (filterStr !== 'none') ctx.filter = filterStr;

    const transformStr = getTransformString(seq.effects, relativeFrame);
    if (transformStr !== 'none') {
      const transform = new DOMMatrix(transformStr);
      ctx.setTransform(transform.multiply(ctx.getTransform()));
    }

    // Render based on type
    switch (seq.type) {
      case 'text':
        renderText(ctx, seq, -w / 2, -h / 2, w, h);
        break;
      case 'shape':
        renderShape(ctx, seq, -w / 2, -h / 2, w, h);
        break;
      case 'image':
        // Image rendering handled separately with pre-loaded images
        break;
    }

    ctx.restore();
  }

  function renderText(
    ctx: CanvasRenderingContext2D,
    seq: Sequence,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const content = seq.props.content ?? 'Text';
    const fontSize = seq.props.fontSize ?? 48;
    const fontFamily = seq.props.fontFamily ?? 'sans-serif';
    const fontWeight = seq.props.fontWeight ?? 'normal';
    const color = seq.props.color ?? '#ffffff';
    const textAlign = seq.props.textAlign ?? 'center';

    ctx.fillStyle = color;
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textAlign = textAlign as CanvasTextAlign;
    ctx.textBaseline = 'middle';

    const lines = content.split('\n');
    const lineHeight = fontSize * 1.2;
    const startY = y + height / 2 - ((lines.length - 1) * lineHeight) / 2;

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x + width / 2, startY + i * lineHeight);
    }
  }

  function renderShape(
    ctx: CanvasRenderingContext2D,
    seq: Sequence,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const shapeType = seq.props.shape ?? 'rectangle';
    const fillColor = seq.props.fill ?? '#3b82f6';
    const strokeColor = seq.props.stroke ?? 'transparent';
    const strokeWidth = seq.props.strokeWidth ?? 0;

    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;

    switch (shapeType) {
      case 'rectangle':
        ctx.fillRect(x, y, width, height);
        if (strokeWidth > 0) ctx.strokeRect(x, y, width, height);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height / 2, Math.min(width, height) / 2, 0, Math.PI * 2);
        ctx.fill();
        if (strokeWidth > 0) ctx.stroke();
        break;
      case 'ellipse':
        ctx.beginPath();
        ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        if (strokeWidth > 0) ctx.stroke();
        break;
    }
  }

  function play() {
    if (isPlaying) return;
    isPlaying = true;
    lastTimestamp = performance.now();
    animate();
  }

  function pause() {
    isPlaying = false;
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  }

  function animate(timestamp?: number) {
    if (!isPlaying) return;

    if (timestamp && lastTimestamp) {
      const delta = timestamp - lastTimestamp;
      const framesToAdvance = Math.round((delta / 1000) * composition.fps * playbackRate);
      currentFrame = Math.min(currentFrame + framesToAdvance, composition.durationInFrames);
      onTimeUpdate?.(currentFrame);

      if (currentFrame >= composition.durationInFrames) {
        pause();
        onComplete?.();
        return;
      }
    }

    lastTimestamp = timestamp ?? 0;
    render();
    animationFrame = requestAnimationFrame(animate);
  }

  function seekTo(frame: number) {
    currentFrame = Math.max(0, Math.min(frame, composition.durationInFrames - 1));
    render();
    onTimeUpdate?.(currentFrame);
  }

  function seekToProgress(p: number) {
    seekTo(Math.round(p * composition.durationInFrames));
  }

  function toggleFullscreen() {
    if (!canvas) return;
    if (!document.fullscreenElement) {
      canvas.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!showControls) return;
    switch (e.key) {
      case ' ':
        e.preventDefault();
        isPlaying ? pause() : play();
        break;
      case 'ArrowLeft':
        seekTo(currentFrame - composition.fps);
        break;
      case 'ArrowRight':
        seekTo(currentFrame + composition.fps);
        break;
      case 'f':
        toggleFullscreen();
        break;
    }
  }

  function resetControlsTimer() {
    showControls = true;
    if (controlsTimer) clearTimeout(controlsTimer);
    controlsTimer = setTimeout(() => { showControls = false; }, 3000);
  }

  onMount(() => {
    render();
    window.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    pause();
    window.removeEventListener('keydown', handleKeydown);
    if (controlsTimer) clearTimeout(controlsTimer);
  });

  $effect(() => {
    if (!isPlaying) render();
  });
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  class="relative bg-black rounded-lg overflow-hidden"
  onmousemove={resetControlsTimer}
  ondblclick={toggleFullscreen}
>
  <canvas
    bind:this={canvas}
    width={composition.width}
    height={composition.height}
    class="w-full h-auto"
  ></canvas>

  <!-- Controls overlay -->
  {#if showControls}
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity">
      <!-- Progress bar -->
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <div
        class="w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 group"
        onclick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          seekToProgress((e.clientX - rect.left) / rect.width);
        }}
      >
        <div
          class="h-full bg-[var(--ui-primary)] rounded-full transition-all"
          style="width: {progress * 100}%"
        ></div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button onclick={() => seekTo(0)} class="p-1 text-white/70 hover:text-white cursor-pointer">
            <SkipBack class="size-4" />
          </button>
          <button onclick={isPlaying ? pause : play} class="p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 cursor-pointer">
            {#if isPlaying}
              <Pause class="size-5" />
            {:else}
              <Play class="size-5" />
            {/if}
          </button>
          <button onclick={() => seekTo(composition.durationInFrames)} class="p-1 text-white/70 hover:text-white cursor-pointer">
            <SkipForward class="size-4" />
          </button>
          <span class="text-xs font-mono text-white/70">{currentTimecode}</span>
        </div>

        <div class="flex items-center gap-3">
          <button onclick={() => isMuted = !isMuted} class="p-1 text-white/70 hover:text-white cursor-pointer">
            {#if isMuted}
              <VolumeX class="size-4" />
            {:else}
              <Volume2 class="size-4" />
            {/if}
          </button>
          <button onclick={toggleFullscreen} class="p-1 text-white/70 hover:text-white cursor-pointer">
            <Maximize class="size-4" />
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
