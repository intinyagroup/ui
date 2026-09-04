<script lang="ts">
  import { editor, selectedElements } from '../state/index.js';

  $: selectedElement = $selectedElements[0] ?? null;
</script>

<div class="w-64 border-l border-[var(--ui-border)] bg-[var(--ui-card)] p-4">
  <h3 class="mb-4 text-sm font-semibold">Properties</h3>

  {#if selectedElement}
    <div class="space-y-4">
      <div>
        <label class="text-xs text-[var(--ui-muted-foreground)]">Name</label>
        <input
          type="text"
          value={selectedElement.name}
          onchange={(e) => editor.updateElement(selectedElement.id, { name: e.currentTarget.value })}
          class="w-full rounded border border-[var(--ui-border)] px-2 py-1 text-sm"
        />
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-xs text-[var(--ui-muted-foreground)]">X</label>
          <input
            type="number"
            value={selectedElement.x}
            onchange={(e) => editor.updateElement(selectedElement.id, { x: Number(e.currentTarget.value) })}
            class="w-full rounded border border-[var(--ui-border)] px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label class="text-xs text-[var(--ui-muted-foreground)]">Y</label>
          <input
            type="number"
            value={selectedElement.y}
            onchange={(e) => editor.updateElement(selectedElement.id, { y: Number(e.currentTarget.value) })}
            class="w-full rounded border border-[var(--ui-border)] px-2 py-1 text-sm"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-xs text-[var(--ui-muted-foreground)]">Width</label>
          <input
            type="number"
            value={selectedElement.width}
            onchange={(e) => editor.updateElement(selectedElement.id, { width: Number(e.currentTarget.value) })}
            class="w-full rounded border border-[var(--ui-border)] px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label class="text-xs text-[var(--ui-muted-foreground)]">Height</label>
          <input
            type="number"
            value={selectedElement.height}
            onchange={(e) => editor.updateElement(selectedElement.id, { height: Number(e.currentTarget.value) })}
            class="w-full rounded border border-[var(--ui-border)] px-2 py-1 text-sm"
          />
        </div>
      </div>

      <div>
        <label class="text-xs text-[var(--ui-muted-foreground)]">Rotation</label>
        <input
          type="range"
          min="0"
          max="360"
          value={selectedElement.rotation}
          oninput={(e) => editor.updateElement(selectedElement.id, { rotation: Number(e.currentTarget.value) })}
          class="w-full"
        />
      </div>

      <div>
        <label class="text-xs text-[var(--ui-muted-foreground)]">Z-Index</label>
        <input
          type="number"
          value={selectedElement.zIndex}
          onchange={(e) => editor.updateElement(selectedElement.id, { zIndex: Number(e.currentTarget.value) })}
          class="w-full rounded border border-[var(--ui-border)] px-2 py-1 text-sm"
        />
      </div>
    </div>
  {:else}
    <p class="text-sm text-[var(--ui-muted-foreground)]">Select an element to edit</p>
  {/if}
</div>
