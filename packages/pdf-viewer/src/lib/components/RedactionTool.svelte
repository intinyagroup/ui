<script lang="ts">
  import { AlertTriangle, Eye, EyeOff, Trash2 } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import type { Annotation } from '../pdf-core.js';

  let {
    annotations,
    currentPage,
    onRedact,
    onRemoveRedaction,
    onApplyRedactions,
    appliedRedactions,
  }: {
    annotations: Annotation[];
    currentPage: number;
    onRedact: (rect: { x: number; y: number; width: number; height: number }, pageNumber: number) => void;
    onRemoveRedaction: (id: string) => void;
    onApplyRedactions: () => void;
    appliedRedactions: { pageNumber: number; rects: { x: number; y: number; width: number; height: number }[] }[];
  } = $props();

  let isDrawing = $state(false);
  let startX = $state(0);
  let startY = $state(0);
  let currentRect = $state<{ x: number; y: number; width: number; height: number } | null>(null);
  let showRedacted = $state(true);

  const redactionAnnotations = $derived(
    annotations.filter((a) => a.type === 'redaction')
  );

  function handleMouseDown(e: MouseEvent, scale: number) {
    isDrawing = true;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    startX = (e.clientX - rect.left) / scale;
    startY = (e.clientY - rect.top) / scale;
  }

  function handleMouseMove(e: MouseEvent, scale: number) {
    if (!isDrawing) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const endX = (e.clientX - rect.left) / scale;
    const endY = (e.clientY - rect.top) / scale;

    currentRect = {
      x: Math.min(startX, endX),
      y: Math.min(startY, endY),
      width: Math.abs(endX - startX),
      height: Math.abs(endY - startY),
    };
  }

  function handleMouseUp() {
    if (!isDrawing || !currentRect) return;
    isDrawing = false;

    if (currentRect.width > 5 && currentRect.height > 5) {
      onRedact(currentRect, currentPage);
    }
    currentRect = null;
  }

  function getRedactionCount(): number {
    return redactionAnnotations.length;
  }

  function getAppliedCount(): number {
    return appliedRedactions.length;
  }
</script>

<div class="space-y-4">
  <div class="flex items-center gap-2">
    <AlertTriangle class="size-5 text-[var(--ui-warning)]" />
    <h3 class="text-sm font-semibold text-[var(--ui-foreground)]">Redaction</h3>
  </div>

  <p class="text-xs text-[var(--ui-muted-foreground)]">
    Draw rectangles over content to redact. Redactions cannot be undone once applied.
  </p>

  <div class="grid grid-cols-2 gap-3 text-center">
    <div class="p-3 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-secondary)]/30">
      <div class="text-lg font-bold text-[var(--ui-foreground)]">{getRedactionCount()}</div>
      <div class="text-[10px] text-[var(--ui-muted-foreground)]">Pending</div>
    </div>
    <div class="p-3 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-secondary)]/30">
      <div class="text-lg font-bold text-[var(--ui-destructive)]">{getAppliedCount()}</div>
      <div class="text-[10px] text-[var(--ui-muted-foreground)]">Applied</div>
    </div>
  </div>

  <!-- Redaction list -->
  {#if redactionAnnotations.length > 0}
    <div class="space-y-1">
      <span class="text-xs text-[var(--ui-muted-foreground)]">Pending redactions:</span>
      {#each redactionAnnotations as ann (ann.id)}
        <div class="flex items-center justify-between px-2 py-1.5 rounded bg-[var(--ui-secondary)]/50 text-sm">
          <span>Page {ann.pageNumber}</span>
          <button onclick={() => onRemoveRedaction(ann.id)} class="text-[var(--ui-destructive)] cursor-pointer">
            <Trash2 class="size-3.5" />
          </button>
        </div>
      {/each}
    </div>
  {/if}

  <Button
    variant="destructive"
    size="sm"
    class="w-full"
    onclick={onApplyRedactions}
    disabled={getRedactionCount() === 0}
  >
    Apply {getRedactionCount()} Redaction(s)
  </Button>

  <Button
    variant="outline"
    size="sm"
    class="w-full"
    onclick={() => showRedacted = !showRedacted}
  >
    {#if showRedacted}
      <EyeOff class="size-4 mr-2" /> Hide Redactions
    {:else}
      <Eye class="size-4 mr-2" /> Show Redactions
    {/if}
  </Button>
</div>
