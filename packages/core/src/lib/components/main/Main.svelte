<script lang="ts">
  import { cn } from '../../utils.js';
  import { type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    class: className,
    children,
    ...restProps
  }: {
    class?: string;
    children: Snippet;
  } & HTMLAttributes<HTMLElement> = $props();
</script>

<main class={cn('flex-1 p-6', className)} {...restProps}>
  {@render children?.()}
</main>
