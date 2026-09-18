<script lang="ts">
  import { Dialog as ArkDialog } from "@ark-ui/svelte/dialog";
  import { Portal } from "@ark-ui/svelte/portal";
  import XIcon from "@lucide/svelte/icons/x";
  import { Button } from "$lib/components/button/index.js";
  import { cn } from "$lib/utils.js";
  import DialogOverlay from "./dialog-overlay.svelte";
  import type { ComponentProps, Snippet } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    children,
    showCloseButton = true,
    overlayClass,
    size = "md",
    ...restProps
  }: ComponentProps<typeof ArkDialog.Content> & {
    children?: Snippet;
    showCloseButton?: boolean;
    overlayClass?: string;
    /** Width preset for dialog content. Custom classes still override this preset. */
    size?: "sm" | "md" | "lg" | "xl" | "full";
  } = $props();

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-lg sm:max-w-sm",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[calc(100%-2rem)]",
  } as const;
</script>

<Portal>
  <DialogOverlay class={overlayClass} />
  <ArkDialog.Positioner
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <ArkDialog.Content
      bind:ref
      data-slot="dialog-content"
      class={cn(
        "relative z-50 grid w-full gap-4 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-background)] p-6 shadow-lg duration-200 text-sm text-[var(--ui-foreground)] outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        sizeClasses[size],
        className,
      )}
      {...restProps}
    >
      {@render children?.()}
      {#if showCloseButton}
        <ArkDialog.CloseTrigger
          class="absolute top-4 right-4"
          data-slot="dialog-close"
        >
          <Button variant="ghost" size="icon-sm">
            <XIcon class="size-4" />
            <span class="sr-only">Close</span>
          </Button>
        </ArkDialog.CloseTrigger>
      {/if}
    </ArkDialog.Content>
  </ArkDialog.Positioner>
</Portal>
