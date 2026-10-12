<script lang="ts">
  import { Dialog as ArkDialog } from "@ark-ui/svelte/dialog";
  import { Button } from "$lib/components/button/index.js";
  import { cn, type WithElementRef } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    children,
    showCloseButton = false,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    showCloseButton?: boolean;
  } = $props();
</script>

<div
  bind:this={ref}
  data-slot="dialog-footer"
  class={cn(
    "-mx-6 -mb-6 mt-auto shrink-0 rounded-b-xl border-t bg-muted/50 p-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
  {#if showCloseButton}
    <ArkDialog.CloseTrigger>
      <Button variant="outline">Close</Button>
    </ArkDialog.CloseTrigger>
  {/if}
</div>
