<script lang="ts">
  import { Type, Image, Trash2, Eye } from 'lucide-svelte';
  import { Button, Input } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';

  let {
    onAddWatermark,
    currentWatermarks,
    onRemoveWatermark,
  }: {
    onAddWatermark: (watermark: { type: 'text' | 'image'; text?: string; imageUrl?: string; color: string; opacity: number; rotation: number; fontSize?: number }) => void;
    currentWatermarks: { id: string; type: string; text?: string }[];
    onRemoveWatermark: (id: string) => void;
  } = $props();

  let watermarkType = $state<'text' | 'image'>('text');
  let watermarkText = $state('CONFIDENTIAL');
  let watermarkColor = $state('#dc2626');
  let watermarkOpacity = $state(0.15);
  let watermarkRotation = $state(-45);
  let watermarkFontSize = $state(48);
  let watermarkImageUrl = $state('');
</script>

<div class="space-y-4">
  <h3 class="text-sm font-semibold text-[var(--ui-foreground)]">Watermark</h3>

  <!-- Type toggle -->
  <div class="flex gap-2">
    <button
      onclick={() => watermarkType = 'text'}
      class={cn("flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors cursor-pointer",
        watermarkType === 'text' ? "border-[var(--ui-primary)] bg-[var(--ui-primary)]/5" : "border-[var(--ui-border)]"
      )}
    >
      <Type class="size-4" /> Text
    </button>
    <button
      onclick={() => watermarkType = 'image'}
      class={cn("flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors cursor-pointer",
        watermarkType === 'image' ? "border-[var(--ui-primary)] bg-[var(--ui-primary)]/5" : "border-[var(--ui-border)]"
      )}
    >
      <Image class="size-4" /> Image
    </button>
  </div>

  {#if watermarkType === 'text'}
    <Input bind:value={watermarkText} placeholder="Watermark text" />

    <div class="grid grid-cols-2 gap-2">
      <label class="block text-xs text-[var(--ui-muted-foreground)]">
        Color
        <input type="color" bind:value={watermarkColor} class="w-full h-8 mt-1 rounded cursor-pointer" />
      </label>
      <label class="block text-xs text-[var(--ui-muted-foreground)]">
        Font size
        <input type="number" bind:value={watermarkFontSize} min={12} max={200} class="w-full h-8 px-2 mt-1 rounded border border-[var(--ui-input)] text-sm" />
      </label>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <label class="block text-xs text-[var(--ui-muted-foreground)]">
        Opacity ({Math.round(watermarkOpacity * 100)}%)
        <input type="range" bind:value={watermarkOpacity} min={0.05} max={1} step={0.05} class="w-full mt-1" />
      </label>
      <label class="block text-xs text-[var(--ui-muted-foreground)]">
        Rotation ({watermarkRotation}°)
        <input type="range" bind:value={watermarkRotation} min={-90} max={90} step={5} class="w-full mt-1" />
      </label>
    </div>
  {:else}
    <Input bind:value={watermarkImageUrl} placeholder="Image URL" />
  {/if}

  <Button
    size="sm"
    onclick={() => onAddWatermark({
      type: watermarkType,
      text: watermarkType === 'text' ? watermarkText : undefined,
      imageUrl: watermarkType === 'image' ? watermarkImageUrl : undefined,
      color: watermarkColor,
      opacity: watermarkOpacity,
      rotation: watermarkRotation,
      fontSize: watermarkFontSize,
    })}
  >
    Add Watermark
  </Button>

  <!-- Current watermarks -->
  {#if currentWatermarks.length > 0}
    <div class="space-y-1">
      <span class="text-xs text-[var(--ui-muted-foreground)]">Active watermarks:</span>
      {#each currentWatermarks as wm}
        <div class="flex items-center justify-between text-sm px-2 py-1 rounded bg-[var(--ui-secondary)]/50">
          <span>{wm.text ?? wm.type}</span>
          <button onclick={() => onRemoveWatermark(wm.id)} class="text-[var(--ui-destructive)] cursor-pointer">
            <Trash2 class="size-3.5" />
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>
