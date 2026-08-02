<script lang="ts">
  import { Search, ChevronUp, ChevronDown, X, CaseSensitive, WholeWord, Regex } from 'lucide-svelte';
  import { Button, Input } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import type { SearchResult, SearchState } from '../pdf-core.js';

  let {
    searchState,
    onSearch,
    onResultClick,
    onHighlightAll,
    onClose,
  }: {
    searchState: SearchState;
    onSearch: (query: string, options: { caseSensitive: boolean; wholeWord: boolean; regex: boolean }) => void;
    onResultClick: (result: SearchResult) => void;
    onHighlightAll: (highlight: boolean) => void;
    onClose: () => void;
  } = $props();

  let query = $state(searchState.query);
  let caseSensitive = $state(searchState.caseSensitive);
  let wholeWord = $state(searchState.wholeWord);
  let useRegex = $state(searchState.regex);
  let highlightAll = $state(true);

  function handleSearch() {
    onSearch(query, { caseSensitive, wholeWord, useRegex });
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      if (searchState.results.length === 0) handleSearch();
      else navigateResult(e.shiftKey ? -1 : 1);
    }
    if (e.key === 'Escape') onClose();
  }

  function navigateResult(direction: number) {
    const total = searchState.totalResults;
    if (total === 0) return;
    const next = (searchState.currentResult + direction + total) % total;
    const result = searchState.results[next];
    if (result) onResultClick(result);
  }

  $effect(() => {
    if (query !== searchState.query) {
      handleSearch();
    }
  });
</script>

<div class="flex flex-col w-80 border-l border-[var(--ui-border)] bg-[var(--ui-card)]">
  <!-- Header -->
  <div class="flex items-center justify-between px-3 py-2 border-b border-[var(--ui-border)]">
    <span class="text-sm font-semibold text-[var(--ui-foreground)]">Search</span>
    <button onclick={onClose} class="p-1 rounded hover:bg-[var(--ui-secondary)] cursor-pointer">
      <X class="size-4" />
    </button>
  </div>

  <!-- Search input -->
  <div class="p-3 space-y-2">
    <div class="relative">
      <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-[var(--ui-muted-foreground)]" />
      <input
        type="text"
        bind:value={query}
        placeholder="Search in document..."
        onkeydown={handleKeydown}
        class="w-full h-9 pl-9 pr-3 rounded-lg border border-[var(--ui-input)] bg-[var(--ui-background)] text-sm outline-none focus:border-[var(--ui-primary)]"
        autofocus
      />
    </div>

    <!-- Options -->
    <div class="flex items-center gap-1">
      <button
        onclick={() => { caseSensitive = !caseSensitive; handleSearch(); }}
        class={cn("p-1.5 rounded text-xs transition-colors", caseSensitive ? "bg-[var(--ui-primary)]/10 text-[var(--ui-primary)]" : "text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)]")}
        title="Case sensitive"
      >
        <CaseSensitive class="size-4" />
      </button>
      <button
        onclick={() => { wholeWord = !wholeWord; handleSearch(); }}
        class={cn("p-1.5 rounded text-xs transition-colors", wholeWord ? "bg-[var(--ui-primary)]/10 text-[var(--ui-primary)]" : "text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)]")}
        title="Whole word"
      >
        <WholeWord class="size-4" />
      </button>
      <button
        onclick={() => { useRegex = !useRegex; handleSearch(); }}
        class={cn("p-1.5 rounded text-xs transition-colors", useRegex ? "bg-[var(--ui-primary)]/10 text-[var(--ui-primary)]" : "text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)]")}
        title="Regex"
      >
        <Regex class="size-4" />
      </button>
    </div>

    <!-- Results count -->
    {#if searchState.totalResults > 0}
      <div class="flex items-center justify-between text-xs text-[var(--ui-muted-foreground)]">
        <span>{searchState.currentResult + 1} of {searchState.totalResults} results</span>
        <div class="flex gap-1">
          <button onclick={() => navigateResult(-1)} class="p-1 rounded hover:bg-[var(--ui-secondary)] cursor-pointer">
            <ChevronUp class="size-3.5" />
          </button>
          <button onclick={() => navigateResult(1)} class="p-1 rounded hover:bg-[var(--ui-secondary)] cursor-pointer">
            <ChevronDown class="size-3.5" />
          </button>
        </div>
      </div>
    {:else if query.length > 0}
      <p class="text-xs text-[var(--ui-muted-foreground)]">No results found</p>
    {/if}
  </div>

  <!-- Results list -->
  {#if searchState.results.length > 0}
    <div class="flex-1 overflow-auto border-t border-[var(--ui-border)]">
      {#each searchState.results as result, index (result.pageNumber + '-' + result.index)}
        <button
          onclick={() => onResultClick(result)}
          class={cn(
            "w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors cursor-pointer border-b border-[var(--ui-border)]/50",
            index === searchState.currentResult
              ? "bg-[var(--ui-primary)]/5"
              : "hover:bg-[var(--ui-secondary)]/50"
          )}
        >
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-[var(--ui-secondary)] text-[var(--ui-muted-foreground)] font-mono shrink-0">
            p.{result.pageNumber}
          </span>
          <span class="text-[var(--ui-foreground)] truncate">
            {result.text}
          </span>
        </button>
      {/each}
    </div>
  {/if}
</div>
