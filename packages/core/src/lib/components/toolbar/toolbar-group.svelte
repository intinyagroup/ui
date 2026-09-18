<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    label,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    label?: string;
    children?: Snippet;
  } = $props();
</script>

<div
  bind:this={ref}
  role="group"
  data-slot="toolbar-group"
  aria-label={label}
  class={cn("inline-flex items-center gap-1", className)}
  {...restProps}
>
  {@render children?.()}
</div>
