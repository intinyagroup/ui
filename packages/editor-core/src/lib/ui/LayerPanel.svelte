<script lang="ts">
  import { editor, selectedElements } from '../state/index.js';

  $: elements = [...$editor.elements].sort((a, b) => b.zIndex - a.zIndex);
</script>

<div class="w-60 border-r border-[var(--ui-border)] bg-[var(--ui-card)] p-4">
  <h3 class="mb-4 text-sm font-semibold">Layers</h3>
  <div class="space-y-1">
    {#each elements as el}
      <button
        onclick={() => editor.select(el.id)}
        class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-left
               hover:bg-[var(--ui-muted)]
               {$selectedElements.includes(el) ? 'bg-[var(--ui-muted)]' : ''}"
      >
        <span class="size-2 rounded-full bg-[var(--ui-primary)]"></span>
        <span class="truncate">{el.name}</span>
      </button>
    {/each}
  </div>
</div>
