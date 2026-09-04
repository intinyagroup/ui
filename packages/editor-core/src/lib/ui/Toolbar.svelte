<script lang="ts">
  import { editor, undo, redo, canUndo, canRedo } from '../state/index.js';
  import { exportToSvelte, exportToReact, exportToHTML } from '../export/index.js';

  let showExport = $state(false);

  function handleExport(format: 'svelte' | 'react' | 'html') {
    const elements = $editor.elements;
    let code = '';

    switch (format) {
      case 'svelte':
        code = exportToSvelte(elements);
        break;
      case 'react':
        code = exportToReact(elements);
        break;
      case 'html':
        code = exportToHTML(elements);
        break;
    }

    navigator.clipboard.writeText(code);
    showExport = false;
    alert('Code copied to clipboard!');
  }
</script>

<div class="flex items-center gap-2 border-b border-[var(--ui-border)] bg-[var(--ui-card)] px-4 py-2">
  <button
    onclick={undo}
    disabled={!canUndo()}
    class="rounded p-2 hover:bg-[var(--ui-muted)] disabled:opacity-50"
    title="Undo"
  >
    ↩
  </button>
  <button
    onclick={redo}
    disabled={!canRedo()}
    class="rounded p-2 hover:bg-[var(--ui-muted)] disabled:opacity-50"
    title="Redo"
  >
    ↪
  </button>

  <div class="mx-2 h-6 w-px bg-[var(--ui-border)]"></div>

  <button
    onclick={() => editor.toggleGrid()}
    class="rounded p-2 hover:bg-[var(--ui-muted)] {$editor.showGrid ? 'text-[var(--ui-primary)]' : ''}"
    title="Toggle Grid"
  >
    #
  </button>

  <div class="flex-1"></div>

  <div class="relative">
    <button
      onclick={() => showExport = !showExport}
      class="rounded bg-[var(--ui-primary)] px-4 py-1.5 text-sm text-[var(--ui-primary-foreground)]"
    >
      Export
    </button>

    {#if showExport}
      <div class="absolute right-0 top-full mt-2 w-40 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)] p-2 shadow-lg">
        <button onclick={() => handleExport('svelte')} class="w-full rounded px-3 py-2 text-left text-sm hover:bg-[var(--ui-muted)]">Svelte</button>
        <button onclick={() => handleExport('react')} class="w-full rounded px-3 py-2 text-left text-sm hover:bg-[var(--ui-muted)]">React</button>
        <button onclick={() => handleExport('html')} class="w-full rounded px-3 py-2 text-left text-sm hover:bg-[var(--ui-muted)]">HTML</button>
      </div>
    {/if}
  </div>
</div>
