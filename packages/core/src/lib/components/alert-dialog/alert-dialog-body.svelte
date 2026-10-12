<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
  bind:this={ref}
  data-slot="alert-dialog-body"
  class={cn(
    "flex-1 min-h-0 overflow-y-auto px-1 py-1 -mx-1 text-sm text-muted-foreground",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>
