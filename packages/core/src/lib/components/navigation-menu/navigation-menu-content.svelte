<script lang="ts">
  import { NavigationMenu as ArkNavMenu } from "@ark-ui/svelte/navigation-menu";
  import { cn } from "$lib/utils.js";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: ComponentProps<typeof ArkNavMenu.Content> = $props();
</script>

<ArkNavMenu.ViewportPositioner>
  <ArkNavMenu.Content
    bind:ref
    data-slot="navigation-menu-content"
    class={cn(
      "p-1 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[viewport=false]/navigation-menu:rounded-lg group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:ring-foreground/10 group-data-[viewport=false]/navigation-menu:duration-300 data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out group-data-[viewport=false]/navigation-menu:data-[motion=from-end]:slide-in-from-left-52 group-data-[viewport=false]/navigation-menu:data-[motion=from-start]:slide-in-from-right-52 group-data-[viewport=false]/navigation-menu:data-[motion=to-end]:slide-out-to-left-52 group-data-[viewport=false]/navigation-menu:data-[motion=to-start]:slide-out-to-right-52",
      className,
    )}
    {...restProps}
  />
</ArkNavMenu.ViewportPositioner>
