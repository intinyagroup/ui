<script lang="ts">
  import { NavigationMenu as ArkNavMenu } from "@ark-ui/svelte/navigation-menu";
  import { cn } from "$lib/utils.js";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: ComponentProps<typeof ArkNavMenu.Link> = $props();
</script>

<ArkNavMenu.Link
  bind:ref
  data-slot="navigation-menu-link"
  class={cn(
    "flex items-center gap-2 rounded-lg p-2 text-sm transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1 in-data-[slot=navigation-menu-content]:rounded-md data-active:bg-muted/50 data-active:hover:bg-muted data-active:focus:bg-muted [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  {...restProps}
/>
