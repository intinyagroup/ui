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
  data-slot="sheet-overlay"
  class={cn(
    "bg-[var(--ui-overlay)] supports-backdrop-filter:backdrop-blur-xs [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none [@media(prefers-reduced-transparency:reduce)]:bg-[var(--ui-overlay-strong)] fixed inset-0 z-50 motion-reduce:transition-none",
    className,
  )}
  {...restProps}
/>
