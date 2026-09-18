<script lang="ts">
  import { Dialog as SheetPrimitive } from "bits-ui";
  import { cn } from "$lib/utils.js";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: SheetPrimitive.OverlayProps = $props();
</script>

<SheetPrimitive.Overlay
  bind:ref
  data-slot="sheet-overlay"
  class={cn(
    "bg-[var(--ui-overlay)] supports-backdrop-filter:backdrop-blur-xs [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none [@media(prefers-reduced-transparency:reduce)]:bg-[var(--ui-overlay-strong)] fixed inset-0 z-50 motion-reduce:transition-none",
    className,
  )}
  {...restProps}
/>
