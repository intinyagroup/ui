<script lang="ts">
  import { Copy, Check } from 'lucide-svelte';
  import { cn } from '../../utils.js';

  let {
    code = '',
    language = 'javascript',
    showLineNumbers = false,
    class: className,
  }: {
    code?: string;
    language?: string;
    showLineNumbers?: boolean;
    class?: string;
  } = $props();

  let copied = $state(false);

  function copyCode() {
    navigator.clipboard.writeText(code);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }

  const lines = $derived(code.split('\n'));
</script>

<div class={cn('relative rounded-xl overflow-hidden border border-[var(--ui-border)]', className)}>
  <!-- Header -->
  <div class="flex items-center justify-between px-4 py-2 bg-[var(--ui-secondary)]/50 border-b border-[var(--ui-border)]">
    <span class="text-[10px] font-mono text-[var(--ui-muted-foreground)] uppercase">{language}</span>
    <button
      onclick={copyCode}
      class="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-[var(--ui-muted-foreground)] hover:bg-[var(--ui-secondary)] transition-colors cursor-pointer"
    >
      {#if copied}
        <Check class="size-3 text-[var(--ui-success)]" /> Copied
      {:else}
        <Copy class="size-3" /> Copy
      {/if}
    </button>
  </div>

  <!-- Code -->
  <div class="overflow-x-auto">
    <pre class="p-4 text-sm font-mono leading-relaxed"><code>{#each lines as line, i}{#if showLineNumbers}<span class="inline-block w-8 text-right mr-4 text-[var(--ui-muted-foreground)]/50 select-none">{i + 1}</span>{/if}{line}
{/each}</code></pre>
  </div>
</div>
