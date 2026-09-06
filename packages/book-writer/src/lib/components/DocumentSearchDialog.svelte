<script lang="ts">
  import { FileText, Search, CornerDownLeft, Sparkles, Folder } from 'lucide-svelte';
  import {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem
  } from '@intinyagroup/ui';
  import type { ContentBlock } from '../book-model.js';

  let {
    open = $bindable(false),
    blocks = [],
    onSelectBlock,
  }: {
    open?: boolean;
    blocks?: ContentBlock[];
    onSelectBlock?: (block: ContentBlock) => void;
  } = $props();

  let searchQuery = $state('');

  function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // Flattened and searchable list of pages & blocks
  const searchableBlocks = $derived.by(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return blocks;

    return blocks.filter((b) => {
      const matchTitle = b.title.toLowerCase().includes(q);
      const matchContent = stripHtml(b.content || '').toLowerCase().includes(q);
      return matchTitle || matchContent;
    });
  });

  function handleSelect(block: ContentBlock) {
    onSelectBlock?.(block);
    open = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      open = !open;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<CommandDialog
  bind:open
  title="Search Document Pages"
  description="Jump to any sub-page, chapter, or search text across pages"
>
  <CommandInput
    bind:value={searchQuery}
    placeholder="Search pages or content... (⌘K)"
  />

  <CommandList>
    <CommandEmpty>No matching pages found.</CommandEmpty>

    <CommandGroup heading="Pages & Chapters">
      {#each searchableBlocks as block (block.id)}
        <CommandItem
          value={block.title}
          onSelect={() => handleSelect(block)}
          class="flex items-center justify-between gap-3 py-2 cursor-pointer"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="text-sm shrink-0 select-none">
              {block.icon || (block.type === 'section' ? '📁' : '📄')}
            </span>
            <div class="flex flex-col min-w-0">
              <span class="text-xs font-semibold text-[var(--ui-foreground)] truncate">
                {block.title || 'Untitled'}
              </span>
              {#if block.content}
                <span class="text-[10px] text-[var(--ui-muted-foreground)] truncate max-w-sm">
                  {stripHtml(block.content)}
                </span>
              {/if}
            </div>
          </div>

          <div class="flex items-center gap-1.5 shrink-0">
            <span class="text-[10px] font-medium uppercase tracking-wider text-[var(--ui-muted-foreground)] px-1.5 py-0.5 rounded bg-[var(--ui-secondary)]/50">
              {block.type}
            </span>
            <CornerDownLeft class="size-3 text-[var(--ui-muted-foreground)] opacity-40" />
          </div>
        </CommandItem>
      {/each}
    </CommandGroup>
  </CommandList>
</CommandDialog>
