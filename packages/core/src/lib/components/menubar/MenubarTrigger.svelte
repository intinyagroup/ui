<script lang="ts">
  import { Menu as ArkMenu } from "@ark-ui/svelte/menu";
  import { cn } from "$lib/utils.js";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: ComponentProps<typeof ArkMenu.Trigger> = $props();
</script>

<ArkMenu.Trigger
  bind:ref
  data-slot="menubar-trigger"
  class={cn(
    "flex cursor-default items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-hidden focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</ArkMenu.Trigger>
