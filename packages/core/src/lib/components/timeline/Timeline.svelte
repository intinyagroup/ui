<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '../../utils.js';
  import { setContext } from 'svelte';

  let {
    alternating = false,
    class: className,
    children,
  }: {
    alternating?: boolean;
    class?: string;
    children: Snippet;
  } = $props();

  setContext('timeline', { alternating });
</script>

<div
  class={cn('relative', className)}
  role="list"
>
  <!-- Connecting vertical line -->
  <div
    class={cn(
      'absolute top-0 bottom-0 w-px bg-[var(--ui-border)]',
      alternating
        ? 'left-1/2 -translate-x-1/2'
        : 'left-[19px]'
    )}
    aria-hidden="true"
  ></div>

  {@render children?.()}
</div>

{#if alternating}
  <style>
    .timeline-alternate-item:nth-child(odd) {
      flex-direction: row-reverse;
    }
    .timeline-alternate-item:nth-child(odd) .tl-content {
      text-align: right;
      padding-right: 2rem;
      padding-left: 0;
      justify-content: flex-end;
    }
    .timeline-alternate-item:nth-child(odd) .tl-title-row {
      flex-direction: row-reverse;
      justify-content: flex-end;
    }
  </style>
{/if}
