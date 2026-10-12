<script lang="ts">
  import { NavigationMenu as ArkNavMenu } from "@ark-ui/svelte/navigation-menu";
  import { cn } from "$lib/utils.js";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: ComponentProps<typeof ArkNavMenu.List> = $props();
</script>

<ArkNavMenu.List
  bind:ref
  data-slot="navigation-menu-list"
  class={cn(
    "gap-0 group flex flex-1 list-none items-center justify-center",
    className,
  )}
  {...restProps}
/>
