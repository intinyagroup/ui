<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";

  export type AppBarSectionAlign = "start" | "center" | "end";

  let {
    ref = $bindable(null),
    class: className,
    align = "start",
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    align?: AppBarSectionAlign;
    children?: Snippet;
  } = $props();
</script>

<div
  bind:this={ref}
  data-slot="app-bar-section"
  data-align={align}
  class={cn(
    "flex items-center gap-1.5",
    align === "start" && "justify-start min-w-0",
    align === "center" && "justify-center flex-1",
    align === "end" && "justify-end ml-auto shrink-0",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>
