<script lang="ts">
  import { Plus, Trash2, RotateCw, RotateCcw, Copy, Move, Crop, Scissors } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import type { PageOperation } from '../pdf-core.js';

  let {
    totalPages,
    selectedPages,
    onOperation,
    onToggleSelect,
    onSelectAll,
    onDeselectAll,
  }: {
    totalPages: number;
    selectedPages: Set<number>;
    onOperation: (op: PageOperation) => void;
    onToggleSelect: (page: number) => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
  } = $props();

  let showInsertDialog = $state(false);
  let insertPageIndex = $state(0);
  let showRotateDialog = $state(false);
  let rotatePageIndex = $state(0);
  let rotateDegrees = $state(90);

  function handleDeleteSelected() {
    if (selectedPages.size === 0) return;
    const sorted = Array.from(selectedPages).sort((a, b) => b - a);
    for (const pageIndex of sorted) {
      onOperation({ type: 'delete', pageIndex });
    }
  }

  function handleDuplicateSelected() {
    for (const pageIndex of selectedPages) {
      onOperation({ type: 'duplicate', pageIndex });
    }
  }

  function handleInsertBlank() {
    onOperation({ type: 'insert', pageIndex: insertPageIndex, content: 'blank' });
    showInsertDialog = false;
  }

  function handleRotate() {
    onOperation({ type: 'rotate', pageIndex: rotatePageIndex, degrees: rotateDegrees });
    showRotateDialog = false;
  }
</script>

<div class="flex flex-wrap items-center gap-2 p-3 border-t border-[var(--ui-border)] bg-[var(--ui-card)]">
  <span class="text-xs text-[var(--ui-muted-foreground)]">
    {selectedPages.size} page(s) selected
  </span>

  <Button variant="outline" size="sm" onclick={onSelectAll} class="text-xs h-7">
    Select all
  </Button>
  <Button variant="outline" size="sm" onclick={onDeselectAll} class="text-xs h-7">
    Deselect
  </Button>

  <div class="h-4 w-px bg-[var(--ui-border)]"></div>

  <Button variant="outline" size="sm" onclick={() => showInsertDialog = true} class="text-xs h-7">
    <Plus class="size-3 mr-1" /> Insert
  </Button>

  {#if selectedPages.size > 0}
    <Button variant="outline" size="sm" onclick={handleDuplicateSelected} class="text-xs h-7">
      <Copy class="size-3 mr-1" /> Duplicate
    </Button>

    <Button variant="outline" size="sm" onclick={() => { showRotateDialog = true; }} class="text-xs h-7">
      <RotateCw class="size-3 mr-1" /> Rotate
    </Button>

    <Button variant="destructive" size="sm" onclick={handleDeleteSelected} class="text-xs h-7">
      <Trash2 class="size-3 mr-1" /> Delete
    </Button>
  {/if}
</div>

<!-- Insert Dialog -->
{#if showInsertDialog}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="bg-[var(--ui-card)] rounded-xl p-6 w-80 shadow-xl">
      <h3 class="text-lg font-semibold mb-4">Insert Page</h3>
      <label class="block text-sm mb-1">Insert at position (1-{totalPages + 1})</label>
      <input
        type="number"
        bind:value={insertPageIndex}
        min={0}
        max={totalPages}
        class="w-full px-3 py-2 rounded-lg border border-[var(--ui-input)] text-sm mb-4"
      />
      <div class="flex justify-end gap-2">
        <Button variant="outline" size="sm" onclick={() => showInsertDialog = false}>Cancel</Button>
        <Button size="sm" onclick={handleInsertBlank}>Insert blank page</Button>
      </div>
    </div>
  </div>
{/if}

<!-- Rotate Dialog -->
{#if showRotateDialog}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="bg-[var(--ui-card)] rounded-xl p-6 w-80 shadow-xl">
      <h3 class="text-lg font-semibold mb-4">Rotate Pages</h3>
      <label class="block text-sm mb-1">Degrees</label>
      <select
        bind:value={rotateDegrees}
        class="w-full px-3 py-2 rounded-lg border border-[var(--ui-input)] text-sm mb-4"
      >
        <option value={90}>90° Clockwise</option>
        <option value={180}>180°</option>
        <option value={270}>270° Clockwise</option>
      </select>
      <div class="flex justify-end gap-2">
        <Button variant="outline" size="sm" onclick={() => showRotateDialog = false}>Cancel</Button>
        <Button size="sm" onclick={handleRotate}>Rotate</Button>
      </div>
    </div>
  </div>
{/if}
