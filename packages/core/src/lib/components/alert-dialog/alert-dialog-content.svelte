<script lang="ts">
  import { Dialog as ArkDialog } from "@ark-ui/svelte/dialog";
  import { Portal } from "@ark-ui/svelte/portal";
  import { cn } from "$lib/utils.js";
  import AlertDialogOverlay from "./alert-dialog-overlay.svelte";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    size = "default",
    children,
    ...restProps
  }: ComponentProps<typeof ArkDialog.Content> & {
    size?: "default" | "sm";
    children?: import("svelte").Snippet;
  } = $props();
</script>

<Portal>
  <AlertDialogOverlay />
  <ArkDialog.Positioner
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <ArkDialog.Content
      bind:ref
      data-slot="alert-dialog-content"
      data-size={size}
      class={cn(
        "relative z-50 flex flex-col max-h-[85vh] sm:max-h-[90dvh] overflow-hidden w-full gap-4 rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 duration-100 data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 group/alert-dialog-content outline-none",
        className,
      )}
      {...restProps}
    >
      {@render children?.()}
    </ArkDialog.Content>
  </ArkDialog.Positioner>
</Portal>
