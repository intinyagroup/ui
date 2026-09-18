<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    level = 1,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLHeadingElement>> & {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    children?: Snippet;
  } = $props();
</script>

<svelte:element
  this={`h${level}`}
  bind:this={ref}
  data-slot="app-bar-title"
  class={cn(
    "truncate font-semibold tracking-tight text-base sm:text-lg text-foreground",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</svelte:element>
