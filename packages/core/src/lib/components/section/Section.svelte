<script lang="ts">
  import { cn } from '../../utils.js';
  import { type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    class: className,
    children,
    'aria-labelledby': ariaLabelledby,
    ...restProps
  }: {
    class?: string;
    children: Snippet;
    'aria-labelledby'?: string;
  } & HTMLAttributes<HTMLElement> = $props();
</script>

<section class={cn('py-8', className)} aria-labelledby={ariaLabelledby} {...restProps}>
  {@render children?.()}
</section>
