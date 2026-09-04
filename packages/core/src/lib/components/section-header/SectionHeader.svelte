<script lang="ts">
  import { cn } from '../../utils.js';
  import type { Snippet } from 'svelte';

  let {
    title = '',
    description = '',
    action,
    class: className,
  }: {
    title?: string;
    description?: string;
    action?: Snippet;
    class?: string;
  } = $props();
</script>

<div class={cn('flex items-start justify-between', className)}>
  <div>
    <h2 class="text-lg font-semibold text-[var(--ui-foreground)]">{title}</h2>
    {#if description}
      <p class="text-sm text-[var(--ui-muted-foreground)] mt-0.5">{description}</p>
    {/if}
  </div>
  {#if action}
    <div class="shrink-0">
      {@render action()}
    </div>
  {/if}
</div>
