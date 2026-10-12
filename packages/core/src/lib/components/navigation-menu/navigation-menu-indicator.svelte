<script lang="ts">
  import { NavigationMenu as ArkNavMenu } from "@ark-ui/svelte/navigation-menu";
  import { cn } from "$lib/utils.js";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: ComponentProps<typeof ArkNavMenu.Indicator> = $props();
</script>

<ArkNavMenu.Indicator
  bind:ref
  data-slot="navigation-menu-indicator"
  class={cn(
    "data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
    className,
  )}
  {...restProps}
>
  <div
    class="rounded-tl-sm bg-border shadow-md relative top-[60%] h-2 w-2 rotate-45"
  ></div>
</ArkNavMenu.Indicator>
