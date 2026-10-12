<script lang="ts" module>
  export type Side = "top" | "right" | "bottom" | "left";
</script>

<script lang="ts">
  import { Dialog as ArkDialog } from "@ark-ui/svelte/dialog";
  import { Portal } from "@ark-ui/svelte/portal";
  import XIcon from "@lucide/svelte/icons/x";
  import { Button } from "$lib/components/button/index.js";
  import { cn } from "$lib/utils.js";
  import SheetOverlay from "./sheet-overlay.svelte";
  import type { ComponentProps } from "svelte";
  import type { Snippet } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    side = "right",
    showCloseButton = true,
    overlayClass,
    children,
    ...restProps
  }: ComponentProps<typeof ArkDialog.Content> & {
    side?: Side;
    showCloseButton?: boolean;
    overlayClass?: string;
    children: Snippet;
  } = $props();
</script>

<Portal>
  <SheetOverlay class={overlayClass} />
  <ArkDialog.Positioner
    class={cn(
      "fixed inset-0 z-50",
      side === "top" && "justify-start",
      side === "bottom" && "justify-end",
      (side === "left" || side === "right") && "items-center",
      side === "left" && "justify-start",
      side === "right" && "justify-end",
    )}
  >
    <ArkDialog.Content
      bind:ref
      data-slot="sheet-content"
      data-side={side}
      class={cn(
        "fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out motion-reduce:transition-none motion-reduce:animate-none data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-[side=right]:data-open:slide-in-from-right data-[side=left]:data-open:slide-in-from-left data-[side=top]:data-open:slide-in-from-top data-[side=bottom]:data-open:slide-in-from-bottom data-closed:animate-out data-closed:fade-out-0 data-[side=right]:data-closed:slide-out-to-right data-[side=left]:data-closed:slide-out-to-left data-[side=top]:data-closed:slide-out-to-top data-[side=bottom]:data-closed:slide-out-to-bottom motion-reduce:transition-none motion-reduce:animate-none",
        className,
      )}
      {...restProps}
    >
      {@render children?.()}
      {#if showCloseButton}
        <ArkDialog.CloseTrigger data-slot="sheet-close">
          <Button variant="ghost" class="absolute top-3 right-3" size="icon-sm">
            <XIcon />
            <span class="sr-only">Close</span>
          </Button>
        </ArkDialog.CloseTrigger>
      {/if}
    </ArkDialog.Content>
  </ArkDialog.Positioner>
</Portal>
