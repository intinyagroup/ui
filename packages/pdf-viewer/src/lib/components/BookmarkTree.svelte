<script lang="ts">
  import { ChevronRight, ChevronDown, BookOpen } from 'lucide-svelte';
  import { cn } from '@intinyagroup/grid-core/utils';
  import type { Bookmark } from '../pdf-core.js';

  let {
    bookmarks = [],
    onNavigate,
    class: className,
  }: {
    bookmarks: Bookmark[];
    onNavigate: (pageNumber: number) => void;
    class?: string;
  } = $props();

  let expanded = $state<Set<string>>(new Set());

  function toggleExpand(title: string) {
    const next = new Set(expanded);
    if (next.has(title)) next.delete(title);
    else next.add(title);
    expanded = next;
  }

  function isExpanded(title: string): boolean {
    return expanded.has(title);
  }

  onMount(() => {
    // Auto-expand top-level
    bookmarks.forEach((b) => expanded.add(b.title));
    expanded = new Set(expanded);
  });

  import { onMount } from 'svelte';
</script>

<div class={cn('p-2', className)}>
  {#if bookmarks.length === 0}
    <div class="text-center py-8 text-sm text-[var(--ui-muted-foreground)]">
      <BookOpen class="size-8 mx-auto mb-2 opacity-40" />
      No bookmarks
    </div>
  {:else}
    {#each bookmarks as bookmark (bookmark.title)}
      <div class="mb-0.5">
        <button
          onclick={() => onNavigate(bookmark.pageNumber)}
          class="flex items-center gap-1.5 w-full px-2 py-1.5 rounded-md text-sm text-left hover:bg-[var(--ui-secondary)] transition-colors cursor-pointer"
        >
          {#if bookmark.children?.length}
            <button
              onclick|stopPropagation={() => toggleExpand(bookmark.title)}
              class="p-0.5 rounded hover:bg-[var(--ui-secondary)]"
            >
              {#if isExpanded(bookmark.title)}
                <ChevronDown class="size-3" />
              {:else}
                <ChevronRight class="size-3" />
              {/if}
            </button>
          {:else}
            <span class="w-5"></span>
          {/if}

          <span class="truncate text-[var(--ui-foreground)]">{bookmark.title}</span>
          <span class="ml-auto text-[10px] text-[var(--ui-muted-foreground)] shrink-0">
            {bookmark.pageNumber}
          </span>
        </button>

        {#if bookmark.children?.length && isExpanded(bookmark.title)}
          <div class="ml-4">
            {#each bookmark.children as child (child.title)}
              <button
                onclick={() => onNavigate(child.pageNumber)}
                class="flex items-center gap-1.5 w-full px-2 py-1 rounded-md text-xs text-left hover:bg-[var(--ui-secondary)] transition-colors cursor-pointer"
              >
                <span class="truncate text-[var(--ui-muted-foreground)]">{child.title}</span>
                <span class="ml-auto text-[10px] text-[var(--ui-muted-foreground)]/60 shrink-0">
                  {child.pageNumber}
                </span>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  {/if}
</div>
