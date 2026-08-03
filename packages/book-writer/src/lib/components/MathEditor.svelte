<script lang="ts">
  import { Sigma, X } from 'lucide-svelte';
  import { Button, Input } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import { renderMath, mathTemplates, loadKaTeX } from '../math-utils.js';
  import { onMount } from 'svelte';

  let {
    onInsert,
    onClose,
  }: {
    onInsert: (latex: string, displayMode: boolean) => void;
    onClose: () => void;
  } = $props();

  let latex = $state('');
  let displayMode = $state(false);

  onMount(() => {
    loadKaTeX();
  });

  const previewHtml = $derived(latex ? renderMath(latex, displayMode) : '');

  function handleInsert() {
    if (!latex.trim()) return;
    onInsert(latex, displayMode);
  }
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div class="bg-[var(--ui-card)] rounded-xl p-6 w-[560px] shadow-xl max-h-[80vh] overflow-auto">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-[var(--ui-foreground)]">
        <Sigma class="size-5 inline mr-2" />
        Insert Math Equation
      </h3>
      <button onclick={onClose} class="p-1 rounded hover:bg-[var(--ui-secondary)] cursor-pointer">
        <X class="size-5" />
      </button>
    </div>

    <p class="text-sm text-[var(--ui-muted-foreground)] mb-4">
      Enter LaTeX math expressions. Use $...$ for inline math or $$...$$ for display math.
    </p>

    <!-- Templates -->
    <div class="mb-4">
      <span class="text-xs text-[var(--ui-muted-foreground)] mb-2 block">Quick templates:</span>
      <div class="flex flex-wrap gap-1.5">
        {#each mathTemplates as template}
          <button
            onclick={() => latex = template.latex}
            class="px-2 py-1 rounded border border-[var(--ui-border)] text-xs hover:bg-[var(--ui-secondary)] transition-colors cursor-pointer"
          >
            {template.label}
          </button>
        {/each}
      </div>
    </div>

    <!-- LaTeX input -->
    <textarea
      bind:value={latex}
      placeholder="Enter LaTeX, e.g., \frac{a}{b} or \sum_{i=1}^{n} x_i"
      class="w-full h-24 px-3 py-2 rounded-lg border border-[var(--ui-input)] text-sm font-mono resize-none mb-3"
    ></textarea>

    <!-- Options -->
    <div class="flex items-center gap-4 mb-4">
      <label class="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" bind:checked={displayMode} class="accent-[var(--ui-primary)]" />
        Display mode (centered, larger)
      </label>
    </div>

    <!-- Preview -->
    {#if previewHtml}
      <div class="p-4 rounded-lg border border-[var(--ui-border)] bg-white mb-4">
        <span class="text-xs text-[var(--ui-muted-foreground)] block mb-2">Preview:</span>
        <div class="text-center text-lg">
          {@html previewHtml}
        </div>
      </div>
    {/if}

    <div class="flex justify-end gap-2">
      <Button variant="outline" onclick={onClose}>Cancel</Button>
      <Button onclick={handleInsert} disabled={!latex.trim()}>Insert Equation</Button>
    </div>
  </div>
</div>
