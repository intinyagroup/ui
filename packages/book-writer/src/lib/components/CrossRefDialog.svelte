<script lang="ts">
  import { Link, X } from 'lucide-svelte';
  import { Button, Input } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import type { Chapter } from '../book-model.js';
  import { getCrossRefOptions, type CrossRefType } from '../crossref-utils.js';

  let {
    chapters,
    onInsert,
    onClose,
  }: {
    chapters: Chapter[];
    onInsert: (type: CrossRefType, targetId: string, label: string) => void;
    onClose: () => void;
  } = $props();

  let selectedType = $state<CrossRefType>('chapter');
  let selectedTarget = $state('');
  let customLabel = $state('');
  let searchQuery = $state('');

  const options = $derived(getCrossRefOptions(chapters));

  const filteredOptions = $derived(
    searchQuery
      ? options.filter((o) => o.label.toLowerCase().includes(searchQuery.toLowerCase()))
      : options.filter((o) => o.type === selectedType)
  );

  function handleInsert() {
    if (!selectedTarget) return;
    const [type, id] = selectedTarget.split(':');
    const option = options.find((o) => o.value === selectedTarget);
    const label = customLabel || option?.label || '';
    onInsert(type as CrossRefType, id, label);
  }

  const types: { value: CrossRefType; label: string }[] = [
    { value: 'chapter', label: 'Chapter' },
    { value: 'page', label: 'Page' },
    { value: 'figure', label: 'Figure' },
    { value: 'table', label: 'Table' },
    { value: 'footnote', label: 'Footnote' },
  ];
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div class="bg-[var(--ui-card)] rounded-xl p-6 w-[480px] shadow-xl max-h-[80vh] overflow-auto">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-[var(--ui-foreground)]">
        <Link class="size-5 inline mr-2" />
        Insert Cross-Reference
      </h3>
      <button onclick={onClose} class="p-1 rounded hover:bg-[var(--ui-secondary)] cursor-pointer">
        <X class="size-5" />
      </button>
    </div>

    <p class="text-sm text-[var(--ui-muted-foreground)] mb-4">
      Link to chapters, pages, or other elements. The reference updates automatically when content changes.
    </p>

    <!-- Type selector -->
    <div class="flex gap-2 mb-4">
      {#each types as type}
        <button
          onclick={() => { selectedType = type.value; selectedTarget = ''; }}
          class={cn(
            "px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer",
            selectedType === type.value
              ? "border-[var(--ui-primary)] bg-[var(--ui-primary)]/5 text-[var(--ui-primary)]"
              : "border-[var(--ui-border)] text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)]"
          )}
        >
          {type.label}
        </button>
      {/each}
    </div>

    <!-- Search -->
    <Input
      bind:value={searchQuery}
      placeholder="Search references..."
      class="mb-3"
    />

    <!-- Options list -->
    <div class="max-h-48 overflow-auto border border-[var(--ui-border)] rounded-lg mb-4">
      {#if filteredOptions.length === 0}
        <div class="p-4 text-center text-sm text-[var(--ui-muted-foreground)]">
          No references found
        </div>
      {:else}
        {#each filteredOptions as option (option.value)}
          <button
            onclick={() => selectedTarget = option.value}
            class={cn(
              "w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors cursor-pointer border-b border-[var(--ui-border)]/50 last:border-0",
              selectedTarget === option.value
                ? "bg-[var(--ui-primary)]/5"
                : "hover:bg-[var(--ui-secondary)]/50"
            )}
          >
            <span class="text-[var(--ui-muted-foreground)] text-xs uppercase w-12">{option.type}</span>
            <span class="text-[var(--ui-foreground)]">{option.label}</span>
          </button>
        {/each}
      {/if}
    </div>

    <!-- Custom label -->
    <Input
      bind:value={customLabel}
      placeholder="Custom display text (optional)"
      class="mb-4"
    />

    <!-- Preview -->
    {#if selectedTarget}
      <div class="p-3 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-secondary)]/20 mb-4">
        <span class="text-xs text-[var(--ui-muted-foreground)]">Preview:</span>
        <span class="text-sm text-[var(--ui-primary)] ml-2">
          {customLabel || options.find((o) => o.value === selectedTarget)?.label}
        </span>
      </div>
    {/if}

    <div class="flex justify-end gap-2">
      <Button variant="outline" onclick={onClose}>Cancel</Button>
      <Button onclick={handleInsert} disabled={!selectedTarget}>Insert Reference</Button>
    </div>
  </div>
</div>
