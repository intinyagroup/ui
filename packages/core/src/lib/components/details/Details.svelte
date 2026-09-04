<script lang="ts">
  import { cn } from '../../utils.js';
  import { type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    open = $bindable(false),
    class: className,
    children,
    ...restProps
  }: {
    open?: boolean;
    class?: string;
    children: Snippet;
  } & HTMLAttributes<HTMLElement> = $props();
</script>

<details bind:open class={cn('rounded-lg border border-[var(--ui-border)] p-4', className)} {...restProps}>
  {@render children?.()}
</details>
