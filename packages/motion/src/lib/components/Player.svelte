<script lang="ts">
  import { onMount, onDestroy, setContext, getContext } from 'svelte';
  import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Minimize } from 'lucide-svelte';
  import { getFilterString, getTransformString } from '../effects/effects.js';
  import { interpolateKeyframes, type Composition, type Sequence } from '../core.js';

  // ---- Props (Remotion Player API parity) ----
  let {
    composition,
    inputProps = {},
    loop = false,
    autoPlay = false,
    clickToPlay = true,
    controls = true,
    doubleClickToFullscreen = false,
    spaceKeyToPlayOrPause = true,
    moveToBeginningWhenEnded = true,
    showVolumeControls = true,
    showPlaybackRateControl = false,
    playbackRate = 1,
    initialFrame = 0,
    inFrame = null,
    outFrame = null,
    allowFullscreen = true,
    alwaysShowControls = false,
    hideControlsWhenPointerDoesntMove = true,
    style,
    class: className,
    overflowVisible = false,
    // Poster
    renderPoster,
    showPosterWhenUnplayed = false,
    showPosterWhenPaused = false,
    showPosterWhenEnded = false,
    // Loading/Error
    renderLoading,
    errorFallback,
    // Custom renderers
    renderPlayPauseButton,
    renderFullscreenButton,
    renderMuteButton,
    renderCustomControls,
    // Callbacks
    onReady,
    onPlay,
    onPause,
    onEnded,
    onFrameUpdate,
    onError,
    onClick,
  }: {
    composition: Composition;
    inputProps?: Record<string, any>;
    loop?: boolean;
    autoPlay?: boolean;
    clickToPlay?: boolean;
    controls?: boolean;
    doubleClickToFullscreen?: boolean;
    spaceKeyToPlayOrPause?: boolean;
    moveToBeginningWhenEnded?: boolean;
    showVolumeControls?: boolean;
    showPlaybackRateControl?: boolean;
    playbackRate?: number;
    initialFrame?: number;
    inFrame?: number | null;
    outFrame?: number | null;
    allowFullscreen?: boolean;
    alwaysShowControls?: boolean;
    hideControlsWhenPointerDoesntMove?: boolean;
    style?: string;
    class?: string;
    overflowVisible?: boolean;
    // Poster
    renderPoster?: (params: { isBuffering: boolean }) => any;
    showPosterWhenUnplayed?: boolean;
    showPosterWhenPaused?: boolean;
    showPosterWhenEnded?: boolean;
    // Loading/Error
    renderLoading?: (params: { height: number; width: number }) => any;
    errorFallback?: (params: { error: Error }) => any;
    // Custom renderers
    renderPlayPauseButton?: (params: { playing: boolean; isBuffering: boolean }) => any;
    renderFullscreenButton?: (params: { isFullscreen: boolean }) => any;
    renderMuteButton?: (params: { muted: boolean; volume: number }) => any;
    renderCustomControls?: any;
    // Callbacks
    onReady?: (api: PlayerAPI) => void;
    onPlay?: () => void;
    onPause?: () => void;
    onEnded?: () => void;
    onFrameUpdate?: (frame: number) => void;
    onError?: (error: Error) => void;
    onClick?: () => void;
  } = $props();

  // ---- State ----
  let currentFrame = $state(initialFrame);
  let isPlaying = $state(false);
  let isMuted = $state(false);
  let volume = $state(1);
  let currentPlaybackRate = $state(playbackRate);
  let showControlsTimer = $state(true);
  let controlsTimer: ReturnType<typeof setTimeout> | null = null;
  let canvas: HTMLCanvasElement | null = null;
  let containerEl: HTMLDivElement | null = null;
  let animationFrame: number | null = null;
  let lastTimestamp = 0;
  let isFullscreen = $state(false);
  let isBuffering = $state(false);
  let hasStarted = $state(false);
  let lastClickTime = 0;

  // ---- Derived ----
  const effectiveFrameStart = $derived(inFrame ?? 0);
  const effectiveFrameEnd = $derived(outFrame ?? composition.durationInFrames - 1);
  const effectiveDuration = $derived(effectiveFrameEnd - effectiveFrameStart + 1);
  const totalDurationMs = $derived((composition.durationInFrames / composition.fps) * 1000);
  const progress = $derived(currentFrame / Math.max(1, composition.durationInFrames));
  const currentTimecode = $derived(formatTimecode(currentFrame, composition.fps));
  const totalTimecode = $derived(formatTimecode(composition.durationInFrames, composition.fps));
  const scale = $derived(containerEl && canvas
    ? containerEl.clientWidth / composition.width
    : 1);

  // ---- Event system ----
  type PlayerEvent = 'play' | 'pause' | 'ended' | 'seeked' | 'timeupdate' | 'frameupdate' | 'fullscreenchange' | 'mutechange' | 'volumechange' | 'error' | 'waiting' | 'resume';
  type EventCallback = (detail?: any) => void;
  let eventListeners = $state<Record<string, EventCallback[]>>({});

  function emit(event: PlayerEvent, detail?: any) {
    const listeners = eventListeners[event] ?? [];
    for (const cb of listeners) cb(detail);
  }

  // ---- PlayerAPI (public) ----
  type PlayerAPI = {
    play: (e?: Event) => void;
    pause: () => void;
    pauseAndReturnToPlayStart: () => void;
    toggle: () => void;
    seekTo: (frame: number) => void;
    getCurrentFrame: () => number;
    setCurrentFrame: (frame: number) => void;
    isPlaying: () => boolean;
    getDuration: () => number;
    getFps: () => number;
    getScale: () => number;
    getContainerNode: () => HTMLDivElement | null;
    mute: () => void;
    unmute: () => void;
    isMuted: () => boolean;
    getVolume: () => number;
    setVolume: (v: number) => void;
    setPlaybackRate: (r: number) => void;
    requestFullscreen: () => void;
    exitFullscreen: () => void;
    isFullscreen: () => boolean;
    addEventListener: (event: PlayerEvent, cb: EventCallback) => void;
    removeEventListener: (event: PlayerEvent, cb: EventCallback) => void;
  };

  function createPlayerAPI(): PlayerAPI {
    return {
      play: (e?: Event) => play(e),
      pause: () => pause(),
      pauseAndReturnToPlayStart: () => { pause(); seekTo(initialFrame); },
      toggle: () => isPlaying ? pause() : play(),
      seekTo,
      getCurrentFrame: () => currentFrame,
      setCurrentFrame: seekTo,
      isPlaying: () => isPlaying,
      getDuration: () => totalDurationMs,
      getFps: () => composition.fps,
      getScale: () => scale,
      getContainerNode: () => containerEl,
      mute: () => { isMuted = true; emit('mutechange', { isMuted: true }); },
      unmute: () => { isMuted = false; emit('mutechange', { isMuted: false }); },
      isMuted: () => isMuted,
      getVolume: () => volume,
      setVolume: (v) => { volume = Math.max(0, Math.min(1, v)); emit('volumechange', { volume }); },
      setPlaybackRate: (r) => { currentPlaybackRate = r; },
      requestFullscreen: () => { if (allowFullscreen) toggleFullscreen(); },
      exitFullscreen: () => { if (isFullscreen) toggleFullscreen(); },
      isFullscreen: () => isFullscreen,
      addEventListener: (event, cb) => {
        if (!eventListeners[event]) eventListeners[event] = [];
        eventListeners[event].push(cb);
      },
      removeEventListener: (event, cb) => {
        if (!eventListeners[event]) return;
        eventListeners[event] = eventListeners[event].filter((c) => c !== cb);
      },
    };
  }

  // ---- Canvas rendering ----
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
    ctx.clearRect(0, 0, width, height);
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
    if (transformStr !== 'none') { const m = new DOMMatrix(transformStr); ctx.setTransform(m.multiply(ctx.getTransform())); }
    if (seq.type === 'text') {
      ctx.fillStyle = seq.props.color ?? '#ffffff';
      ctx.font = `${seq.props.fontWeight ?? 'normal'} ${seq.props.fontSize ?? 48}px ${seq.props.fontFamily ?? 'sans-serif'}`;
      ctx.textAlign = (seq.props.textAlign as CanvasTextAlign) ?? 'center';
      ctx.textBaseline = 'middle';
      const lines = (seq.props.content ?? 'Text').split('\n');
      const lh = (seq.props.fontSize ?? 48) * 1.2;
      const startY = -((lines.length - 1) * lh) / 2;
      for (let i = 0; i < lines.length; i++) ctx.fillText(lines[i], 0, startY + i * lh);
    } else if (seq.type === 'shape') {
      ctx.fillStyle = seq.props.fill ?? '#3b82f6';
      if (seq.props.shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, Math.min(w, h) / 2, 0, Math.PI * 2); ctx.fill(); }
      else if (seq.props.shape === 'ellipse') { ctx.beginPath(); ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2); ctx.fill(); }
      else ctx.fillRect(-w / 2, -h / 2, w, h);
    }
    ctx.restore();
  }

  // ---- Playback ----
  function play(e?: Event) {
    if (isPlaying) return;
    isPlaying = true;
    hasStarted = true;
    lastTimestamp = 0;
    animate();
    emit('play');
    onPlay?.();
  }

  function pause() {
    isPlaying = false;
    if (animationFrame) { cancelAnimationFrame(animationFrame); animationFrame = null; }
    emit('pause');
    onPause?.();
  }

  function animate(ts?: number) {
    if (!isPlaying) return;
    if (ts && lastTimestamp) {
      const delta = ts - lastTimestamp;
      const frames = Math.round((delta / 1000) * composition.fps * currentPlaybackRate);
      const nextFrame = currentFrame + frames;

      if (nextFrame >= effectiveFrameEnd + 1) {
        if (loop) {
          currentFrame = effectiveFrameStart;
          emit('frameupdate', { frame: currentFrame });
        } else {
          currentFrame = effectiveFrameEnd;
          pause();
          if (moveToBeginningWhenEnded) currentFrame = effectiveFrameStart;
          emit('ended');
          onEnded?.();
          return;
        }
      } else {
        currentFrame = Math.max(effectiveFrameStart, nextFrame);
      }
      onFrameUpdate?.(currentFrame);
      emit('frameupdate', { frame: currentFrame });
    }
    lastTimestamp = ts ?? 0;
    render();
    animationFrame = requestAnimationFrame(animate);
  }

  function seekTo(frame: number) {
    const wasPlaying = isPlaying;
    if (wasPlaying) { if (animationFrame) cancelAnimationFrame(animationFrame); animationFrame = null; }
    currentFrame = Math.max(effectiveFrameStart, Math.min(frame, effectiveFrameEnd));
    render();
    emit('seeked', { frame: currentFrame });
    if (wasPlaying) animate();
  }

  function prevFrame() { seekTo(currentFrame - 1); }
  function nextFrame() { seekTo(currentFrame + 1); }

  function handleCanvasClick(e: MouseEvent) {
    const now = Date.now();
    if (doubleClickToFullscreen && now - lastClickTime < 300) {
      toggleFullscreen();
      lastClickTime = 0;
      return;
    }
    lastClickTime = now;
    if (clickToPlay) { isPlaying ? pause() : play(); }
    onClick?.();
  }

  function toggleFullscreen() {
    if (!containerEl || !allowFullscreen) return;
    if (!document.fullscreenElement) { containerEl.requestFullscreen(); isFullscreen = true; }
    else { document.exitFullscreen(); isFullscreen = false; }
    emit('fullscreenchange', { isFullscreen });
  }

  // ---- Keyboard ----
  function handleKeydown(e: KeyboardEvent) {
    if (spaceKeyToPlayOrPause && e.key === ' ') { e.preventDefault(); isPlaying ? pause() : play(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prevFrame(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); nextFrame(); }
    if (allowFullscreen && e.key === 'f') toggleFullscreen();
  }

  // ---- Controls auto-hide ----
  function resetControlsTimer() {
    showControlsTimer = true;
    if (controlsTimer) clearTimeout(controlsTimer);
    if (hideControlsWhenPointerDoesntMove && !alwaysShowControls) {
      controlsTimer = setTimeout(() => { showControlsTimer = false; }, 3000);
    }
  }

  function fullscreenHandler() {
    isFullscreen = !!document.fullscreenElement;
    emit('fullscreenchange', { isFullscreen });
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    document.addEventListener('fullscreenchange', fullscreenHandler);
    render();
    if (autoPlay) setTimeout(() => play(), 100);
    onReady?.(createPlayerAPI());
  });

  onDestroy(() => {
    pause();
    window.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('fullscreenchange', fullscreenHandler);
    if (controlsTimer) clearTimeout(controlsTimer);
  });

  $effect(() => { if (!isPlaying) render(); });

  let error = $state<Error | null>(null);
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  bind:this={containerEl}
  class={cn('relative overflow-hidden bg-black', overflowVisible ? '' : 'rounded-xl', className)}
  {style}
  onmousemove={resetControlsTimer}
  role="application"
  aria-label="Video player"
>
  {#if error}
    {#if errorFallback}
      {@render errorFallback({ error })}
    {:else}
      <div class="flex items-center justify-center h-64 bg-red-950 text-red-200 text-sm">
        Error: {error.message}
      </div>
    {/if}
  {:else}
    <canvas
      bind:this={canvas}
      width={composition.width}
      height={composition.height}
      class="w-full h-auto {clickToPlay || doubleClickToFullscreen ? 'cursor-pointer' : ''}"
      onclick={handleCanvasClick}
    ></canvas>

    <!-- Poster overlay -->
    {#if renderPoster && !isPlaying && ((showPosterWhenUnplayed && !hasStarted) || (showPosterWhenPaused && hasStarted) || showPosterWhenEnded)}
      <div class="absolute inset-0 pointer-events-none">
        {@render renderPoster({ isBuffering })}
      </div>
    {/if}

    <!-- Controls -->
    {#if controls && showControlsTimer}
      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-opacity">
        <!-- Progress bar -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-3 group/progress hover:h-3 transition-all"
          onclick={(e) => {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            seekTo(Math.round(effectiveFrameStart + pct * effectiveDuration));
          }}
        >
          <div class="h-full bg-white rounded-full relative transition-all" style="width: {progress * 100}%;">
            <div class="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white opacity-0 group-hover/progress:opacity-100 shadow-lg transition-opacity"></div>
          </div>
        </div>

        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            {#if renderPlayPauseButton}
              <button onclick={() => isPlaying ? pause() : play()} class="cursor-pointer">
                {@render renderPlayPauseButton({ playing: isPlaying, isBuffering })}
              </button>
            {:else}
              <button onclick={() => isPlaying ? pause() : play()} class="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer">
                {#if isPlaying}
                  <Pause class="size-5" />
                {:else}
                  <Play class="size-5" />
                {/if}
              </button>
            {/if}
          </div>

          <div class="text-sm font-mono text-white/80">
            <span class="text-white">{currentTimecode}</span>
            <span class="text-white/40 mx-1">/</span>
            <span>{totalTimecode}</span>
          </div>

          <div class="flex items-center gap-2">
            {#if showPlaybackRateControl}
              <select bind:value={currentPlaybackRate} class="h-8 px-2 rounded-lg bg-white/10 text-white text-xs border-none outline-none cursor-pointer">
                <option value={0.25}>0.25x</option>
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            {/if}

            {#if showVolumeControls}
              {#if renderMuteButton}
                <button onclick={() => { isMuted = !isMuted; emit('mutechange', { isMuted }); }} class="cursor-pointer">
                  {@render renderMuteButton({ muted: isMuted, volume })}
                </button>
              {:else}
                <button onclick={() => { isMuted = !isMuted; emit('mutechange', { isMuted }); }} class="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                  {#if isMuted}
                    <VolumeX class="size-4" />
                  {:else}
                    <Volume2 class="size-4" />
                  {/if}
                </button>
              {/if}
            {/if}

            {#if allowFullscreen}
              {#if renderFullscreenButton}
                <button onclick={toggleFullscreen} class="cursor-pointer">
                  {@render renderFullscreenButton({ isFullscreen })}
                </button>
              {:else}
                <button onclick={toggleFullscreen} class="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                  {#if isFullscreen}
                    <Minimize class="size-4" />
                  {:else}
                    <Maximize class="size-4" />
                  {/if}
                </button>
              {/if}
            {/if}

            {#if renderCustomControls}
              {@render renderCustomControls()}
            {/if}
          </div>
        </div>
      </div>
    {/if}
  {/if}
</div>
