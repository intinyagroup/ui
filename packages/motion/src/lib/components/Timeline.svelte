<script lang="ts">
  import { Play, Pause, SkipBack, SkipForward, Plus, Trash2, Eye, EyeOff, Lock, Unlock } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import type { Composition, Track, Sequence } from '../core.js';
  import { createTrack, createSequence } from '../core.js';

  let {
    composition,
    currentFrame,
    isPlaying,
    onFrameChange,
    onPlay,
    onPause,
    onCompositionChange,
  }: {
    composition: Composition;
    currentFrame: number;
    isPlaying: boolean;
    onFrameChange: (frame: number) => void;
    onPlay: () => void;
    onPause: () => void;
    onCompositionChange: (comp: Composition) => void;
  } = $props();

  let timelineEl: HTMLDivElement | null = $state(null);
  let isDraggingPlayhead = $state(false);

  const tracks = $derived(composition.sequences.reduce<Track[]>((acc, seq) => {
    let track = acc.find((t) => t.type === seq.type);
    if (!track) {
      track = createTrack({ name: `${seq.type} track`, type: seq.type as Track['type'] });
      acc.push(track);
    }
    track.sequences.push(seq);
    return acc;
  }, []));

  const timelineWidth = $derived(800);
  const pixelsPerFrame = $derived(timelineWidth / composition.durationInFrames);
  const playheadX = $derived(currentFrame * pixelsPerFrame);

  function formatTimecode(frame: number): string {
    const ms = (frame / composition.fps) * 1000;
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const frames = frame % composition.fps;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  }

  function handleTimelineClick(e: MouseEvent) {
    if (!timelineEl) return;
    const rect = timelineEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const frame = Math.max(0, Math.min(composition.durationInFrames, Math.round(x / pixelsPerFrame)));
    onFrameChange(frame);
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

  function handleDrop(e: DragEvent, trackId: string) {
    e.preventDefault();
    const data = e.dataTransfer?.getData('application/json');
    if (!data) return;

    try {
      const seqData = JSON.parse(data);
      const newSeq = createSequence({
        ...seqData,
        from: Math.round((e.clientX - (timelineEl?.getBoundingClientRect().left ?? 0)) / pixelsPerFrame),
      });

      const newSequences = [...composition.sequences, newSeq];
      onCompositionChange({ ...composition, sequences: newSequences });
    } catch {
      // Ignore parse errors
    }
  }

  function deleteSequence(seqId: string) {
    const newSequences = composition.sequences.filter((s) => s.id !== seqId);
    onCompositionChange({ ...composition, sequences: newSequences });
  }
</script>

<svelte:window onmouseup={handlePlayheadDragEnd} onmousemove={handlePlayheadDrag} />

<div class="border-t border-[var(--ui-border)] bg-[var(--ui-card)]">
  <!-- Transport controls -->
  <div class="flex items-center gap-3 px-4 py-2 border-b border-[var(--ui-border)]">
    <Button variant="ghost" size="sm" class="size-7 p-0" onclick={() => onFrameChange(0)}>
      <SkipBack class="size-4" />
    </Button>
    <Button variant="ghost" size="sm" class="size-7 p-0" onclick={isPlaying ? onPause : onPlay}>
      {#if isPlaying}
        <Pause class="size-4" />
      {:else}
        <Play class="size-4" />
      {/if}
    </Button>
    <Button variant="ghost" size="sm" class="size-7 p-0" onclick={() => onFrameChange(composition.durationInFrames)}>
      <SkipForward class="size-4" />
    </Button>

    <span class="text-xs font-mono text-[var(--ui-muted-foreground)]">
      {formatTimecode(currentFrame)} / {formatTimecode(composition.durationInFrames)}
    </span>

    <div class="flex-1"></div>

    <span class="text-[10px] text-[var(--ui-muted-foreground)]">
      {composition.fps}fps · {composition.width}×{composition.height}
    </span>
  </div>

  <!-- Timeline tracks -->
  <div class="flex">
    <!-- Track labels -->
    <div class="w-32 border-r border-[var(--ui-border)]">
      <div class="px-3 py-1.5 border-b border-[var(--ui-border)] text-[10px] font-medium text-[var(--ui-muted-foreground)]">
        Tracks
      </div>
      {#each tracks as track (track.id)}
        <div class="flex items-center gap-2 px-3 py-1.5 border-b border-[var(--ui-border)]/50 text-xs">
          <button class="text-[var(--ui-muted-foreground)] cursor-pointer">
            {#if track.visible}
              <Eye class="size-3" />
            {:else}
              <EyeOff class="size-3 opacity-50" />
            {/if}
          </button>
          <span class="truncate flex-1">{track.name}</span>
          <span class="text-[10px] text-[var(--ui-muted-foreground)]">{track.sequences.length}</span>
        </div>
      {/each}

      {#if tracks.length === 0}
        <div class="px-3 py-4 text-[10px] text-center text-[var(--ui-muted-foreground)]">
          No tracks
        </div>
      {/if}
    </div>

    <!-- Timeline grid -->
    <div class="flex-1 overflow-auto">
      <!-- Time ruler -->
      <div class="relative h-6 border-b border-[var(--ui-border)] bg-[var(--ui-secondary)]/30" style="width: {timelineWidth}px;">
        {#each Array.from({ length: Math.ceil(composition.durationInFrames / composition.fps) + 1 }, (_, i) => i) as second}
          <div
            class="absolute top-0 bottom-0 border-l border-[var(--ui-border)]/30"
            style="left: {second * composition.fps * pixelsPerFrame}px;"
          >
            <span class="absolute top-0.5 left-1 text-[8px] text-[var(--ui-muted-foreground)]">
              {second}s
            </span>
          </div>
        {/each}
      </div>

      <!-- Track rows -->
      <div class="relative" style="width: {timelineWidth}px;">
        {#each tracks as track, trackIndex (track.id)}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="relative h-10 border-b border-[var(--ui-border)]/20"
            ondragover={(e) => e.preventDefault()}
            ondrop={(e) => handleDrop(e, track.id)}
          >
            {#each track.sequences as seq (seq.id)}
              <div
                class="absolute top-1 bottom-1 rounded bg-[var(--ui-primary)]/20 border border-[var(--ui-primary)]/30 cursor-pointer hover:bg-[var(--ui-primary)]/30 group"
                style="left: {seq.from * pixelsPerFrame}px; width: {seq.durationInFrames * pixelsPerFrame}px;"
                onclick={() => onFrameChange(seq.from)}
              >
                <span class="absolute inset-0 flex items-center px-2 text-[9px] text-[var(--ui-primary)] truncate">
                  {seq.name}
                </span>
                <button
                  onclick|stopPropagation={() => deleteSequence(seq.id)}
                  class="absolute top-0.5 right-0.5 p-0.5 rounded text-[var(--ui-muted-foreground)] opacity-0 group-hover:opacity-100 hover:text-[var(--ui-destructive)] cursor-pointer"
                >
                  <Trash2 class="size-2.5" />
                </button>
              </div>
            {/each}
          </div>
        {/each}

        <!-- Playhead -->
        <div
          class="absolute top-0 bottom-0 w-0.5 bg-[var(--ui-destructive)] z-10"
          style="left: {playheadX}px;"
        >
          <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-[var(--ui-destructive)] rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
</div>
