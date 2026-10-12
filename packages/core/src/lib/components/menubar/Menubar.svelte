<script lang="ts">
  import { Menu as ArkMenu } from "@ark-ui/svelte/menu";
  import { cn } from "$lib/utils.js";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: ComponentProps<typeof ArkMenu.Root> & {
    ref?: HTMLDivElement | null;
    class?: string;
  } = $props();
</script>

<div
  bind:this={ref}
  data-slot="menubar"
  class={cn(
    "flex h-10 items-center gap-1 rounded-md border bg-background p-1 text-sm shadow-sm",
    className,
  )}
>
  <ArkMenu.Root {...restProps}>
    {@render children?.()}
  </ArkMenu.Root>
</div>
