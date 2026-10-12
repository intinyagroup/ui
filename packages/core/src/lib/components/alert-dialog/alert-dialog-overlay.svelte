<script lang="ts">
  import { Dialog as ArkDialog } from "@ark-ui/svelte/dialog";
  import { cn } from "$lib/utils.js";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: ComponentProps<typeof ArkDialog.Backdrop> = $props();
</script>

<ArkDialog.Backdrop
  bind:ref
  data-slot="alert-dialog-overlay"
  class={cn(
    "bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 z-50",
    className,
  )}
  {...restProps}
/>
