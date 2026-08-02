<script lang="ts">
  import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';

  let {
    sheets,
    activeSheetId,
    onSheetChange,
    onAddSheet,
    onRemoveSheet,
    onRenameSheet,
  }: {
    sheets: { id: string; name: string }[];
    activeSheetId: string;
    onSheetChange: (id: string) => void;
    onAddSheet: () => void;
    onRemoveSheet: (id: string) => void;
    onRenameSheet: (id: string, name: string) => void;
  } = $props();

  let editingId = $state<string | null>(null);
  let editValue = $state('');

  function startRename(id: string, currentName: string) {
    editingId = id;
    editValue = currentName;
  }

  function commitRename() {
    if (editingId && editValue.trim()) {
      onRenameSheet(editingId, editValue.trim());
    }
    editingId = null;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') commitRename();
    if (e.key === 'Escape') editingId = null;
  }
</script>

<div class="flex items-center gap-1 border-t border-[var(--ui-border)] bg-[var(--ui-card)] px-2 py-1.5">
  <Button variant="ghost" size="sm" class="size-7 p-0" onclick={onAddSheet}>
    <Plus class="size-3.5" />
  </Button>

  <div class="flex items-center gap-0.5 overflow-x-auto">
    {#each sheets as sheet (sheet.id)}
      {@const isActive = sheet.id === activeSheetId}

      {#if editingId === sheet.id}
        <input
          type="text"
          bind:value={editValue}
          onblur={commitRename}
          onkeydown={handleKeydown}
          class="h-7 w-24 px-2 rounded-md border border-[var(--ui-primary)] bg-[var(--ui-background)] text-xs font-medium text-[var(--ui-foreground)] outline-none"
          autofocus
        />
      {:else}
        <button
          onclick={() => onSheetChange(sheet.id)}
          ondblclick={() => startRename(sheet.id, sheet.name)}
          class={cn(
            'flex items-center gap-1 h-7 px-3 rounded-md text-xs font-medium transition-colors cursor-pointer',
            isActive
              ? 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)]'
              : 'text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)] hover:text-[var(--ui-foreground)]'
          )}
        >
          {sheet.name}
          {#if sheets.length > 1}
            <button
              onclick={(e) => { e.stopPropagation(); onRemoveSheet(sheet.id); }}
              class="ml-1 rounded p-0.5 hover:bg-[var(--ui-primary)]/20"
              aria-label="Remove sheet"
            >
              <X class="size-3" />
            </button>
          {/if}
        </button>
      {/if}
    {/each}
  </div>
</div>
