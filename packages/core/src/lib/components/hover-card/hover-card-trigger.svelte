<script lang="ts">
  import { HoverCard as ArkHoverCard } from "@ark-ui/svelte/hover-card";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    ...restProps
  }: ComponentProps<typeof ArkHoverCard.Trigger> = $props();
</script>

<ArkHoverCard.Trigger bind:ref data-slot="hover-card-trigger" {...restProps} />
