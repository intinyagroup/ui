<script lang="ts">
  import { Menu as ArkMenu } from "@ark-ui/svelte/menu";
  import { cn } from "$lib/utils.js";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    inset,
    children,
    ...restProps
  }: ComponentProps<typeof ArkMenu.ItemGroupLabel> & {
    inset?: boolean;
  } = $props();
</script>

<ArkMenu.ItemGroupLabel
  bind:ref
  data-slot="context-menu-group-heading"
  data-inset={inset}
  class={cn(
    "px-2 py-1.5 text-sm font-medium text-foreground data-inset:ps-8",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</ArkMenu.ItemGroupLabel>
