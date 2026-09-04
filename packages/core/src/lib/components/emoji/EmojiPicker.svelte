<script lang="ts">
  import { Search, X } from 'lucide-svelte';
  import { Input } from '../input/index.js';
  import { cn } from '@intinyagroup/grid-core/utils';
  import { emojiCategories, searchEmojis, getRecentEmojis, addRecentEmoji } from '../../utils/bidi-emoji.js';

  let {
    onSelect,
    onClose,
  }: {
    onSelect: (emoji: string) => void;
    onClose: () => void;
  } = $props();

  let searchQuery = $state('');
  let activeCategory = $state('Smileys');
  let recentEmojis = $state(getRecentEmojis());

  const filteredEmojis = $derived(
    searchQuery
      ? searchEmojis(searchQuery)
      : emojiCategories.find((c) => c.name === activeCategory)?.emojis ?? []
  );

  function handleSelect(emoji: string) {
    addRecentEmoji(emoji);
    recentEmojis = getRecentEmojis();
    onSelect(emoji);
  }
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div class="bg-[var(--ui-card)] rounded-xl w-[360px] shadow-xl max-h-[500px] flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-[var(--ui-border)]">
      <span class="text-sm font-semibold text-[var(--ui-foreground)]">Emoji</span>
      <button onclick={onClose} class="p-1 rounded hover:bg-[var(--ui-secondary)] cursor-pointer">
        <X class="size-4" />
      </button>
    </div>

    <!-- Search -->
    <div class="px-4 py-2 border-b border-[var(--ui-border)]">
      <div class="relative">
        <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-[var(--ui-muted-foreground)]" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search emoji..."
          class="w-full h-8 pl-8 pr-3 rounded-lg border border-[var(--ui-input)] bg-[var(--ui-background)] text-sm outline-none"
        />
      </div>
    </div>

    <!-- Categories -->
    {#if !searchQuery}
      <div class="flex gap-1 px-4 py-2 border-b border-[var(--ui-border)] overflow-x-auto">
        {#each emojiCategories as category}
          <button
            onclick={() => activeCategory = category.name}
            class={cn(
              "size-8 flex items-center justify-center rounded-lg text-lg transition-colors cursor-pointer shrink-0",
              activeCategory === category.name
                ? "bg-[var(--ui-primary)]/10 ring-1 ring-[var(--ui-primary)]/30"
                : "hover:bg-[var(--ui-secondary)]"
            )}
            title={category.name}
          >
            {category.icon}
          </button>
        {/each}
      </div>
    {/if}

    <!-- Emoji grid -->
    <div class="flex-1 overflow-auto p-3">
      {#if searchQuery && filteredEmojis.length === 0}
        <div class="text-center py-8 text-sm text-[var(--ui-muted-foreground)]">
          No emojis found
        </div>
      {:else}
        <div class="grid grid-cols-8 gap-0.5">
          {#each filteredEmojis as emoji (emoji)}
            <button
              onclick={() => handleSelect(emoji)}
              class="size-9 flex items-center justify-center rounded-lg text-xl hover:bg-[var(--ui-secondary)] transition-colors cursor-pointer"
              title={emoji}
            >
              {emoji}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
