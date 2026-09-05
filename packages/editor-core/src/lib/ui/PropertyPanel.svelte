<script lang="ts">
  import { editor, selectedElements } from '../state/index.js';

  $: selectedElement = $selectedElements[0] ?? null;
</script>

<div class="w-64 border-l border-[var(--ui-border)] bg-[var(--ui-card)] p-4">
  <h3 class="mb-4 text-sm font-semibold">Properties</h3>

  {#if selectedElement}
    <div class="space-y-4">
      <label class="block space-y-1 text-xs text-[var(--ui-muted-foreground)]">
        <span>Name</span>
        <input
          type="text"
          value={selectedElement.name}
          onchange={(e) => editor.updateElement(selectedElement.id, { name: e.currentTarget.value })}
          class="w-full rounded border border-[var(--ui-border)] px-2 py-1 text-sm text-[var(--ui-foreground)] bg-transparent"
        />
      </label>

      <div class="grid grid-cols-2 gap-2">
        <label class="block space-y-1 text-xs text-[var(--ui-muted-foreground)]">
          <span>X</span>
          <input
            type="number"
            value={selectedElement.x}
            onchange={(e) => editor.updateElement(selectedElement.id, { x: Number(e.currentTarget.value) })}
            class="w-full rounded border border-[var(--ui-border)] px-2 py-1 text-sm text-[var(--ui-foreground)] bg-transparent"
          />
        </label>
        <label class="block space-y-1 text-xs text-[var(--ui-muted-foreground)]">
          <span>Y</span>
          <input
            type="number"
            value={selectedElement.y}
            onchange={(e) => editor.updateElement(selectedElement.id, { y: Number(e.currentTarget.value) })}
            class="w-full rounded border border-[var(--ui-border)] px-2 py-1 text-sm text-[var(--ui-foreground)] bg-transparent"
          />
        </label>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <label class="block space-y-1 text-xs text-[var(--ui-muted-foreground)]">
          <span>Width</span>
          <input
            type="number"
            value={selectedElement.width}
            onchange={(e) => editor.updateElement(selectedElement.id, { width: Number(e.currentTarget.value) })}
            class="w-full rounded border border-[var(--ui-border)] px-2 py-1 text-sm text-[var(--ui-foreground)] bg-transparent"
          />
        </label>
        <label class="block space-y-1 text-xs text-[var(--ui-muted-foreground)]">
          <span>Height</span>
          <input
            type="number"
            value={selectedElement.height}
            onchange={(e) => editor.updateElement(selectedElement.id, { height: Number(e.currentTarget.value) })}
            class="w-full rounded border border-[var(--ui-border)] px-2 py-1 text-sm text-[var(--ui-foreground)] bg-transparent"
          />
        </label>
      </div>

      <label class="block space-y-1 text-xs text-[var(--ui-muted-foreground)]">
        <span>Fill</span>
        <input
          type="color"
          value={selectedElement.props?.fill ?? '#000000'}
          onchange={(e) => editor.updateElement(selectedElement.id, { props: { ...selectedElement.props, fill: e.currentTarget.value } })}
          class="h-8 w-full rounded border border-[var(--ui-border)] cursor-pointer bg-transparent"
        />
      </label>

      <label class="block space-y-1 text-xs text-[var(--ui-muted-foreground)]">
        <span>Opacity</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={selectedElement.props?.opacity ?? 1}
          oninput={(e) => editor.updateElement(selectedElement.id, { props: { ...selectedElement.props, opacity: Number(e.currentTarget.value) } })}
          class="w-full cursor-pointer"
        />
      </label>
    </div>
  {:else}
    <p class="text-sm text-[var(--ui-muted-foreground)]">Select an element to edit</p>
  {/if}
</div>
