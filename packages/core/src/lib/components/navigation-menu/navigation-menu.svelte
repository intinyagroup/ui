<script lang="ts">
  import { NavigationMenu as ArkNavMenu } from "@ark-ui/svelte/navigation-menu";
  import { cn } from "$lib/utils.js";
  import type { ComponentProps } from "svelte";
  import NavigationMenuViewport from "./navigation-menu-viewport.svelte";

  let {
    ref = $bindable(null),
    class: className,
    viewport = true,
    children,
    ...restProps
  }: ComponentProps<typeof ArkNavMenu.Root> & {
    viewport?: boolean;
  } = $props();
</script>

<ArkNavMenu.Root
  bind:ref
  data-slot="navigation-menu"
  data-viewport={viewport}
  class={cn(
    "max-w-max group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
  {#if viewport}
    <NavigationMenuViewport />
  {/if}
</ArkNavMenu.Root>
