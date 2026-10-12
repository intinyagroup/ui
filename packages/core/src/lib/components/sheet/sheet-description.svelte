<script lang="ts">
  import { Dialog as ArkDialog } from "@ark-ui/svelte/dialog";
  import { cn } from "$lib/utils.js";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: ComponentProps<typeof ArkDialog.Description> = $props();
</script>

<ArkDialog.Description
  bind:ref
  data-slot="sheet-description"
  class={cn("text-sm text-muted-foreground", className)}
  {...restProps}
/>
