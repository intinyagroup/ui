<script lang="ts">
  import { Menu as ArkMenu } from "@ark-ui/svelte/menu";
  import { cn } from "$lib/utils.js";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    inset,
    variant = "default",
    children,
    ...restProps
  }: ComponentProps<typeof ArkMenu.Item> & {
    inset?: boolean;
    variant?: "default" | "destructive";
  } = $props();
</script>

<ArkMenu.Item
  bind:ref
  data-slot="context-menu-item"
  data-inset={inset}
  data-variant={variant}
  class={cn(
    "gap-1.5 rounded-md px-1.5 py-1 text-sm focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:focus:bg-destructive/20 [&_svg:not([class*='size-'])]:size-4 focus:*:[svg]:text-accent-foreground data-[variant=destructive]:*:[svg]:text-destructive group/context-menu-item relative flex cursor-default items-center outline-hidden",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</ArkMenu.Item>
