<script lang="ts">
  import {
    Play, Pause, SkipBack, SkipForward, Download, Upload, Circle, Square,
    PanelLeftOpen, PanelRightOpen, Settings, Eye, Layers, Type, Image, Music,
    Palette, Wand2
  } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import {
    createComposition, createSequence, createTrack, createEffect,
    type Composition, type Sequence, type Track, type Effect, type EffectType,
    type Transition, type TransitionType
  } from '@intinyagroup/motion';
  import { effectPresets, transitionPresets } from '@intinyagroup/motion-effects';
  import { Player } from '@intinyagroup/motion-player';
  import InspectorPanel from './InspectorPanel.svelte';
  import AssetLibrary from './AssetLibrary.svelte';

  let {
    initialComposition,
    onSave,
    onExport,
  }: {
    initialComposition?: Composition;
    onSave?: (comp: Composition) => void;
    onExport?: (blob: Blob) => void;
  } = $props();

  let composition = $state(initialComposition ?? createComposition({ name: 'Untitled' }));
  let currentFrame = $state(0);
  let isPlaying = $state(false);
  let selectedSequenceId = $state<string | null>(null);
  let showInspector = $state(true);
  let showAssets = $state(false);

  const selectedSequence = $derived(
    composition.sequences.find((s) => s.id === selectedSequenceId)
  );

  function play() { isPlaying = true; }
  function pause() { is(false); isPlaying = false; }

  function handleTimeUpdate(frame: number) { currentFrame = frame; }

  function handleCompositionChange(comp: Composition) { composition = comp; }

  function addSequence(type: Sequence['type']) {
    const seq = createSequence({
      name: `${type} ${composition.sequences.length + 1}`,
      type,
      from: currentFrame,
      durationInFrames: composition.fps * 3,
      props: type === 'text' ? { content: 'New Text', fontSize: 48, color: '#ffffff' } :
             type === 'shape' ? { shape: 'rectangle', fill: '#3b82f6' } :
             type === 'image' ? { src: '' } : {},
      style: { x: 10, y: 10, width: 80, height: 80 },
    });
    composition = { ...composition, sequences: [...composition.sequences, seq] };
    selectedSequenceId = seq.id;
  }

  function addEffectToSelected(effectType: EffectType) {
    if (!selectedSequence) return;
    const fx = { id: `fx-${Date.now()}`, type: effectType, params: {} };
    const updated = composition.sequences.map((s) =>
      s.id === selectedSequenceId ? { ...s, effects: [...s.effects, fx] } : s
    );
    composition = { ...composition, sequences: updated };
  }

  function deleteSequence(id: string) {
    composition = { ...composition, sequences: composition.sequences.filter((s) => s.id !== id) };
    if (selectedSequenceId === id) selectedSequenceId = null;
  }

  function duplicateSequence() {
    if (!selectedSequence) return;
    const dup = { ...JSON.parse(JSON.stringify(selectedSequence)), id: `seq-${Date.now()}`, name: `${selectedSequence.name} (copy)` };
    composition = { ...composition, sequences: [...composition.sequences, dup] };
  }
</script>

<div class="flex flex-col h-screen bg-[var(--ui-background)]">
  <!-- Top toolbar -->
  <div class="flex items-center gap-3 px-4 py-2 border-b border-[var(--ui-border)] bg-[var(--ui-card)]">
    <input
      type="text"
      bind:value={composition.name}
      class="text-sm font-semibold bg-transparent border-none outline-none max-w-[200px]"
    />
    <span class="text-[10px] text-[var(--ui-muted-foreground)]">
      {composition.fps}fps · {composition.width}×{composition.height}
    </span>
    <div class="flex-1"></div>
    <Button variant="ghost" size="sm" class="size-7 p-0" onclick={() => showAssets = !showAssets}>
      <Image class="size-4" />
    </Button>
    <Button variant="ghost" size="sm" class="size-7 p-0" onclick={() => showInspector = !showInspector}>
      <Settings class="size-4" />
    </Button>
    <Button variant="outline" size="sm" onclick={() => onSave?.(composition)}>Save</Button>
    <Button size="sm" onclick={() => onExport?.(new Blob())}>Export</Button>
  </div>

  <!-- Main area -->
  <div class="flex flex-1 overflow-hidden">
    <!-- Left: Assets -->
    {#if showAssets}
      <AssetLibrary onSelect={(url) => addSequence('image')} />
    {/if}

    <!-- Center -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Preview -->
      <div class="flex-1 overflow-auto flex items-center justify-center p-4 bg-[var(--ui-muted)]/20">
        <VideoPlayer {composition} onTimeUpdate={handleTimeUpdate} onComplete={() => isPlaying = false} />
      </div>

      <!-- Add sequence buttons -->
      <div class="flex items-center gap-2 px-4 py-2 border-t border-[var(--ui-border)]">
        <span class="text-[10px] text-[var(--ui-muted-foreground)]">Add:</span>
        <Button variant="outline" size="sm" class="h-7 text-xs" onclick={() => addSequence('text')}>
          <Type class="size-3 mr-1" /> Text
        </Button>
        <Button variant="outline" size="sm" class="h-7 text-xs" onclick={() => addSequence('shape')}>
          <Square class="size-3 mr-1" /> Shape
        </Button>
        <Button variant="outline" size="sm" class="h-7 text-xs" onclick={() => addSequence('image')}>
          <Image class="size-3 mr-1" /> Image
        </Button>
        {#if selectedSequence}
          <div class="flex-1"></div>
          <span class="text-[10px] text-[var(--ui-muted-foreground)]">Effects:</span>
          {#each effectPresets.slice(0, 4) as fx}
            <Button variant="ghost" size="sm" class="h-6 px-2 text-[10px]" onclick={() => addEffectToSelected(fx.type)}>
              {fx.label}
            </Button>
          {/each}
        {/if}
      </div>

      <!-- Timeline -->
      <Timeline
        {composition}
        {currentFrame}
        {isPlaying}
        onFrameChange={(f) => { currentFrame = f; }}
        onPlay={play}
        onPause={pause}
        onCompositionChange={handleCompositionChange}
      />
    </div>

    <!-- Right: Inspector -->
    {#if showInspector && selectedSequence}
      <InspectorPanel
        sequence={selectedSequence}
        composition={composition}
        onUpdateSequence={(seq) => {
          composition = { ...composition, sequences: composition.sequences.map((s) => s.id === seq.id ? seq : s) };
        }}
        onDeleteSequence={deleteSequence}
        onDuplicateSequence={duplicateSequence}
      />
    {/if}
  </div>
</div>
