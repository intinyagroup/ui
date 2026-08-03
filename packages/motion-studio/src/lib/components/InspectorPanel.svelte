<script lang="ts">
  import { Trash2, Copy } from 'lucide-svelte';
  import { Button, Input } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import type { Sequence, Effect } from '@intinyagroup/motion';
  import { effectPresets } from '@intinyagroup/motion';

  let {
    sequence,
    composition,
    onUpdateSequence,
    onDeleteSequence,
    onDuplicateSequence,
  }: {
    sequence: Sequence;
    composition: any;
    onUpdateSequence: (seq: Sequence) => void;
    onDeleteSequence: (id: string) => void;
    onDuplicateSequence: () => void;
  } = $props();

  function updateProp(key: string, value: any) {
    onUpdateSequence({ ...sequence, props: { ...sequence.props, [key]: value } });
  }

  function updateStyle(key: string, value: any) {
    onUpdateSequence({ ...sequence, style: { ...sequence.style, [key]: value } });
  }

  function removeEffect(effectId: string) {
    onUpdateSequence({ ...sequence, effects: sequence.effects.filter((fx) => fx.id !== effectId) });
  }
</script>

<div class="w-64 border-l border-[var(--ui-border)] bg-[var(--ui-card)] flex flex-col overflow-hidden shrink-0">
  <div class="px-3 py-2 border-b border-[var(--ui-border)] flex items-center justify-between">
    <span class="text-xs font-semibold text-[var(--ui-foreground)]">{sequence.name}</span>
    <div class="flex gap-1">
      <Button variant="ghost" size="sm" class="size-6 p-0" onclick={onDuplicateSequence}>
        <Copy class="size-3" />
      </Button>
      <Button variant="ghost" size="sm" class="size-6 p-0 text-[var(--ui-destructive)]" onclick={() => onDeleteSequence(sequence.id)}>
        <Trash2 class="size-3" />
      </Button>
    </div>
  </div>

  <div class="flex-1 overflow-auto p-3 space-y-3 text-xs">
    <!-- Basic props -->
    <label class="block text-[var(--ui-muted-foreground)]">
      Name
      <input class="w-full mt-1 px-2 py-1 rounded border border-[var(--ui-input)] text-xs" value={sequence.name}
        oninput={(e) => onUpdateSequence({ ...sequence, name: e.currentTarget.value })} />
    </label>

    <div class="grid grid-cols-2 gap-2">
      <label class="text-[var(--ui-muted-foreground)]">
        From (frame)
        <input type="number" class="w-full mt-1 px-2 py-1 rounded border border-[var(--ui-input)] text-xs" value={sequence.from}
          oninput={(e) => onUpdateSequence({ ...sequence, from: Number(e.currentTarget.value) })} />
      </label>
      <label class="text-[var(--ui-muted-foreground)]">
        Duration (frames)
        <input type="number" class="w-full mt-1 px-2 py-1 rounded border border-[var(--ui-input)] text-xs" value={sequence.durationInFrames}
          oninput={(e) => onUpdateSequence({ ...sequence, durationInFrames: Number(e.currentTarget.value) })} />
      </label>
    </div>

    <!-- Style -->
    <div class="border-t border-[var(--ui-border)] pt-3">
      <span class="text-[10px] font-medium text-[var(--ui-muted-foreground)] uppercase">Transform</span>
      <div class="grid grid-cols-2 gap-2 mt-2">
        <label class="text-[var(--ui-muted-foreground)]">
          X %
          <input type="number" class="w-full mt-1 px-2 py-1 rounded border border-[var(--ui-input)] text-xs" value={sequence.style.x ?? 0}
            oninput={(e) => updateStyle('x', Number(e.currentTarget.value))} />
        </label>
        <label class="text-[var(--ui-muted-foreground)]">
          Y %
          <input type="number" class="w-full mt-1 px-2 py-1 rounded border border-[var(--ui-input)] text-xs" value={sequence.style.y ?? 0}
            oninput={(e) => updateStyle('y', Number(e.currentTarget.value))} />
        </label>
        <label class="text-[var(--ui-muted-foreground)]">
          Width %
          <input type="number" class="w-full mt-1 px-2 py-1 rounded border border-[var(--ui-input)] text-xs" value={sequence.style.width ?? 100}
            oninput={(e) => updateStyle('width', Number(e.currentTarget.value))} />
        </label>
        <label class="text-[var(--ui-muted-foreground)]">
          Height %
          <input type="number" class="w-full mt-1 px-2 py-1 rounded border border-[var(--ui-input)] text-xs" value={sequence.style.height ?? 100}
            oninput={(e) => updateStyle('height', Number(e.currentTarget.value))} />
        </label>
        <label class="text-[var(--ui-muted-foreground)]">
          Rotation
          <input type="number" class="w-full mt-1 px-2 py-1 rounded border border-[var(--ui-input)] text-xs" value={sequence.style.rotation ?? 0}
            oninput={(e) => updateStyle('rotation', Number(e.currentTarget.value))} />
        </label>
        <label class="text-[var(--ui-muted-foreground)]">
          Scale
          <input type="number" step="0.1" class="w-full mt-1 px-2 py-1 rounded border border-[var(--ui-input)] text-xs" value={sequence.style.scale ?? 1}
            oninput={(e) => updateStyle('scale', Number(e.currentTarget.value))} />
        </label>
        <label class="text-[var(--ui-muted-foreground)]">
          Opacity
          <input type="number" step="0.1" min="0" max="1" class="w-full mt-1 px-2 py-1 rounded border border-[var(--ui-input)] text-xs" value={sequence.style.opacity ?? 1}
            oninput={(e) => updateStyle('opacity', Number(e.currentTarget.value))} />
        </label>
      </div>
    </div>

    <!-- Type-specific props -->
    {#if sequence.type === 'text'}
      <div class="border-t border-[var(--ui-border)] pt-3">
        <span class="text-[10px] font-medium text-[var(--ui-muted-foreground)] uppercase">Text</span>
        <div class="grid gap-2 mt-2">
          <label class="text-[var(--ui-muted-foreground)]">
            Content
            <textarea class="w-full mt-1 px-2 py-1 rounded border border-[var(--ui-input)] text-xs h-16 resize-none" value={sequence.props.content ?? ''}
              oninput={(e) => updateProp('content', e.currentTarget.value)}></textarea>
          </label>
          <div class="grid grid-cols-2 gap-2">
            <label class="text-[var(--ui-muted-foreground)]">
              Font Size
              <input type="number" class="w-full mt-1 px-2 py-1 rounded border border-[var(--ui-input)] text-xs" value={sequence.props.fontSize ?? 48}
                oninput={(e) => updateProp('fontSize', Number(e.currentTarget.value))} />
            </label>
            <label class="text-[var(--ui-muted-foreground)]">
              Color
              <input type="color" class="w-full mt-1 h-7 rounded cursor-pointer" value={sequence.props.color ?? '#ffffff'}
                oninput={(e) => updateProp('color', e.currentTarget.value)} />
            </label>
          </div>
        </div>
      </div>
    {/if}

    {#if sequence.type === 'shape'}
      <div class="border-t border-[var(--ui-border)] pt-3">
        <span class="text-[10px] font-medium text-[var(--ui-muted-foreground)] uppercase">Shape</span>
        <div class="grid gap-2 mt-2">
          <label class="text-[var(--ui-muted-foreground)]">
            Type
            <select class="w-full mt-1 px-2 py-1 rounded border border-[var(--ui-input)] text-xs" value={sequence.props.shape ?? 'rectangle'}
              onchange={(e) => updateProp('shape', e.currentTarget.value)}>
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
              <option value="ellipse">Ellipse</option>
            </select>
          </label>
          <label class="text-[var(--ui-muted-foreground)]">
            Fill
            <input type="color" class="w-full mt-1 h-7 rounded cursor-pointer" value={sequence.props.fill ?? '#3b82f6'}
              oninput={(e) => updateProp('fill', e.currentTarget.value)} />
          </label>
        </div>
      </div>
    {/if}

    <!-- Effects -->
    {#if sequence.effects.length > 0}
      <div class="border-t border-[var(--ui-border)] pt-3">
        <span class="text-[10px] font-medium text-[var(--ui-muted-foreground)] uppercase">Effects ({sequence.effects.length})</span>
        <div class="mt-2 space-y-1">
          {#each sequence.effects as fx}
            <div class="flex items-center justify-between px-2 py-1 rounded bg-[var(--ui-secondary)]/50">
              <span class="text-xs">{fx.type}</span>
              <button onclick={() => removeEffect(fx.id)} class="text-[var(--ui-muted-foreground)] hover:text-[var(--ui-destructive)] cursor-pointer">
                <Trash2 class="size-3" />
              </button>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>
