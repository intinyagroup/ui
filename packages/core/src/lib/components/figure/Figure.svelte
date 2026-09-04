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

<figure class={cn('flex flex-col items-center', className)} {...restProps}>
  {@render children?.()}
</figure>
