<script lang="ts">
  import { Dialog as ArkDialog } from "@ark-ui/svelte/dialog";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    ...restProps
  }: ComponentProps<typeof ArkDialog.Trigger> = $props();
</script>

<ArkDialog.Trigger bind:ref data-slot="sheet-trigger" {...restProps} />
