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

<summary class={cn('cursor-pointer font-medium text-[var(--ui-foreground)] [&::-webkit-details-marker]:hidden', className)} {...restProps}>
  {@render children?.()}
</summary>
