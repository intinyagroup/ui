<script lang="ts">
  import { Play, Pause, SkipBack, SkipForward, Plus, Trash2, Eye, EyeOff, Lock, Unlock } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import type { MotionLayer, MotionProject } from '../motion-model.js';

  let {
    project,
    currentTime,
    isPlaying,
    onTimeChange,
    onPlay,
    onPause,
    onLayerSelect,
    onAddLayer,
    onRemoveLayer,
    onToggleVisibility,
    onToggleLock,
    selectedLayerId,
  }: {
    project: MotionProject;
    currentTime: number;
    isPlaying: boolean;
    onTimeChange: (time: number) => void;
    onPlay: () => void;
    onPause: () => void;
    onLayerSelect: (id: string | null) => void;
    onAddLayer: () => void;
    onRemoveLayer: (id: string) => void;
    onToggleVisibility: (id: string) => void;
    onToggleLock: (id: string) => void;
    selectedLayerId: string | null;
  } = $props();

  let timelineEl: HTMLDivElement | null = $state(null);
  let isDraggingPlayhead = $state(false);

  const totalFrames = $derived(Math.ceil((project.duration / 1000) * project.fps));
  const currentFrame = $derived(Math.round((currentTime / 1000) * project.fps));
  const timelineWidth = $derived(600);
  const pixelsPerMs = $derived(timelineWidth / project.duration);

  function formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const frames = Math.round((ms % 1000) / (1000 / project.fps));
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  }

  function handleTimelineClick(e: MouseEvent) {
    if (!timelineEl) return;
    const rect = timelineEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = Math.max(0, Math.min(project.duration, (x / timelineWidth) * project.duration));
    onTimeChange(time);
  }

  function handlePlayheadDragStart(e: MouseEvent) {
    isDraggingPlayhead = true;
    handleTimelineClick(e);
  }

  function handlePlayheadDrag(e: MouseEvent) {
    if (!isDraggingPlayhead) return;
    handleTimelineClick(e);
  }

  function handlePlayheadDragEnd() {
    isDraggingPlayhead = false;
  }

  function formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  }
</script>

<svelte:window onmouseup={handlePlayheadDragEnd} onmousemove={handlePlayheadDrag} />

<div class="border-t border-[var(--ui-border)] bg-[var(--ui-card)]">
  <!-- Transport controls -->
  <div class="flex items-center gap-3 px-4 py-2 border-b border-[var(--ui-border)]">
    <Button variant="ghost" size="sm" class="size-7 p-0" onclick={() => onTimeChange(0)}>
      <SkipBack class="size-4" />
    </Button>
    <Button variant="ghost" size="sm" class="size-7 p-0" onclick={isPlaying ? onPause : onPlay}>
      {#if isPlaying}
        <Pause class="size-4" />
      {:else}
        <Play class="size-4" />
      {/if}
    </Button>
    <Button variant="ghost" size="sm" class="size-7 p-0" onclick={() => onTimeChange(project.duration)}>
      <SkipForward class="size-4" />
    </Button>

    <div class="text-xs font-mono text-[var(--ui-muted-foreground)]">
      {formatTime(currentTime)} / {formatTime(project.duration)}
    </div>

    <div class="flex-1"></div>

    <span class="text-[10px] text-[var(--ui-muted-foreground)]">
      {project.fps}fps · {project.width}×{project.height}
    </span>
  </div>

  <!-- Timeline -->
  <div class="flex">
    <!-- Layer list -->
    <div class="w-48 border-r border-[var(--ui-border)]">
      <div class="flex items-center justify-between px-3 py-1.5 border-b border-[var(--ui-border)]">
        <span class="text-[10px] font-medium text-[var(--ui-muted-foreground)]">Layers</span>
        <button onclick={onAddLayer} class="p-0.5 rounded hover:bg-[var(--ui-secondary)] cursor-pointer">
          <Plus class="size-3.5" />
        </button>
      </div>

      <div class="max-h-40 overflow-auto">
        {#each project.layers as layer (layer.id)}
          <div
            class={cn(
              "flex items-center gap-2 px-3 py-1.5 border-b border-[var(--ui-border)]/50 cursor-pointer text-xs",
              selectedLayerId === layer.id ? "bg-[var(--ui-primary)]/10" : "hover:bg-[var(--ui-secondary)]/50"
            )}
            onclick={() => onLayerSelect(layer.id)}
          >
            <button onclick|stopPropagation={() => onToggleVisibility(layer.id)} class="text-[var(--ui-muted-foreground)] cursor-pointer">
              {#if layer.visible}
                <Eye class="size-3" />
              {:else}
                <EyeOff class="size-3 opacity-50" />
              {/if}
            </button>
            <button onclick|stopPropagation={() => onToggleLock(layer.id)} class="text-[var(--ui-muted-foreground)] cursor-pointer">
              {#if layer.locked}
                <Lock class="size-3" />
              {:else}
                <Unlock class="size-3 opacity-50" />
              {/if}
            </button>
            <span class="truncate flex-1 {layer.visible ? '' : 'opacity-50'}">{layer.name}</span>
            <button onclick|stopPropagation={() => onRemoveLayer(layer.id)} class="text-[var(--ui-muted-foreground)] hover:text-[var(--ui-destructive)] cursor-pointer opacity-0 group-hover:opacity-100">
              <Trash2 class="size-3" />
            </button>
          </div>
        {/each}

        {#if project.layers.length === 0}
          <div class="px-3 py-4 text-[10px] text-center text-[var(--ui-muted-foreground)]">
            No layers. Click + to add.
          </div>
        {/if}
      </div>
    </div>

    <!-- Timeline tracks -->
    <div class="flex-1 overflow-auto">
      <div
        bind:this={timelineEl}
        class="relative h-40 cursor-pointer"
        style="width: {timelineWidth}px;"
        onclick={handleTimelineClick}
        onmousedown={handlePlayheadDragStart}
      >
        <!-- Time markers -->
        <div class="absolute inset-0">
          {#each Array.from({ length: Math.ceil(project.duration / 1000) + 1 }, (_, i) => i) as second}
            <div
              class="absolute top-0 bottom-0 border-l border-[var(--ui-border)]/30"
              style="left: {second * 1000 * pixelsPerMs}px;"
            >
              <span class="absolute top-0.5 left-1 text-[8px] text-[var(--ui-muted-foreground)]">
                {second}s
              </span>
            </div>
          {/each}
        </div>

        <!-- Layer tracks -->
        {#each project.layers as layer, index (layer.id)}
          <div
            class="absolute left-0 right-0 border-b border-[var(--ui-border)]/20"
            style="top: {index * 32}px; height: 32px;"
          >
            <!-- Layer bar -->
            <div
              class="absolute top-1 bottom-1 rounded bg-[var(--ui-primary)]/20 border border-[var(--ui-primary)]/30"
              style="left: {layer.startTime * pixelsPerMs}px; width: {layer.duration * pixelsPerMs}px;"
            >
              <span class="absolute inset-0 flex items-center px-2 text-[9px] text-[var(--ui-primary)] truncate">
                {layer.name}
              </span>
            </div>
          </div>
        {/each}

        <!-- Playhead -->
        <div
          class="absolute top-0 bottom-0 w-0.5 bg-[var(--ui-destructive)] z-10"
          style="left: {currentTime * pixelsPerMs}px;"
        >
          <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-[var(--ui-destructive)] rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
</div>
