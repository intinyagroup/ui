<script lang="ts">
  import { HoverCard as ArkHoverCard } from "@ark-ui/svelte/hover-card";
  import type { ComponentProps } from "svelte";

  let {
    open = $bindable(false),
    ...restProps
  }: ComponentProps<typeof ArkHoverCard.Root> = $props();
</script>

<ArkHoverCard.Root bind:open {...restProps} />
