<script lang="ts">
  import { cn } from '../../utils.js';
  import { Inbox } from 'lucide-svelte';
  import type { Snippet } from 'svelte';

  let {
    icon = Inbox,
    title = 'No data',
    description = '',
    action,
    class: className,
  }: {
    icon?: any;
    title?: string;
    description?: string;
    action?: Snippet;
    class?: string;
  } = $props();
</script>

<div class={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
  <div class="size-16 rounded-full bg-[var(--ui-secondary)] flex items-center justify-center mb-4">
    <svelte:component this={icon} class="size-8 text-[var(--ui-muted-foreground)]" />
  </div>
  <h3 class="text-lg font-semibold text-[var(--ui-foreground)] mb-1">{title}</h3>
  {#if description}
    <p class="text-sm text-[var(--ui-muted-foreground)] text-center max-w-sm">{description}</p>
  {/if}
  {#if action}
    <div class="mt-4">
      {@render action()}
    </div>
  {/if}
</div>
