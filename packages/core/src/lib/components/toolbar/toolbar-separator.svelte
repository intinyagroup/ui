<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    orientation = "vertical",
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    orientation?: "horizontal" | "vertical";
  } = $props();
</script>

<div
  bind:this={ref}
  role="separator"
  data-slot="toolbar-separator"
  data-orientation={orientation}
  aria-orientation={orientation}
  class={cn(
    "shrink-0 bg-border/80 self-center",
    orientation === "vertical" ? "h-4 w-px mx-1" : "w-full h-px my-1",
    className,
  )}
  {...restProps}
></div>
