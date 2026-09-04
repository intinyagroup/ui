<script lang="ts">
  import { Copy, Check } from 'lucide-svelte';
  import { cn } from '../../utils.js';
  import type { Snippet } from 'svelte';

  let {
    text = '',
    variant = 'ghost',
    size = 'sm',
    class: className,
    onCopy,
  }: {
    text?: string;
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'sm' | 'md';
    class?: string;
    onCopy?: (text: string) => void;
  } = $props();

  let copied = $state(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
      onCopy?.(text);
      setTimeout(() => (copied = false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      copied = true;
      onCopy?.(text);
      setTimeout(() => (copied = false), 2000);
    }
  }
</script>

<button
  onclick={handleCopy}
  class={cn(
    'inline-flex items-center gap-1.5 transition-colors cursor-pointer',
    variant === 'ghost' ? 'hover:bg-[var(--ui-secondary)]' : '',
    size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm',
    className
  )}
  title="Copy to clipboard"
>
  {#if copied}
    <Check class="size-3.5 text-[var(--ui-success)]" />
    <span>Copied!</span>
  {:else}
    <Copy class="size-3.5" />
    <span>Copy</span>
  {/if}
</button>
