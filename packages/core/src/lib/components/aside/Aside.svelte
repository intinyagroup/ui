<script lang="ts">
  import { cn } from '../../utils.js';
  import { type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    class: className,
    children,
    'aria-label': ariaLabel,
    ...restProps
  }: {
    class?: string;
    children: Snippet;
    'aria-label'?: string;
  } & HTMLAttributes<HTMLElement> = $props();
</script>

<aside class={cn('border-r border-[var(--ui-border)] bg-[var(--ui-card)]', className)} aria-label={ariaLabel} {...restProps}>
  {@render children?.()}
</aside>
