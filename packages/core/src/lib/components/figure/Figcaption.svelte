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
<!-- svelte-ignore a11y_figcaption_parent -->
<figcaption class={cn('mt-2 text-sm text-[var(--ui-muted-foreground)]', className)} {...restProps}>
  {@render children?.()}
</figcaption>
