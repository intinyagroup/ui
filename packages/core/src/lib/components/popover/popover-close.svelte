<script lang="ts">
  import { Popover as ArkPopover } from "@ark-ui/svelte/popover";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    ...restProps
  }: ComponentProps<typeof ArkPopover.CloseTrigger> = $props();
</script>

<ArkPopover.CloseTrigger bind:ref data-slot="popover-close" {...restProps} />
