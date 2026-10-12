<script lang="ts">
  import { Menu as ArkMenu } from "@ark-ui/svelte/menu";
  import { Portal } from "@ark-ui/svelte/portal";
  import { cn } from "$lib/utils.js";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: ComponentProps<typeof ArkMenu.Content> = $props();
</script>

<Portal>
  <ArkMenu.Positioner>
    <ArkMenu.Content
      bind:ref
      data-slot="context-menu-content"
      class={cn(
        "min-w-36 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 z-50 overflow-x-hidden overflow-y-auto outline-none",
        className,
      )}
      {...restProps}
    >
      {@render children?.()}
    </ArkMenu.Content>
  </ArkMenu.Positioner>
</Portal>
