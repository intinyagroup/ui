<script lang="ts">
  import { Dialog as ArkDialog } from "@ark-ui/svelte/dialog";
  import { cn } from "$lib/utils.js";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: ComponentProps<typeof ArkDialog.Title> = $props();
</script>

<ArkDialog.Title
  bind:ref
  data-slot="sheet-title"
  class={cn("text-base font-medium text-foreground", className)}
  {...restProps}
/>
