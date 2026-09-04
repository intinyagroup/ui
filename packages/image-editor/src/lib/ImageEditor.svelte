<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';

  interface FilterState {
    brightness: number;
    contrast: number;
    saturate: number;
    grayscale: number;
    sepia: number;
    blur: number;
    hueRotate: number;
    invert: number;
  }

  interface TransformState {
    rotate: number;
    flipX: boolean;
    flipY: boolean;
  }

  interface EffectsState {
    borderRadius: number;
    shadow: boolean;
    shadowColor: string;
    shadowBlur: number;
    overlay: string;
    overlayOpacity: number;
  }

  let {
    src,
    alt = '',
    filters = $bindable({
      brightness: 1,
      contrast: 1,
      saturate: 1,
      grayscale: 0,
      sepia: 0,
      blur: 0,
      hueRotate: 0,
      invert: 0
    }),
    transform = $bindable({
      rotate: 0,
      flipX: false,
      flipY: false
    }),
    effects = $bindable({
      borderRadius: 0,
      shadow: false,
      shadowColor: '#000000',
      shadowBlur: 10,
      overlay: '',
      overlayOpacity: 0.5
    }),
    class: className,
    onExport,
    children
  }: {
    src: string;
    alt?: string;
    filters?: FilterState;
    transform?: TransformState;
    effects?: EffectsState;
    class?: string;
    onExport?: (blob: Blob) => void;
    children?: Snippet;
  } = $props();

  let canvasRef = $state<HTMLCanvasElement>();
  let imageRef = $state<HTMLImageElement>();
  let showPanel = $state(false);
  let activeTab = $state<'filters' | 'transform' | 'effects'>('filters');

  const filterString = $derived(
    `brightness(${filters.brightness}) contrast(${filters.contrast}) saturate(${filters.saturate}) ` +
    `grayscale(${filters.grayscale}) sepia(${filters.sepia}) blur(${filters.blur}px) ` +
    `hue-rotate(${filters.hueRotate}deg) invert(${filters.invert})`
  );

  const transformString = $derived(
    `rotate(${transform.rotate}deg) scaleX(${transform.flipX ? -1 : 1}) scaleY(${transform.flipY ? -1 : 1})`
  );

  const styleString = $derived(
    `filter: ${filterString}; transform: ${transformString};
    border-radius: ${effects.borderRadius}px;
    ${effects.shadow ? `box-shadow: 0 4px ${effects.shadowBlur}px ${effects.shadowColor};` : ''}`
  );

  function handleExport() {
    if (!canvasRef || !imageRef) return;

    const ctx = canvasRef.getContext('2d');
    if (!ctx) return;

    canvasRef.width = imageRef.naturalWidth;
    canvasRef.height = imageRef.naturalHeight;

    ctx.filter = filterString;
    ctx.drawImage(imageRef, 0, 0);

    canvasRef.toBlob((blob) => {
      if (blob && onExport) onExport(blob);
    }, 'image/png');
  }

  function resetFilters() {
    filters = { brightness: 1, contrast: 1, saturate: 1, grayscale: 0, sepia: 0, blur: 0, hueRotate: 0, invert: 0 };
    transform = { rotate: 0, flipX: false, flipY: false };
    effects = { borderRadius: 0, shadow: false, shadowColor: '#000000', shadowBlur: 10, overlay: '', overlayOpacity: 0.5 };
  }
</script>

<div class="relative inline-block">
  <!-- Image Preview -->
  <img
    bind:this={imageRef}
    {src}
    {alt}
    class={className}
    style={styleString}
  />

  <!-- Hidden canvas for export -->
  <canvas bind:this={canvasRef} class="hidden"></canvas>

  <!-- Controls -->
  <div class="absolute bottom-2 right-2 flex gap-2">
    <button
      onclick={() => showPanel = !showPanel}
      class="rounded-lg bg-[var(--ui-background)] px-3 py-1.5 text-xs shadow-lg hover:bg-[var(--ui-muted)]"
    >
      {showPanel ? 'Hide' : 'Edit'}
    </button>
    <button
      onclick={handleExport}
      class="rounded-lg bg-[var(--ui-primary)] px-3 py-1.5 text-xs text-[var(--ui-primary-foreground)] shadow-lg hover:opacity-90"
    >
      Export
    </button>
  </div>

  <!-- Editor Panel -->
  {#if showPanel}
    <div class="absolute bottom-full left-0 mb-2 w-72 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-background)] p-4 shadow-xl">
      <!-- Tabs -->
      <div class="mb-4 flex gap-1 border-b border-[var(--ui-border)]">
        <button
          onclick={() => activeTab = 'filters'}
          class="px-3 py-1.5 text-xs {activeTab === 'filters' ? 'border-b-2 border-[var(--ui-primary)] font-medium' : ''}"
        >Filters</button>
        <button
          onclick={() => activeTab = 'transform'}
          class="px-3 py-1.5 text-xs {activeTab === 'transform' ? 'border-b-2 border-[var(--ui-primary)] font-medium' : ''}"
        >Transform</button>
        <button
          onclick={() => activeTab = 'effects'}
          class="px-3 py-1.5 text-xs {activeTab === 'effects' ? 'border-b-2 border-[var(--ui-primary)] font-medium' : ''}"
        >Effects</button>
      </div>

      {#if activeTab === 'filters'}
        <div class="space-y-3">
          <div>
            <label class="flex justify-between text-xs">Brightness <span>{filters.brightness}</span></label>
            <input type="range" min="0" max="2" step="0.1" bind:value={filters.brightness} class="w-full" />
          </div>
          <div>
            <label class="flex justify-between text-xs">Contrast <span>{filters.contrast}</span></label>
            <input type="range" min="0" max="2" step="0.1" bind:value={filters.contrast} class="w-full" />
          </div>
          <div>
            <label class="flex justify-between text-xs">Saturation <span>{filters.saturate}</span></label>
            <input type="range" min="0" max="2" step="0.1" bind:value={filters.saturate} class="w-full" />
          </div>
          <div>
            <label class="flex justify-between text-xs">Grayscale <span>{filters.grayscale}</span></label>
            <input type="range" min="0" max="1" step="0.1" bind:value={filters.grayscale} class="w-full" />
          </div>
          <div>
            <label class="flex justify-between text-xs">Sepia <span>{filters.sepia}</span></label>
            <input type="range" min="0" max="1" step="0.1" bind:value={filters.sepia} class="w-full" />
          </div>
          <div>
            <label class="flex justify-between text-xs">Blur <span>{filters.blur}px</span></label>
            <input type="range" min="0" max="20" step="1" bind:value={filters.blur} class="w-full" />
          </div>
        </div>
      {:else if activeTab === 'transform'}
        <div class="space-y-3">
          <div>
            <label class="flex justify-between text-xs">Rotate <span>{transform.rotate}°</span></label>
            <input type="range" min="0" max="360" step="90" bind:value={transform.rotate} class="w-full" />
          </div>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 text-xs">
              <input type="checkbox" bind:checked={transform.flipX} />
              Flip X
            </label>
            <label class="flex items-center gap-2 text-xs">
              <input type="checkbox" bind:checked={transform.flipY} />
              Flip Y
            </label>
          </div>
        </div>
      {:else}
        <div class="space-y-3">
          <div>
            <label class="flex justify-between text-xs">Border Radius <span>{effects.borderRadius}px</span></label>
            <input type="range" min="0" max="50" step="1" bind:value={effects.borderRadius} class="w-full" />
          </div>
          <label class="flex items-center gap-2 text-xs">
            <input type="checkbox" bind:checked={effects.shadow} />
            Drop Shadow
          </label>
          {#if effects.shadow}
            <div>
              <label class="flex justify-between text-xs">Shadow Blur <span>{effects.shadowBlur}px</span></label>
              <input type="range" min="0" max="50" step="1" bind:value={effects.shadowBlur} class="w-full" />
            </div>
          {/if}
        </div>
      {/if}

      <button
        onclick={resetFilters}
        class="mt-4 w-full rounded border border-[var(--ui-border)] px-3 py-1.5 text-xs hover:bg-[var(--ui-muted)]"
      >
        Reset All
      </button>
    </div>
  {/if}
</div>
