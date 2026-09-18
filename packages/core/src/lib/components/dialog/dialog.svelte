<script lang="ts">
  import { Dialog as ArkDialog } from "@ark-ui/svelte/dialog";
  import type { ComponentProps } from "svelte";

  // Ark owns modal focus trapping, focus restoration, and body scroll prevention.
  // Keep this wrapper thin so custom overlays do not double-lock or steal focus.
  let {
    open = $bindable(false),
    children,
    ...restProps
  }: ComponentProps<typeof ArkDialog.Root> = $props();
</script>

<ArkDialog.Root
  bind:open
  onOpenChange={(e) => {
    open = e.open;
    restProps.onOpenChange?.(e);
  }}
  {...restProps}
>
  {@render children?.()}
</ArkDialog.Root>
