<script lang="ts">
  import { Download, Image, FileText, Settings } from 'lucide-svelte';
  import { Button, Input } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import type { ExportFormat, ExportOptions } from '../pdf-core.js';

  let {
    totalPages,
    currentPage,
    onExport,
    exporting,
  }: {
    totalPages: number;
    currentPage: number;
    onExport: (options: ExportOptions) => void;
    exporting: boolean;
  } = $props();

  let format = $state<ExportFormat>('png');
  let pages = $state('all');
  let quality = $state(0.92);
  let scale = $state(2);
  let includeAnnotations = $state(true);

  function parsePages(): number[] | undefined {
    if (pages === 'all') return undefined;
    if (pages === 'current') return [currentPage];

    // Parse page ranges like "1-5, 8, 10-12"
    const result: number[] = [];
    const parts = pages.split(',').map((p) => p.trim());
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          if (i >= 1 && i <= totalPages) result.push(i);
        }
      } else {
        const num = parseInt(part);
        if (num >= 1 && num <= totalPages) result.push(num);
      }
    }
    return result.length > 0 ? result : undefined;
  }

  function handleExport() {
    onExport({
      format,
      pages: parsePages(),
      quality,
      scale,
      includeAnnotations,
    });
  }

  const formats: { value: ExportFormat; label: string; description: string }[] = [
    { value: 'pdf', label: 'PDF', description: 'Export as PDF document' },
    { value: 'png', label: 'PNG', description: 'High quality images' },
    { value: 'jpg', label: 'JPEG', description: 'Compressed images' },
    { value: 'svg', label: 'SVG', description: 'Vector graphics' },
    { value: 'text', label: 'Text', description: 'Plain text extraction' },
  ];
</script>

<div class="space-y-4">
  <div class="flex items-center gap-2">
    <Download class="size-5 text-[var(--ui-primary)]" />
    <h3 class="text-sm font-semibold text-[var(--ui-foreground)]">Export Document</h3>
  </div>

  <!-- Format selection -->
  <div class="space-y-2">
    <span class="text-xs text-[var(--ui-muted-foreground)]">Format:</span>
    <div class="grid grid-cols-3 gap-2">
      {#each formats as f (f.value)}
        <button
          onclick={() => format = f.value}
          class={cn(
            "flex flex-col items-center gap-1 p-3 rounded-lg border text-center transition-colors cursor-pointer",
            format === f.value
              ? "border-[var(--ui-primary)] bg-[var(--ui-primary)]/5"
              : "border-[var(--ui-border)] hover:bg-[var(--ui-secondary)]"
          )}
        >
          {#if f.value === 'pdf'}
            <FileText class="size-5" />
          {:else if ['png', 'jpg'].includes(f.value)}
            <Image class="size-5" />
          {:else}
            <Settings class="size-5" />
          {/if}
          <span class="text-xs font-medium">{f.label}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Pages -->
  <div class="space-y-2">
    <span class="text-xs text-[var(--ui-muted-foreground)]">Pages:</span>
    <div class="flex gap-2">
      <button
        onclick={() => pages = 'all'}
        class={cn("px-3 py-1.5 rounded-lg border text-xs", pages === 'all' ? "border-[var(--ui-primary)] bg-[var(--ui-primary)]/5" : "border-[var(--ui-border)]")}
      >All ({totalPages})</button>
      <button
        onclick={() => pages = 'current'}
        class={cn("px-3 py-1.5 rounded-lg border text-xs", pages === 'current' ? "border-[var(--ui-primary)] bg-[var(--ui-primary)]/5" : "border-[var(--ui-border)]")}
      >Current ({currentPage})</button>
      <button
        onclick={() => pages = 'custom'}
        class={cn("px-3 py-1.5 rounded-lg border text-xs", pages === 'custom' ? "border-[var(--ui-primary)] bg-[var(--ui-primary)]/5" : "border-[var(--ui-border)]")}
      >Custom</button>
    </div>
    {#if pages === 'custom'}
      <Input bind:value={pages} placeholder="e.g., 1-5, 8, 10-12" class="text-sm" />
    {/if}
  </div>

  <!-- Quality (for images) -->
  {#if ['png', 'jpg'].includes(format)}
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-xs text-[var(--ui-muted-foreground)]">Scale: {scale}x</span>
      </div>
      <input type="range" bind:value={scale} min={1} max={4} step={0.5} class="w-full" />

      {#if format === 'jpg'}
        <div class="flex items-center justify-between">
          <span class="text-xs text-[var(--ui-muted-foreground)]">Quality: {Math.round(quality * 100)}%</span>
        </div>
        <input type="range" bind:value={quality} min={0.1} max={1} step={0.05} class="w-full" />
      {/if}
    </div>
  {/if}

  <!-- Options -->
  <label class="flex items-center gap-2 text-sm cursor-pointer">
    <input type="checkbox" bind:checked={includeAnnotations} class="accent-[var(--ui-primary)]" />
    Include annotations
  </label>

  <Button
    size="sm"
    class="w-full"
    onclick={handleExport}
    disabled={exporting}
  >
    {#if exporting}
      Exporting...
    {:else}
      <Download class="size-4 mr-2" /> Export as {format.toUpperCase()}
    {/if}
  </Button>
</div>
