<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Minimize, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import { getFilterString, getTransformString } from '../effects/effects.js';
  import { interpolateKeyframes, type Composition, type Sequence } from '../core.js';

  let {
    composition,
    inputProps = {},
    loop = false,
    autoPlay = false,
    clickToPlay = true,
    controls = true,
    showVolume = true,
    showPlaybackRate = true,
    showFrameCounter = true,
    style,
    class: className,
    onReady,
    onPlay,
    onPause,
    onEnded,
    onFrameUpdate,
    onClick,
  }: {
    /** Composition to render */
    composition: Composition;
    /** Props passed to composition */
    inputProps?: Record<string, any>;
    /** Loop playback */
    loop?: boolean;
    /** Auto-play on mount */
    autoPlay?: boolean;
    /** Click canvas to play/pause */
    clickToPlay?: boolean;
    /** Show playback controls */
    controls?: boolean;
    /** Show volume control */
    showVolume?: boolean;
    /** Show playback rate selector */
    showPlaybackRate?: boolean;
    /** Show frame counter */
    showFrameCounter?: boolean;
    style?: string;
    class?: string;
    onReady?: (player: PlayerAPI) => void;
    onPlay?: () => void;
    onPause?: () => void;
    onEnded?: () => void;
    onFrameUpdate?: (frame: number) => void;
    onClick?: () => void;
  } = $props();

  let currentFrame = $state(0);
  let isPlaying = $state(false);
  let isMuted = $state(false);
  let volume = $state(1);
  let playbackRate = $state(1);
  let showControls = $state(true);
  let controlsTimer: ReturnType<typeof setTimeout> | null = null;
  let canvas: HTMLCanvasElement | null = null;
  let containerEl: HTMLDivElement | null = null;
  let animationFrame: number | null = null;
  let lastTimestamp = 0;
  let isFullscreen = $state(false);

  const totalDuration = $derived(composition.durationMs);
  const progress = $derived(currentFrame / Math.max(1, composition.durationInFrames));
  const currentTimecode = $derived(formatTimecode(currentFrame, composition.fps));
  const totalTimecode = $derived(formatTimecode(composition.durationInFrames, composition.fps));
  const isAtEnd = $derived(currentFrame >= composition.durationInFrames - 1);

  // Public API exposed via onReady
  type PlayerAPI = {
    play: () => void;
    pause: () => void;
    seekTo: (frame: number) => void;
    seekToTime: (ms: number) => void;
    togglePlay: () => void;
    getCurrentFrame: () => number;
    setCurrentFrame: (frame: number) => void;
    setPlaybackRate: (rate: number) => void;
    setVolume: (vol: number) => void;
    setMuted: (muted: boolean) => void;
    getDuration: () => number;
    getFps: () => number;
    isPlaying: () => boolean;
  };

  function formatTimecode(frame: number, fps: number = composition.fps): string {
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
    ctx.fillStyle = composition.background;
    ctx.fillRect(0, 0, width, height);

    for (const seq of composition.sequences) {
      if (currentFrame < seq.from || currentFrame >= seq.from + seq.durationInFrames) continue;
      renderSequence(ctx, seq, currentFrame - seq.from, width, height);
    }
  }

  function renderSequence(ctx: CanvasRenderingContext2D, seq: Sequence, relFrame: number, cw: number, ch: number) {
    ctx.save();
    const x = (seq.style.x ?? 0) * (cw / 100);
    const y = (seq.style.y ?? 0) * (ch / 100);
    const w = (seq.style.width ?? 100) * (cw / 100);
    const h = (seq.style.height ?? 100) * (ch / 100);

    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(((seq.style.rotation ?? 0) * Math.PI) / 180);
    ctx.scale(seq.style.scale ?? 1, seq.style.scale ?? 1);
    ctx.globalAlpha = seq.style.opacity ?? 1;

    const filterStr = getFilterString(seq.effects, relFrame);
    if (filterStr !== 'none') ctx.filter = filterStr;

    const transformStr = getTransformString(seq.effects, relFrame);
    if (transformStr !== 'none') {
      const m = new DOMMatrix(transformStr);
      ctx.setTransform(m.multiply(ctx.getTransform()));
    }

    if (seq.type === 'text') {
      ctx.fillStyle = seq.props.color ?? '#ffffff';
      ctx.font = `${seq.props.fontWeight ?? 'normal'} ${seq.props.fontSize ?? 48}px ${seq.props.fontFamily ?? 'sans-serif'}`;
      ctx.textAlign = (seq.props.textAlign as CanvasTextAlign) ?? 'center';
      ctx.textBaseline = 'middle';
      const lines = (seq.props.content ?? 'Text').split('\n');
      const lh = (seq.props.fontSize ?? 48) * 1.2;
      const startY = -((lines.length - 1) * lh) / 2;
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], 0, startY + i * lh);
      }
    } else if (seq.type === 'shape') {
      ctx.fillStyle = seq.props.fill ?? '#3b82f6';
      const shape = seq.props.shape ?? 'rectangle';
      if (shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, Math.min(w, h) / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (shape === 'ellipse') {
        ctx.beginPath();
        ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-w / 2, -h / 2, w, h);
      }
    }

    ctx.restore();
  }

  function play() {
    if (isPlaying) return;
    isPlaying = true;
    lastTimestamp = 0;
    animate();
    onPlay?.();
  }

  function pause() {
    isPlaying = false;
    if (animationFrame) { cancelAnimationFrame(animationFrame); animationFrame = null; }
    onPause?.();
  }

  function animate(ts?: number) {
    if (!isPlaying) return;
    if (ts && lastTimestamp) {
      const delta = ts - lastTimestamp;
      const frames = Math.round((delta / 1000) * composition.fps * playbackRate);
      currentFrame = Math.min(currentFrame + frames, composition.durationInFrames - 1);
      onFrameUpdate?.(currentFrame);

      if (currentFrame >= composition.durationInFrames - 1) {
        if (loop) {
          currentFrame = 0;
        } else {
          pause();
          onEnded?.();
          return;
        }
      }
    }
    lastTimestamp = ts ?? 0;
    render();
    animationFrame = requestAnimationFrame(animate);
  }

  function seekTo(frame: number) {
    currentFrame = Math.max(0, Math.min(frame, composition.durationInFrames - 1));
    render();
    onFrameUpdate?.(currentFrame);
  }

  function seekToTime(ms: number) {
    seekTo(Math.round((ms / 1000) * composition.fps));
  }

  function prevFrame() { seekTo(currentFrame - 1); }
  function nextFrame() { seekTo(currentFrame + 1); }

  function handleCanvasClick() {
    if (clickToPlay) {
      isPlaying ? pause() : play();
    }
    onClick?.();
  }

  function toggleFullscreen() {
    if (!containerEl) return;
    if (!document.fullscreenElement) {
      containerEl.requestFullscreen();
      isFullscreen = true;
    } else {
      document.exitFullscreen();
      isFullscreen = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case ' ': e.preventDefault(); isPlaying ? pause() : play(); break;
      case 'ArrowLeft': e.preventDefault(); prevFrame(); break;
      case 'ArrowRight': e.preventDefault(); nextFrame(); break;
      case 'f': toggleFullscreen(); break;
    }
  }

  function resetControlsTimer() {
    showControls = true;
    if (controlsTimer) clearTimeout(controlsTimer);
    controlsTimer = setTimeout(() => { showControls = false; }, 3000);
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    render();
    if (autoPlay) play();
    onReady?.({
      play, pause, seekTo, seekToTime,
      togglePlay: () => isPlaying ? pause() : play(),
      getCurrentFrame: () => currentFrame,
      setCurrentFrame: seekTo,
      setPlaybackRate: (r: number) => { playbackRate = r; },
      setVolume: (v: number) => { volume = v; },
      setMuted: (m: boolean) => { isMuted = m; },
      getDuration: () => totalDuration,
      getFps: () => composition.fps,
      isPlaying: () => isPlaying,
    });
  });

  onDestroy(() => {
    pause();
    window.removeEventListener('keydown', handleKeydown);
    if (controlsTimer) clearTimeout(controlsTimer);
  });

  $effect(() => { if (!isPlaying) render(); });
</script>

<div bind:this={containerEl} class={cn('relative rounded-xl overflow-hidden bg-black', className)} {style}
  onmousemove={resetControlsTimer}>
  <!-- Canvas -->
  <canvas
    bind:this={canvas}
    width={composition.width}
    height={composition.height}
    class="w-full h-auto cursor-pointer"
    onclick={handleCanvasClick}
  ></canvas>

  <!-- Controls overlay -->
  {#if controls && showControls}
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-opacity">
      <!-- Progress bar -->
      <div
        class="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-3 group/progress hover:h-3 transition-all"
        onclick={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          seekTo(Math.round(pct * composition.durationInFrames));
        }}
      >
        <div class="h-full bg-[var(--ui-primary)] rounded-full relative transition-all" style="width: {progress * 100}%;">
          <div class="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--ui-primary)] opacity-0 group-hover/progress:opacity-100 shadow-lg transition-opacity"></div>
        </div>
      </div>

      <div class="flex items-center justify-between gap-4">
        <!-- Left: transport -->
        <div class="flex items-center gap-2">
          <button onclick={prevFrame} class="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer" title="Previous frame">
            <ChevronLeft class="size-5" />
          </button>
          <button onclick={() => isPlaying ? pause() : play()} class="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer">
            {#if isPlaying}
              <Pause class="size-5" />
            {:else}
              <Play class="size-5" />
            {/if}
          </button>
          <button onclick={nextFrame} class="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer" title="Next frame">
            <ChevronRight class="size-5" />
          </button>
        </div>

        <!-- Center: time -->
        {#if showFrameCounter}
          <div class="text-sm font-mono text-white/80">
            <span class="text-white">{currentTimecode}</span>
            <span class="text-white/40 mx-1">/</span>
            <span>{totalTimecode}</span>
          </div>
        {/if}

        <!-- Right: controls -->
        <div class="flex items-center gap-2">
          {#if showPlaybackRate}
            <select
              bind:value={playbackRate}
              class="h-8 px-2 rounded-lg bg-white/10 text-white text-xs border-none outline-none cursor-pointer"
            >
              <option value={0.25}>0.25x</option>
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          {/if}

          {#if showVolume}
            <button onclick={() => isMuted = !isMuted} class="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
              {#if isMuted}
                <VolumeX class="size-4" />
              {:else}
                <Volume2 class="size-4" />
              {/if}
            </button>
          {/if}

          <button onclick={toggleFullscreen} class="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            {#if isFullscreen}
              <Minimize class="size-4" />
            {:else}
              <Maximize class="size-4" />
            {/if}
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
