<script lang="ts">
  import { NavigationMenu as ArkNavMenu } from "@ark-ui/svelte/navigation-menu";
  import { cn } from "$lib/utils.js";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: ComponentProps<typeof ArkNavMenu.Item> = $props();
</script>

<ArkNavMenu.Item
  bind:ref
  data-slot="navigation-menu-item"
  class={cn("cn-navigation-menu-item relative", className)}
  {...restProps}
/>
